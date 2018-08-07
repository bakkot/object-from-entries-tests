// Copyright (C) 2018 Kevin Gibbons. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: >
  Object.fromEntries evaluation order is iterator.next(), get '0', get '1',
  toPropertyKey, repeat.
esid: sec-object.fromentries
includes: [compareArray.js]
features: [Symbol.iterator, Object.fromEntries]
---*/

Object.fromEntries = function ObjectFromEntries(iter) {
  const obj = {};

  for (const pair of iter) {
    if (Object(pair) !== pair) {
      throw new TypeError('iterable for fromEntries should yield objects');
    }

    // Consistency with Map: contract is that entry has "0" and "1" keys, not
    // that it is an array or iterable.

    const { '0': key, '1': val } = pair;

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: val,
    });
  }

  return obj;
}

function assert(mustBeTrue, message) {
  if (mustBeTrue === true) {
    return;
  }

  if (message === undefined) {
    message = 'Expected true but got ' + String(mustBeTrue);
  }
  throw new Error(message);
}
function compareArray(a, b) {
  if (b.length !== a.length) {
    return false;
  }

  for (var i = 0; i < a.length; i++) {
    if (b[i] !== a[i]) {
      return false;
    }
  }
  return true;
}

assert.compareArray = function(actual, expected, message) {
  assert(compareArray(actual, expected),
         'Expected [' + actual.join(', ') + '] and [' + expected.join(', ') + '] to have the same contents. ' + message);
};

assert._isSameValue = function (a, b) {
  if (a === b) {
    // Handle +/-0 vs. -/+0
    return a !== 0 || 1 / a === 1 / b;
  }

  // Handle NaN vs. NaN
  return a !== a && b !== b;
};


assert.sameValue = function (actual, expected, message) {
  if (assert._isSameValue(actual, expected)) {
    return;
  }

  if (message === undefined) {
    message = '';
  } else {
    message += ' ';
  }

  message += 'Expected SameValue(«' + String(actual) + '», «' + String(expected) + '») to be true';

  throw new Error(message);
};











var effects = [];



function makeEntry(label) {
  return {
    get '0'() {
      effects.push('access property "0" of ' + label + ' entry');
      return {
        toString() {
          effects.push('toString of ' + label + ' key');
          return label + ' key';
        },
      };
    },
    get '1'() {
      effects.push('access property "1" of ' + label + ' entry');
      return label + ' value';
    },
  };
}

var iterable = {
  [Symbol.iterator]() {
    effects.push('get Symbol.iterator');
    var count = 0;
    return {
      next() {
        effects.push('next ' + count);
        if (count === 0) {
          ++count;
          return {
            done: false,
            value: makeEntry('first', 'first key', 'first value'),
          };
        } else if (count === 1) {
          ++count;
          return {
            done: false,
            value: makeEntry('second', 'second key', 'second value'),
          };
        } else {
          return {
            done: true,
          };
        }
      },
    };
  },
};

var result = Object.fromEntries(iterable);
assert.compareArray(effects, [
  'get Symbol.iterator',
  'next 0',
  'access property "0" of first entry',
  'access property "1" of first entry',
  'toString of first key',
  'next 1',
  'access property "0" of second entry',
  'access property "1" of second entry',
  'toString of second key',
  'next 2',
], 'Object.fromEntries evaluation order');
assert.sameValue(result['first key'], 'first value', '');
assert.sameValue(result['second key'], 'second value', '');

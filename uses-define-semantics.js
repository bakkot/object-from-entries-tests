// Copyright (C) 2018 Kevin Gibbons. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: >
  Object.fromEntries reads properties "0 and "1" of entry objects, rather
  than using @@iterator.
esid: sec-object.fromentries
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





Object.defineProperty(Object.prototype, 'property', {
  get: function() {
    throw new Test262Error('should not trigger getter on Object.prototype');
  },
  set: function() {
    throw new Test262Error('should not trigger setter on Object.prototype');
  },
});


var result = Object.fromEntries([['property', 'value']]);
assert.sameValue(result['property'], 'value', '');


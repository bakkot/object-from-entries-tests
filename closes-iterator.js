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

assert.throws = function (expectedErrorConstructor, func, message) {
  if (typeof func !== "function") {
    $ERROR('assert.throws requires two arguments: the error constructor ' +
      'and a function to run');
    return;
  }
  if (message === undefined) {
    message = '';
  } else {
    message += ' ';
  }

  try {
    func();
  } catch (thrown) {
    if (typeof thrown !== 'object' || thrown === null) {
      message += 'Thrown value was not an object!';
      $ERROR(message);
    } else if (thrown.constructor !== expectedErrorConstructor) {
      message += 'Expected a ' + expectedErrorConstructor.name + ' but got a ' + thrown.constructor.name;
      $ERROR(message);
    }
    return;
  }

  message += 'Expected a ' + expectedErrorConstructor.name + ' to be thrown but no exception was thrown at all';
  $ERROR(message);
};



// closed: null value, value with throwy accessors, value with throwy strinigifed key
// not closed: next not callable, next throws, next returns non-object, next returns object with throwy done

var returned = false;
var reachedDone = false;
var returnedTwice = false;
var iterable = {
  [Symbol.iterator]() {
    var first = true;
    return {
      next() {
        if (first) {
          first = false;
          return {
            done: false,
            value: null,
          };
        } else {
          reachedDone = true;
          return {
            done: true,
          };
        }
      },
      return() {
        if (returned) {
          returnedTwice = true; 
        }
        returned = true;
      },
    };
  },
};

assert.throws(TypeError, function() {
  Object.fromEntries(iterable);
});

assert(returned, 'iterator should be closed on error');
assert(!reachedDone, 'iterator should not continue after error');
assert(!returnedTwice, 'iterator close only once');


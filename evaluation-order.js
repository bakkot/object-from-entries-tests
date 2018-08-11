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

// Copyright (C) 2018 Kevin Gibbons. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: >
  Object.fromEntries closes iterators when they return entries which are null.
esid: sec-object.fromentries
features: [Symbol.iterator, Object.fromEntries]
---*/

var returned = false;
var iterable = {
  [Symbol.iterator]() {
    var first = true;
    return {
      next() {
        if (first) {
          first = false;
          return {
            done: false,
            value: 'null',
          };
        } else {
          throw new Test262Error('should only return once');
        }
      },
      return() {
        if (returned) {
          throw new Test262Error('should only return once');
        }
        returned = true;
      },
    };
  },
};

assert.throws(TypeError, function() {
  Object.fromEntries(iterable);
});

assert(returned, 'iterator should be closed when entry is null');

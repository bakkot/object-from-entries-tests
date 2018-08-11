// Copyright (C) 2018 Kevin Gibbons. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: >
  Object.fromEntries closes iterators when accessing an entry's properties throws.
esid: sec-object.fromentries
features: [Symbol.iterator, Object.fromEntries]
---*/

function DummyError() {}

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
            value: {
              get '0'() {
                throw new DummyError();
              }
            },
          };
        } else {
          throw new Test262Error('should not call next more than once');
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

assert.throws(DummyError, function() {
  Object.fromEntries(iterable);
});

assert(returned, 'iterator should be closed when entry property access throws');


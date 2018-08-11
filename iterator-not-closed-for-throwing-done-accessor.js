// Copyright (C) 2018 Kevin Gibbons. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: >
  Object.fromEntries does not close iterators when the iterators are broken
  by having a `done` accessor which throws.
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
        return {
          get done() {
            throw new DummyError();
          },
        };
      },
      return() {
        throw new Test262Error('should not call return');
      },
    };
  },
};

assert.throws(DummyError, function() {
  Object.fromEntries(iterable);
});

// Copyright (C) 2018 Kevin Gibbons. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Does not close iterators with a `next` method which throws.
esid: sec-object.fromentries
features: [Symbol.iterator, Object.fromEntries]
---*/

function DummyError() {}

var iterable = {
  [Symbol.iterator]() {
    return {
      next() {
        throw new DummyError();
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

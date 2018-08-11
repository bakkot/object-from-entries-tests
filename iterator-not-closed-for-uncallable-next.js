// Copyright (C) 2018 Kevin Gibbons. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: Does not close iterators with an uncallable `next` property.
esid: sec-object.fromentries
features: [Symbol.iterator, Object.fromEntries]
---*/

var iterable = {
  [Symbol.iterator]() {
    return {
      next: null,
      return() {
        throw new Test262Error('should not call return');
      },
    };
  },
};

assert.throws(TypeError, function() {
  Object.fromEntries(iterable);
});

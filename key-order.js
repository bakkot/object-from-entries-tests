// Copyright (C) 2018 Kevin Gibbons. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: >
  Object.fromEntries creates objects whose key evaluation order matches
  the order of entries in its argument.
esid: sec-object.fromentries
includes: [compareArray.js]
features: [Object.fromEntries]
---*/

var entries = [
  ['a', 1],
  ['b', 2],
  ['c', 3],
  ['b', 4],
];

var result = Object.fromEntries(entries);
assert.sameValue(result['a'], 1);
assert.sameValue(result['b'], 4);
assert.sameValue(result['c'], 3);
assert.compareArray(Object.keys(result), ['a', 'b', 'c']);

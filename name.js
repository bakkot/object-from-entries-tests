// Copyright (C) 2018 Kevin Gibbons. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-object.fromentries
description: >
  Object.fromEntries.name is "fromEntries".
includes: [propertyHelper.js]
features: [Object.fromEntries]
---*/

assert.sameValue(Object.fromEntries.name, "fromEntries");

verifyNotEnumerable(Object.fromEntries, "name");
verifyNotWritable(Object.fromEntries, "name");
verifyConfigurable(Object.fromEntries, "name");

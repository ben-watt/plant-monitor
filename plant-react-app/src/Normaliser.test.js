import React from 'react'
import Normaliser from './Normaliser'

test('Returns correct Min value', () => {
  let n = new Normaliser();

  var result = n.mapToRange(0, 100)
    .withDomain(50, 100)
    .normalise(50);

  expect(result).toBe(0);
});

test('Returns correct Max value', () => {
  let n = new Normaliser();

  var result = n.mapToRange(0, 100)
    .withDomain(50, 60)
    .normalise(60);

  expect(result).toBe(100);
});


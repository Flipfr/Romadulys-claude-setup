import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoster } from './read-roster.mjs';

test('parseRoster ne garde que les head-of et dérive le domaine', () => {
  const roster = parseRoster({ plugins: [
    { name: 'head-of-sales', description: 'x', source: './team-plugins/plugins/head-of-sales' },
    { name: 'head-of-customer-success', description: 'y', source: './s' },
    { name: 'apprentissages', description: 'z', source: './a' },
  ]});
  assert.equal(roster.length, 2);
  assert.deepEqual(roster.map((r) => r.domain), ['sales', 'customer-success']);
  assert.equal(roster[0].name, 'head-of-sales');
});

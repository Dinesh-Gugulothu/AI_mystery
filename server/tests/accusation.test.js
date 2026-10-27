import test from 'node:test';
import assert from 'node:assert/strict';

function evaluate(suspectId, culpritId) { return { correct:suspectId===culpritId }; }
test('correct accusation compares suspect ID to stored culprit ID',()=>assert.deepEqual(evaluate('suspect_2','suspect_2'),{correct:true}));
test('incorrect accusation does not match a different suspect',()=>assert.deepEqual(evaluate('suspect_1','suspect_2'),{correct:false}));

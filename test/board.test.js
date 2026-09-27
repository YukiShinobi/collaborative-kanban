import test from 'node:test';
import assert from 'node:assert/strict';
import { createBoard, addCard, moveCard, boardStats } from '../src/index.js';

test('creates and moves cards with version checks', () => {
  let board = createBoard('Launch');
  board = addCard(board, 'col-1', { title: 'Ship API' }, 'yuki');
  const cardId = board.columns[0].cards[0].id;
  const version = board.version;
  board = moveCard(board, cardId, 'col-4', 0, version, 'yuki');
  assert.equal(board.columns[3].cards[0].title, 'Ship API');
  assert.equal(boardStats(board).completionPercent, 100);
});

test('rejects stale writes', () => {
  const board = createBoard('Team');
  assert.throws(() => moveCard(board, 'missing', 'col-2', 0, 0), /Version conflict/);
});

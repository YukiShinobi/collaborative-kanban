import { randomUUID } from 'node:crypto';

export function createBoard(title, columns = ['Backlog', 'In Progress', 'Review', 'Done']) {
  return {
    id: randomUUID(),
    title,
    version: 1,
    columns: columns.map((name, index) => ({ id: `col-${index + 1}`, name, cards: [] })),
    activity: []
  };
}

export function addCard(board, columnId, input, actor = 'system') {
  const next = structuredClone(board);
  const column = next.columns.find(item => item.id === columnId);
  if (!column) throw new Error('Unknown column');
  const card = { id: randomUUID(), title: input.title, description: input.description ?? '', assignees: input.assignees ?? [], labels: input.labels ?? [] };
  column.cards.push(card);
  next.version += 1;
  next.activity.unshift({ type: 'card.created', actor, cardId: card.id, columnId, at: new Date().toISOString() });
  return next;
}

export function moveCard(board, cardId, targetColumnId, targetIndex = 0, expectedVersion = board.version, actor = 'system') {
  if (board.version !== expectedVersion) throw new Error('Version conflict');
  const next = structuredClone(board);
  let card;
  let fromColumnId;
  for (const column of next.columns) {
    const index = column.cards.findIndex(item => item.id === cardId);
    if (index !== -1) {
      [card] = column.cards.splice(index, 1);
      fromColumnId = column.id;
      break;
    }
  }
  if (!card) throw new Error('Card not found');
  const target = next.columns.find(item => item.id === targetColumnId);
  if (!target) throw new Error('Target column not found');
  const safeIndex = Math.max(0, Math.min(targetIndex, target.cards.length));
  target.cards.splice(safeIndex, 0, card);
  next.version += 1;
  next.activity.unshift({ type: 'card.moved', actor, cardId, fromColumnId, toColumnId: targetColumnId, at: new Date().toISOString() });
  return next;
}

export function boardStats(board) {
  const total = board.columns.reduce((sum, col) => sum + col.cards.length, 0);
  const done = board.columns.find(col => /done/i.test(col.name))?.cards.length ?? 0;
  return { total, done, completionPercent: total ? Number(((done / total) * 100).toFixed(1)) : 0 };
}

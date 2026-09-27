<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=210&text=COLLABORATIVE%20KANBAN&fontAlignY=38&desc=STATE%20%E2%80%A2%20ACTIVITY%20%E2%80%A2%20CONFLICTS&descAlignY=58&color=0:050505,55:202020,100:5a1616&fontColor=f5f5f5&descColor=d4d4d4" width="100%" />

![Node](https://img.shields.io/badge/Node.js-20%2B-111111?style=for-the-badge&logo=nodedotjs)
![Model](https://img.shields.io/badge/model-versioned%20state-2b2b2b?style=for-the-badge)
![Tests](https://img.shields.io/badge/tests-node:test-7a1f1f?style=for-the-badge)

**A board-state engine for collaborative task systems where stale writes and activity history actually matter.**

</div>

---

## What it models

- boards and ordered columns
- cards with labels and assignees
- card movement between columns
- activity history
- completion statistics
- optimistic version checks for stale updates

```txt
client change
    ↓
expected board version
    ↓
state transition
    ↓
new version + activity event
```

## Example

```js
import { createBoard, addCard, moveCard } from './src/index.js';

let board = createBoard('Launch');
board = addCard(board, 'col-1', { title: 'Ship API' }, 'yuki');

const cardId = board.columns[0].cards[0].id;
board = moveCard(board, cardId, 'col-4', 0, board.version, 'yuki');
```

## Test

```bash
npm test
```

## Why this exists

A collaborative board gets interesting when two people can change the same state. I wanted the repo to focus on that domain problem instead of only building drag-and-drop visuals.

## Next

`WebSocket sync` · `comments` · `presence` · `persistent event log` · `board permissions` · `undo`

---

<div align="center"><sub>YukiShinobi // state should stay understandable even when multiple people touch it.</sub></div>

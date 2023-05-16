type mino = { type: number; shape: number[][]; color: string };

const type1: mino = {
  type: 1,
  shape: [
    [0, 1, 1],
    [0, 1, 1],
    [0, 0, 0],
  ],
  color: '#fbdb43',
};

const type2: mino = {
  type: 2,
  shape: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  color: '#37bcec',
};

const type3: mino = {
  type: 3,
  shape: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  color: '#93338f',
};

const type4: mino = {
  type: 4,
  shape: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  color: '#e98e30',
};

const type5: mino = {
  type: 5,
  shape: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  color: '#1c76bb',
};

const type6: mino = {
  type: 6,
  shape: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  color: '#7dba50',
};

const type7: mino = {
  type: 7,
  shape: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  color: '#cc2828',
};

const mino: mino[] = [type1, type2, type3, type4, type5, type6, type7];

export { mino };

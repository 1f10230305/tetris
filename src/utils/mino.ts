type mino = { type: number; shape: number[][] };

const type1: mino = {
  type: 1,
  shape: [
    [1, 1],
    [1, 1],
  ],
};

const type2: mino = {
  type: 2,
  shape: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};

const type3: mino = {
  type: 3,
  shape: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

const type4: mino = {
  type: 4,
  shape: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

const type5: mino = {
  type: 5,
  shape: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

const type6: mino = {
  type: 6,
  shape: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
};

const type7: mino = {
  type: 7,
  shape: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

const mino: mino[] = [type1, type2, type3, type4, type5, type6, type7];

export { mino };

export const turnArray = (array: number[][], deg: number) => {
  const length: number = array.length;
  const count: number = 3 - ((((deg / 90) % 4) + 4) % 4);

  let rotatedArray = [...array];
  for (let i = 0; i < count; i++) {
    rotatedArray = rotatedArray[0].map((_, y) => rotatedArray.map((row) => row[length - y - 1]));
  }

  return rotatedArray;
};

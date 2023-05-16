export const createArray = (width: number, height: number, value: number): number[][] => {
  const array: number[][] = [];
  for (let i = 0; i < height; i++) {
    const row: number[] = [];
    for (let j = 0; j < width; j++) {
      row.push(value);
    }
    array.push(row);
  }
  return array;
};

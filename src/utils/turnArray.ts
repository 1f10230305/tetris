export const turnArray = (Array: number[][], deg: number) => {
  let array = [...Array];
  const colCount = array[0].length;
  for (let i = 0; i < (deg / 90) % 4; i++) {
    array = array[0].map((_, colIndex) => {
      return array.map((row) => row[colCount - colIndex - 1]);
    });
  }
  return array;
};

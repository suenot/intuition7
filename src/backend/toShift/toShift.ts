/**
 * Function for shifting elements in an array to ensure that the total number of elements
 * in baseArray and newArray does not exceed the value of max. The old data is preserved.
 *
 * @param baseArray - the base array to be modified.
 * @param newArray - the new array whose elements will be added to baseArray.
 * @param max - the maximum number of elements that baseArray can contain after adding elements from newArray.
 * @returns Returns an object containing baseArray after adding elements from newArray and oldData, which contains the old data that was removed from baseArray.
 */
export const toShift = (baseArray: any[], newArray: any[], max: number): { baseArray: any[], oldData: any[]} => {
  const totalLength = baseArray.length + newArray.length;

  let oldData = [];
  if (totalLength > max) {
    const shift = totalLength - max;
    oldData = baseArray.splice(0, shift);
  }

  baseArray.push(...newArray);

  return { baseArray, oldData };
}
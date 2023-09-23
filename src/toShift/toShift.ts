/**
 * Функция для сдвига элементов в массиве, чтобы общее количество элементов
 * в baseArray и newArray не превышало значение max.
 *
 * @param baseArray - базовый массив, который будет изменяться.
 * @param newArray - новый массив, элементы которого будут добавлены в baseArray.
 * @param max - максимальное количество элементов, которое может содержать baseArray после добавления элементов из newArray.
 * @returns Возвращает baseArray после добавления элементов из newArray.
 */
export const toShift = (baseArray: any[], newArray: any[], max: number): any[] => {
  const totalLength = baseArray.length + newArray.length;

  if (totalLength > max) {
      const shift = totalLength - max;
      baseArray.splice(0, shift);
  }

  baseArray.push(...newArray);

  return baseArray;
}
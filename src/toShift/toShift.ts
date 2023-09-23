/**
 * Функция для сдвига элементов в массиве, чтобы общее количество элементов
 * в baseArray и newArray не превышало значение max. Старые данные сохраняются.
 *
 * @param baseArray - базовый массив, который будет изменяться.
 * @param newArray - новый массив, элементы которого будут добавлены в baseArray.
 * @param max - максимальное количество элементов, которое может содержать baseArray после добавления элементов из newArray.
 * @returns Возвращает объект, содержащий baseArray после добавления элементов из newArray и oldData, содержащий старые данные, которые были удалены из baseArray.
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
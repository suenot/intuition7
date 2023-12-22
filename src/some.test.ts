function sum(a: any, b: any) {
  return a + b;
}

const somesa: number = 10;

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
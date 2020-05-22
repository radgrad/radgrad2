import faker from 'faker';

export const makeSampleIce = () => {
  const i = faker.random.number(100);
  const c = faker.random.number(100);
  const e = faker.random.number(100);
  // console.log(`{ i = ${i}, c = ${c}, e = ${e} }`);
  return { i, c, e };
};

import faker from 'faker';

export const makeSampleIce = () => {
  const i = faker.random.number(0, 100);
  const c = faker.random.number(0, 100);
  const e = faker.random.number(0, 100);
  return { i, c, e };
};

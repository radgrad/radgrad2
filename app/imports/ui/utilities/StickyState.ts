import { entity } from 'simpler-state';

const entities = {};

export const useStickyState = (name, initialValue) => {
  if (entities[name]) {
    const { savedEntity, savedSetter } = entities[name];
    return [savedEntity.use(), savedSetter];
  }
  // Otherwise create a new entity
  const newEntity = entity(initialValue);
  const newEntitySetter = (newValue) => newEntity.set(newValue);
  entities[name] = { savedEntity: newEntity, savedSetter: newEntitySetter };
  return [newEntity.use(), newEntitySetter];
};


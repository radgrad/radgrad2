import _ from 'lodash';

export const getCollectionData = (radgradDump, collectionName) => {
  const collection = _.find(radgradDump.collections, (c) => c.name === collectionName);
  // console.log(collectionName, collection);
  return collection.contents;
};

export const getNonRetiredCollectionData = (radgradDump, collectionName) => getCollectionData(radgradDump, collectionName).filter((doc) => !doc.retired);

export const getCollectionDocFromSlug = (collection, slug) => _.find(collection, (doc) => doc.slug === slug);

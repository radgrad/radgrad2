import _ from 'lodash';
import { Internship } from '../../../typings/radgrad';
import { InterestKeywords } from '../../interest/InterestKeywordCollection';
import slugify from '../../slug/SlugCollection';
import { getInternAlohaInternshipsMethod } from '../InternshipCollection.methods';
import { internAlohaUrls } from './InternAlohaUrls';

import { matchKeywords } from './match-keywords';

const getInternAlohaInternships = async (url) => {
  const internships = await getInternAlohaInternshipsMethod.callPromise({ url });
  return internships;
};

const getAllInternAlohaInternships = async () => {
  const internships = [];
  for (const url of internAlohaUrls) {
    // eslint-disable-next-line no-await-in-loop
    const results = await getInternAlohaInternships(url);
    results.forEach((r) => internships.push(r));
  }
  return internships;
};

const removeHTMLFromDescription = (internship) => {
  const update = internship;
  const doc = new DOMParser().parseFromString(internship.description, 'text/html');
  update.description = doc.body.textContent || '';
  return update;
};

const addInterests = (internship) => {
  const define = internship;
  // get the unique keywords from InterestKeywordCollection
  const keywords = InterestKeywords.getUniqueKeywords();
  const matching = matchKeywords(keywords, internship);
  let interests = [];
  matching.forEach((k) => {
    interests = interests.concat(InterestKeywords.getInterestSlugs(k));
  });
  define.interests = _.uniq(interests);
  define.missedUploads = 0;
  return define;
};

const updateLocation = (internship) => {
  const update = internship;
  update.location = [internship.location];
  return update;
};

const shallowEquals = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
};

const containsLocation = (locationArr, location) => {
  let found = false;
  locationArr.forEach(l => {
    if (shallowEquals(l, location)) {
      found = true;
    }
  });
  return found;
};

export const createGUID = (company: string, position: string, length: number): string => slugify(`${slugify(company)}_${slugify(position)}_${length}`);

export const getInternshipKey = (internship: Internship): string => createGUID(internship.company, internship.position, internship.description.length);

export const getCompanyFromKey = (internshipKey: string): string => internshipKey.split('_')[0];

export const getPositionFromKey = (internshipKey: string): string => internshipKey.split('_')[1];


const buildURLs = (internships) => {
  const groupUrls = {};
  internships.forEach((internship) => {
    const key = getInternshipKey(internship);
    if (!groupUrls[key]) {
      groupUrls[key] = [];
    }
    groupUrls[key].push(internship.url);
  });
  return groupUrls;
};

const collapse = (groupUrls, internships) => {
  const reduced = {};
  internships.forEach((i) => {
    const key = getInternshipKey(i);
    if (!reduced[key]) {
      const temp = i;
      temp.urls = groupUrls[key];
      reduced[key] = temp;
    } else {
      // check the locations
      const temp = reduced[key];
      if (!containsLocation(temp.location, i.location[0])) {
        temp.location.push(i.location[0]);
        // console.log(key, temp.location);
      }
    }
  });
  // console.log(Object.keys(reduced).length);
  return Object.values(reduced);
};

const addGUID = (internship) => {
  const update = internship;
  const guid = `internship-${getInternshipKey(internship)}`;
  update.guid = guid;
  return update;
};

export const processInternAlohaInternships = async () => {
  // get the internships
  const rawInternships = await getAllInternAlohaInternships();
  console.log('raw internships', rawInternships.length);
  // add interests
  const withInterests = rawInternships.map((i) => {
    removeHTMLFromDescription(i);
    addInterests(i);
    return updateLocation(i);
  });
  // console.log(withInterests[0]);
  // remove uninteresting internships
  const interestingInternships = withInterests.filter((i) => i.interests.length > 0);
  console.log('interesting internships', interestingInternships.length);
  // reduce by grouping urls
  const groupedURLs = buildURLs(interestingInternships);
  let reduced = collapse(groupedURLs, interestingInternships);
  console.log('combined internships', reduced.length);
  // add guid to reduced
  reduced = reduced.map(r => addGUID(r));
  return reduced;
};

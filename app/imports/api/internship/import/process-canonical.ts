import { InterestKeywords } from '../../interest/InterestKeywordCollection';
import { matchKeywords } from './match-keywords';

export const processCanonical = (rawInternship) => {
  const define = rawInternship;
  // console.log(rawInternship);
  // get the unique keywords from InterestKeywordCollection
  const keywords = InterestKeywords.getUniqueKeywords();
  // console.log(keywords);
  // get the matching keywords
  const matching = matchKeywords(keywords, rawInternship);
  // console.log(matching);
  let interests = [];
  matching.forEach((k) => {
    interests = interests.concat(InterestKeywords.getInterestSlugs(k));
  });
  // console.log(interests);
  define.interests = interests;
  return define;
};

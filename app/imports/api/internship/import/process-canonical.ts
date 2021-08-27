import { InterestKeywords } from '../../interest/InterestKeywordCollection';
import { matchKeywords } from './match-keywords';

export const processCanonical = (rawInternship) => {
  // console.log(rawInternship);
  // get the unique keywords from InterestKeywordCollection
  const keywords = InterestKeywords.getUniqueKeywords();
  // console.log(keywords);
  // get the matching keywords
  const matching = matchKeywords(keywords, rawInternship);
  console.log(matching);
};

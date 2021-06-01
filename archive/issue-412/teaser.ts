import { Teasers } from '../../app/imports/api/teaser/TeaserCollection';

export const teaser = (theOpp: { slugID: string }): unknown => {
  if (Teasers.isDefined({ targetSlugID: theOpp.slugID })) {
    return Teasers.findDoc({ targetSlugID: theOpp.slugID });
  }
  return {};
};

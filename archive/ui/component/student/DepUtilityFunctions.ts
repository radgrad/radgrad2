import { Slugs } from '../../../../app/imports/api/slug/SlugCollection';
import { EXPLORER_TYPE } from '../../../../app/imports/ui/layouts/utilities/route-constants';
import * as Router from '../../../../app/imports/ui/components/shared/utilities/router';

export const itemSlug = (item) => Slugs.findDoc(item.slugID).name;

export const buildRouteName = (match, item, type) => {
  const itemName = itemSlug(item);
  let route = '';
  switch (type) {
    case EXPLORER_TYPE.COURSES:
      route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${itemName}`);
      break;
    case EXPLORER_TYPE.OPPORTUNITIES:
      route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${itemName}`);
      break;
    default:
      route = '#';
      break;
  }
  return route;
};

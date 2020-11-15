import { Slugs } from '../../../../api/slug/SlugCollection';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';
import * as Router from '../../shared/router-helper-functions';

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

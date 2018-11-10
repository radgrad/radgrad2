import { Slugs } from '../../../api/slug/SlugCollection';

export function itemShortDescription(item: { description: string; }) {
  let description = item.description;
  if (description.length > 200) {
    description = `${description.substring(0, 200)}`;
    if (description.charAt(description.length - 1) === ' ') {
      description = `${description.substring(0, 199)}`;
    }
  }
  return description;
}

export function getSlug(item: { slugID: string; }) {
  try {
    return Slugs.getNameFromID(item.slugID);
  } catch (e) {
    console.log(e, item.slugID);
    return '';
  }
}

export function getRouteName(path: string): string {
  switch (path) {
    case '/explorer/career-goals':
      return 'Career Goals';
    default:
      return 'Undefined';
  }
}

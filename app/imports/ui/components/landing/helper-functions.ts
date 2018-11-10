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
  let regex = /academic-plans/;
  if (regex.test(path)) {
    return 'Academic Plans';
  }
  regex = /career-goals/;
  if (regex.test(path)) {
    return 'Career Goals';
  }
  regex = /courses/;
  if (regex.test(path)) {
    return 'Courses';
  }
  regex = /degrees/;
  if (regex.test(path)) {
    return 'Degrees';
  }
  regex = /interests/;
  if (regex.test(path)) {
    return 'Interests';
  }
  regex = /opportunities/;
  if (regex.test(path)) {
    return 'Opportunities';
  }
  return 'Undefined';
}

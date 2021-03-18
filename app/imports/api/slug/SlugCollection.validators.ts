import { Meteor } from 'meteor/meteor';
import { Slugs } from './SlugCollection';

/**
 * Custom validator for fields that must contain a previously undefined slug name.
 * @returns Undefined if the slug value is not previously defined, otherwise errorType 'duplicateSlug'.
 * @throws Error if there are no Slugs in the SlugCollection.
 * @memberOf api/slug
 */
export function newSlugValidator(): string | undefined {
  if (Slugs.count() === 0) {
    throw new Meteor.Error('newSlugValidator called but SlugCollection is empty. Probably a subscription issue.');
  }
  return (Slugs.isDefined(this.value)) ? 'duplicateSlug' : undefined;
}

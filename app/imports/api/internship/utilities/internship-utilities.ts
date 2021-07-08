import { InternshipCanonical, InternshipDefine } from '../../../typings/radgrad';

/**
 * Takes the canonical internship from InternAloha and applies information to convert it to an InternshipDefine object.
 * @param {InternshipCanonical} canonical
 * @return {InternshipDefine}
 */
export const convertCanonicalToInternship = (canonical: InternshipCanonical): InternshipDefine => undefined;

/*
What is unique about an internship so that we can detect multiple listings of the same internship? Company and position?
Should we create an object that looks something like:

{
  company1: {
    position1: {
      urls: [urls],
      locations: [locations],
    }
    position2: {
      urls: [urls],
      locations: [locations],
    }
  },
  company2: {
    position1: {
      urls: [urls],
      locations: [locations],
    }
    position2: {
      urls: [urls],
      locations: [locations],
    }
  }
 */

/**
 * Runs NLP over the description to return an array of interest slugs.
 * @param {string} description the internship description.
 * @return {string[]} the interest slugs for the internship.
 */
export const getInterestSlugs = (description: string): string[] => [''];

/**
 * Runs NLP over the description to return an array of career goal slugs.
 * @param {string} description the internship description.
 * @return {string[]} the career goal slugs for the internship.
 */
export const getCareerGoalSlugs = (description: string): string[] => [''];

/**
 * Given an array of InternshipDefines finds the duplicate internships and reduces them to a shorter array of InternshipDefines.
 * @param {InternshipCanonical[]} canonical
 * @return {InternshipDefine[]}
 */
export const findDuplicateInternships = (definitions: InternshipDefine[]): InternshipDefine[] => undefined;

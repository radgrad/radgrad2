import { InternshipCanonical, InternshipDefine } from '../../../typings/radgrad';

/**
 * Takes the canonical internship from InternAloha and applies information to convert it to an InternshipDefine object.
 * @param {InternshipCanonical} canonical
 * @return {InternshipDefine}
 */
export const convertCanonicalToInternship = (canonical: InternshipCanonical): InternshipDefine => undefined;

/*
What is unique about an internship so that we can detect multiple listings of the same internship? Company and position?



 */

export const getInterestSlugs = (description: string): string[] => [''];
export const getCareerGoalSlugs = (description: string): string[] => [''];

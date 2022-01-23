import { InternshipDefine } from '../../../typings/radgrad';

/**
 * Returns the keywords that match the internship. This is a very dumb function just filtering the keywords that don't appear in the internship.description.
 * @param {string[]} keywords the keywords to check.
 * @param internship the internship to match the keywords.
 * @return {string[]} the keywords that match the internship.
 */
export const matchKeywords = (keywords: string[], internship: InternshipDefine): string[] => keywords.filter((word) => internship.description.includes(` ${word} `));

import _ from 'lodash';

/**
 * Strips of the counter for the plan choice. The counter is used in academic plans to keep track of how many
 * choices there are (e.g. five ics_400+ in the B.S. degree).
 * @param planChoice the plan choice.
 * @returns {*}
 * @memberOf api/degree-plan
 */
export const stripCounter = (planChoice: string): string => {
  const index = planChoice.indexOf('-');
  if (index !== -1) {
    return planChoice.substring(0, index);
  }
  return planChoice;
};

/**
 * Returns the count of the given planChoice.
 * @param {string} planChoice the planChoice
 * @returns {number} the count value of the planChoice, or 0 if none.
 */
export const getPlanCount = (planChoice: string): number => {
  const index = planChoice.indexOf('-');
  if (index !== -1) {
    return parseInt(planChoice.substring(index + 1), 10);
  }
  return 0;
};

/**
 * Returns true if the planChoice is a single choice.
 * @param planChoice the plan choice.
 * @returns {boolean}
 * @memberOf api/degree-plan
 */
export const isSingleChoice = (planChoice: string): boolean => {
  const cleaned = stripCounter(planChoice);
  return cleaned.indexOf(',') === -1;
};

/**
 * Returns true if the plan choice is a simple choice, just individual slugs separated by commas.
 * @param planChoice the plan choice.
 * @returns {boolean}
 * @memberOf api/degree-plan
 */
export const isSimpleChoice = (planChoice: string): boolean => {
  const cleaned = stripCounter(planChoice);
  const parenp = cleaned.indexOf('(') !== -1;
  const orp = cleaned.indexOf(',') !== -1;
  return !parenp && orp;
};

/**
 * Returns true if the plan choice includes a sub-choice (e.g. '(ics_313,ics_331),ics_355-1' )
 * @param planChoice the plan choice.
 * @returns {boolean}
 * @memberOf api/degree-plan
 */
export const isComplexChoice = (planChoice: string): boolean => {
  const cleaned = stripCounter(planChoice);
  const parenp = cleaned.indexOf('(') !== -1;
  const orp = cleaned.indexOf(',') !== -1;
  return parenp && orp;
};

/**
 * Returns true if the planChoice is a 300+ or 400+.
 * @param planChoice the plan choice.
 * @return {boolean}
 * @memberOf api/degree-plan
 */
export const isXXChoice = (planChoice: string): boolean => {
  const cleaned = stripCounter(planChoice);
  return cleaned.indexOf('+') !== -1;
};

/**
 * Converts a complex choice into an array of the slugs that make up the choice.
 * Note: This may not be enough to solve the generate plan problem.
 * @param planChoice a plan choice.
 * @memberOf api/degree-plan
 */
export const complexChoiceToArray = (planChoice: string): string[] => {
  const cleaned = stripCounter(planChoice);
  const split = cleaned.split(',');
  return split.map((slug) => {
    if (slug.startsWith('(')) {
      return slug.substring(1);
    }
    if (slug.endsWith(')')) {
      return slug.substring(0, slug.length - 1);
    }
    return slug;
  });
};

/**
 * Creates the course name from the slug. Course names have department in all caps.
 * @param slug the course slug.
 * @returns {string}
 * @memberOf api/degree-plan
 */
export const buildCourseSlugName = (slug: string): string => {
  const splits = slug.split('_');
  return `${splits[0].toUpperCase()} ${splits[1]}`;
};

/**
 * Builds the Name for a simple planChoice. Will have commas replaced by ' or '.
 * @param slug the simple plan choice.
 * @returns {string}
 * @memberOf api/degree-plan
 */
export const buildSimpleName = (slug: string): string => {
  const splits = stripCounter(slug).split(',');
  let ret = '';
  splits.forEach((s) => {
    ret = `${ret}${buildCourseSlugName(s)} or `;
  });
  return ret.substring(0, ret.length - 4);
};

/**
 * Returns the department from a course slug.
 * @param courseSlug
 * @returns {*}
 * @memberOf api/degree-plan
 */
export const getDepartment = (courseSlug: string): string => {
  let slug = courseSlug;
  if (courseSlug.startsWith('(')) {
    slug = courseSlug.substring(1);
  }
  const result = slug.split('_');
  return result[0];
};

/**
 * Returns an array of the departments in the plan choice.
 * @param planChoice The plan choice.
 * @returns {Array}
 * @memberOf api/degree-plan
 */
export const getDepartments = (planChoice: string): string[] => {
  const choices = complexChoiceToArray(planChoice);
  const ret = [];
  choices.forEach((c) => {
    const dept = getDepartment(c);
    if (_.indexOf(ret, dept) === -1) {
      ret.push(dept);
    }
  });
  return ret;
};

/**
 * Returns true if the getCourseSlug satisfies the planChoice.
 * @param planChoice a plan choice.
 * @param courseSlug a course's slug.
 * @returns {*}
 * @memberOf api/degree-plan
 */
const satisfiesSinglePlanChoice = (planChoice: string, courseSlug: string): boolean => {
  const dept = getDepartment(planChoice);
  const stripped = stripCounter(planChoice);
  if (planChoice.includes('300+')) {
    return courseSlug.startsWith(`${dept}_3`) || courseSlug.startsWith(`${dept}_4`);
  }
  if (planChoice.includes('400+')) {
    return courseSlug.startsWith(`${dept}_4`);
  }
  return planChoice.indexOf(courseSlug) !== -1 && stripped.length === courseSlug.length;
};

/**
 * Returns the number portion of the getCourseSlug.
 * @param courseSlug the course slug.
 * @returns {string}
 */
export const getSimpleChoiceNumber = (simpleChoice: string): string => simpleChoice.split('_')[1];

/**
 * Returns true if the courseSlug satisfies the plan choice.
 * @param planChoice The plan choice.
 * @param courseSlug The course slug.
 * @return {Boolean}
 * @memberOf api/degree-plan
 */
export const satisfiesPlanChoice = (planChoice: string, courseSlug: string): boolean => {
  const singleChoices = complexChoiceToArray(planChoice);
  let ret = false;
  singleChoices.forEach((choice) => {
    if (satisfiesSinglePlanChoice(choice, courseSlug)) {
      ret = true;
    }
  });
  // console.log('satisfiesPlanChoice %s, %s returns %o', planChoice, getCourseSlug, ret);
  return ret;
};

/**
 * Returns the index of the getCourseSlug in the array of plan choices.
 * @param planChoices an array of plan choices.
 * @param courseSlug the course slug.
 * @return {Number} the index of getCourseSlug in the array.
 * @memberOf api/degree-plan
 */
export const planIndexOf = (planChoices: string[], courseSlug: string): number => {
  for (let i = 0; i < planChoices.length; i += 1) {
    if (satisfiesPlanChoice(planChoices[i], courseSlug)) {
      return i;
    }
  }
  return -1;
};

export const simpleCombineChoices = (choice1: string, choice2: string): string => `${choice1},${choice2}`;

export const compoundCombineChoices = (choice1: string, choice2: string): string => {
  let left = choice1;
  let right = choice2;
  if (!isSingleChoice(left)) {
    left = `(${left})`;
  }
  if (!isSingleChoice(right)) {
    right = `(${right})`;
  }
  return `${left},${right}`;
};

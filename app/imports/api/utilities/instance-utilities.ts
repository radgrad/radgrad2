import { AcademicTerms } from '../academic-term/AcademicTermCollection';

export const instanceIsInThePast = (instance: { termID: string }): boolean => {
  const currentTermNumber = AcademicTerms.getCurrentAcademicTermNumber();
  const instanceTermNumber = AcademicTerms.findDoc(instance.termID).termNumber;
  return instanceTermNumber < currentTermNumber;
};

export const instanceIsNowOrFuture = (instance: { termID: string }): boolean => {
  const currentTermNumber = AcademicTerms.getCurrentAcademicTermNumber();
  const instanceTermNumber = AcademicTerms.findDoc(instance.termID).termNumber;
  return instanceTermNumber >= currentTermNumber;
};

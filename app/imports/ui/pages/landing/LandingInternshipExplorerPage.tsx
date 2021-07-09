import React from 'react';
import { useRouteMatch } from 'react-router';
import { CareerGoal, Course, Interest, Internship, Opportunity } from '../../../typings/radgrad';

interface InternshipExplorerProps {
  currentUser: string;
  interest: Interest;
  courses: Course[];
  opportunities: Opportunity[];
  careerGoals: CareerGoal[];
  internship: Internship[];
}

const headerPaneTitle = 'The Internship Explorer';

const LandingInternshipExplorerPage: React.FC<InternshipExplorerProps> = ({ currentUser, internship, careerGoals, courses, interest, opportunities}) => (
  const match = useRouteMatch();
);

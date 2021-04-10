import React from 'react';
import { Ice, ICEType, ProfileInterest } from '../../../../typings/radgrad';

interface StudentIceRecommendedTabPaneProps {
  type: ICEType;
  earnedICEPoints: number;
  projectedICEPoints: number;
  matchingPoints: (a: number, b: number) => boolean;
  icePoints: (ice: Ice) => number;
  getCourseSlug: (course) => string;
  getOpportunitySlug: (opportunity) => string;
  profileInterests: ProfileInterest[];
}

const StudentIceRecommendedTabPane: React.FC<StudentIceRecommendedTabPaneProps> = ({ type, earnedICEPoints, projectedICEPoints, matchingPoints, icePoints, getCourseSlug, getOpportunitySlug, profileInterests }) => {};

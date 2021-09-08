import React from 'react';
import { Card, Grid } from 'semantic-ui-react';
import { CareerGoal, Course, Interest, Internship, Opportunity, ProfileCareerGoal, ProfileCourse, ProfileInterest, ProfileOpportunity } from '../../../../../typings/radgrad';
import { EXPLORER_TYPE_ICON } from '../../../../utilities/ExplorerUtils';
import RadGradHeader from '../../RadGradHeader';
import RadGradSegment from '../../RadGradSegment';
import InternshipCard from './InternshipCard';

interface InternshipBrowserViewProps {
  internships: Internship[];
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  profileCareerGoals: ProfileCareerGoal[];
  profileCourses: ProfileCourse[];
  profileInterests: ProfileInterest[];
  profileOpportunities: ProfileOpportunity[];
}

const InternshipBrowswerView: React.FC<InternshipBrowserViewProps> = ({ careerGoals, courses, interests, internships, opportunities, profileCareerGoals, profileCourses, profileOpportunities, profileInterests }) => {
  const icon = EXPLORER_TYPE_ICON.INTERNSHIP;
  const header = <RadGradHeader title='internships' count={internships.length} icon={icon} />;
  return (
    <div id="internship-browser-view">
      <RadGradSegment header={header}>
        <Grid>
          <Card.Group itemsPerRow={3} stackable id="browserCardGroup" style={{ margin: '0px' }}>
            {internships.map((internship) => (
              <InternshipCard internship={internship} key={internship._id} />
            ))}
          </Card.Group>
        </Grid>
      </RadGradSegment>
    </div>
  );

};

export default InternshipBrowswerView;

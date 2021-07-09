import React from 'react';
import { useRouteMatch } from 'react-router';
import { Internships } from '../../../api/internship/InternshipCollection';
import { CareerGoal, Course, Interest, Internship, Opportunity } from '../../../typings/radgrad';
import { Grid } from 'semantic-ui-react';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

interface InternshipExplorerProps {
  currentUser: string;
  interest: Interest;
  courses: Course[];
  opportunities: Opportunity[];
  careerGoals: CareerGoal[];
  internship: Internship[];
}

const headerPaneTitle = 'The Internship Explorer';

const LandingInternshipExplorerPage: React.FC<InternshipExplorerProps> = ({ currentUser, internship, careerGoals, courses, interest, opportunities}) => {
  const match = useRouteMatch();
  return (
    <div>
      <LandingExplorerMenuBar/>
      <PageLayout id={PAGEIDS.LANDING_INTERNSHIP_EXPLORER} headerPaneTitle={headerPaneTitle}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <LandingExplorerMenuContainer />
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </PageLayout>
    </div>
  );
};



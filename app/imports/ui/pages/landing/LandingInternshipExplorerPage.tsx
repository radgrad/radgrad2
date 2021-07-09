import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router';
import { Grid } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Internships } from '../../../api/internship/InternshipCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { CareerGoal, Course, Interest, Internship, Opportunity } from '../../../typings/radgrad';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import * as Router from '../../components/shared/utilities/router';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

interface InternshipExplorerProps {
  currentUser: string;
  interest: Interest[];
  courses: Course[];
  opportunities: Opportunity[];
  careerGoals: CareerGoal[];
  internship: Internship;
}

const headerPaneTitle = 'The Internship Explorer';

const LandingInternshipExplorerPage: React.FC<InternshipExplorerProps> = ({ currentUser, internship, careerGoals, courses, interest, opportunities }) => {
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
          <Grid.Column width={13}>
            <RadGradSegment header={<RadGradHeader title={internship.position} dividing/> }>
              <Markdown escapeHtml source={internship.description}
                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}/>
            </RadGradSegment>
          </Grid.Column>
        </Grid>
      </PageLayout>
    </div>
  );
};

const LandingInternshipExplorerContainer = withTracker(() => {
  const { internship } = useParams();
  const id = Slugs.getEntityID(internship, 'Internships');
  const internshipDoc = Internships.findDoc(id);
  const careerGoals = CareerGoals.findNonRetired({ internshipIDs: id });
  return {
    internship: internshipDoc,
    careerGoals,
  };
})(LandingInternshipExplorerPage);

export default withListSubscriptions(LandingInternshipExplorerContainer, [
  Courses.getPublicationName(),
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  CareerGoals.getPublicationName(),
  Slugs.getPublicationName(),
  Internships.getPublicationName(),
  Teasers.getPublicationName(),
]);

import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, List, Segment } from 'semantic-ui-react';
import { Course, Interest, Opportunity } from '../../../typings/radgrad';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import { getSlugFromEntityID } from '../../components/landing/utilities/helper-functions';
import * as Router from '../../components/shared/utilities/router';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import PageLayout from '../PageLayout';

interface InterestExplorerProps {
  currentUser: string;
  interest: Interest;
  courses: Course[];
  opportunities: Opportunity[];
}

const headerPaneTitle = 'The Interest Explorer';
const headerPaneBody = `
Interests are curated by the faculty to provide information about topic areas important to the discipline and future career goals.  Interests are used by RadGrad to recommend courses and opportunities relevant to the user. Interests are also used to build community by allowing registered users to find others with matching interests.

This public explorer does not provide information about community members.
`;

const LandingInterestExplorerPage: React.FC<InterestExplorerProps> = ({ currentUser, opportunities, courses, interest }) => {
  const match = useRouteMatch();
  return (
    <div>
      <LandingExplorerMenuBar/>
      <PageLayout id="landing-interest-explorer-page" headerPaneTitle={headerPaneTitle}
                  headerPaneBody={headerPaneBody}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={3}>
            <LandingExplorerMenuContainer />
          </Grid.Column>
          <Grid.Column width={13}>
            <Segment>
              <Header as="h4" dividing>
                <span>{interest.name}</span>
              </Header>
              <b>Description:</b>
              <Markdown escapeHtml source={interest.description} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
            </Segment>
            <Segment padded>
              <Header as="h4" dividing>
                Related Courses
              </Header>
              {courses.length > 0 ? (
                <List horizontal bulleted>
                  {courses.map((course) => (
                    <List.Item key={course._id} href={`#/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${getSlugFromEntityID(course._id)}`}>
                      {course.name}
                    </List.Item>
                  ))}
                </List>
              ) : (
                'N/A'
              )}
            </Segment>
            <Segment>
              <Header as="h4" dividing>
                Related Opportunities
              </Header>
              {opportunities.length > 0 ? (
                <List horizontal bulleted>
                  {opportunities.map((opportunity) => (
                    <List.Item key={opportunity._id} href={`#/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${getSlugFromEntityID(opportunity._id)}`}>
                      {opportunity.name}
                    </List.Item>
                  ))}
                </List>
              ) : (
                'N/A'
              )}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      </PageLayout>
    </div>
  );
};

const LandingInterestExplorerContainer = withTracker(() => {
  const { interest } = useParams();
  const id = Slugs.getEntityID(interest, 'Interest');
  return {
    interest: Interests.findDoc(id),
    courses: Courses.findNonRetired({ interestIDs: id }),
    opportunities: Opportunities.findNonRetired({ interestIDs: id }),
  };
})(LandingInterestExplorerPage);

export default withListSubscriptions(LandingInterestExplorerContainer, [Courses.getPublicationName(), Interests.getPublicationName(), Opportunities.getPublicationName(), Slugs.getPublicationName()]);

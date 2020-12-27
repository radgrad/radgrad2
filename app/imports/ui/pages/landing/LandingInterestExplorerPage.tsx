import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, List, Segment } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { Course, HelpMessage, Interest, Opportunity } from '../../../typings/radgrad';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import { getSlugFromEntityID } from '../../components/landing/utilities/helper-functions';
import * as Router from '../../components/shared/utilities/router';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';

interface InterestExplorerProps {
  currentUser: string;
  interest: Interest;
  courses: Course[];
  opportunities: Opportunity[];
  helpMessages: HelpMessage[];
}

const LandingInterestExplorerPage: React.FC<InterestExplorerProps> = ({ currentUser, opportunities, courses, helpMessages, interest }) => {
  // console.log(interest);
  const match = useRouteMatch();
  return (
    <div id="landing-interest-explorer-page">
      <ExplorerMenuBarContainer />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={3}>
            <LandingExplorerMenuContainer />
          </Grid.Column>

          <Grid.Column width={11}>
            <Segment padded style={{ overflow: 'auto', maxHeight: 750 }}>
              <Header as="h4" dividing>
                <span>{interest.name}</span>
              </Header>
              <b>Description:</b>
              <Markdown
                escapeHtml
                source={interest.description}
                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
              />
            </Segment>
            <Segment padded>
              <Header as="h4" dividing>Related Courses</Header>
              {courses.length > 0 ?
                (
                  <List horizontal bulleted>
                    {courses.map((course) => (
                      <List.Item
                        key={course._id}
                        href={`#/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${getSlugFromEntityID(course._id)}`}
                      >
                        {course.name}
                      </List.Item>
                    ))}
                  </List>
                )
                : 'N/A'}
            </Segment>
            <Segment padded>
              <Header as="h4" dividing>Related Opportunities</Header>
              {opportunities.length > 0 ?
                (
                  <List horizontal bulleted>
                    {opportunities.map((opportunity) => (
                      <List.Item
                        key={opportunity._id}
                        href={`#/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${getSlugFromEntityID(opportunity._id)}`}
                      >
                        {opportunity.name}
                      </List.Item>
                    ))}
                  </List>
                )
                : 'N/A'}
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>
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
    helpMessages: HelpMessages.findNonRetired({}),
  };
})(LandingInterestExplorerPage);

export default withListSubscriptions(LandingInterestExplorerContainer, [
  Courses.getPublicationName(),
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  Slugs.getPublicationName(),
  HelpMessages.getPublicationName(),
]);

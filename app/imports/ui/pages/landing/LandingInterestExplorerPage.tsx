import { Meteor } from 'meteor/meteor';
import React from 'react';
import Markdown from 'react-markdown';
import { useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, List, Segment } from 'semantic-ui-react';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { ICourse, IInterest, IOpportunity } from '../../../typings/radgrad';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';
import { getSlugFromEntityID } from '../../components/landing/utilities/helper-functions';
import * as Router from '../../components/shared/utilities/router';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { EXPLORER_TYPE } from '../../layouts/utilities/route-constants';

interface IInterestExplorerProps {
  currentUser: string;
  interest: IInterest;
  courses: ICourse[];
  opportunities: IOpportunity[];
}

const LandingInterestExplorerPage = (props: IInterestExplorerProps) => {
  // console.log(props.interest);
  const match = useRouteMatch();
  return (
    <div id="landing-interest-explorer-page">
      <ExplorerMenuBarContainer currentUser={props.currentUser} />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
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
                <span>{props.interest.name}</span>
              </Header>
              <b>Description:</b>
              <Markdown
                escapeHtml
                source={props.interest.description}
                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
              />
            </Segment>
            <Segment padded>
              <Header as="h4" dividing>Related Courses</Header>
              {props.courses.length > 0 ?
                (
                  <List horizontal bulleted>
                    {props.courses.map((course) => (
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
              {props.opportunities.length > 0 ?
                (
                  <List horizontal bulleted>
                    {props.opportunities.map((opportunity) => (
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

const WithSubs = withListSubscriptions(LandingInterestExplorerPage, [
  Courses.getPublicationName(),
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  Slugs.getPublicationName(),
]);

const LandingInterestExplorerContainer = withTracker((props) => {
  const slugName = props.match.params.interest;
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(slugName, 'Interest');
  return {
    interest: Interests.findDoc(id),
    courses: Courses.findNonRetired({ interestIDs: id }),
    opportunities: Opportunities.findNonRetired({ interestIDs: id }),
    currentUser: Meteor.user() ? Meteor.user().username : '',
  };
})(WithSubs);

export default LandingInterestExplorerContainer;

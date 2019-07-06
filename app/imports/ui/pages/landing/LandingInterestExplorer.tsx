import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, List, Segment } from 'semantic-ui-react';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { ICourse, IInterest, IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import withListSubscriptions from '../../layouts/shared/SubscriptionListHOC';
import { getSlugFromEntityID } from '../../components/landing/helper-functions';
import * as Router from '../../components/shared/RouterHelperFunctions';

interface IInterestExplorerProps {
  interest: IInterest;
  courses: ICourse[];
  opportunities: IOpportunity[];
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  location: object;
  history: object;
}

class LandingInterestExplorer extends React.Component<IInterestExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    // console.log(this.props.interest);
    const { match } = this.props;
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true} container={true} padded="vertically">
          {/* <Grid.Row> */}
          {/* <HelpPanelWidgetContainer routeProps={this.props.location}/> */}
          {/* </Grid.Row> */}
          <Grid.Row>
            <Grid.Column width="three">
              <LandingExplorerMenuContainer/>
            </Grid.Column>
            <Grid.Column width="thirteen">
              <Segment padded={true} style={{ overflow: 'auto', maxHeight: 750 }}>
                <Header as="h4" dividing={true}>
                  <span>{this.props.interest.name}</span>
                </Header>
                <b>Description:</b>
                <Markdown escapeHtml={true} source={this.props.interest.description}
                          renderers={{ link: (props) => Router.renderLink(props, match) }}/>
              </Segment>
              <Segment padded={true}>
                <Header as="h4" dividing={true}>Related Courses</Header>
                <List horizontal={true} bulleted={true}>
                  {// console.log(course.name);
                   this.props.courses.map((course) => (<List.Item key={course._id} href={`#/explorer/courses/${getSlugFromEntityID(course._id)}`}>{course.name}</List.Item>))}
                </List>
              </Segment>
              <Segment padded={true}>
                <Header as="h4" dividing={true}>Related Opportunities</Header>
                <List horizontal={true} bulleted={true}>
                  {// console.log(course.name);
                   this.props.opportunities.map((opportunity) => (<List.Item key={opportunity._id} href={`#/explorer/opportunites/${getSlugFromEntityID(opportunity._id)}`}>{opportunity.name}</List.Item>))}
                </List>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const WithSubs = withListSubscriptions(LandingInterestExplorer, [
  Courses.getPublicationName(),
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  Slugs.getPublicationName(),
]);

const LandingInterestExplorerCon = withRouter(WithSubs);

const LandingInterestExplorerContainer = withTracker((props) => {
  const slugName = props.match.params.interest;
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(slugName, 'Interest');
  return {
    interest: Interests.findDoc(id),
    courses: Courses.findNonRetired({ interestIDs: id }),
    opportunities: Opportunities.findNonRetired({ interestIDs: id }),
  };
})(LandingInterestExplorerCon);

export default LandingInterestExplorerContainer;

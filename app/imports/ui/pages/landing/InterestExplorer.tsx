import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Icon, Image, Label, List, Loader, Segment } from 'semantic-ui-react';
import ExplorerMenuBarContainer from '../../components/landing/ExplorerMenuBar';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import { ICourse, IInterest, IOpportunity } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/LandingExplorerCard';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import withGenericSubscriptions from '../../layouts/shared/GenericSubscriptionHOC';
import InterestList from '../../components/landing/InterestList';
import { getSlugFromEntityID } from '../../components/landing/helper-functions';

interface IInterestExplorerProps {
  interest: IInterest;
  courses: ICourse[];
  opportunities: IOpportunity[];
  match: object;
  location: object;
  history: object;
}

class InterestExplorer extends React.Component<IInterestExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    // console.log(this.props.interest);
    const inlineStyle = {
      maxHeight: 750,
      marginTop: 10,
    };
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true} container={true} padded="vertically">
          {/*<Grid.Row>*/}
          {/*<HelpPanelWidgetContainer routeProps={this.props.location}/>*/}
          {/*</Grid.Row>*/}
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
                <Markdown escapeHtml={true} source={this.props.interest.description}/>
              </Segment>
              <Segment padded={true}>
                <Header as="h4" dividing={true}>Related Courses</Header>
                <List horizontal={true} bulleted={true}>
                  {this.props.courses.map((course) => {
                    // console.log(course.name);
                    return (<List.Item key={course._id} href={`#/explorer/courses/${getSlugFromEntityID(course._id)}`}>{course.name}</List.Item>);
                  })}
                </List>
              </Segment>
              <Segment padded={true}>
                <Header as="h4" dividing={true}>Related Opportunities</Header>
                <List horizontal={true} bulleted={true}>
                  {this.props.opportunities.map((opportunity) => {
                    // console.log(course.name);
                    return (<List.Item key={opportunity._id} href={`#/explorer/opportunites/${getSlugFromEntityID(opportunity._id)}`}>{opportunity.name}</List.Item>);
                  })}
                </List>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const WithSubs = withGenericSubscriptions(InterestExplorer, [
  Courses.getPublicationName(),
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  Slugs.getPublicationName(),
]);

const InterestExplorerCon = withRouter(WithSubs);

const InterestExplorerContainer = withTracker((props) => {
  const slugName = props.match.params.interest;
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(slugName, 'Interest');
  return {
    interest: Interests.findDoc(id),
    courses: Courses.find({ interestIDs: id }).fetch(),
    opportunities: Opportunities.find({ interestIDs: id }).fetch(),
  };
})(InterestExplorerCon);

export default InterestExplorerContainer;

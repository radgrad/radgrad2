import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import ExplorerMenuBarContainer from '../../components/landing/ExplorerMenuBar';
// import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import { ICourse } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import withGenericSubscriptions from '../../layouts/shared/GenericSubscriptionHOC';
import InterestList from '../../components/landing/InterestList';

interface ICourseExplorerProps {
  course: ICourse;
  match: object;
  location: object;
  history: object;
}

class CourseExplorer extends React.Component<ICourseExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    // console.log(this.props.course);
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
                  <span>{this.props.course.shortName} ({this.props.course.name})</span>
                </Header>
                <b>Course Number:</b> {this.props.course.num}
                <b>Description:</b>
                <Markdown escapeHtml={true} source={this.props.course.description}/>
                <Header as="h4" dividing={true}>Course Interests</Header>
                <InterestList interestIDs={this.props.course.interestIDs}/>
              </Segment>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

const WithSubs = withGenericSubscriptions(CourseExplorer, [
  Courses.getCollectionName(),
  Slugs.getPublicationName(),
  Interests.getPublicationName(),
]);

const CourseExplorerCon = withRouter(WithSubs);

const CourseExplorerContainer = withTracker((props) => {
  const slugName = props.match.params.course;
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(slugName, 'Course');
  return {
    course: Courses.findDoc(id),
  };
})(CourseExplorerCon);

export default CourseExplorerContainer;

import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
// import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import { ICourse } from '../../../typings/radgrad'; // eslint-disable-line
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import withListSubscriptions from '../../layouts/shared/SubscriptionListHOC';
import InterestList from '../../components/landing/InterestList';
import LandingPrerequisiteList from '../../components/landing/LandingPrerequisiteList';

interface ICourseExplorerProps {
  course: ICourse;
  match: object;
  location: object;
  history: object;
}

class LandingCourseExplorer extends React.Component<ICourseExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    // console.log(this.props.course);
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
                  <span>{this.props.course.shortName} ({this.props.course.name})</span>
                </Header>
                <Grid columns={2} stackable={true}>
                  <Grid.Column width={'six'}>
                    <b>Course Number:</b> {this.props.course.num}<br/>
                    <b>Credit Hours:</b> {this.props.course.creditHrs}
                  </Grid.Column>
                  <Grid.Column width={'ten'}>
                    <b>Syllabus</b> {this.props.course.syllabus ? < a href={this.props.course.syllabus}>{this.props.course.syllabus}</a> : 'None available'}
                  </Grid.Column>
                </Grid>
                <b>Description:</b>
                <Markdown escapeHtml={true} source={this.props.course.description}/>
                <Header as="h4" dividing={true}>Prerequisites</Header>
                <LandingPrerequisiteList prerequisites={this.props.course.prerequisites}/>
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

const WithSubs = withListSubscriptions(LandingCourseExplorer, [
  Courses.getPublicationName(),
  Slugs.getPublicationName(),
  Interests.getPublicationName(),
]);

const LandingCourseExplorerCon = withRouter(WithSubs);

const LandingCourseExplorerContainer = withTracker((props) => {
  const slugName = props.match.params.course;
  // console.log(Slugs.find().fetch());
  const id = Slugs.getEntityID(slugName, 'Course');
  return {
    course: Courses.findDoc(id),
  };
})(LandingCourseExplorerCon);

export default LandingCourseExplorerContainer;

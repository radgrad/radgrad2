import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
import { ICourse } from '../../../typings/radgrad'; // eslint-disable-line
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import withListSubscriptions from '../../layouts/shared/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import LandingPrerequisiteList from '../../components/landing/LandingPrerequisiteList';
import * as Router from '../../components/shared/RouterHelperFunctions';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface ICourseExplorerProps {
  course: ICourse;
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

class LandingCourseExplorer extends React.Component<ICourseExplorerProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const { match } = this.props;
    return (
      <div>
        <ExplorerMenuBarContainer/>
        <Grid stackable={true}>
          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={14}><HelpPanelWidget/></Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={3}>
              <LandingExplorerMenuContainer/>
            </Grid.Column>

            <Grid.Column width={11}>
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
                    <b>Syllabus</b> {this.props.course.syllabus ?
                    < a href={this.props.course.syllabus}>{this.props.course.syllabus}</a> : 'None available'}
                  </Grid.Column>
                </Grid>
                <b>Description:</b>
                <Markdown escapeHtml={true} source={this.props.course.description}
                          renderers={{ link: (props) => Router.renderLink(props, match) }}/>
                <Header as="h4" dividing={true}>Prerequisites</Header>
                <LandingPrerequisiteList prerequisites={this.props.course.prerequisites}/>
                <Header as="h4" dividing={true}>Course Interests</Header>
                <LandingInterestList interestIDs={this.props.course.interestIDs}/>
              </Segment>
            </Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>
        </Grid>

        <BackToTopButton/>
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

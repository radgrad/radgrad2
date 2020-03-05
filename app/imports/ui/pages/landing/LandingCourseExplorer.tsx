import React from 'react';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import ExplorerMenuBarContainer from '../../components/landing/LandingExplorerMenuBar';
// import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';
import { ICourse } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import { withListSubscriptions } from '../../layouts/shared/SubscriptionListHOC';
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

const LandingCourseExplorer = (props: ICourseExplorerProps) => {
  const { match } = props;
  return (
    <div>
      <ExplorerMenuBarContainer />
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
                <span>
                  {props.course.shortName}
                  {' '}
(
                  {props.course.name}
)
                </span>
              </Header>
              <Grid columns={2} stackable>
                <Grid.Column width="six">
                  <b>Course Number:</b>
                  {' '}
                  {props.course.num}
                  <br />
                  <b>Credit Hours:</b>
                  {' '}
                  {props.course.creditHrs}
                </Grid.Column>
                <Grid.Column width="ten">
                  <b>Syllabus</b>
                  {' '}
                  {props.course.syllabus ?
                    <a href={props.course.syllabus}>{props.course.syllabus}</a> : 'None available'}
                </Grid.Column>
              </Grid>
              <b>Description:</b>
              <Markdown
                escapeHtml
                source={props.course.description}
                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
              />
              <Header as="h4" dividing>Prerequisites</Header>
              <LandingPrerequisiteList prerequisites={props.course.prerequisites} />
              <Header as="h4" dividing>Course Interests</Header>
              <LandingInterestList interestIDs={props.course.interestIDs} />
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

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

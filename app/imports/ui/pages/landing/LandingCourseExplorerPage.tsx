import React from 'react';
import Markdown from 'react-markdown';
import {useParams, useRouteMatch} from 'react-router-dom';
import {withTracker} from 'meteor/react-meteor-data';
import {Grid, Header, Segment} from 'semantic-ui-react';
import {Courses} from '../../../api/course/CourseCollection';
import {HelpMessages} from '../../../api/help/HelpMessageCollection';
import {Course, HelpMessage} from '../../../typings/radgrad';
import {Slugs} from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import {Interests} from '../../../api/interest/InterestCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import LandingPrerequisiteList from '../../components/landing/LandingPrerequisiteList';
import * as Router from '../../components/shared/utilities/router';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import PageLayout from '../PageLayout';

interface CourseExplorerProps {
  course: Course;
  helpMessages: HelpMessage[];
}

const headerPaneTitle = 'The Course Explorer';
const headerPaneBody = `
The RadGrad course explorer provides helpful information about courses, including reviews by students from previous semesters, as well as the number of students planning to take the course in an upcoming semester. 

This public explorer does not show reviews or the forecasts for future semesters, but does provide an overview of the courses currently available in the system.
`;

/**
 * The landing course explorer page.
 * @param {React.PropsWithChildren<CourseExplorerProps>} props
 * @return {JSX.Element}
 * @constructor
 */
const LandingCourseExplorerPage: React.FC<CourseExplorerProps> = ({helpMessages, course}) => {
  const match = useRouteMatch();
  return (
    <div>
      <LandingExplorerMenuBar/>
      <PageLayout id="landing-course-explorer-page" headerPaneTitle={headerPaneTitle}
                  headerPaneBody={headerPaneBody}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <LandingExplorerMenuContainer/>
            </Grid.Column>

            <Grid.Column width={13}>
              <Segment>
                <Header as="h4" dividing>
                <span>
                  {course.shortName} ({course.name})
                </span>
                </Header>
                <Grid columns={2} stackable>
                  <Grid.Column width="six">
                    <b>Course Number:</b> {course.num}
                    <br/>
                    <b>Credit Hours:</b> {course.creditHrs}
                  </Grid.Column>
                  <Grid.Column width="ten">
                    <b>Syllabus: </b>
                    {course.syllabus ? (
                      <a href={course.syllabus} target="_blank" rel="noopener noreferrer">
                        {course.syllabus}
                      </a>
                    ) : (
                      'None available'
                    )}
                  </Grid.Column>
                </Grid>
                <b>Description:</b>
                <Markdown escapeHtml source={course.description}
                          renderers={{link: (localProps) => Router.renderLink(localProps, match)}}/>
                <Header as="h4" dividing>
                  Prerequisites
                </Header>
                {course.prerequisites.length > 0 ?
                  <LandingPrerequisiteList prerequisites={course.prerequisites}/> : 'N/A'}
                {course.interestIDs.length > 0 ? <LandingInterestList interestIDs={course.interestIDs}/> : 'N/A'}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </PageLayout>
    </div>
  );
};

const LandingCourseExplorerContainer = withTracker(() => {
  const {course} = useParams();
  const id = Slugs.getEntityID(course, 'Course');
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    course: Courses.findDoc(id),
    helpMessages,
  };
})(LandingCourseExplorerPage);

export default withListSubscriptions(LandingCourseExplorerContainer, [Courses.getPublicationName(), Slugs.getPublicationName(), Interests.getPublicationName(), HelpMessages.getPublicationName()]);

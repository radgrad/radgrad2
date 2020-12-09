import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { ICourse, IHelpMessage } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import LandingPrerequisiteList from '../../components/landing/LandingPrerequisiteList';
import * as Router from '../../components/shared/utilities/router';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

interface ICourseExplorerProps {
  course: ICourse;
  helpMessages: IHelpMessage[];
}

/**
 * The landing course explorer page.
 * @param {React.PropsWithChildren<ICourseExplorerProps>} props
 * @return {JSX.Element}
 * @constructor
 */
const LandingCourseExplorerPage: React.FC<ICourseExplorerProps> = ({ helpMessages, course }) => {
  const match = useRouteMatch();
  return (
    <div id="landing-course-explorer-page">
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
                <span>
                  {course.shortName} ({course.name})
                </span>
              </Header>
              <Grid columns={2} stackable>
                <Grid.Column width="six">
                  <b>Course Number:</b> {course.num}
                  <br />
                  <b>Credit Hours:</b> {course.creditHrs}
                </Grid.Column>
                <Grid.Column width="ten">
                  <b>Syllabus: </b>
                  {course.syllabus ?
                    (
                      <a href={course.syllabus} target="_blank" rel="noopener noreferrer">
                        {course.syllabus}
                      </a>
                    )
                    : 'None available'}
                </Grid.Column>
              </Grid>
              <b>Description:</b>
              <Markdown
                escapeHtml
                source={course.description}
                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
              />
              <Header as="h4" dividing>Prerequisites</Header>
              {course.prerequisites.length > 0 ?
                (<LandingPrerequisiteList prerequisites={course.prerequisites} />)
                : 'N/A'}
              {course.interestIDs.length > 0 ?
                (<LandingInterestList interestIDs={course.interestIDs} />)
                : 'N/A'}
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

const LandingCourseExplorerContainer = withTracker(() => {
  const { course } = useParams();
  const id = Slugs.getEntityID(course, 'Course');
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    course: Courses.findDoc(id),
    helpMessages,
  };
})(LandingCourseExplorerPage);

export default withListSubscriptions(LandingCourseExplorerContainer, [
  Courses.getPublicationName(),
  Slugs.getPublicationName(),
  Interests.getPublicationName(),
  HelpMessages.getPublicationName(),
]);

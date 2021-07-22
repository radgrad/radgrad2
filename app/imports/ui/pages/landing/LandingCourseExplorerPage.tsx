import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import { Course } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import LandingCareerGoalList from '../../components/landing/LandingCareerGoalList';
import LandingOpportunityList from '../../components/landing/LandingOpportunityList';
import * as Router from '../../components/shared/utilities/router';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import RadGradSegment from '../../components/shared/RadGradSegment';
import RadGradHeader from '../../components/shared/RadGradHeader';
import { EXPLORER_TYPE_ICON } from '../../utilities/ExplorerUtils';

interface CourseExplorerProps {
  course: Course;
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
const LandingCourseExplorerPage: React.FC<CourseExplorerProps> = ({ course }) => {
  const match = useRouteMatch();
  const relatedCareerGoals = Courses.findRelatedCareerGoals(course._id);
  const relatedOpportunities = Courses.findRelatedOpportunities(course._id);
  const title = Courses.getName(course._id);
  const headerPaneImage = course.picture;
  return (
    <div>
      <LandingExplorerMenuBar />
      <PageLayout id={PAGEIDS.LANDING_COURSE_EXPLORER} headerPaneTitle={headerPaneTitle}
        headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <LandingExplorerMenuContainer />
            </Grid.Column>

            <Grid.Column width={13}>
              <RadGradSegment header={<RadGradHeader title={title} />}>
                <Grid columns={2} stackable>
                  <Grid.Column width="six">
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
                  renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}/>
              </RadGradSegment>
              <RadGradSegment header={<RadGradHeader title='Related Interests' icon={EXPLORER_TYPE_ICON.INTEREST} dividing/>}>{course.interestIDs.length > 0 ? <LandingInterestList interestIDs={course.interestIDs} size='small' /> : 'N/A'}</RadGradSegment>
              <RadGradSegment header={<RadGradHeader title="Related Career Goals" icon={EXPLORER_TYPE_ICON.CAREERGOAL} dividing />}>
                {relatedCareerGoals.length > 0 ? <LandingCareerGoalList careerGoals={relatedCareerGoals} size='small' /> : 'N/A'}
              </RadGradSegment>
              <RadGradSegment header={<RadGradHeader title="Related Opportunities" icon={EXPLORER_TYPE_ICON.OPPORTUNITY} dividing />}>
                {relatedOpportunities.length > 0 ? <LandingOpportunityList opportunities={relatedOpportunities} size='small' /> : 'N/A'}
              </RadGradSegment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </PageLayout>
    </div>
  );
};

const LandingCourseExplorerContainer = withTracker(() => {
  const { course } = useParams();
  const id = Slugs.getEntityID(course, 'Course');
  const courseDoc = Courses.findDoc(id);
  return {
    course: courseDoc,
  };
})(LandingCourseExplorerPage);

export default withListSubscriptions(LandingCourseExplorerContainer, [
  Courses.getPublicationName(),
  Slugs.getPublicationName(),
  Interests.getPublicationName(),
  CareerGoals.getPublicationName(),
  Opportunities.getPublicationName(),
]);

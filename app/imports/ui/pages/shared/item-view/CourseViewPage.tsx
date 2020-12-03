import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid } from 'semantic-ui-react';
import _ from 'lodash';
import { getMenuWidget } from '../utilities/getMenuWidget';
import { HelpMessages } from '../../../../api/help/HelpMessageCollection';
import HelpPanelWidget from '../../../components/shared/HelpPanelWidget';
import ExplorerMenu from '../../../components/shared/explorer/item-view/ExplorerMenu';
import { ICourse, IDescriptionPair, IFavoriteCourse, IHelpMessage } from '../../../../typings/radgrad';
import { Courses } from '../../../../api/course/CourseCollection';
import { FavoriteCourses } from '../../../../api/favorite/FavoriteCourseCollection';
import { Users } from '../../../../api/user/UserCollection';
import ExplorerCourseWidget from '../../../components/shared/explorer/item-view/course/ExplorerCourseWidget';
import { Interests } from '../../../../api/interest/InterestCollection';
import { teaser } from '../../../components/shared/explorer/item-view/utilities/teaser';
import { isSingleChoice } from '../../../../api/degree-plan/PlanChoiceUtilities';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import * as Router from '../../../components/shared/utilities/router';
import { Slugs } from '../../../../api/slug/SlugCollection';

interface ICourseViewPageProps {
  favoriteCourses: IFavoriteCourse[];
  course: ICourse;
  helpMessages: IHelpMessage[];
}

// TODO this seems very complicated to get the description pairs.
const passedCourseHelper = (courseSlugName: string, match): string => {
  let ret = 'Not in plan';
  const theCourse = Courses.findDocBySlug(courseSlugName);
  const ci = CourseInstances.findNonRetired({
    studentID: Router.getUserIdFromRoute(match),
    courseID: theCourse._id,
  });
  _.forEach(ci, (c) => {
    if (c.verified === true) {
      ret = 'Completed';
    } else if (ret !== 'Completed') {
      ret = 'In plan, but not yet complete';
    }
  });
  return ret;
};

const prerequisiteStatus = (prerequisite: string, match) => {
  if (isSingleChoice(prerequisite)) {
    return passedCourseHelper(prerequisite, match);
  }
  const slugs = prerequisite.split(',');
  let ret = 'Not in plan';
  slugs.forEach((slug) => {
    const result = passedCourseHelper(slug, match);
    if (result === 'Completed') {
      ret = result;
    } else if (result === 'In plan, but not yet complete') {
      ret = result;
    }
  });
  return ret;
};

const prerequisites = (theCourse: ICourse, match): any[] => {
  const list = theCourse.prerequisites;
  const complete = [];
  const incomplete = [];
  const notInPlan = [];
  let itemStatus = '';
  _.forEach(list, (item) => {
    itemStatus = prerequisiteStatus(item, match);
    if (itemStatus === 'Not in plan') {
      notInPlan.push({ course: item, status: itemStatus });
    } else if (itemStatus === 'Completed') {
      complete.push({ course: item, status: itemStatus });
    } else {
      incomplete.push({ course: item, status: itemStatus });
    }
  });
  if (complete.length === 0 && incomplete.length === 0 && notInPlan.length === 0) {
    return null;
  }
  return [complete, incomplete, notInPlan];
};

const descriptionPairsCourses = (theCourse: ICourse, match): IDescriptionPair[] => [
  { label: 'Course Number', value: theCourse.num },
  { label: 'Credit Hours', value: theCourse.creditHrs },
  { label: 'Description', value: theCourse.description },
  { label: 'Syllabus', value: theCourse.syllabus },
  { label: 'Interests', value: _.sortBy(Interests.findNames(theCourse.interestIDs)) },
  { label: 'Prerequisites', value: prerequisites(theCourse, match) },
  { label: 'Teaser', value: teaser(theCourse) },
];

const isCourseCompleted = (courseSlugName, match): boolean => {
  let ret = false;
  const courseStatus = passedCourseHelper(courseSlugName, match);
  if (courseStatus === 'Completed') {
    ret = true;
  }
  return ret;
};

const CourseViewPage: React.FC<ICourseViewPageProps> = ({ favoriteCourses, course, helpMessages }) => {
  const match = useRouteMatch();
  const menuAddedList = _.map(favoriteCourses, (f) => ({
    item: Courses.findDoc(f.courseID), count: 1,
  }));
  const descriptionPairs = descriptionPairsCourses(course, match);
  const courseSlug = Slugs.getNameFromID(course.slugID);
  const completed = isCourseCompleted(courseSlug, match);
  return (
    <div id="course-view-page">
      {getMenuWidget(match)}
      <Container>
        <Grid stackable>
          <Grid.Row className="helpPanel">
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <ExplorerMenu menuAddedList={menuAddedList} type="courses" />
            </Grid.Column>
            <Grid.Column width={13}>
              <ExplorerCourseWidget name={course.name} shortName={course.shortName} descriptionPairs={descriptionPairs} item={course} completed={completed} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

const CourseViewPageContainer = withTracker(() => {
  const { course, username } = useParams();
  // console.log(course, username);
  const courseDoc = Courses.findDocBySlug(course);
  const profile = Users.getProfile(username);
  const favoriteCourses = FavoriteCourses.findNonRetired({ studentID: profile.userID });
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    course: courseDoc,
    favoriteCourses,
    helpMessages,
  };
})(CourseViewPage);

export default CourseViewPageContainer;

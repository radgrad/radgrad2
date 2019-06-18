import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import * as _ from 'lodash';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../../components/mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../../components/faculty/FacultyPageMenuWidget';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { isSingleChoice } from '../../../api/degree-plan/PlanChoiceUtilities';
import { Users } from '../../../api/user/UserCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import ExplorerCoursesWidget from '../../components/shared/ExplorerCoursesWidget';
import { ICourse } from '../../../typings/radgrad'; // eslint-disable-line
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import ExplorerMenu from "../../components/shared/ExplorerMenu"; // eslint-disable-line

interface IExplorerCoursesPageProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      course: string;
    }
  };
}

class ExplorerCoursesPage extends React.Component<IExplorerCoursesPageProps> {
  constructor(props) {
    super(props);
  }

  private getRoleByUrl = (): string => {
    const url = this.props.match.url;
    const username = this.props.match.params.username;
    const indexUsername = url.indexOf(username);
    return url.substring(1, indexUsername - 1);
  }

  private renderPageMenuWidget = (): JSX.Element | string => {
    const role = this.getRoleByUrl();
    switch (role) {
      case 'student':
        return <StudentPageMenuWidget/>;
      case 'mentor':
        return <MentorPageMenuWidget/>;
      case 'faculty':
        return <FacultyPageMenuWidget/>;
      default:
        return '';
    }
  }

  /* ####################################### EXPLORER MENU HELPER FUNCTIONS ######################################### */
  private addedCourses = (): { item: ICourse, count: number }[] => {
    const addedCourses = [];
    const allCourses = _.filter(Courses.find({}, { sort: { shortName: 1 } })
      .fetch(), (c) => !c.retired);
    const userID = this.getUserIdFromRoute();
    _.forEach(allCourses, (course) => {
      const ci = CourseInstances.find({
        studentID: userID,
        courseID: course._id,
      })
        .fetch();
      if (ci.length > 0) {
        if (course.shortName !== 'Non-CS Course') {
          addedCourses.push({ item: course, count: ci.length });
        }
      }
    });
    return addedCourses;
  }

  /* ####################################### EXPLORER COURSES WIDGET HELPER FUNCTIONS ############################### */
  private course = (): ICourse => {
    const courseSlugName = this.props.match.params.course;
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.findDoc({ slugID: slug[0]._id });
    return course;
  }

  private slugName = (slugID: string): string => Slugs.findDoc(slugID).name;

  private descriptionPairs = (course: ICourse): object[] => [
    { label: 'Course Number', value: course.num },
    { label: 'Credit Hours', value: course.creditHrs },
    { label: 'Description', value: course.description },
    { label: 'Syllabus', value: course.syllabus },
    { label: 'Interests', value: _.sortBy(Interests.findNames(course.interestIDs)) },
    { label: 'Prerequisites', value: this.prerequisites(course) },
  ]

  private prerequisites = (course: ICourse): any[] => {
    const list = course.prerequisites;
    const complete = [];
    const incomplete = [];
    const notInPlan = [];
    let itemStatus = '';
    _.forEach(list, (item) => {
      itemStatus = this.prerequisiteStatus(item);
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
  }

  private prerequisiteStatus = (prerequisite: string) => {
    // console.log(prerequisite);
    if (isSingleChoice(prerequisite)) {
      return this.passedCourseHelper(prerequisite);
    }
    const slugs = prerequisite.split(',');
    let ret = 'Not in plan';
    slugs.forEach((slug) => {
      const result = this.passedCourseHelper(slug);
      if (result === 'Completed') {
        ret = result;
      } else if (result === 'In plan, but not yet complete') {
        ret = result;
      }
    });
    return ret;
  }

  private passedCourseHelper = (courseSlugName: string): string => {
    let ret = 'Not in plan';
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.find({ slugID: slug[0]._id }).fetch();
    const ci = CourseInstances.find({
      studentID: this.getUserIdFromRoute(),
      courseID: course[0]._id,
    })
      .fetch();
    _.forEach(ci, (c) => {
      if (c.verified === true) {
        ret = 'Completed';
      } else if (ret !== 'Completed') {
        ret = 'In plan, but not yet complete';
      }
    });
    return ret;
  }

  private completed = (): boolean => {
    let ret = false;
    const courseSlugName = this.props.match.params.course;
    const courseStatus = this.passedCourseHelper(courseSlugName);
    if (courseStatus === 'Completed') {
      ret = true;
    }
    return ret;
  }

  private reviewed = (course: ICourse): boolean => {
    let ret = false;
    const review = Reviews.find({
      studentID: this.getUserIdFromRoute(),
      revieweeID: course._id,
    }).fetch();
    if (review.length > 0) {
      ret = true;
    }
    return ret;
  }

  private getUserIdFromRoute = (): string => {
    const username = this.props.match.params.username;
    return username && Users.getID(username);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const helpMessage = HelpMessages.findOne({ routeName: this.props.match.path });

    const addedList = this.addedCourses();

    const course = this.course();
    const name = course.name;
    const shortName = course.shortName;
    const slug = this.slugName(course.slugID);
    const descriptionPairs = this.descriptionPairs(course);
    const id = course._id;
    const completed = this.completed();
    const reviewed = this.reviewed(course);
    const role = this.getRoleByUrl();

    return (
      <React.Fragment>
        {this.renderPageMenuWidget()}

        <Grid container={true} stackable={true}>
          <Grid.Row>
            {helpMessage ? <HelpPanelWidget/> : ''}
          </Grid.Row>

          <Grid.Column width={3}>
            <ExplorerMenu menuAddedList={addedList} type={'courses'} role={this.getRoleByUrl()}/>
          </Grid.Column>

          <Grid.Column width={13}>
            <ExplorerCoursesWidget name={name} shortName={shortName} slug={slug} descriptionPairs={descriptionPairs}
                                   id={id} item={course} completed={completed} reviewed={reviewed} role={role}/>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

const ExplorerCoursesPageCon = withGlobalSubscription(ExplorerCoursesPage);
const ExplorerCoursesPageContainer = withInstanceSubscriptions(ExplorerCoursesPageCon);

export default ExplorerCoursesPageContainer;

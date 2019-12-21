import * as React from 'react';
import { Button, Header, Menu, Popup } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { ICourse, ICourseInstanceDefine, IRadGradMatch } from '../../../typings/radgrad'; // eslint-disable-line
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import * as Router from '../shared/RouterHelperFunctions';
import { academicTermNameToSlug, itemToSlugName } from '../shared/data-model-helper-functions';

interface IStudentExplorerCoursesWidgetButtonProps {
  buttonType: 'remove' | 'add' | 'taken';
  course: ICourse;
  match: IRadGradMatch;
}

const nextYears = (amount: number): number[] => {
  const years = [];
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  let currentYear = currentTerm.year;
  for (let i = 0; i < amount; i += 1) {
    years.push(currentYear);
    currentYear += 1;
  }
  return years;
};

const yearTerms = (year: number): string[] => {
  const terms = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
  return terms;
};

const handleAddToPlan = (props: IStudentExplorerCoursesWidgetButtonProps) => (e: any): void => {
  e.preventDefault();
  const course = props.course;
  const term = e.target.text;
  const courseSlug = itemToSlugName(course);
  const termSlug = academicTermNameToSlug(term);
  const username = Router.getUsername(props.match);
  const collectionName = CourseInstances.getCollectionName();
  const definitionData: ICourseInstanceDefine = {
    academicTerm: termSlug,
    course: courseSlug,
    verified: false,
    note: course.num,
    grade: 'B',
    student: username,
  };
  defineMethod.call({ collectionName, definitionData }, (error) => {
    if (!error) {
      FeedbackFunctions.checkPrerequisites(Router.getUserIdFromRoute(props.match));
      FeedbackFunctions.checkCompletePlan(Router.getUserIdFromRoute(props.match));
      FeedbackFunctions.generateRecommendedCourse(Router.getUserIdFromRoute(props.match));
    }
  });
  const interactionData = { username, type: 'addCourse', typeData: courseSlug.name };
  userInteractionDefineMethod.call(interactionData, (err) => {
    if (err) {
      console.log('Error creating UserInteraction', err);
    }
  });
};

// FIXME: Removing from Plan isn't reactive
const handleRemoveFromPlan = (props: IStudentExplorerCoursesWidgetButtonProps) => (e: any): void => {
  e.preventDefault();
  const course = props.course;
  const term = e.target.text;
  const termSplit = term.split(' ');
  const termSlug = `${termSplit[0]}-${termSplit[1]}`;
  const termID = AcademicTerms.getID(termSlug);
  const collectionName = CourseInstances.getCollectionName();
  const ci = CourseInstances.find({
    studentID: Router.getUserIdFromRoute(props.match),
    courseID: course._id,
    termID: termID,
  }).fetch();
  if (ci.length > 1) {
    console.log('Too many course instances found for a single academic term.');
  }
  removeItMethod.call({ collectionName, instance: ci[0]._id }, (error) => {
    if (!error) {
      FeedbackFunctions.checkPrerequisites(Router.getUserIdFromRoute(props.match));
      FeedbackFunctions.checkCompletePlan(Router.getUserIdFromRoute(props.match));
      FeedbackFunctions.generateRecommendedCourse(Router.getUserIdFromRoute(props.match));
    }
  });
  const interactionData = {
    username: Router.getUsername(props.match),
    type: 'removeCourse',
    typeData: Slugs.getNameFromID(course.slugID),
  };
  userInteractionDefineMethod.call(interactionData, (err) => {
    if (err) {
      console.log('Error creating UserInteraction', err);
    }
  });
};

const existingTerms = (props: IStudentExplorerCoursesWidgetButtonProps): string[] => {
  const terms = [];
  const course = props.course;
  const ci = CourseInstances.find({
    studentID: Router.getUserIdFromRoute(props.match),
    courseID: course._id,
  }).fetch();
  _.forEach(ci, (c) => {
    const term = AcademicTerms.findDoc(c.termID);
    if (term.termNumber >= AcademicTerms.getCurrentAcademicTermDoc().termNumber) {
      terms.push(AcademicTerms.toString(c.termID, false));
    }
  });
  return terms;
};

const StudentExplorerCoursesWidgetButton = (props: IStudentExplorerCoursesWidgetButtonProps) => {
  const buttonStyle = { marginButtom: '1rem' };
  const header5Style = {
    marginTop: 0,
    color: '#6FBE44',
  };

  const { buttonType } = props;
  const isAddButtonType = buttonType === 'add';
  const isRemoveButtonType = buttonType === 'remove';
  const isTakenButtonType = buttonType === 'taken';
  const years = nextYears(4);

  // FIXME: Only one Popup should be open at a time and they need to close once an Item has been picked
  return (
    <React.Fragment>
      {
        isAddButtonType ? (
          <Popup
            trigger={
              <Button basic color="green" size="mini" floated="right" style={buttonStyle}>ADD TO PLAN</Button>
            }
            className="transition"
            position="right center"
            on="click"
          >
            <Popup.Content>
              <Menu vertical>
                {
                  years.map((year) => (
                    <React.Fragment key={year}>
                      <Popup
                        trigger={(
                          <Menu.Item as="a">
                            {year}
                          </Menu.Item>
                        )}
                        on="click"
                      >
                        <Popup.Content>
                          <Menu vertical>
                            {
                              yearTerms(year).map((term) => (
                                <Menu.Item as="a" key={term} onClick={handleAddToPlan(props)}>
                                  {term}
                                </Menu.Item>
                              ))
                            }
                          </Menu>
                        </Popup.Content>
                      </Popup>
                    </React.Fragment>
                  ))
                }
              </Menu>
            </Popup.Content>
          </Popup>
        )
          : (
            <React.Fragment>
              {
              isRemoveButtonType ? (
                <Popup
                  className="transition"
                  trigger={(
                    <Button basic color="green" size="mini" floated="right" style={buttonStyle}>
                      REMOVE FROM PLAN
                    </Button>
                  )}
                  position="right center"
                  on="click"
                >
                  <Popup.Content>
                    <Menu vertical>
                      {
                        existingTerms(props).map((term) => (
                          <Menu.Item as="a" key={term} onClick={handleRemoveFromPlan(props)} position="right">
                            {term}
                          </Menu.Item>
                        ))
                      }
                    </Menu>
                  </Popup.Content>
                </Popup>
              )
                : (
                  <React.Fragment>
                    {
                    isTakenButtonType ?
                      <Header as="h5" color="green" floated="right" style={header5Style}>COMPLETED</Header>
                      : ''
                  }
                  </React.Fragment>
              )
}
            </React.Fragment>
        )
}
    </React.Fragment>
  );
};

const StudentExplorerCoursesWidgetButtonContainer = withRouter(StudentExplorerCoursesWidgetButton);
export default StudentExplorerCoursesWidgetButtonContainer;

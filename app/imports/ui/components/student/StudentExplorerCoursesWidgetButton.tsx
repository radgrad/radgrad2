import * as React from 'react';
import { Button, Popup, Menu, Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Users } from '../../../api/user/UserCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { ICourseInstanceDefine } from '../../../typings/radgrad'; // eslint-disable-line
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import { FeedbackFunctions } from '../../../api/feedback/FeedbackFunctions';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

interface IStudentExplorerCoursesWidgetButtonProps {
  buttonType: string;
  course: {
    [key: string]: any;
  };
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

class StudentExplorerCoursesWidgetButton extends React.Component<IStudentExplorerCoursesWidgetButtonProps> {
  constructor(props) {
    super(props);
  }

  private nextYears = (amount: number): number[] => {
    const nextYears = [];
    const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
    let currentYear = currentTerm.year;
    for (let i = 0; i < amount; i += 1) {
      nextYears.push(currentYear);
      currentYear += 1;
    }
    return nextYears;
  }

  private yearTerms = (year: number): string[] => {
    const terms = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];
    return terms;
  }

  private getUsername = (): string => this.props.match.params.username;

  private getUserIdFromRoute = (): string => {
    const username = this.getUsername();
    return username && Users.getID(username);
  }

  private handleAddToPlan = (e: any): void => {
    e.preventDefault();
    const course = this.props.course;
    const term = e.target.text;
    const courseSlug = Slugs.findDoc({ _id: course.slugID });
    const termSplit = term.split(' ');
    const termSlug = `${termSplit[0]}-${termSplit[1]}`;
    const username = this.getUsername();
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
        FeedbackFunctions.checkPrerequisites(this.getUserIdFromRoute());
        FeedbackFunctions.checkCompletePlan(this.getUserIdFromRoute());
        FeedbackFunctions.generateRecommendedCourse(this.getUserIdFromRoute());
      }
    });
    const interactionData = { username, type: 'addCourse', typeData: courseSlug.name };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  }

  private handleRemoveFromPlan = (e: any): void => {
    e.preventDefault();
    const course = this.props.course;
    const term = e.target.text;
    const termSplit = term.split(' ');
    const termSlug = `${termSplit[0]}-${termSplit[1]}`;
    const termID = AcademicTerms.getID(termSlug);
    const collectionName = CourseInstances.getCollectionName();
    const ci = CourseInstances.find({
      studentID: this.getUserIdFromRoute(),
      courseID: course._id,
      termID: termID,
    }).fetch();
    if (ci.length > 1) {
      console.log('Too many course instances found for a single semester.');
    }
    removeItMethod.call({ collectionName, instance: ci[0]._id }, (error) => {
      if (!error) {
        FeedbackFunctions.checkPrerequisites(this.getUserIdFromRoute());
        FeedbackFunctions.checkCompletePlan(this.getUserIdFromRoute());
        FeedbackFunctions.generateRecommendedCourse(this.getUserIdFromRoute());
      }
    });
    const interactionData = {
      username: this.getUsername(),
      type: 'removeCourse',
      typeData: Slugs.getNameFromID(course.slugID),
    };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  }

  private existingTerms = (): string[] => {
    const terms = [];
    const course = this.props.course;
    const ci = CourseInstances.find({
      studentID: this.getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    _.forEach(ci, function (c) {
      const term = AcademicTerms.findDoc(c.termID);
      if (term.termNumber >= AcademicTerms.getCurrentAcademicTermDoc().termNumber) {
        terms.push(AcademicTerms.toString(c.termID, false));
      }
    });
    return terms;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const buttonStyle = { marginButtom: '1rem' };
    const header5Style = {
      marginTop: 0,
      color: '#6FBE44',
    };

    const { buttonType } = this.props;
    const isAddButtonType = buttonType === 'add';
    const isRemoveButtonType = buttonType === 'remove';
    const isTakenButtonType = buttonType === 'taken';
    const nextYears = this.nextYears(4);
    const existingTerms = this.existingTerms();

    return (
      <React.Fragment>
        {
          isAddButtonType ?
            <Popup
              className="transition"
              trigger={
                <Button basic={true} color="green" size="mini" floated="right" style={buttonStyle}>ADD TO PLAN</Button>
              }
              on="click"
            >
              <Popup.Content>
                <Menu vertical={true}>
                  {
                    nextYears.map((year, index) => (
                      <React.Fragment key={index}>
                        <Popup
                          trigger={
                            <Menu.Item as="a" position="right">
                              {year}
                            </Menu.Item>
                          }
                          on="click"
                        >
                          <Popup.Content>
                            <Menu vertical={true}>
                              {
                                this.yearTerms(year).map((term) => (
                                  <Menu.Item as="a" key={term} onClick={this.handleAddToPlan}>
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
            :
            <React.Fragment>
              {
                isRemoveButtonType ?
                  <Popup
                    className="transition"
                    trigger={
                      <Button basic={true} color="green" size="mini" floated="right" style={buttonStyle}>
                        REMOVE FROM PLAN
                      </Button>
                    }
                    on="click"
                  >
                    <Popup.Content>
                      <Menu vertical={true}>
                        {
                          existingTerms.map((term) => (
                            <Menu.Item as="a" key={term} onClick={this.handleRemoveFromPlan} position="right">
                              {term}
                            </Menu.Item>
                          ))
                        }
                      </Menu>
                    </Popup.Content>
                  </Popup>
                  :
                  <React.Fragment>
                    {
                      isTakenButtonType ?
                        <Header as="h5" color="green" floated="right" style={header5Style}>COMPLETED</Header>
                        : ''
                    }
                  </React.Fragment>
              }
            </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

const StudentExplorerCoursesWidgetButtonContainer = withRouter(StudentExplorerCoursesWidgetButton);
export default StudentExplorerCoursesWidgetButtonContainer;

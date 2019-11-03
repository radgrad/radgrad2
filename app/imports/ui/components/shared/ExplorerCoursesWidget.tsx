import * as React from 'react';
import { Divider, Grid, Header, Item, List, Segment } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import * as Markdown from 'react-markdown';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import StudentExplorerCoursesWidgetButtonContainer from '../student/StudentExplorerCoursesWidgetButton';
import InterestList from './InterestList';
import { isSingleChoice } from '../../../api/degree-plan/PlanChoiceUtilities';
import { Reviews } from '../../../api/review/ReviewCollection';
import StudentExplorerReviewWidget from '../student/StudentExplorerReviewWidget';
import { ICourse } from '../../../typings/radgrad'; // eslint-disable-line
import { UserInteractions } from '../../../api/analytic/UserInteractionCollection';
import * as Router from './RouterHelperFunctions';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import { isSame, toUpper } from './helper-functions';
import { courseSlugToName } from './data-model-helper-functions';

interface IExplorerCoursesWidgetProps {
  name: string;
  shortName: string;
  descriptionPairs: any[];
  item: ICourse;
  completed: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      course: string;
    }
  };
  reactiveSourceOne: object[];
  reactiveSourceTwo: object[];
  reactiveSourceThree: object[];
}

const userStatus = (course: ICourse, props: IExplorerCoursesWidgetProps): boolean => {
  let ret = false;
  const ci = CourseInstances.find({
    studentID: Router.getUserIdFromRoute(props.match),
    courseID: course._id,
  }).fetch();
  if (ci.length > 0) {
    ret = true;
  }
  return ret;
};

const futureInstance = (course: ICourse, props: IExplorerCoursesWidgetProps): boolean => {
  let ret = false;
  const ci = CourseInstances.find({
    studentID: Router.getUserIdFromRoute(props.match),
    courseID: course._id,
  }).fetch();
  _.forEach(ci, (courseInstance) => {
    if (AcademicTerms.findDoc(courseInstance.termID).termNumber >=
      AcademicTerms.getCurrentAcademicTermDoc().termNumber) {
      ret = true;
    }
  });
  return ret;
};

const passedCourse = (course: ICourse, props: IExplorerCoursesWidgetProps): boolean => {
  let ret = false;
  const ci = CourseInstances.find({
    studentID: Router.getUserIdFromRoute(props.match),
    courseID: course._id,
  }).fetch();
  _.forEach(ci, (c) => {
    if (c.grade === 'A+' || c.grade === 'A' || c.grade === 'A-' ||
      c.grade === 'B+' || c.grade === 'B') {
      ret = true;
    }
  });
  return ret;
};

const getTableTitle = (tableIndex: number, table: object[]): JSX.Element | String => {
  const greyColorStyle = { color: 'grey' };
  switch (tableIndex) {
    case 0:
      if (table.length !== 0) {
        return <h4><i className="green checkmark icon"/>Completed</h4>;
      }
      return <h4 style={greyColorStyle}><i className="grey checkmark icon"/>Completed</h4>;
    case 1:
      if (table.length !== 0) {
        return <h4><i className="yellow warning sign icon"/>In Plan (Not Yet Completed)</h4>;
      }
      return <h4 style={greyColorStyle}><i className="grey warning sign icon"/>In Plan (Not Yet Completed)</h4>;
    case 2:
      if (table.length !== 0) {
        return <h4><i className="red warning circle icon"/>Not in Plan</h4>;
      }
      return <h4 style={greyColorStyle}><i className="grey warning circle icon"/>Not in Plan</h4>;
    default:
      return 'ERROR: More than one table.';
  }
};

const color = (table: object[]): string => {
  if (table.length === 0) {
    return 'whitesmoke';
  }
  return '';
};

const length = (table: object[]): boolean => table.length !== 0;

const choices = (prerequisite: { course: string; status: string }): string[] => prerequisite.course.split(',');

const isFirst = (index: number): boolean => index === 0;

const findReview = (props: IExplorerCoursesWidgetProps): object => {
  const review = Reviews.find({
    studentID: Router.getUserIdFromRoute(props.match),
    revieweeID: props.item._id,
  }).fetch();
  return review[0];
};

const ExplorerCoursesWidget = (props: IExplorerCoursesWidgetProps) => {
  const segmentGroupStyle = { backgroundColor: 'white' };
  const zeroMarginTopStyle = { marginTop: 0 };
  const fiveMarginTopStyle = { marginTop: '5px' };
  const clearingBasicSegmentStyle = {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  };
  const breakWordStyle: React.CSSProperties = { wordWrap: 'break-word' };

  const { name, shortName, descriptionPairs, item, completed, match } = props;
  /* Header Variables */
  const upperShortName = toUpper(shortName);
  const isStudent = Router.isUrlRoleStudent(props.match);

  return (
    <div>
      <Segment.Group style={segmentGroupStyle}>
        <Segment padded={true} className="container">
          <Segment clearing={true} basic={true} style={clearingBasicSegmentStyle}>
            <Header as="h4" floated="left">{upperShortName} ({name})</Header>
            {
              isStudent ?
                <React.Fragment>
                  {
                    userStatus(item, props) ?
                      <React.Fragment>
                        {
                          futureInstance(item, props) ?
                            <StudentExplorerCoursesWidgetButtonContainer key={_.uniqueId()} buttonType="remove"
                                                                         course={item}/>
                            :
                            <React.Fragment>
                              {
                                passedCourse(item, props) ?
                                  <StudentExplorerCoursesWidgetButtonContainer key={_.uniqueId()} buttonType="taken"
                                                                               course={item}/>
                                  :
                                  <StudentExplorerCoursesWidgetButtonContainer key={_.uniqueId()} buttonType="add"
                                                                               course={item}/>
                              }
                            </React.Fragment>
                        }
                      </React.Fragment>
                      :
                      <StudentExplorerCoursesWidgetButtonContainer key={_.uniqueId()} buttonType="add"
                                                                   course={item}/>
                  }
                </React.Fragment>
                : ''
            }
          </Segment>

          <Divider style={zeroMarginTopStyle}/>

          <Grid stackable={true} columns={2}>
            <Grid.Column width={6}>
              {
                descriptionPairs.map((descriptionPair, index) => (
                  <React.Fragment key={index}>
                    {
                      isSame(descriptionPair.label, 'Course Number') ?
                        <React.Fragment>
                          <b>{descriptionPair.label}:</b>
                          {
                            descriptionPair.value ?
                              <React.Fragment> {descriptionPair.value} <br/></React.Fragment>
                              :
                              <React.Fragment> N/A <br/></React.Fragment>
                          }
                        </React.Fragment>
                        : ''
                    }

                    {
                      isSame(descriptionPair.label, 'Credit Hours') ?
                        <React.Fragment>
                          <b>{descriptionPair.label}:</b>
                          {
                            descriptionPair.value ?
                              <React.Fragment> {descriptionPair.value} <br/></React.Fragment>
                              :
                              <React.Fragment> N/A <br/></React.Fragment>
                          }
                        </React.Fragment>
                        : ''
                    }
                  </React.Fragment>
                ))
              }
            </Grid.Column>

            <Grid.Column width={10}>
              {
                descriptionPairs.map((descriptionPair, index) => (
                  <React.Fragment key={index}>
                    {
                      isSame(descriptionPair.label, 'Syllabus') ?
                        <React.Fragment>
                          <b>{descriptionPair.label}:</b>
                          {
                            descriptionPair.value ?
                              <div style={breakWordStyle}>
                                <Markdown source={descriptionPair.value}
                                          renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}/>
                                <br/>
                              </div>
                              :
                              <React.Fragment> N/A <br/></React.Fragment>
                          }
                        </React.Fragment>
                        : ''
                    }
                  </React.Fragment>
                ))
              }
            </Grid.Column>
          </Grid>

          <Grid stackable={true} style={zeroMarginTopStyle}>
            <Grid.Column>
              {
                descriptionPairs.map((descriptionPair, index) => (
                  <React.Fragment key={index}>
                    {
                      isSame(descriptionPair.label, 'Description') ?
                        <React.Fragment>
                          <b>{descriptionPair.label}:</b>
                          {
                            descriptionPair.value ?
                              <Markdown escapeHtml={true} source={descriptionPair.value}
                                        renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}/>
                              :
                              <React.Fragment> N/A <br/></React.Fragment>
                          }
                        </React.Fragment>
                        : ''
                    }

                    {
                      isSame(descriptionPair.label, 'Interests') ?
                        <div style={fiveMarginTopStyle}><InterestList item={item} size="mini"/></div>
                        : ''
                    }
                  </React.Fragment>
                ))
              }
            </Grid.Column>
          </Grid>

          <Grid stackable={true} style={zeroMarginTopStyle}>
            <Grid.Column>
              {
                descriptionPairs.map((descriptionPair, index) => (
                  <React.Fragment key={index}>
                    {
                      isSame(descriptionPair.label, 'Prerequisites') ?
                        <React.Fragment>
                          {
                            descriptionPair.value ?
                              <React.Fragment>
                                <Header as="h4" className={'horizontal divider'}>{descriptionPair.label}</Header>
                                {
                                  isStudent ?
                                    <Grid columns={3} stackable={true} padded={true} celled={true}>
                                      <Grid.Row>
                                        {
                                          descriptionPair.value.map((table, tableIndex) => (
                                            <Grid.Column key={_.uniqueId()} style={{
                                              textAlign: 'center',
                                              backgroundColor: color(table),
                                            }}>
                                              {getTableTitle(tableIndex, table)}
                                              {
                                                length(table) ?
                                                  <React.Fragment>
                                                    {
                                                      table.map((prerequisite) => (
                                                        <React.Fragment key={_.uniqueId()}>
                                                          {
                                                            isSingleChoice(prerequisite.course) ?
                                                              <NavLink exact={true}
                                                                       to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${prerequisite.course}`)}
                                                                       activeClassName="active item">
                                                                {courseSlugToName(prerequisite.course)}
                                                                <br/>
                                                              </NavLink>
                                                              :
                                                              _.map(choices(prerequisite), (choice, choicesIndex) => (
                                                                <React.Fragment key={_.uniqueId()}>
                                                                  {
                                                                    isFirst(choicesIndex) ?
                                                                      <NavLink exact={true}
                                                                               to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${choice}`)}
                                                                               activeClassName="active item">
                                                                        {courseSlugToName(choice)}
                                                                      </NavLink>
                                                                      :
                                                                      <React.Fragment>
                                                                        {/* Not exactly sure where this pops up because even in
                                                                             the original RadGrad I don't see any "or {choice} */}
                                                                        or <NavLink exact={true}
                                                                                    to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${choice}`)}
                                                                                    activeClassName="active item">
                                                                        {courseSlugToName(choice)}
                                                                      </NavLink>
                                                                      </React.Fragment>
                                                                  }
                                                                </React.Fragment>
                                                              ))
                                                          }
                                                        </React.Fragment>
                                                      ))
                                                    }
                                                  </React.Fragment>
                                                  :
                                                  <Item style={{ color: 'grey' }}>None</Item>
                                              }
                                            </Grid.Column>
                                          ))
                                        }
                                      </Grid.Row>
                                    </Grid>
                                    :
                                    <List horizontal={true} bulleted={true}>
                                      {
                                        descriptionPair.value.map((prereqType) => (
                                          prereqType.map((prereq) => (
                                            <List.Item key={prereq.course} as={NavLink} exact={true}
                                                       to={Router.buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${prereq.course}`)}>
                                              {courseSlugToName(prereq.course)}
                                            </List.Item>
                                          ))
                                        ))
                                      }
                                    </List>
                                }
                              </React.Fragment>
                              : ''
                          }
                        </React.Fragment>
                        : ''
                    }
                  </React.Fragment>
                ))
              }
            </Grid.Column>
          </Grid>
        </Segment>
      </Segment.Group>

      {
        isStudent ?
          <Grid stackable={true} className="column">
            <Grid.Column width={16}>
              <Segment padded={true}>
                <StudentExplorerReviewWidget event={item} userReview={findReview(props)} completed={completed}
                                             reviewType="course"/>
              </Segment>
            </Grid.Column>
          </Grid>
          : ''
      }
    </div>
  );
};

const ExplorerCoursesWidgetContainer = withTracker(() => {
  /* Reactive Sources to make StudentExplorerCoursesWidgetButton reactive */
  const reactiveSourceOne = CourseInstances.findNonRetired({});
  const reactiveSouceTwo = UserInteractions.find({}).fetch();

  /* Reactive Source to make StudentExplorerEditReviewForm reactive */
  const reactiveSourceThree = Reviews.find({}).fetch();

  return {
    reactiveSourceOne,
    reactiveSouceTwo,
    reactiveSourceThree,
  };
})(ExplorerCoursesWidget);
export default withRouter(ExplorerCoursesWidgetContainer);

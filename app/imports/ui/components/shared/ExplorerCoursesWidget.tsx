import * as React from 'react';
import { Divider, Grid, Header, Item, List, Segment } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import * as Markdown from 'react-markdown';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { UserInteractions } from '../../../api/analytic/UserInteractionCollection';
import StudentExplorerCoursesWidgetButtonContainer from '../student/StudentExplorerCoursesWidgetButton';
import InterestList from './InterestList';
import { Courses } from '../../../api/course/CourseCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { isSingleChoice } from '../../../api/degree-plan/PlanChoiceUtilities';
import { Reviews } from '../../../api/review/ReviewCollection';
import StudentExplorerReviewWidget from '../student/StudentExplorerReviewWidget';

interface IExplorerCoursesWidgetProps {
  name: string;
  shortName: string;
  slug: string;
  descriptionPairs: any[];
  id: string;
  item: {
    [key: string]: any;
  };
  completed: boolean;
  reviewed: boolean;
  role: string;
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

class ExplorerCoursesWidget extends React.Component<IExplorerCoursesWidgetProps> {
  constructor(props) {
    super(props);
  }

  private toUpper = (string: string): string => string.toUpperCase();

  private isRoleStudent = (): boolean => this.props.role === 'student';

  private getUserIdFromRoute = (): string => {
    const username = this.props.match.params.username;
    return username && Users.getID(username);
  }

  private userStatus = (course: { [key: string]: any }): boolean => {
    let ret = false;
    const ci = CourseInstances.find({
      studentID: this.getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    if (ci.length > 0) {
      ret = true;
    }
    return ret;
  }

  private futureInstance = (course: { [key: string]: any }): boolean => {
    let ret = false;
    const ci = CourseInstances.find({
      studentID: this.getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    _.forEach(ci, (courseInstance) => {
      if (AcademicTerms.findDoc(courseInstance.termID).termNumber >=
        AcademicTerms.getCurrentAcademicTermDoc().termNumber) {
        ret = true;
      }
    });
    return ret;
  }

  private passedCourse = (course: { [key: string]: any }): boolean => {
    let ret = false;
    const ci = CourseInstances.find({
      studentID: this.getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    _.forEach(ci, (c) => {
      if (c.grade === 'A+' || c.grade === 'A' || c.grade === 'A-' ||
        c.grade === 'B+' || c.grade === 'B') {
        ret = true;
      }
    });
    return ret;
  }

  private courseNameFromSlug = (courseSlugName: string): string => {
    const slug = Slugs.find({ name: courseSlugName }).fetch();
    const course = Courses.findDoc({ slugID: slug[0]._id });
    return course.shortName;
  }

  private isLabel = (label: string, str: string): boolean => label === str;

  private getTableTitle = (tableIndex: number, table: object[]): JSX.Element | String => {
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
  }

  private color = (table: object[]): string => {
    if (table.length === 0) {
      return 'whitesmoke';
    }
    return '';
  }

  private length = (table: object[]): boolean => table.length !== 0;

  private isSingleChoice = (prerequisite: { course: string; status: string }): boolean => isSingleChoice(prerequisite.course);

  private choices = (prerequisite: { course: string; status: string }): string[] => prerequisite.course.split(',');

  private isFirst = (index: number): boolean => index === 0;

  private review = (): object => {
    const review = Reviews.find({
      studentID: this.getUserIdFromRoute(),
      revieweeID: this.props.item._id,
    }).fetch();
    return review[0];
  }

  private routerLink = (props) => (
    props.href.match(/^(https?:)?\/\//)
      ? <a href={props.href}>{props.children}</a>
      : <div/>
  )

  private buildRouteName = (slug) => {
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/`;
    return `${baseRoute}explorer/courses/${slug}`;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const segmentGroupStyle = { backgroundColor: 'white' };
    const zeroMarginTopStyle = { marginTop: 0 };
    const clearingBasicSegmentStyle = {
      margin: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    };
    const breakWordStyle: React.CSSProperties = { wordWrap: 'break-word' };
    const fiveMarginTopStyle = { marginTop: '5px' };

    const { name, shortName, descriptionPairs, item, completed } = this.props;
    /* Header Variables */
    const upperShortName = this.toUpper(shortName);
    const isStudent = this.isRoleStudent();
    const userStatus = this.userStatus(item);
    const futureInstance = this.futureInstance(item);
    const passedCourse = this.passedCourse(item);

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
                      userStatus ?
                        <React.Fragment>
                          {
                            futureInstance ?
                              <StudentExplorerCoursesWidgetButtonContainer key={_.uniqueId()} buttonType="remove"
                                                                           course={item}/>
                              :
                              <React.Fragment>
                                {
                                  passedCourse ?
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
                        this.isLabel(descriptionPair.label, 'Course Number') ?
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
                        this.isLabel(descriptionPair.label, 'Credit Hours') ?
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
                        this.isLabel(descriptionPair.label, 'Syllabus') ?
                          <React.Fragment>
                            <b>{descriptionPair.label}:</b>
                            {
                              descriptionPair.value ?
                                <div style={breakWordStyle}>
                                  <Markdown source={descriptionPair.value}
                                            linkTarget="_blank"
                                            renderers={{ link: this.routerLink }}/>
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
                        this.isLabel(descriptionPair.label, 'Description') ?
                          <React.Fragment>
                            <b>{descriptionPair.label}:</b>
                            {
                              descriptionPair.value ?
                                <Markdown escapeHtml={true} source={descriptionPair.value}
                                          renderers={{ link: this.routerLink }}/>
                                :
                                <React.Fragment> N/A <br/></React.Fragment>
                            }
                          </React.Fragment>
                          : ''
                      }

                      {
                        this.isLabel(descriptionPair.label, 'Interests') ?
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
                        this.isLabel(descriptionPair.label, 'Prerequisites') ?
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
                                                backgroundColor: this.color(table),
                                              }}>
                                                {this.getTableTitle(tableIndex, table)}
                                                {
                                                  this.length(table) ?
                                                    <React.Fragment>
                                                      {
                                                        table.map((prerequisite) => (
                                                          <React.Fragment key={_.uniqueId()}>
                                                            {
                                                              this.isSingleChoice(prerequisite) ?
                                                                <NavLink exact={true}
                                                                         to={this.buildRouteName(prerequisite.course)}
                                                                         activeClassName="active item">
                                                                  {this.courseNameFromSlug(prerequisite.course)}
                                                                  <br/>
                                                                </NavLink>
                                                                :
                                                                _.map(this.choices(prerequisite), (choice, choicesIndex) => (
                                                                  <React.Fragment key={_.uniqueId()}>
                                                                    {
                                                                      this.isFirst(choicesIndex) ?
                                                                        <NavLink exact={true}
                                                                                 to={this.buildRouteName(choice)}
                                                                                 activeClassName="active item">
                                                                          {this.courseNameFromSlug(choice)}
                                                                        </NavLink>
                                                                        :
                                                                        <React.Fragment>
                                                                          {/* Not exactly sure where this pops up because even in
                                                                             the original RadGrad I don't see any "or {choice} */}
                                                                          or <NavLink exact={true}
                                                                                      to={this.buildRouteName(choice)}
                                                                                      activeClassName="active item">
                                                                          {this.courseNameFromSlug(choice)}
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
                                                         to={this.buildRouteName(prereq.course)}>
                                                {this.courseNameFromSlug(prereq.course)}
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

        <Grid stackable={true} columns={1}>
          <Grid.Column width={16}>
            <Segment padded={true}>
              <StudentExplorerReviewWidget event={item} userReview={this.review()} completed={completed}
                                           reviewType="course"/>
            </Segment>
          </Grid.Column>
        </Grid>

        {/*  TODO: Back To Top Button */}
      </div>
    );
  }
}

const ExplorerCoursesWidgetContainer = withTracker(() => {
  /* Reactive Sources to make StudentExplorerCoursesWidgetButton reactive */
  const reactiveSourceOne = CourseInstances.findNonRetired({});
  const reactiveSouceTwo = OpportunityInstances.findNonRetired({});
  const reactiveSourceThree = UserInteractions.find({}).fetch();

  return {
    reactiveSourceOne,
    reactiveSouceTwo,
    reactiveSourceThree,
  };
})(ExplorerCoursesWidget);
export default withRouter(ExplorerCoursesWidgetContainer);

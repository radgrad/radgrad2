import * as React from 'react';
import { Segment, Container, Divider, Grid, Header, List } from 'semantic-ui-react';
import { withRouter, Link, NavLink } from 'react-router-dom';
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

interface IExplorerCoursesWidgetProps {
  name: string;
  shortName: string;
  slug: string;
  descriptionPairs: any[];
  id: string;
  item: object;
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

  private routerLink = (props) => (
    props.href.match(/^(https?:)?\/\//)
      ? <a href={props.href}>{props.children}</a>
      : <Link to={props.href}>{props.children}</Link>
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

    const { name, shortName, slug, descriptionPairs, id, item, completed, reviewed } = this.props;
    /* Header Variables */
    const upperShortName = this.toUpper(shortName);
    const isStudent = this.isRoleStudent();
    const userStatus = this.userStatus(item);
    const futureInstance = this.futureInstance(item);
    const passedCourse = this.passedCourse(item);

    const prerequisiteList = descriptionPairs[descriptionPairs.length - 1];
    console.log(prerequisiteList);
    return (
      <div>
        <Segment.Group style={segmentGroupStyle}>
          <Container>
            <Segment padded={true}>
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
                                  <div style={breakWordStyle}><Markdown escapeHtml={false}
                                                                        source={descriptionPair.value}/></div>
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
                                    <Header as="h4" dividing={true}>{descriptionPair.label}</Header>
                                    {
                                      isStudent ?
                                        <Grid>
                                          {/* TODO */}
                                        </Grid>
                                        :
                                        <List horizontal={true} bulleted={true}>
                                          <List.Item>
                                            <React.Fragment>
                                              {
                                                Object.keys(prerequisiteList).map((key) => {
  
                                                })
                                              }


                                            </React.Fragment>
                                          </List.Item>
                                        </List>
                                    }
                                  </React.Fragment>
                                  : ''
                              //   _.forEach(prerequisiteList.value, (arr) => (
                              //   _.map(arr, (prereqType) => {
                              //   // _.forEach(prereqType, (prereq) => (
                              //   return (
                              //   console.log(prereqType.course)
                              //   );
                              //   // ))
                              // })
                              //   ))
                              // }
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
          </Container>
        </Segment.Group>

        <Grid stackable={true} columns={1}>
          <Grid.Column width={16}>
            <Segment padded={true}>
              {/*  TODO: Student Explorer Review Widget */}
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

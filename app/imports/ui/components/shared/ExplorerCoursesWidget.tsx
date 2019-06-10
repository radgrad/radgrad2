import * as React from 'react';
import { Segment, Container, Divider, Grid, Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Users } from '../../../api/user/UserCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';

interface IExplorerCoursesWidgetProps {
  name: string;
  shortName: string;
  slug: string;
  descriptionPairs: object[];
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

    const { name, shortName, slug, descriptionPairs, id, item, completed, reviewed } = this.props;
    const upperShortName = this.toUpper(shortName);
    const isStudent = this.isRoleStudent();
    const userStatus = this.userStatus(item);
    const futureInstance = this.futureInstance(item);
    const passedCourse = this.passedCourse(item);
    return (
      <React.Fragment>
        <Segment.Group style={segmentGroupStyle}>
          <Container>
            <Segment padded={true}>
              <Segment clearing={true} basic={true} style={clearingBasicSegmentStyle}>
                <Header as="h4" floated="left">{upperShortName} {name}</Header>
                {
                  isStudent ?
                    [
                      userStatus ?
                        [
                          futureInstance ?
                            <div/>
                            // TODO: StudentExplorerCoursesWidgetButton buttonType="remove" course=item"
                            :
                            [
                              passedCourse ?
                                <div/>
                                //  TODO: StudentExplorerCoursesWidgetButton buttonType="taken"
                                :
                                <div/>,
                              //  TODO: StudentExplorerCoursesWidgetButton buttonType="add" course=item
                            ],
                        ]
                        :
                        <div/>,
                      //    TODO: StudentExplorerCOursesWidgetButton buttonType="add" course=item"
                    ]
                    : ''
                }
              </Segment>

              <Divider style={zeroMarginTopStyle}/>

              <Grid stackable={true} columns={2}>
                <Grid.Column width={6}>

                </Grid.Column>

                <Grid.Column width={10}>

                </Grid.Column>
              </Grid>

              <Grid stackable={true} style={zeroMarginTopStyle}>
                <Grid.Column>

                </Grid.Column>
              </Grid>

              <Grid stackable={true} style={zeroMarginTopStyle}>
                <Grid.Column>

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
      </React.Fragment>
    );
  }
}

export default withRouter(ExplorerCoursesWidget);

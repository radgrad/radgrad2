import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Header, Icon, Label, Segment, Table } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { IAcademicTerm, ICourse } from '../../../typings/radgrad'; // eslint-disable-line
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseScoreboard } from '../../../startup/client/collections';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';

interface ICourseScoreboardWidgetProps {
  courses: ICourse[],
  terms: IAcademicTerm[];
  scores: any[];
}

class CourseScoreboardWidget extends React.Component<ICourseScoreboardWidgetProps> {
  constructor(props) {
    super(props);
    // console.log('CourseScoreboardWidget props=%o', props);
  }

  private getCourseScore(courseID, termID) {
    const id = `${courseID} ${termID}`;
    const scoreItem = _.find(this.props.scores, (p) => p._id === id);
    // console.log(scoreItem, courseID, termID);
    if (scoreItem) {
      return scoreItem.count;
    }
    return 0;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <Segment>
        <Header>Future Course Scoreboard</Header>
        <Table celled={true}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Course</Table.HeaderCell>
              {_.map(this.props.terms, (term) => (<Table.HeaderCell key={term._id}
                                                                    collapsing={true}>{AcademicTerms.getShortName(term._id)}</Table.HeaderCell>))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(this.props.courses, (c, index) => (
              <Table.Row key={index}>
                <Table.Cell collapsing={true}><Label>{c.num}</Label></Table.Cell>
                {_.map(this.props.terms, (t) => {
                  const score = this.getCourseScore(c._id, t._id);
                  return (
                    <Table.Cell key={`${c._id}${t._id}`} negative={score > 0} collapsing={true}>{score > 10 ?
                      <Icon name='attention'/> : ''}{score}</Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}

const CourseScoreboardWidgetContainer = withTracker(() => {
  const courses = Courses.findNonRetired({ num: { $ne: 'other' } }, { sort: { num: 1 } });
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const isQuarterSystem = RadGradSettings.findOne({}).quarterSystem;
  const limit = isQuarterSystem ? 12 : 9;
  const terms = AcademicTerms.findNonRetired({ termNumber: { $gte: currentTerm.termNumber } }, {
    sort: { termNumber: 1 },
    limit: limit,
  });
  const scores = CourseScoreboard.find().fetch();
  return {
    courses,
    terms,
    scores,
  };
})(CourseScoreboardWidget);

export default CourseScoreboardWidgetContainer;

import React from 'react';
import _ from 'lodash';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { Button, Grid, Header, Icon, Label, Popup, Segment, Table } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { IAcademicTerm, ICourse } from '../../../typings/radgrad';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { CourseScoreboard } from '../../../startup/client/collections';
import { courseScoreboardWidget } from './shared-widget-names';

interface ICourseScoreboardWidgetProps {
  courses: ICourse[],
  terms: IAcademicTerm[];
  scores: any[];
}

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const getCourseScore = (courseID, termID, props: ICourseScoreboardWidgetProps) => {
  const id = `${courseID} ${termID}`;
  const scoreItem = _.find(props.scores, (p) => p._id === id);
  // console.log(scoreItem, courseID, termID);
  if (scoreItem) {
    return scoreItem.count;
  }
  return 0;
};

const handleSaveAsCSV = (props: ICourseScoreboardWidgetProps) => () => {
  let result = '';
  const headerArr = ['Course'];
  _.forEach(props.terms, (term) => headerArr.push(AcademicTerms.getShortName(term._id)));
  result += headerArr.join(',');
  result += '\r\n';
  _.forEach(props.courses, (o) => {
    result += `${o.name},`;
    _.forEach(props.terms, (t) => {
      const id = `${o._id} ${t._id}`;
      const scoreItem: any = CourseScoreboard.findOne({ _id: id });
      result += scoreItem ? `${scoreItem.count},` : '0,';
    });
    result += '\r\n';
  });
  const zip = new ZipZap();
  const dir = 'course-scoreboard';
  const fileName = `${dir}/${moment().format(databaseFileDateFormat)}.csv`;
  zip.file(fileName, result);
  zip.saveAs(`${dir}.zip`);
};


const CourseScoreboardWidget = (props: ICourseScoreboardWidgetProps) => {
  const scrollBody: React.CSSProperties = {
    display: 'inline-block',
    height: 500,
    overflowY: 'scroll',
    width: '100%',
  };
  return (
    <Segment textAlign="center" id={`${courseScoreboardWidget}`}>
      <Header>Future Course Scoreboard</Header>
      <Grid>
        <Grid.Row>
          <Table celled fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={1}>Course</Table.HeaderCell>
                {_.map(props.terms, (term) => (
                  <Table.HeaderCell
                    width={1}
                    key={term._id}
                  >
                    {AcademicTerms.getShortName(term._id)}
                  </Table.HeaderCell>
))}
              </Table.Row>
            </Table.Header>
          </Table>
          <div style={scrollBody}>
            <Table celled fixed>
              <Table.Body>
                {_.map(props.courses, (c, index) => (
                  <Table.Row key={index}>
                    <Table.Cell width={1}><Popup content={c.shortName} trigger={<Label>{c.num}</Label>} /></Table.Cell>
                    {_.map(props.terms, (t) => {
                      const score = getCourseScore(c._id, t._id, props);
                      return (
                        <Table.Cell width={1} key={`${c._id}${t._id}`} negative={score > 0} collapsing>
                          {score > 10 ? <Icon name="attention" /> : ''}
                          {score}
                        </Table.Cell>
                      );
                    })}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={1} />
          <Button basic color="green" onClick={handleSaveAsCSV(props)}>Save as CSV</Button>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

const CourseScoreboardWidgetContainer = withTracker(() => {
  const courses = Courses.findNonRetired({ num: { $ne: 'other' } }, { sort: { num: 1 } });
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const isQuarterSystem = RadGradProperties.getQuarterSystem();
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

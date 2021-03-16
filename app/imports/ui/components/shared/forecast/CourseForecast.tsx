import React from 'react';
import _ from 'lodash';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { Button, Grid, Header, Icon, Label, Popup, Segment, Table } from 'semantic-ui-react';
import { AcademicTerm, Course, Forecast } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';

interface CourseForecastProps {
  courses: Course[];
  terms: AcademicTerm[];
  scores: Forecast[];
}

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const getCourseScore = (courseID: string, termID: string, scores: Forecast[]): number => {
  const id = `${courseID} ${termID}`;
  const scoreItem = _.find(scores, (p) => p._id === id);
  // console.log(scoreItem, courseID, termID);
  if (scoreItem) {
    return scoreItem.count;
  }
  return 0;
};

const handleSaveAsCSV = (terms: AcademicTerm[], courses: Course[], scores: Forecast[]) => () => {
  let result = '';
  const headerArr = ['Course'];
  terms.forEach((term) => headerArr.push(AcademicTerms.getShortName(term._id)));
  result += headerArr.join(',');
  result += '\r\n';
  courses.forEach((o) => {
    const courseID = o._id;
    result += `${o.name},`;
    terms.forEach((t) => {
      const termID = t._id;
      result += `${getCourseScore(courseID, termID, scores)},`;
    });
    result += '\r\n';
  });
  const zip = new ZipZap();
  const dir = 'course-forecast';
  const fileName = `${dir}/${moment().format(databaseFileDateFormat)}.csv`;
  zip.file(fileName, result);
  zip.saveAs(`${dir}.zip`);
};

const CourseForecast: React.FC<CourseForecastProps> = ({ courses, terms, scores }) => {
  const scrollBody: React.CSSProperties = {
    display: 'inline-block',
    height: 500,
    overflowY: 'scroll',
    width: '100%',
  };
  return (
    <Segment textAlign="center" id="course-forecast">
      <Header>Future Course Forecast</Header>
      <Grid>
        <Grid.Row>
          <Table celled fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={1}>Course</Table.HeaderCell>
                {terms.map((term) => (
                  <Table.HeaderCell width={1} key={term._id}>
                    {AcademicTerms.getShortName(term._id)}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
          </Table>
          <div style={scrollBody}>
            <Table celled fixed>
              <Table.Body>
                {courses.map((c, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Table.Row key={index}>
                    <Table.Cell width={1}>
                      <Popup content={c.shortName} trigger={<Label>{c.num}</Label>} />
                    </Table.Cell>
                    {terms.map((t) => {
                      const score = getCourseScore(c._id, t._id, scores);
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
          <Button basic color="green" onClick={handleSaveAsCSV(terms, courses, scores)}>
            Save as CSV
          </Button>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default CourseForecast;

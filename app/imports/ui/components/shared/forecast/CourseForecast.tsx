import React, { useEffect, useState } from 'react';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { Button, Grid, Header, Icon, Label, Popup, Segment, Table } from 'semantic-ui-react';
import {
  getFutureEnrollmentMethod,
} from '../../../../api/utilities/FutureEnrollment.methods';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { EnrollmentForecast, ENROLLMENT_TYPE } from '../../../../startup/both/RadGradForecasts';

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const handleSaveAsCSV = (data: EnrollmentForecast[]) => () => {
  let result = '';
  const headerArr = ['Course'];
  data[0].enrollment.forEach((entry) => headerArr.push(AcademicTerms.getShortName(entry.termID)));
  result += headerArr.join(',');
  result += '\r\n';
  data.forEach((d) => {
    const course = Courses.findDoc(d.courseID);
    result += `${course.num},`;
    d.enrollment.forEach((entry) => {
      result += `${entry.count},`;
    });
    result += '\r\n';
  });
  const zip = new ZipZap();
  const dir = 'course-forecast';
  const fileName = `${dir}/${moment().format(databaseFileDateFormat)}.csv`;
  zip.file(fileName, result);
  zip.saveAs(`${dir}.zip`);
};

const CourseForecast: React.FC = () => {
  const [data, setData] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getFutureEnrollmentMethod.callPromise(ENROLLMENT_TYPE.COURSE)
        .then((result) => setData(result))
        .catch((error) => {
          console.error(error);
          setData([]);
        });
    }

    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched]);
  const scrollBody: React.CSSProperties = {
    display: 'inline-block',
    height: 500,
    overflowY: 'scroll',
    width: '100%',
  };
  // console.log(data);
  return (
    <Segment textAlign="center" id="course-forecast">
      <Header>Future Course Forecast</Header>
      <Grid>
        <Grid.Row>
          {/* We need to see if we got the data */}
          {data[0] ? (<div>
            <Table celled fixed>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>Course</Table.HeaderCell>
                  {data[0].enrollment.map((entry) => (
                    <Table.HeaderCell width={1} key={entry.termID}>
                      {AcademicTerms.getShortName(entry.termID)}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
            </Table>
            <div style={scrollBody}>
              <Table celled fixed>
                <Table.Body>
                  {data.map((c) => {
                    const course = Courses.findDoc(c.courseID);
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <Table.Row key={`${course._id}`}>
                        <Table.Cell width={1}>
                          <Popup content={course.shortName} trigger={<Label>{course.num}</Label>} />
                        </Table.Cell>
                        {c.enrollment.map((t) => {
                          const score = t.count;
                          return (
                            <Table.Cell width={1} key={`${course._id}${t.termID}`} negative={score > 0} collapsing>
                              {score > 10 ? <Icon name="attention" /> : ''}
                              {score}
                            </Table.Cell>
                          );
                        })}
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </div>
          </div>) : ''}
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={1} />
          <Button basic color="green" onClick={handleSaveAsCSV(data)}>
            Save as CSV
          </Button>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default CourseForecast;

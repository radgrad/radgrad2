import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { getFutureEnrollmentSingleMethod } from '../../../../api/utilities/FutureEnrollment.methods';
import { ENROLLMENT_TYPE, EnrollmentForecast } from '../../../../startup/both/RadGradForecasts';
import { Course, Opportunity } from '../../../../typings/radgrad';

interface FutureParticipationProps {
  item: Course | Opportunity;
}

// Future participation data is updated once a day at midnight
const FutureParticipation: React.FC<FutureParticipationProps> = ({ item }) => {
  const isCourse = Courses.isDefined(item._id);
  const type = isCourse ? ENROLLMENT_TYPE.COURSE : ENROLLMENT_TYPE.OPPORTUNITY;
  const [data, setData] = useState<EnrollmentForecast>({});
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getFutureEnrollmentSingleMethod.callPromise({ id: item._id, type })
        .then((result) => setData(result))
        .catch((error) => {
          console.error(error);
          setData({});
        });
    }

    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched, item._id, type]);
  const startOfYearTerm = AcademicTerms.getStartOfCurrentAcademicYearTerm();
  const termsPerYear = RadGradProperties.getQuarterSystem() ? 4 : 3;
  const label1 = AcademicTerms.getAcademicYearLabel(startOfYearTerm._id);
  const label2 = `${startOfYearTerm.year + 1}-${startOfYearTerm.year + 2}`;
  const label3 = `${startOfYearTerm.year + 2}-${startOfYearTerm.year + 3}`;
  const tableData = {};
  tableData[label1] = [];
  tableData[label2] = [];
  tableData[label3] = [];

  if (!_.isEmpty(data)) {
    const enrollmentRev = data.enrollment.slice().reverse();
    enrollmentRev.forEach((e) => {
      const key = AcademicTerms.getAcademicYearLabel(e.termID);
      tableData[key].unshift(e.count);
    });
    while (tableData[label1].length < termsPerYear) {
      tableData[label1].unshift('N/A');
    }
  }

  const totalArrays = tableData[label1].concat(tableData[label2], tableData[label3]);
  const numParticipants = totalArrays.reduce((total, participant) => {
    if (typeof (participant) === 'number') {
      return total + participant;
    }
    return total;
  }, 0);

  if (numParticipants === 0) {
    return <p>No one has planned to take this {type} in the next two years yet.</p>;
  }
  if (termsPerYear === 4) {
    return (
      <div>
        <p>* Note: Updated once a day at midnight.</p>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Academic Year</Table.HeaderCell>
              <Table.HeaderCell>Fall</Table.HeaderCell>
              <Table.HeaderCell>Winter</Table.HeaderCell>
              <Table.HeaderCell>Spring</Table.HeaderCell>
              <Table.HeaderCell>Summer</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{label1}</Table.Cell>
              <Table.Cell>{tableData[label1][0]}</Table.Cell>
              <Table.Cell>{tableData[label1][1]}</Table.Cell>
              <Table.Cell>{tableData[label1][2]}</Table.Cell>
              <Table.Cell>{tableData[label1][3]}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{label2}</Table.Cell>
              <Table.Cell>{tableData[label2][0]}</Table.Cell>
              <Table.Cell>{tableData[label2][1]}</Table.Cell>
              <Table.Cell>{tableData[label2][2]}</Table.Cell>
              <Table.Cell>{tableData[label2][3]}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>{label3}</Table.Cell>
              <Table.Cell>{tableData[label3][0]}</Table.Cell>
              <Table.Cell>{tableData[label3][1]}</Table.Cell>
              <Table.Cell>{tableData[label3][2]}</Table.Cell>
              <Table.Cell>{tableData[label3][3]}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
  return (
    <div>
      <p>* Note: Updated once a day at midnight.</p>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Academic Year</Table.HeaderCell>
            <Table.HeaderCell>Fall</Table.HeaderCell>
            <Table.HeaderCell>Spring</Table.HeaderCell>
            <Table.HeaderCell>Summer</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{label1}</Table.Cell>
            <Table.Cell>{tableData[label1][0]}</Table.Cell>
            <Table.Cell>{tableData[label1][1]}</Table.Cell>
            <Table.Cell>{tableData[label1][2]}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{label2}</Table.Cell>
            <Table.Cell>{tableData[label2][0]}</Table.Cell>
            <Table.Cell>{tableData[label2][1]}</Table.Cell>
            <Table.Cell>{tableData[label2][2]}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{label3}</Table.Cell>
            <Table.Cell>{tableData[label3][0]}</Table.Cell>
            <Table.Cell>{tableData[label3][1]}</Table.Cell>
            <Table.Cell>{tableData[label3][2]}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};

export default FutureParticipation;

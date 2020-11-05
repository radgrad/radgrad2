import React, { useState } from 'react';
import { Table, Header } from 'semantic-ui-react';
import { getFutureEnrollmentMethod } from '../../../api/course/CourseCollection.methods';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';

interface IFutureCourseEnrollmentWidgetProps {
  courseID: string;
}

const FutureCourseEnrollmentWidget = (props: IFutureCourseEnrollmentWidgetProps) => {
  const initData: any = {};
  const [dataState, setData] = useState(initData);
  getFutureEnrollmentMethod.call(props.courseID, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      // console.log(result);
      setData(result);
    }
  });

  if (dataState) {
    // console.log(dataState.enrollmentData);
    const quarterP = RadGradProperties.getQuarterSystem();
    return (
      <div>
        <Header as="h4">Future Enrollment:</Header>
        <Table celled>
          <Table.Body>
            {quarterP ? (
              <Table.Row>
                <Table.Cell>{dataState.enrollmentData[0].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[1].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[2].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[3].join(': ')}</Table.Cell>
              </Table.Row>
            ) : (
              <Table.Row>
                <Table.Cell>{dataState.enrollmentData[0].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[1].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[2].join(': ')}</Table.Cell>
              </Table.Row>
            )}
            {quarterP ? (
              <Table.Row>
                <Table.Cell>{dataState.enrollmentData[4].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[5].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[6].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[7].join(': ')}</Table.Cell>
              </Table.Row>
            ) : (
              <Table.Row>
                <Table.Cell>{dataState.enrollmentData[3].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[4].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[5].join(': ')}</Table.Cell>
              </Table.Row>
            )}
            {quarterP ? (
              <Table.Row>
                <Table.Cell>{dataState.enrollmentData[8].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[9].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[10].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[11].join(': ')}</Table.Cell>
              </Table.Row>
            ) : (
              <Table.Row>
                <Table.Cell>{dataState.enrollmentData[6].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[7].join(': ')}</Table.Cell>
                <Table.Cell>{dataState.enrollmentData[8].join(': ')}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    );
  }
  return '';
};

export default FutureCourseEnrollmentWidget;

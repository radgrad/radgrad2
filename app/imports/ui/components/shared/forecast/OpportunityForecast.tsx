import React, { useEffect, useState } from 'react';
import { Button, Grid, Header, Icon, Label, Segment, Table } from 'semantic-ui-react';
import moment from 'moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { getFutureEnrollmentMethod } from '../../../../api/utilities/FutureEnrollment.methods';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { EnrollmentForecast, ENROLLMENT_TYPE } from '../../../../startup/both/RadGradForecasts';

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const saveAsCSV = (data: EnrollmentForecast[]) => () => {
  let result = '';
  const headerArr = ['Opportunity'];
  data[0].enrollment.forEach((entry) => headerArr.push(AcademicTerms.getShortName(entry.termID)));
  result += headerArr.join(',');
  result += '\r\n';
  data.forEach((o) => {
    const opportunity = Opportunities.findDoc(o.opportunityID);
    result += `${opportunity.name},`;
    o.enrollment.forEach((entry) => {
      result += `${entry.count},`;
    });
    result += '\r\n';
  });
  const zip = new ZipZap();
  const dir = 'opportunity-forecast';
  const fileName = `${dir}/${moment().format(databaseFileDateFormat)}.csv`;
  zip.file(fileName, result);
  zip.saveAs(`${dir}.zip`);
};

const OpportunityForecast: React.FC = () => {
  const [data, setData] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getFutureEnrollmentMethod.callPromise(ENROLLMENT_TYPE.OPPORTUNITY)
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
  return (
    <Segment textAlign="center" id="opportunity-forecast">
      <Header>Future Opportunity Forecast</Header>
      <Grid>
        <Grid.Row>
          {/* We need to see if we got the data */}
          {data[0] ? (<div>
            <Table celled fixed>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>Opportunity</Table.HeaderCell>
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
                  {data.map((o) => {
                    const opportunity = Opportunities.findDoc(o.opportunityID);
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <Table.Row key={`${opportunity._id}`}>
                        <Table.Cell width={1}>
                          <Label>{opportunity.name}</Label>
                        </Table.Cell>
                        {o.enrollment.map((entry) => {
                          const score = entry.count;
                          return (
                            <Table.Cell width={1} key={`${opportunity._id}${entry.termID}`} negative={score > 0}
                              collapsing>
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
          <Button basic color="green" onClick={saveAsCSV(data)}>
            Save as CSV
          </Button>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default OpportunityForecast;

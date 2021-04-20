import React from 'react';
import _ from 'lodash';
import { Button, Grid, Header, Icon, Label, Popup, Segment, Table } from 'semantic-ui-react';
import moment from 'moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { AcademicTerm, Opportunity, Forecast } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';

interface OpportunityForecastProps {
  opportunities: Opportunity[];
  terms: AcademicTerm[];
}

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

const getOpportunityScore = (opportunityID: string, termID: string, scores: Forecast[]) => {
  const id = `${opportunityID} ${termID}`;
  const scoreItem = _.find(scores, (p) => p._id === id);
  // console.log(scoreItem, courseID, termID);
  if (scoreItem) {
    return scoreItem.count;
  }
  return 0;
};

const saveAsCSV = (terms: AcademicTerm[], opportunities: Opportunity[], scores: Forecast[]) => () => {
  let result = '';
  const headerArr = ['Opportunity'];
  terms.forEach((term) => headerArr.push(AcademicTerms.getShortName(term._id)));
  result += headerArr.join(',');
  result += '\r\n';
  opportunities.forEach((o) => {
    const opportunityID = o._id;
    result += `${o.name},`;
    terms.forEach((t) => {
      const termID = t._id;
      result += `${getOpportunityScore(opportunityID, termID, scores)},`;
    });
    result += '\r\n';
  });
  const zip = new ZipZap();
  const dir = 'opportunity-forecast';
  const fileName = `${dir}/${moment().format(databaseFileDateFormat)}.csv`;
  zip.file(fileName, result);
  zip.saveAs(`${dir}.zip`);
};

const OpportunityForecast: React.FC<OpportunityForecastProps> = ({ opportunities, terms }) => {
  const scrollBody: React.CSSProperties = {
    display: 'inline-block',
    height: 500,
    overflowY: 'scroll',
    width: '100%',
  };
  const scores = [];
  return (
    <Segment textAlign="center" id="opportunity-forecast">
      <Header>Future Opportunity Forecast</Header>
      <Grid>
        <Grid.Row>
          <Table celled fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={1}>Opportunity</Table.HeaderCell>
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
                {opportunities.map((c, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Table.Row key={index}>
                    <Table.Cell width={1}>
                      <Popup content={c.name} trigger={<Label>{c.name}</Label>} />
                    </Table.Cell>
                    {terms.map((t) => {
                      const score = getOpportunityScore(c._id, t._id, scores);
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
          <Button basic color="green" onClick={saveAsCSV(terms, opportunities, scores)}>
            Save as CSV
          </Button>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default OpportunityForecast;

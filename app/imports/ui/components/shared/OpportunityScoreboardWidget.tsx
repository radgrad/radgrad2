import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Button, Grid, Header, Icon, Label, Popup, Segment, Table } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { moment } from 'meteor/momentjs:moment';
import { ZipZap } from 'meteor/udondan:zipzap';
import { IAcademicTerm, IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { OpportunityScoreboard } from '../../../startup/client/collections';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';

interface IOpportunityScoreboardWidgetProps {
  opportunities: IOpportunity[];
  terms: IAcademicTerm[];
  scores: any[];
}

const databaseFileDateFormat = 'YYYY-MM-DD-HH-mm-ss';

class OpportunityScoreboardWidget extends React.Component<IOpportunityScoreboardWidgetProps> {
  constructor(props) {
    super(props);
    // console.log('OpportunityScoreboardWidget props=%o', props);
  }

  private getOpportunityScore = (opportunityID, termID) => {
    const id = `${opportunityID} ${termID}`;
    const scoreItem = _.find(this.props.scores, (p) => p._id === id);
    // console.log(scoreItem, courseID, termID);
    if (scoreItem) {
      return scoreItem.count;
    }
    return 0;
  };

  private saveAsCSV = () => {
    let result = '';
    const headerArr = ['Opportunity'];
    _.forEach(this.props.terms, (term) => headerArr.push(AcademicTerms.getShortName(term._id)));
    result += headerArr.join(',');
    result += '\r\n';
    _.forEach(this.props.opportunities, (o) => {
      result += `${o.name},`;
      _.forEach(this.props.terms, (t) => {
        const id = `${o._id} ${t._id}`;
        const scoreItem: any = OpportunityScoreboard.findOne({ _id: id });
        result += scoreItem ? `${scoreItem.count},` : '0,';
      });
      result += '\r\n';
    });
    const zip = new ZipZap();
    const dir = 'opportunity-scoreboard';
    const fileName = `${dir}/${moment().format(databaseFileDateFormat)}.csv`;
    zip.file(fileName, result);
    zip.saveAs(`${dir}.zip`);
  };

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const scrollBody: React.CSSProperties = {
      display: 'inline-block',
      height: 500,
      overflowY: 'scroll',
      width: '100%',
    };
    return (
      <Segment textAlign="center">
        <Header>Future Opportunity Scoreboard</Header>
        <Grid>
          <Grid.Row>
            <Table celled={true} fixed={true}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>Opportunity</Table.HeaderCell>
                  {_.map(this.props.terms, (term) => (
                    <Table.HeaderCell width={1}
                                      key={term._id}>{AcademicTerms.getShortName(term._id)}</Table.HeaderCell>))}
                </Table.Row>
              </Table.Header>
            </Table>
            <div style={scrollBody}>
              <Table celled={true} fixed={true}>
                <Table.Body>
                  {_.map(this.props.opportunities, (c, index) => (
                    <Table.Row key={index}>
                      <Table.Cell width={1}><Popup content={c.name} trigger={<Label>{c.name}</Label>}/></Table.Cell>
                      {_.map(this.props.terms, (t) => {
                        const score = this.getOpportunityScore(c._id, t._id);
                        return (
                          <Table.Cell width={1} key={`${c._id}${t._id}`} negative={score > 0} collapsing={true}>
                            {score > 10 ? <Icon name='attention'/> : ''}{score}
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
            <Grid.Column width={1}/>
            <Button basic={true} color={'green'} onClick={this.saveAsCSV}>Save as CSV</Button>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

const OpportunityScoreboardWidgetContainer = withTracker(() => {
  const opportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const isQuarterSystem = RadGradSettings.findOne({}).quarterSystem;
  const limit = isQuarterSystem ? 12 : 9;
  const terms = AcademicTerms.findNonRetired({ termNumber: { $gte: currentTerm.termNumber } }, {
    sort: { termNumber: 1 },
    limit: limit,
  });
  const scores = OpportunityScoreboard.find().fetch();
  return {
    opportunities,
    terms,
    scores,
  };
})(OpportunityScoreboardWidget);

export default OpportunityScoreboardWidgetContainer;

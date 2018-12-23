import * as React from 'react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Container, Grid, Header, Label } from 'semantic-ui-react';
import { IOpportunityInstance } from '../../../typings/radgrad';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';

interface IOpportunityInstancePillProps {
  instance: IOpportunityInstance;
  handleClickOpportunityInstance: (event, { value }) => any;
}

class OpportunityInstancePill extends React.Component<IOpportunityInstancePillProps> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(event) {
    event.preventDefault();
    // console.log(`clicked OI ${this.props.instance}`);
    this.props.handleClickOpportunityInstance(event, { value: this.props.instance._id });
  }

  public render() {
    const opp = Opportunities.findDoc(this.props.instance.opportunityID);
    return (
      <Label as="a" basic={true} onClick={this.handleClick}>
        {opp.name}
      </Label>
    );
  }
}

export default OpportunityInstancePill;

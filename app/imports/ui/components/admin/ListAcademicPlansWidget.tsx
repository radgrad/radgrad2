import * as React from 'react';
import { Accordion, Icon, Button, Grid, Header, Segment, Tab } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { IAcademicPlan } from '../../../typings/radgrad';

interface IListAcademicPlansWidgetProps {
  index: number;
  name: string;
}
interface IListAcademicPlansWidgetState {
  activeIndex: number;
}
class ListAcademicPlansWidget extends React.Component<IListAcademicPlansWidgetProps, IListAcademicPlansWidgetState> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = { activeIndex: -1 };
  }

  private handleClick(e, titleProps) {
    e.preventDefault();
    console.log(titleProps);
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  public render(): React.ReactNode {
    const plans = AcademicPlans.find({}).fetch();
    const { activeIndex } = this.state;
    return (
      <Accordion styled={true} fluid={true}>
        {_.map(plans, (plan, index) => (
          <>
            <Accordion.Title active={activeIndex === index} onClick={this.handleClick} index={index}>
              <Icon name="dropdown" />
              {plan.name}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === index} index={index}>
              {plan.name}
            </Accordion.Content>
          </>
        ))}
      </Accordion>
    );
  }
}

export default ListAcademicPlansWidget;

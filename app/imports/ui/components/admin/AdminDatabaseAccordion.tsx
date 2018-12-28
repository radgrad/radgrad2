import * as React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

interface IAdminDatabaseAccordionState {
  activeIndex: number;
}

interface IAdminDatabaseAccodionProps {
  index: number;
  name: string;
  contents: string[];
}

class AdminDatabaseAccordion extends React.Component<IAdminDatabaseAccodionProps, IAdminDatabaseAccordionState> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.prettyPrint = this.prettyPrint.bind(this);
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

  private prettyPrint() {
    let returnString = '';
    this.props.contents.forEach((s) => {
      returnString += `${JSON.stringify(s, null, 0)}\n`;
    });
    // console.log(this.props.contents, returnString);
    return returnString;
  }

  public render() {
    const { activeIndex } = this.state;
    return (
      <Accordion styled={true} fluid={true}>
        <Accordion.Title active={activeIndex === this.props.index} index={this.props.index} onClick={this.handleClick}>
          <Icon name="dropdown"/>
          {this.props.name} ({this.props.contents.length})
        </Accordion.Title>
        <Accordion.Content active={activeIndex === this.props.index}>
          {this.prettyPrint()}
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default AdminDatabaseAccordion;

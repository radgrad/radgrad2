import * as React from 'react';
import { Accordion, Button, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as Markdown from 'react-markdown';
import { IDescriptionPair } from '../../../typings/radgrad'; // eslint-disable-line

interface IAdminDataModelAccordionProps {
  id: string;
  retired: boolean;
  name: string;
  slug?: string;
  additionalTitleInfo?: string;
  descriptionPairs: IDescriptionPair[];
  updateDisabled: boolean;
  deleteDisabled: boolean;
  handleOpenUpdate: (evt: any, id: any) => any;
  handleDelete: (evt: any, id: any) => any;
}

interface IAdminDataModelAccordionState {
  active: boolean;
}

class AdminDataModelAccordion extends React.Component<IAdminDataModelAccordionProps, IAdminDataModelAccordionState> {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }

  public handleClick = () => {
    let { active } = this.state;
    active = !active;
    this.setState({ active });
  }

  public render() {
    return (
      <Accordion fluid={true} styled={true}>
        <Accordion.Title active={this.state.active} onClick={this.handleClick}>
          {this.props.retired ? <Icon name="eye slash"/> : ''}
          <Icon name="dropdown"/>
          {this.props.name}
          {this.props.slug ? (this.props.slug) : ''}
          {this.props.additionalTitleInfo ? this.props.additionalTitleInfo : ''}
        </Accordion.Title>
        <Accordion.Content active={this.state.active}>
          {_.map(this.props.descriptionPairs, (descriptionPair, index) => (
            <React.Fragment key={index}>
            <b>{descriptionPair.label}:</b> <Markdown escapeHtml={true} source={descriptionPair.value}/>
            </React.Fragment>
          ))}
          <p>
            <Button id={this.props.id} color="green" basic={true} size="mini" disabled={this.props.updateDisabled}
                    onClick={this.props.handleOpenUpdate}>Update</Button>
            <Button id={this.props.id} color="green" basic={true} size="mini" disabled={this.props.deleteDisabled}
                    onClick={this.props.handleDelete}>Delete</Button>
          </p>
        </Accordion.Content>
      </Accordion>
    );
  }
}
export default AdminDataModelAccordion;

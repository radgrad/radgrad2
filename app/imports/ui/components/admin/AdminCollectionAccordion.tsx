import * as React from 'react';
import { Accordion, Button } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as Markdown from 'react-markdown';
import { IDescriptionPair } from '../../../typings/radgrad';

interface IAdminCollectionAccordionProps {
  id: string;
  title: React.ReactNode;
  descriptionPairs: IDescriptionPair[];
  updateDisabled: boolean;
  deleteDisabled: boolean;
  handleOpenUpdate: (evt: any, id: any) => any;
  handleDelete: (evt: any, id: any) => any;
}

interface IAdminCollectionAccordionState {
  active: boolean;
}

class AdminCollectionAccordion extends React.Component<IAdminCollectionAccordionProps, IAdminCollectionAccordionState> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = { active: false };
  }

  public handleClick(e, titleProps) {
    let { active } = this.state;
    active = !active;
    this.setState({ active });
  }

  public render(): React.ReactNode {
    return (
      <Accordion fluid={true} styled={true}>
        <Accordion.Title active={this.state.active} onClick={this.handleClick}>
          {this.props.title}
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

export default AdminCollectionAccordion;

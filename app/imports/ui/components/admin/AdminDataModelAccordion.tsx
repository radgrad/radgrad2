import * as React from 'react';
import { Accordion, Button, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as Markdown from 'react-markdown';
import { IDescriptionPair } from '../../../typings/radgrad';
import slug = Mocha.utils.slug;

interface IAdminDataModelAccordionProps {
  id: string;
  retired: boolean;
  name: string;
  slug?: string;
  additionalTitleInfo?: string;
  descriptionPairs: IDescriptionPair[];
  updateDisabled: boolean;
  deleteDisabled: boolean;
  handleUpdate: () => any;
  handleDelete: () => any;
}

const AdminDataModelAccordion = (props: IAdminDataModelAccordionProps) => (
  <Accordion fluid={true} styled={true}>
    <Accordion.Title>
      {props.retired ? <Icon name="eye slash"/> : ''}
      <Icon name="dropdown"/>
      {props.name}
      {props.slug ? (props.slug) : ''}
      {props.additionalTitleInfo ? props.additionalTitleInfo : ''}
    </Accordion.Title>
    <Accordion.Content>
      {_.map(props.descriptionPairs, (descriptionPair) => (
        <p><b>{descriptionPair.label}:</b> <Markdown escapeHtml={true} source={descriptionPair.value}/></p>
      ))}
      <p>
        <Button id={props.id} color="green" basic={true} size="mini" disabled={props.updateDisabled}
                onClick={props.handleUpdate}>Update</Button>
        <Button id={props.id} color="green" basic={true} size="mini" disabled={props.deleteDisabled}
                onClick={props.handleDelete}>Delete</Button>
      </p>
    </Accordion.Content>
  </Accordion>
);

export default AdminDataModelAccordion;

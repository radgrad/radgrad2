import React, { useState } from 'react';
import { Accordion, Button, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { IDescriptionPair } from '../../../../typings/radgrad';
import * as Router from '../../shared/router-helper-functions';

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
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const AdminDataModelAccordion = (props: IAdminDataModelAccordionProps) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  const { match } = props;
  return (
    <Accordion fluid styled>
      <Accordion.Title active={active} onClick={handleClick}>
        {props.retired ? <Icon name="eye slash" /> : ''}
        <Icon name="dropdown" />
        {props.name}
        {props.slug ? (props.slug) : ''}
        {props.additionalTitleInfo ? props.additionalTitleInfo : ''}
      </Accordion.Title>
      <Accordion.Content active={active}>
        {_.map(props.descriptionPairs, (descriptionPair, index) => (
          <React.Fragment key={index}>
            <b>{descriptionPair.label}:</b> {typeof descriptionPair.value === 'string' ? (
              <Markdown
                escapeHtml
                source={descriptionPair.value}
                renderers={{ link: (lProps) => Router.renderLink(lProps, match) }}
              />
            ) : typeof descriptionPair.value === 'undefined' ? ' ' :
            <p>{descriptionPair.value.join(', ')}</p>}
          </React.Fragment>
        ))}
        <p>
          <Button
            id={props.id}
            color="green"
            basic
            size="mini"
            disabled={props.updateDisabled}
            onClick={props.handleOpenUpdate}
          >
            Update
          </Button>
          <Button
            id={props.id}
            color="green"
            basic
            size="mini"
            disabled={props.deleteDisabled}
            onClick={props.handleDelete}
          >
            Delete
          </Button>
        </p>
      </Accordion.Content>
    </Accordion>
  );
};

export default withRouter(AdminDataModelAccordion);

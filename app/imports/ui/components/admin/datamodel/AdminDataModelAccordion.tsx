import React, { useState } from 'react';
import { Accordion, Button, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import Markdown from 'react-markdown';
import { useRouteMatch } from 'react-router-dom';
import { IDescriptionPair } from '../../../../typings/radgrad';
import * as Router from '../../shared/utilities/router';

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

const AdminDataModelAccordion: React.FC<IAdminDataModelAccordionProps> = ({ id, retired, name, slug, additionalTitleInfo, deleteDisabled, descriptionPairs, handleOpenUpdate, handleDelete, updateDisabled }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  const getDescriptionPairValue = (descriptionPair: IDescriptionPair): string => {
    if (Array.isArray(descriptionPair.value)) {
      return descriptionPair.value.join(', ');
    }
    if (typeof descriptionPair.value === 'undefined') {
      return ' ';
    }
    return `${descriptionPair.value}`;
  };

  const match = useRouteMatch();
  return (
    <Accordion fluid styled>
      <Accordion.Title active={active} onClick={handleClick}>
        {retired ? <Icon name="eye slash" /> : ''}
        <Icon name="dropdown" />
        {name}
        {slug}
        {additionalTitleInfo}
      </Accordion.Title>
      <Accordion.Content active={active}>
        {_.map(descriptionPairs, (descriptionPair, index) => (
          <React.Fragment key={index}>
            <b>{descriptionPair.label}:</b>
            <Markdown
              escapeHtml
              source={getDescriptionPairValue(descriptionPair)}
              renderers={{ link: (lProps) => Router.renderLink(lProps, match) }}
            />
          </React.Fragment>
        ))}
        <p>
          <Button
            id={id}
            color="green"
            basic
            size="mini"
            disabled={updateDisabled}
            onClick={handleOpenUpdate}
          >
            Update
          </Button>
          <Button
            id={id}
            color="green"
            basic
            size="mini"
            disabled={deleteDisabled}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </p>
      </Accordion.Content>
    </Accordion>
  );
};

export default AdminDataModelAccordion;

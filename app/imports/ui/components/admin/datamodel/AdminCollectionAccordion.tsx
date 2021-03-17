import React, { useState } from 'react';
import { Accordion, Button } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { useRouteMatch } from 'react-router-dom';
import { DescriptionPair } from '../../../../typings/radgrad';
import * as Router from '../../shared/utilities/router';

interface AdminCollectionAccordionProps {
  id: string;
  title: React.ReactNode;
  descriptionPairs: DescriptionPair[];
  updateDisabled: boolean;
  deleteDisabled: boolean;
  handleOpenUpdate: (evt: any, id: any) => any;
  handleDelete: (evt: any, id: any) => any;
}

const AdminCollectionAccordion: React.FC<AdminCollectionAccordionProps> = ({ id, title, descriptionPairs, updateDisabled, deleteDisabled, handleDelete, handleOpenUpdate }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  const getDescriptionPairValue = (descriptionPair: DescriptionPair): string => {
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
        {title}
      </Accordion.Title>
      <Accordion.Content active={active}>
        {descriptionPairs.map((descriptionPair, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={`${descriptionPair.label}-${index}`}>
            <b>{descriptionPair.label}:</b>
            <Markdown escapeHtml source={getDescriptionPairValue(descriptionPair)} renderers={{ link: (lProps) => Router.renderLink(lProps, match) }} />
          </React.Fragment>
        ))}
        <p>
          <Button id={id} color="green" basic size="mini" disabled={updateDisabled} onClick={handleOpenUpdate}>
            Update
          </Button>
          <Button id={id} color="green" basic size="mini" disabled={deleteDisabled} onClick={handleDelete}>
            Delete
          </Button>
        </p>
      </Accordion.Content>
    </Accordion>
  );
};

export default AdminCollectionAccordion;

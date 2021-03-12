import React from 'react';
import {Button} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

interface ChecklistButtonLinkProps {
  url: string,
  label: string
}

export const ChecklistButtonLink: React.FC<ChecklistButtonLinkProps> = ({ url, label }) => (
  <Button style={{marginBottom: '2px'}} size='medium' color='teal' as={Link} to={url} icon='arrow alternate circle right' labelPosition='right' content={label}/>
);

interface ChecklistButtonActionProps {
  onClick: () => void,
  label: string
}

export const ChecklistButtonAction: React.FC<ChecklistButtonActionProps> = ({ onClick, label }) => (
  <Button style={{marginBottom: '2px'}} size='medium' color='teal' onClick={onClick} content={label} labelPosition='right' icon='thumbs up outline'/>
);


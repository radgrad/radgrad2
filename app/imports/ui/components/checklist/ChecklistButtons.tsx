import React from 'react';
import {Button} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

interface ChecklistButtonLinkProps {
  url: string,
  label: string
}

export const ChecklistButtonLink: React.FC<ChecklistButtonLinkProps> = ({ url, label }) => (
  <Button style={{marginBottom: '10px'}} size='medium' inverted color='green' as={Link} to={url} icon='arrow alternate circle right' labelPosition='right' content={label}/>
);

interface ChecklistButtonActionProps {
  onClick: () => void,
  label: string
  icon?: string
}

export const ChecklistButtonAction: React.FC<ChecklistButtonActionProps> = ({ onClick, label, icon = 'thumbs up outline' }) => (
  <Button style={{marginBottom: '2px'}} size='small' color='teal' onClick={onClick} content={label} labelPosition='right' icon={icon}/>
);


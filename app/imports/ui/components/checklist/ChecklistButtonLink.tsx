import React from 'react';
import {Button} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

interface ChecklistButtonLinkProps {
  url: string,
  label: string
}

export const ChecklistButtonLink: React.FC<ChecklistButtonLinkProps> = ({ url, label }) => (
  <Button size='medium' color='teal' as={Link} to={url} icon='arrow alternate circle right' labelPosition='right' content={label}/>
)

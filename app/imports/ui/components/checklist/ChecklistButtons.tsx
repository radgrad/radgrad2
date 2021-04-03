import React from 'react';
import { ButtonLink, ButtonAction } from '../shared/button/Buttons';

interface ChecklistButtonLinkProps {
  url: string,
  label: string
}

export const ChecklistButtonLink: React.FC<ChecklistButtonLinkProps> = ({ url, label }) => (
  <ButtonLink style={{ marginBottom: '2px' }} size='small' color='teal' url={url} label={label}/>
);

interface ChecklistButtonActionProps {
  onClick: () => void,
  label: string
  icon?: string
}

export const ChecklistButtonAction: React.FC<ChecklistButtonActionProps> = ({ onClick, label, icon = 'thumbs up outline' }) => (
  <ButtonAction style={{ marginBottom: '2px' }} size='small' color='teal' onClick={onClick} label={label} icon={icon}/>
);


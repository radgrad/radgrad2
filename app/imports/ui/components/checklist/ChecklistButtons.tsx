import React from 'react';
import { ButtonLink } from '../shared/button/ButtonLink';
import { ButtonAction } from '../shared/button/ButtonAction';

interface ChecklistButtonLinkProps {
  url: string,
  label: string
}

export const ChecklistButtonLink: React.FC<ChecklistButtonLinkProps> = ({ url, label }) => (
  <ButtonLink style={{ marginBottom: '10px' }} size='medium' color='green' url={url} label={label}/>
);

interface ChecklistButtonActionProps {
  onClick: () => void,
  label: string
  icon?: string
}

export const ChecklistButtonAction: React.FC<ChecklistButtonActionProps> = ({ onClick, label, icon = 'thumbs up outline' }) => (
  <ButtonAction style={{ marginBottom: '10px' }} size='medium' color='green' onClick={onClick} label={label} icon={icon}/>
);


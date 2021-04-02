import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import './style.css';

export interface ProfileLabelProps {
  name: string,
  level?: number,
  image?: string,
  size?: SemanticSIZES,
}

const ProfileLabel: React.FC<ProfileLabelProps> = ({ name, level, image, size = 'large' }) => {
  const levelIconURL = `/images/level-icons/radgrad-level-${level}-icon.png`;
  const className = `profileLabel Level${level || 0}BackgroundColor`;
  return (
    <Label image className={className} size={size}>
      { image ? <img src={image}/> : ''}
      {name}
      { level ? <Label.Detail className='profileLabel'><img src={levelIconURL}/></Label.Detail> : ''}
    </Label>
  );
};

export default ProfileLabel;
import React from 'react';
import {Label} from 'semantic-ui-react';
import './style.css';

export interface ProfileLabelProps {
  name: string,
  level?: number,
  image?: string
}

const ProfileLabel: React.FC<ProfileLabelProps> = ({name, level, image}) => {
  const levelIconURL = `/images/level-icons/radgrad-level-${level}-icon.png`;
  const className = `profileLabel Level${level || 0}BackgroundColor`;
  return (
    <Label image className={className} size='small'>
      { image ? <img src={image}/> : ''}
      {name}
      { level ? <Label.Detail className='profileLabel'><img src={levelIconURL}/></Label.Detail> : ''}
    </Label>
  );
};

export default ProfileLabel;
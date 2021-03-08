import React from 'react';
import {Label} from 'semantic-ui-react';

export interface ProfileLabelProps {
  name: string,
  level?: number,
  image?: string
}

/**
 * Level light  dark
 *   1. #969c9f #7d8388
 *   2. #ddca7d #ceb23f
 *   3. #96ca50 #6ea543
 *   4. #395890 #243557
 *   5. #d5714b #a94d29
 *   6. #3a3a3c #252525
 */

const ProfileLabel: React.FC<ProfileLabelProps> = ({name, level, image}) => {
  const levelURL = `/images/level-icons/radgrad-level-${level}-icon.png`;
  const className = `profileLabel Level${level || 0}BackgroundColor`;
  return (
    <Label image className={className}>
      { image ? <img src={image}/> : ''}
      {name}
      { level ? <Label.Detail className='profileLabel'><img src={levelURL}/></Label.Detail> : ''}
    </Label>
  );
};

export default ProfileLabel;
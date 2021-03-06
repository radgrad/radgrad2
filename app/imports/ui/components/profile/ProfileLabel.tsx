import React from 'react';

export interface ProfileLabelProps {
  name: string,
  level?: number,
  image?: string
}

const ProfileLabel: React.FC<ProfileLabelProps> = ({name, level, image}) => {
  const foo = 10;
  return (
    <div/>
  );
};

export default ProfileLabel;
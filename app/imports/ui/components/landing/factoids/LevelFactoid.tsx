import React from 'react';
import { LevelFactoid } from '../../../../typings/radgrad';

const LevelFactoid: React.FC<LevelFactoid> = ({ levelIconName}) => {
  console.log(levelIconName);
  return (
    <div id="level-factoid" />
  );
};

export default LevelFactoid;

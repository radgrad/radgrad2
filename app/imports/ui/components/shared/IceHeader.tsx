import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Ice } from '../../../typings/radgrad';

interface IceHeaderProps {
  ice: Ice;
  size?: SemanticSIZES;
}

const IceHeader: React.FC<IceHeaderProps> = ({ ice, size = 'tiny' }) => {
  const marginStyle = {
    margin: 0,
  };
  return (
    <Label.Group circular size={size} className="radgrad-ice-header">
      <Label style={marginStyle}>{ice.i}</Label>
      <Label style={marginStyle}>{ice.c}</Label>
      <Label style={marginStyle}>{ice.e}</Label>
    </Label.Group>
  );
};

export default IceHeader;

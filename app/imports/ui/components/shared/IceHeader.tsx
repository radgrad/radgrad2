import React from 'react';
import { Label } from 'semantic-ui-react';
import { Ice } from '../../../typings/radgrad';

interface IceHeaderProps {
  ice: Ice;
}

const IceHeader: React.FC<IceHeaderProps> = ({ ice }) => {
  const marginStyle = {
    margin: 0,
  };
  return (
    <Label.Group circular size="tiny" className="radgrad-ice-header">
      <Label style={marginStyle}>{ice.i}</Label>
      <Label style={marginStyle}>{ice.c}</Label>
      <Label style={marginStyle}>{ice.e}</Label>
    </Label.Group>
  );
};

export default IceHeader;

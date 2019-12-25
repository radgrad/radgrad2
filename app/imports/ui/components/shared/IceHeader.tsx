import React from 'react';
import { Label } from 'semantic-ui-react';
import { Ice } from '../../../typings/radgrad'; // eslint-disable-line

interface IceHeaderProps {
  ice: Ice;
}

const IceHeader = (props: IceHeaderProps) => {
  const marginStyle = {
    margin: 0,
  };
  return (
  <Label.Group circular={true} size="tiny" className="radgrad-ice-header">
    <Label style={marginStyle}>{props.ice.i}</Label>
    <Label style={marginStyle}>{props.ice.c}</Label>
    <Label style={marginStyle}>{props.ice.e}</Label>
  </Label.Group>
  );
};

export default IceHeader;

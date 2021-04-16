import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Ice } from '../../../typings/radgrad';

interface IceHeaderProps {
  ice: Ice;
  size?: SemanticSIZES;
}

/**
 * Label showing a student's ICE values.
 * @param {Ice} ice the student's ice.
 * @param {"mini" | "tiny" | "small" | "medium" | "large" | "big" | "huge" | "massive" | undefined} size
 * @return {JSX.Element} the Label.
 * @constructor
 */
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

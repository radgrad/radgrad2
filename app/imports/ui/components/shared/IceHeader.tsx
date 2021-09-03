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
const IceHeader: React.FC<IceHeaderProps> = ({ ice, size = 'tiny' }) => (
  <Label.Group circular size={size} className="radgrad-ice-header">
    <Label>{ice.i}</Label>
    <Label>{ice.c}</Label>
    <Label>{ice.e}</Label>
  </Label.Group>
);

export default IceHeader;

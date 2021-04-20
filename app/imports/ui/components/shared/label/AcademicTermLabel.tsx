import React from 'react';
import { Label, SemanticCOLORS, SemanticSIZES } from 'semantic-ui-react';

interface AcademicTermLabelProps {
  slug: string;
  size?: SemanticSIZES;
  name: string;
  style?: Record<string, unknown>;
  color?: SemanticCOLORS;
}

const AcademicTermLabel: React.FC<AcademicTermLabelProps> = ({ slug, size = 'large', style = {}, name, color = 'green' }) => {
  // eslint-disable-next-line no-param-reassign
  style.margin = '2px';
  return (
    <Label key={slug} size={size} color={color} style={style}>
      {name.toUpperCase()}
    </Label>
  );
};

export default AcademicTermLabel;

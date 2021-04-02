import React from 'react';
import { Label, SemanticCOLORS, SemanticSIZES } from 'semantic-ui-react';

interface AcademicTermLabelProps {
  slug: string;
  size?: SemanticSIZES;
  name: string;
  style?: Record<string, unknown>;
  color?: SemanticCOLORS;
}

const AcademicTermLabel: React.FC<AcademicTermLabelProps> = ({ slug, size = 'large', style, name, color = 'green' }) => (
    <Label key={slug} size={size} color={color} style={style}>
      {name}
    </Label>
);

export default AcademicTermLabel;

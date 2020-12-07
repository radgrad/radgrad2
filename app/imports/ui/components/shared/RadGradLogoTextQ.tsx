import React from 'react';
import { SemanticCOLORS } from 'semantic-ui-react';

interface IRadGradLogoProps {
  color?: SemanticCOLORS;
  style?: any;
}

const RadGradLogoTextQ: React.FC<IRadGradLogoProps> = ({ color, style }) => {
  const radStyle = { fontWeight: 700, color: color };
  const gradStyle = { fontWeight: 400, color: color };
  return (
    <div style={style}>
      <span className="radgrad-brand-font" style={radStyle}>RAD</span>
      <span className="radgrad-brand-font" style={gradStyle}>GRAD</span>
      <span className="radgrad-brand-font" style={radStyle}>?</span>
    </div>
  );
};

export default RadGradLogoTextQ;

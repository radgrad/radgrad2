import React from 'react';
import { SemanticCOLORS } from 'semantic-ui-react'; // eslint-disable-line

interface IRadGradLogoProps {
  color?: SemanticCOLORS;
  style?: any;
}

const RadGradLogoTextQ = (props: IRadGradLogoProps) => {
  const radStyle = { fontWeight: 700, color: props.color };
  const gradStyle = { fontWeight: 400, color: props.color };
  return (
    <div style={props.style}>
      <span className="radgrad-brand-font" style={radStyle}>RAD</span>
      <span className="radgrad-brand-font" style={gradStyle}>GRAD</span>
      <span className="radgrad-brand-font" style={radStyle}>?</span>
    </div>
  );
};

export default RadGradLogoTextQ;

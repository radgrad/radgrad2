import React from 'react';
import { SemanticCOLORS } from 'semantic-ui-react';

interface IRadGradLogoProps {
  // eslint-disable-next-line react/require-default-props
  color?: SemanticCOLORS;
  // eslint-disable-next-line react/require-default-props
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

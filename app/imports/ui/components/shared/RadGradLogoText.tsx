import React from 'react';

interface RadGradLogoProps {
  instanceName?: string;
  style?: any;
}

const RadGradLogoText: React.FC<RadGradLogoProps> = ({ instanceName, style = {} }) => {
  const radStyle = { fontWeight: 700 };
  const gradStyle = { fontWeight: 400 };
  const instanceText = instanceName ? `(${instanceName})` : '';
  return (
    <span>
      <span className="radgrad-brand-font" style={radStyle}>
        RAD
      </span>
      <span className="radgrad-brand-font" style={gradStyle}>
        GRAD
      </span>
      {' '} <span style={gradStyle}>{instanceText}</span>
    </span>
  );
};

export default RadGradLogoText;

import React from 'react';

interface RadGradLogoProps {
  style?: any;
}

const RadGradLogoText: React.FC<RadGradLogoProps> = ({ style }) => {
  const radStyle = { fontWeight: 700 };
  const gradStyle = { fontWeight: 400 };
  return (
    <div style={style}>
      <span className="radgrad-brand-font" style={radStyle}>
        RAD
      </span>
      <span className="radgrad-brand-font" style={gradStyle}>
        GRAD
      </span>
    </div>
  );
};

export default RadGradLogoText;

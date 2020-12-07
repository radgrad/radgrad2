import React from 'react';

interface IRadGradLogoProps {
  style?: any;
}

const RadGradLogoText: React.FC<IRadGradLogoProps> = ({ style }) => {
  const radStyle = { fontWeight: 700 };
  const gradStyle = { fontWeight: 400 };
  return (
    <div style={style}>
      <span className="radgrad-brand-font" style={radStyle}>RAD</span>
      <span className="radgrad-brand-font" style={gradStyle}>GRAD</span>
    </div>
  );
};

export default RadGradLogoText;

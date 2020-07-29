import React from 'react';

interface IRadGradLogoProps {
  style?: any;
}

const RadGradLogoText = (props: IRadGradLogoProps) => {
  const radStyle = { fontWeight: 700 };
  const gradStyle = { fontWeight: 400 };
  return (
    <div style={props.style}>
      <span className="radgrad-brand-font" style={radStyle}>RAD</span>
      <span className="radgrad-brand-font" style={gradStyle}>GRAD</span>
    </div>
  );
};

export default RadGradLogoText;

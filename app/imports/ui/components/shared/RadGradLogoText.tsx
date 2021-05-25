import React from 'react';
import _ from 'lodash';

interface RadGradLogoProps {
  instanceName: string;
  style?: any;
}

const RadGradLogoText: React.FC<RadGradLogoProps> = ({ instanceName, style = {} }) => {
  const radStyle = { fontWeight: 700 };
  const gradStyle = { fontWeight: 400 };
  _.defaults(style, { wordWrap: 'break-word' });
  return (
    <span style={style}>
      {instanceName}&nbsp;
      <span className="radgrad-brand-font" style={radStyle}>
        RAD
      </span>
      <span className="radgrad-brand-font" style={gradStyle}>
        GRAD
      </span>
    </span>
  );
};

export default RadGradLogoText;

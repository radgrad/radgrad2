import * as React from 'react';
import { SemanticCOLORS } from 'semantic-ui-react'; // eslint-disable-line

interface IRadGradLogoProps {
  color?: SemanticCOLORS;
  style?: any;
}

const RadGradLogoText = (props: IRadGradLogoProps) => {
  const radStyle = { fontWeight: 700 };
  const gradStyle = { fontWeight: 400 };
  return (
    <div style={props.style}><span className="radgrad-brand-font" style={radStyle}>RAD</span>
      <span className="radgrad-brand-font" style={gradStyle}>GRAD</span>
    </div>
  );
};

export default RadGradLogoText;

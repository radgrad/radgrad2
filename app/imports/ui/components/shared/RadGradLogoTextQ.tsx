import * as React from 'react';
import { Header, SemanticCOLORS } from 'semantic-ui-react';

interface IRadGradLogoProps {
  color?: SemanticCOLORS;
  style?: any;
}

export default class RadGradLogoTextQ extends React.Component<IRadGradLogoProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const radStyle = { fontWeight: 700, color: this.props.color };
    const gradStyle = { fontWeight: 400, color: this.props.color };
    return (
      <div style={this.props.style}><span className="radgrad-brand-font" style={radStyle}>RAD</span>
        <span className="radgrad-brand-font" style={gradStyle}>GRAD</span>
        <span className="radgrad-brand-font" style={radStyle}>?</span>
      </div>
    );
  }
}

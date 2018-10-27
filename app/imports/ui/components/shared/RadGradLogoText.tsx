import * as React from 'react';
import { Header } from 'semantic-ui-react';

export default class RadGradLogoText extends React.Component {
  public render() {
    const radStyle = { fontWeight: 700 };
    const gradStyle = { fontWeight: 400 };
    return (
      <Header as="h2"><span className="radgrad-brand-font" style={radStyle}>RAD</span>
        <span className="radgrad-brand-font" style={gradStyle}>GRAD</span>
      </Header>
    );
  }
}

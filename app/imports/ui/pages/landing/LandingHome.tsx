import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import LandingNavBarContainer from './LandingNavBar';
import LandingSection1 from '../../components/landing/LandingSection1';
import LandingSection2 from '../../components/landing/LandingSection2';

/** A simple static component to render some text for the landing page. */
class LandingHome extends React.Component {
  public render() {
    return (
      <div>
        <LandingNavBarContainer/>
        <LandingSection1/>
        <LandingSection2/>
      </div>
    );
  }
}

export default LandingHome;

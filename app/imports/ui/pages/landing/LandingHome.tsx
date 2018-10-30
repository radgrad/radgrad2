import * as React from 'react';
import LandingNavBarContainer from './LandingNavBar';
import LandingSection1 from '../../components/landing/LandingSection1';
import LandingSection2 from '../../components/landing/LandingSection2';
import LandingSection3 from '../../components/landing/LandingSection3';
import LandingSection4 from '../../components/landing/LandingSection4';
import LandingSection5 from '../../components/landing/LandingSection5';
import LandingSection6 from '../../components/landing/LandingSection6';
import LandingSection7 from '../../components/landing/LandingSection7';
import LandingSection8 from '../../components/landing/LandingSection8';

/** A simple static component to render some text for the landing page. */
class LandingHome extends React.Component {
  public render() {
    return (
      <div>
        <LandingNavBarContainer/>
        <LandingSection1/>
        <LandingSection2/>
        <LandingSection3/>
        <LandingSection4/>
        <LandingSection5/>
        <LandingSection6/>
        <LandingSection7/>
        <LandingSection8/>
      </div>
    );
  }
}

export default LandingHome;

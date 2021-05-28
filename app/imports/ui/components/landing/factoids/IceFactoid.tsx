import React from 'react';
import { Card, Header } from 'semantic-ui-react';
import { makeSampleIce } from '../../../../api/ice/SampleIce';
import MenuIceCircle from '../../shared/MenuIceCircle';
import styles from '../utilities/landing-styles';

const IceFactoid: React.FC = () => {
  const projectedICE = makeSampleIce();
  const earnedICE = { i: 85, c: 100, e: 65 };
  const flexStyle = { display: 'flex', paddingTop: '5px', paddingRight: '13px', marginTop: '3px' };
  return (
    <div id="ice-factoid">
      <Header inverted style={styles['green-text']}>In RadGrad, GPA doesn&apos;t matter.</Header>
      <Card fluid>
        <Card.Content>
          <Card.Header>RadGrad focuses on Innovation, Competency, and Experience.</Card.Header>
          <div style={flexStyle}>
            <MenuIceCircle earned={earnedICE.i} planned={projectedICE.i} type='innov' />
            <MenuIceCircle earned={earnedICE.c} planned={projectedICE.c} type='comp' />
            <MenuIceCircle earned={earnedICE.e} planned={projectedICE.e} type='exp' />
          </div>
        </Card.Content>
      </Card></div>
  );
};

export default IceFactoid;

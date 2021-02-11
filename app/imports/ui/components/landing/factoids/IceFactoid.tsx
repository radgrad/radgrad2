import React from 'react';
import { Card } from 'semantic-ui-react';
import { makeSampleIce } from '../../../../api/ice/SampleIce';
import MenuIceCircle from '../../shared/MenuIceCircle';

const IceFactoid: React.FC = () => {
  const projectedICE = makeSampleIce();
  const earnedICE = { i: 85, c: 100, e: 65 };
  const flexStyle = { display: 'flex', paddingTop: '5px', paddingRight: '13px', marginTop: '3px' };
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>RadGrad tracks ICE, not GPA.</Card.Header>
        <Card.Description>RadGrad helps you develop Innovation, Competency, and Experience.</Card.Description>
        <div style={flexStyle}>
          <MenuIceCircle earned={earnedICE.i} planned={projectedICE.i} type="innov" />
          <MenuIceCircle earned={earnedICE.c} planned={projectedICE.c} type="comp" />
          <MenuIceCircle earned={earnedICE.e} planned={projectedICE.e} type="exp" />
        </div>

      </Card.Content>
    </Card>
  );
};

export default IceFactoid;

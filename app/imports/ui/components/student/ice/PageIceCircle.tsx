import React from 'react';
import { PositionProperties } from 'react-native';

interface PageIceCircleProps {
  earned: number;
  planned: number;
  type: string;
}
// TODO remove this file use shared/MenuIceCircle
const PageIceCircle: React.FC<PageIceCircleProps> = ({ planned, type, earned }) => {
  const styles = {
    position: 'absolute' as PositionProperties.absolute,
    zIndex: 1,
    left: '-22px',
    top: '48px',
    width: '3.45em',
    fontSize: '0.40em',
  };
  // TODO display current value not capped at 100
  const p = planned < 100 ? planned : 100;
  const e = earned < 100 ? earned : 100;
  // TODO cap class name p100
  const classNamesPlanned = `radgrad-ice-circle p${p} radgrad-proj-${type}`;
  const classNamesEarned = `radgrad-ice-circle p${e} radgrad-earn-${type}`;
  return (
    <div className="radgrad-ice">
      <span className={classNamesPlanned}>
        <div style={styles}>
          <span>{e}</span>
        </div>
        <div className="slice">
          <div className="bar" />
          <div className="fill" />
        </div>
      </span>
      <span className={classNamesEarned}>
        <span />
        <div className="slice">
          <div className="bar" />
          <div className="fill" />
        </div>
      </span>
    </div>
  );
};

export default PageIceCircle;

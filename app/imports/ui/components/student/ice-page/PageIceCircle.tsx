import * as React from 'react';
import { PositionProperties } from 'react-native';
import { Link, withRouter } from 'react-router-dom';
import { buildRouteName } from '../../shared/router-helper-functions';

interface IPageIceCircleProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  earned: number;
  planned: number;
  type: string;
}

const PageIceCircle = (props: IPageIceCircleProps) => {
  const styles = {
    position: 'absolute' as PositionProperties.absolute,
    zIndex: 1,
    left: '-22px',
    top: '48px',
    width: '3.45em',
    fontSize: '0.40em',
  };
  const { planned, type, earned, match } = props;
  const p = (planned < 100) ? planned : 100;
  const e = (earned < 100) ? earned : 100;
  const classNamesPlanned = `radgrad-ice-circle p${p} radgrad-proj-${type}`;
  const classNamesEarned = `radgrad-ice-circle p${e} radgrad-earn-${type}`;
  const routeToIcePage = buildRouteName(match, '/home/ice');
  return (
    <div className="radgrad-ice">
      <Link to={routeToIcePage} className={classNamesPlanned}>
        <div style={styles}>
          <span>{e}</span>
        </div>
        <div className="slice">
          <div className="bar" />
          <div className="fill" />
        </div>
      </Link>
      <a className={classNamesEarned}>
        <span />
        <div className="slice">
          <div className="bar" />
          <div className="fill" />
        </div>
      </a>
    </div>
  );
};

export default withRouter(PageIceCircle);

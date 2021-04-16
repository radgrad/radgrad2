import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import { buildRouteName } from './utilities/router';

interface MenuIceCircleProps {
  earned: number;
  planned: number;
  type: string;
}

/* Technical Debt:
 *  L25 the type needs to change.
 *  L30, 31 update the theme classnames.
 */

/**
 * This is an ICE circle with a link to the ICE page.
 * @param {number} planned the planned ICE value.
 * @param {string} type the type of ICE, 'innov', 'comp', 'exp'.
 * @param {number} earned the earned ICE value.
 * @return {JSX.Element} the ICE circle.
 * @constructor
 */
const MenuIceCircle: React.FC<MenuIceCircleProps> = ({ planned, type, earned }) => {
  const marginRight = { marginRight: 5 };
  const match = useRouteMatch();
  const p = planned < 100 ? planned : 100;
  const e = earned < 100 ? earned : 100;
  const classNamesPlanned = `radgrad-ice-circle p${p} radgrad-proj-${type}`;
  const classNamesEarned = `radgrad-ice-circle p${e} radgrad-earn-${type}`;
  const routeToIcePage = buildRouteName(match, '/ice');
  return (
    <Popup
      trigger={
        <div className="radgrad-ice menu" style={marginRight}>
          <Link to={routeToIcePage} className={classNamesPlanned}>
            <div className="radgrad-ice-stat">
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
      }
      content={`${earned}/${planned}`}
    />
  );
};

export default MenuIceCircle;

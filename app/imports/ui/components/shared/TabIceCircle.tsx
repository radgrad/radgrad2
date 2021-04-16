import React from 'react';
import { Popup } from 'semantic-ui-react';

interface TabIceCircleProps {
  earned: number;
  planned: number;
  type: string;
}

/* Technical Debt:
 *  L21 the type needs to change.
 *  L26, 27 update the theme classnames.
 */

/**
 * This is an ICE circle without the link to the ICE page.
 * @param {number} planned the planned ICE value.
 * @param {string} type the type of ICE, 'innov', 'comp', 'exp'.
 * @param {number} earned the earned ICE value.
 * @return {JSX.Element} the ICE circle.
 * @constructor
 */
const TabIceCircle: React.FC<TabIceCircleProps> = ({ planned, type, earned }) => {
  const marginRight = { marginRight: 5 };
  const p = planned < 100 ? planned : 100;
  const e = earned < 100 ? earned : 100;
  const classNamesPlanned = `radgrad-ice-circle p${p} radgrad-proj-${type}`;
  const classNamesEarned = `radgrad-ice-circle p${e} radgrad-earn-${type}`;
  return (
    <Popup
      trigger={
        <div className="radgrad-ice menu" style={marginRight}>
          <div className={classNamesPlanned}>
            <div className="radgrad-ice-stat">
              <span>{e}</span>
            </div>
            <div className="slice">
              <div className="bar" />
              <div className="fill" />
            </div>
          </div>
          <div className={classNamesEarned}>
            <span />
            <div className="slice">
              <div className="bar" />
              <div className="fill" />
            </div>
          </div>
        </div>
      }
      content={`${earned}/${planned}`}
    />
  );
};

export default TabIceCircle;

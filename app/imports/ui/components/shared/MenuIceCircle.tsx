import React from 'react';
import { PositionProperties } from 'react-native';
import { Link, useRouteMatch } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import { buildRouteName } from './utilities/router';

interface IMenuIceCircleProps {
  earned: number;
  planned: number;
  type: string;
  large: boolean=true;
}

const MenuIceCircle: React.FC<IMenuIceCircleProps> = ({ planned, type, earned, large }) => {
  const marginRight = { marginRight: 5 };
  const match = useRouteMatch();
  var internalNumber:React.ReactNode;
  var classNamesss:string="radgrade-ice";
  const p = (planned < 100) ? planned : 100;
  const e = (earned < 100) ? earned : 100;
  const classNamesPlanned = `radgrad-ice-circle p${p} radgrad-proj-${type}`;
  const classNamesEarned = `radgrad-ice-circle p${e} radgrad-earn-${type}`;
  const routeToIcePage = buildRouteName(match, '/home/ice');
  const tmp=false
  if(tmp){//prepare inner number for specific size
      const styles = {
        position: 'absolute' as PositionProperties.absolute,
        zIndex: 1,
        left: '-22px',
        top: '48px',
        width: '3.45em',
        fontSize: '0.40em',
      };
      internalNumber=(
        <div style={styles}>
          <span>{earned}</span>
        </div>
      )
    }else{
      classNamesss+='menu'
      internalNumber=(
          <div className="radgrad-ice-stat">
            <span>{earned}</span>
          </div>
        )
    }
    var circle:React.ReactNode=(
     <div className={classNamesss}>
                      <Link to={routeToIcePage} className={classNamesPlanned}>
                        {internalNumber}
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

    var ret:React.ReactNode;
    if(tmp){
        ret=circle
    }else{
        ret=(
        <Popup
          trigger={(
            <div classNames={classNamesss}>
              <Link to={routeToIcePage} className={classNamesPlanned}>
                {internalNumber}
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
          )}
          content={`${earned}/${planned}`}
        />
       )
    }

  return ret
};

export default MenuIceCircle;

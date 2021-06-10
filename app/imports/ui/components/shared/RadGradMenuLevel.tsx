import React from 'react';
import { Popup } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { buildRouteName } from './utilities/router';

interface RadGradMenuLevelProps {
  level: number;
}

const RadGradMenuLevel: React.FC<RadGradMenuLevelProps> = ({ level }) => {
  const iconName = `/images/level-icons/radgrad-level-${level}-icon.png`;
  const iconStyle = {
    backgroundImage: `url('${iconName}'`,
    backgroundRepeat: 'no-prepeat',
    width: '50px',
    height: '50px',
    margin: '0px 5px 0 0',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundSize: '100% 100%',
    display: 'flex',
  };
  const match = useRouteMatch();
  const routeToLevelsPage = buildRouteName(match, '/levels');
  return (
    <Popup trigger={<Link to={routeToLevelsPage}> <div style={iconStyle}/> </Link>} content={`Level ${level}`}/>
  );
};

export default RadGradMenuLevel;

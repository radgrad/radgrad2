import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { getBaseRoute } from './RouterHelperFunctions';
import { COURSE_SCOREBOARD, OPPORTUNITY_SCOREBOARD, SCOREBOARD } from '../../../startup/client/route-constants';
import { leftHandMenu } from './shared-widget-names';


const ScoreboardPageMenu = (props: any) => {
  // console.log(props);
  const baseRoute = getBaseRoute(props.match);
  // console.log(baseRoute);
  return (
    <Menu vertical fluid id={`${leftHandMenu}`}>
      <Menu.Item
        key="courses"
        as={NavLink}
        exact
        to={`${baseRoute}/${SCOREBOARD}/${COURSE_SCOREBOARD}`}
      >
        Courses
      </Menu.Item>
      <Menu.Item
        key="opportunities"
        as={NavLink}
        exact
        to={`${baseRoute}/${SCOREBOARD}/${OPPORTUNITY_SCOREBOARD}`}
      >
        Opportunities
      </Menu.Item>
    </Menu>
  );
};

export default withRouter(ScoreboardPageMenu);

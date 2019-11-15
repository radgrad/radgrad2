import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { getBaseRoute } from './RouterHelperFunctions';
import { COURSE_SCOREBOARD, OPPORTUNITY_SCOREBOARD, SCOREBOARD } from '../../../startup/client/routes-config';
import { leftHandMenu } from './shared-widget-names';


const ScoreboardPageMenu = (props: any) => {
  // console.log(props);
  const baseRoute = getBaseRoute(props.match);
  // console.log(baseRoute);
  return (
      <Menu vertical={true} fluid={true} id={`${leftHandMenu}`}>
        <Menu.Item key='courses' as={NavLink} exact={true}
                   to={`${baseRoute}/${SCOREBOARD}/${COURSE_SCOREBOARD}`}>Courses</Menu.Item>
        <Menu.Item key='opportunities' as={NavLink} exact={true}
                   to={`${baseRoute}/${SCOREBOARD}/${OPPORTUNITY_SCOREBOARD}`}>Opportunities</Menu.Item>
      </Menu>
  );
};

export default withRouter(ScoreboardPageMenu);

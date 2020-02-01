import * as React from 'react';
import { Menu } from 'semantic-ui-react';

interface IPageTrackingMenuProps {

}

const PageTrackingMenu = (props: IPageTrackingMenuProps) => (
  <Menu vertical>
    <Menu.Item>Career Goals</Menu.Item>
    <Menu.Item>Courses</Menu.Item>
    <Menu.Item active>Interests</Menu.Item>
    <Menu.Item>Opportunities</Menu.Item>
  </Menu>
);

export default PageTrackingMenu;

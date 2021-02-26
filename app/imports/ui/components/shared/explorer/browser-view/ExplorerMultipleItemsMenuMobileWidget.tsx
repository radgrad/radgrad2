import { createMedia } from '@artsy/fresnel';
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import * as Router from '../../utilities/router';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import ExplorerMenuMobileItem from '../item-view/ExplorerMenuMobileItem';
import { ExplorerInterfaces, isType } from '../utilities/explorer';

const AppMedia = createMedia({
  breakpoints: {
    mobile: 320,
    tablet: 768,
    computer: 992,
    largeScreen: 1200,
    widescreen: 1920,
  },
});

const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

interface CardExplorerMenuMobileWidgetProps {
  menuAddedList: { item: ExplorerInterfaces; count: number }[];
  type: 'plans' | 'career-goals' | 'courses' | 'interests' | 'opportunities';
}

const ExplorerMultipleItemsMenuMobileWidget: React.FC<CardExplorerMenuMobileWidgetProps> = ({ menuAddedList, type }) => {
  const match = useRouteMatch();
  const isStudent = Router.isUrlRoleStudent(match);
  return (
    <React.Fragment>
      <style>{mediaStyles}</style>
      {/* ####### The Menu underneath the Dropdown for MOBILE ONLY ####### */}
      {/* The following components are rendered ONLY for STUDENTS: Academic Plans, Courses, and Opportunities. */}
      <MediaContextProvider>
        <Media lessThan="tablet">
          {isType(EXPLORER_TYPE.COURSES, type) && isStudent ? (
            <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
              <Dropdown.Menu>
                <Dropdown.Header as="h4">MY FAVORITE COURSES</Dropdown.Header>
                <Dropdown.Divider />
                {
                  // eslint-disable-next-line react/prop-types
                  menuAddedList.map((listItem) => (
                    <ExplorerMenuMobileItem type={EXPLORER_TYPE.COURSES} listItem={listItem} key={listItem.item._id} />
                  ))
                }
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            ''
          )}

          {isType(EXPLORER_TYPE.OPPORTUNITIES, type) && isStudent ? (
            <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
              <Dropdown.Menu>
                <Dropdown.Header as="h4">MY FAVORITE OPPORTUNITIES</Dropdown.Header>
                <Dropdown.Divider />
                {menuAddedList.map((listItem) => (
                  <ExplorerMenuMobileItem type={EXPLORER_TYPE.OPPORTUNITIES} listItem={listItem} key={listItem.item._id} />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            ''
          )}

          {/* Components renderable to STUDENTS and FACULTY. */}
          {isType(EXPLORER_TYPE.INTERESTS, type) ? (
            <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
              <Dropdown.Menu>
                <Dropdown.Header as="h4">MY FAVORITE INTERESTS</Dropdown.Header>
                <Dropdown.Divider />
                {menuAddedList.map((listItem) => (
                  <ExplorerMenuMobileItem type={EXPLORER_TYPE.INTERESTS} listItem={listItem} key={listItem.item._id} />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            ''
          )}

          {isType(EXPLORER_TYPE.CAREERGOALS, type) ? (
            <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
              <Dropdown.Menu>
                <Dropdown.Header as="h4">MY FAVORITE CAREER GOALS</Dropdown.Header>
                <Dropdown.Divider />
                {menuAddedList.map((listItem) => (
                  <ExplorerMenuMobileItem type={EXPLORER_TYPE.CAREERGOALS} listItem={listItem} key={listItem.item._id} />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            ''
          )}
        </Media>
      </MediaContextProvider>
    </React.Fragment>
  );
};

export default ExplorerMultipleItemsMenuMobileWidget;

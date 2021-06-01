import { createMedia } from '@artsy/fresnel';
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import * as Router from '../../app/imports/ui/components/shared/utilities/router';
import { EXPLORER_TYPE } from '../../app/imports/ui/layouts/utilities/route-constants';
import ExplorerMenuMobileItem, { ListItem } from './ExplorerMenuMobileItem';

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

interface ExplorerMenuMobileWidgetProps {
  menuAddedList: ListItem[];
  type: 'plans' | 'career-goals' | 'courses' | 'interests' | 'opportunities' | 'users'; // TODO should this be a defined type?
}

const isType = (typeToCheck: string, type: string): boolean => type === typeToCheck;

// TODO QA this does a lot can we simplify this?
const ExplorerMenuMobile: React.FC<ExplorerMenuMobileWidgetProps> = ({ menuAddedList, type }) => {
  const match = useRouteMatch();
  const isStudent = Router.isUrlRoleStudent(match);
  return (
    <React.Fragment>
      <style>{mediaStyles}</style>
      <MediaContextProvider>
        <Media lessThan="tablet">
          {isType(EXPLORER_TYPE.COURSES, type) && isStudent ? (
            <React.Fragment>
              <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY PROFILE COURSES</Dropdown.Header>
                  <Dropdown.Divider />
                  {menuAddedList.map((listItem) => (
                    <ExplorerMenuMobileItem type={EXPLORER_TYPE.COURSES} listItem={listItem} key={listItem.item._id} />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </React.Fragment>
          ) : (
            ''
          )}

          {isType(EXPLORER_TYPE.OPPORTUNITIES, type) ? (
            <React.Fragment>
              {isStudent ? (
                <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                  <Dropdown.Menu>
                    <Dropdown.Header as="h4">MY PROFILE OPPORTUNITIES</Dropdown.Header>
                    <Dropdown.Divider />
                    {menuAddedList.map((listItem) => (
                      <ExplorerMenuMobileItem type={EXPLORER_TYPE.OPPORTUNITIES} listItem={listItem} key={listItem.item._id} />
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                ''
              )}
            </React.Fragment>
          ) : (
            ''
          )}

          {/* Components renderable to STUDENTS and FACULTY. */}
          {isType(EXPLORER_TYPE.INTERESTS, type) ? (
            <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
              <Dropdown.Menu>
                <Dropdown.Header as="h4">MY PROFILE INTERESTS</Dropdown.Header>
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
                <Dropdown.Header as="h4">MY PROFILE CAREER GOALS</Dropdown.Header>
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

export default ExplorerMenuMobile;

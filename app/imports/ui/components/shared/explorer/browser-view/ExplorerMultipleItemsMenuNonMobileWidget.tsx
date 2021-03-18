import { createMedia } from '@artsy/fresnel';
import React from 'react';
import { Menu, Header, Button, Icon } from 'semantic-ui-react';
import { useRouteMatch, Link } from 'react-router-dom';
import { RadGradProperties } from '../../../../../api/radgrad/RadGradProperties';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import ExplorerMenuNonMobileItem from '../item-view/ExplorerMenuNonMobileItem';
import { ExplorerInterfaces, IExplorerTypes, isType } from '../utilities/explorer';
import { buildRouteName, isUrlRoleAdvisor, isUrlRoleFaculty, isUrlRoleStudent } from '../../utilities/router';
// import '../../../../../../client/style.css';

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

interface CardExplorerMenuNonMobileWidgetProps {
  menuAddedList: { item: ExplorerInterfaces; count: number }[];
  // eslint-disable-next-line react/no-unused-prop-types
  type: IExplorerTypes;
}

const ExplorerMultipleItemsMenuNonMobileWidget: React.FC<CardExplorerMenuNonMobileWidgetProps> = ({ menuAddedList, type }) => {
  const match = useRouteMatch();
  const adminEmail = RadGradProperties.getAdminEmail();
  const isStudent = isUrlRoleStudent(match);
  const isFaculty = isUrlRoleFaculty(match) || isUrlRoleAdvisor(match);

  const addFacultyOpportunityButtonStyle: React.CSSProperties = { marginTop: '5px' };

  return (
    <React.Fragment>
      <style>{mediaStyles}</style>
      {/* ####### The Menu underneath the Dropdown for NON mobile  ####### */}
      {/* The following components are rendered ONLY for STUDENTS: Academic Plans, Courses, and Opportunities. However,
            FACULTY have a 'Suggest a Opportunity / Career Goal' mailto link. */}
      <MediaContextProvider>
        <Media greaterThanOrEqual="tablet">
          {isType(EXPLORER_TYPE.COURSES, type) && isStudent ? (
            <Menu vertical text className="cardMenu">
              <Header as="h4" className="cardMenu_header">
                <Icon name="book" size="mini" />
                <Header.Content>MY COURSES</Header.Content>
              </Header>
              {menuAddedList.map((listItem) => (
                <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.COURSES} key={listItem.item._id} />
              ))}
            </Menu>
          ) : (
            ''
          )}

          {isType(EXPLORER_TYPE.OPPORTUNITIES, type) ? (
            <React.Fragment>
              <a href={`mailto:${adminEmail}?subject=New Opportunity Suggestion`}>Suggest a new Opportunity</a>
              {isFaculty ? (
                <Button as={Link} to={buildRouteName(match, '/manage-opportunities')} size="small" style={addFacultyOpportunityButtonStyle}>
                  Add a Faculty Opportunity
                </Button>
              ) : (
                ''
              )}
              {isStudent ? (
                <Menu vertical text className="cardMenu">
                  <Header as="h4" className="cardMenu_header">
                    <Icon name="handshake" size="mini" />
                    <Header.Content>MY OPPORTUNITIES</Header.Content>
                  </Header>
                  {menuAddedList.map((listItem) => (
                    <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.OPPORTUNITIES} key={listItem.item._id} />
                  ))}
                </Menu>
              ) : (
                ''
              )}
            </React.Fragment>
          ) : (
            ''
          )}

          {/* Components renderable to STUDENTS and FACULTY. But if we are FACULTY, make sure we
                don't map over menuAddedList or else we get undefined error. */}
          {isType(EXPLORER_TYPE.INTERESTS, type) ? (
            <Menu vertical text className="cardMenu">
              <Button icon positive className="cardMenu_btn" href={`mailto:${adminEmail}?subject=New Interest Suggestion`}>
                <Icon name="edit" />
                &nbsp;&nbsp;Suggest a NEW Interest
              </Button>
              <Header as="h4" className="cardMenu_header">
                <Icon name="favorite" size="mini" />
                <Header.Content>MY INTERESTS</Header.Content>
              </Header>
              {menuAddedList.map((listItem) => (
                <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.INTERESTS} key={listItem.item._id} />
              ))}
            </Menu>
          ) : (
            ''
          )}

          {isType(EXPLORER_TYPE.CAREERGOALS, type) ? (
            <Menu vertical text className="cardMenu">
              <Button icon positive className="cardMenu_btn" href={`mailto:${adminEmail}?subject=New Career Goal Suggestion`}>
                <Icon name="edit" />
                &nbsp;&nbsp;Suggest a NEW Career Goal
              </Button>
              <Header as="h4" className="cardMenu_header">
                <Icon name="briefcase" size="mini" />
                <Header.Content>MY CAREER GOALS</Header.Content>
              </Header>
              {menuAddedList.map((listItem) => (
                <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.CAREERGOALS} key={listItem.item._id} />
              ))}
            </Menu>
          ) : (
            ''
          )}
        </Media>
      </MediaContextProvider>
    </React.Fragment>
  );
};

export default ExplorerMultipleItemsMenuNonMobileWidget;

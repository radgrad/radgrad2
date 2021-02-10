import { createMedia } from '@artsy/fresnel';
import React from 'react';
import { Menu, Header, Button, Icon } from 'semantic-ui-react';
import { useRouteMatch, Link } from 'react-router-dom';
import { RadGradProperties } from '../../../../../api/radgrad/RadGradProperties';
import * as Router from '../../utilities/router';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import ExplorerMenuNonMobileItem from './ExplorerMenuNonMobileItem';
import { buildRouteName, isUrlRoleFaculty } from '../../utilities/router';
import { ListItem } from './ExplorerMenuMobileItem';

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

interface ExplorerMenuNonMobileWidgetProps {
  menuAddedList: ListItem[];
  menuCareerList: ListItem[] | undefined;
  type: 'plans' | 'career-goals' | 'courses' | 'interests' | 'opportunities' | 'users'; // TODO should this be a defined type?
}

const getTypeName = (type: string): string => {
  const names = ['Career Goals', 'Courses', 'Interests', 'Opportunities', 'Users'];
  // TODO QA this feels terrible.
  switch (type) {
    case EXPLORER_TYPE.CAREERGOALS:
      return names[0];
    case EXPLORER_TYPE.COURSES:
      return names[1];
    case EXPLORER_TYPE.INTERESTS:
      return names[2];
    case EXPLORER_TYPE.OPPORTUNITIES:
      return names[3];
    default:
      return '';
  }
};

const isType = (typeToCheck: string, type: string): boolean => type === typeToCheck;

// TODO QA this does a lot can we simplify this?
const ExplorerMenuNonMobileWidget: React.FC<ExplorerMenuNonMobileWidgetProps> = ({ menuAddedList, menuCareerList, type }) => {
  // console.log('ExplorerMenuNonMobileWidget', props);
  const marginTopStyle = { marginTop: '5px' };
  const match = useRouteMatch();

  const baseUrl = match.url;
  const username = Router.getUsername(match);
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}`;

  const isStudent = Router.isUrlRoleStudent(match);
  const adminEmail = RadGradProperties.getAdminEmail();
  const isFaculty = isUrlRoleFaculty(match);

  const addFacultyOpportunityButtonStyle: React.CSSProperties = { marginTop: '5px' };

  return (
    <React.Fragment>
      <style>{mediaStyles}</style>
      <MediaContextProvider>
        <Media greaterThanOrEqual="tablet">
          {isType(EXPLORER_TYPE.COURSES, type) ? (
            <React.Fragment>
              <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${type}`} style={marginTopStyle}>
                <Icon name="chevron circle left" />
                <br />
                Back to {getTypeName(type)}
              </Button>
              {isStudent ? (
                <Menu vertical text>
                  <Header as="h4" dividing>
                    MY FAVORITE COURSES
                  </Header>
                  {menuAddedList.map((listItem) => (
                    <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.COURSES} key={listItem.item._id} />
                  ))}
                </Menu>
              ) : (
                ''
              )}
            </React.Fragment>
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
              <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${type}`} style={marginTopStyle}>
                <Icon name="chevron circle left" />
                <br />
                Back to {getTypeName(type)}
              </Button>
              {isStudent ? (
                <Menu vertical text>
                  <Header as="h4" dividing>
                    MY FAVORITE OPPORTUNITIES
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
            <Menu vertical text>
              <a href={`mailto:${adminEmail}?subject=New Interest Suggestion`}>Suggest a new Interest</a>
              <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${type}`} style={marginTopStyle}>
                <Icon name="chevron circle left" />
                <br />
                Back to {getTypeName(type)}
              </Button>
              <Header as="h4" dividing>
                MY FAVORITE INTERESTS
              </Header>
              {menuAddedList.map((listItem) => (
                <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.INTERESTS} key={listItem.item._id} />
              ))}

              <Header as="h4" dividing>
                SUGGESTED CAREER GOAL INTERESTS
              </Header>
              {menuCareerList.map((listItem) => (
                <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.INTERESTS} key={listItem.item._id} />
              ))}
            </Menu>
          ) : (
            ''
          )}

          {isType(EXPLORER_TYPE.CAREERGOALS, type) ? (
            <Menu vertical text>
              <a href={`mailto:${adminEmail}?subject=New Career Goal Suggestion`}>Suggest a new Career Goal</a>
              <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${type}`} style={marginTopStyle}>
                <Icon name="chevron circle left" />
                <br />
                Back to {getTypeName(type)}
              </Button>
              <Header as="h4" dividing>
                MY FAVORITE CAREER GOALS
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

export default ExplorerMenuNonMobileWidget;

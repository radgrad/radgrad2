import { createMedia } from '@artsy/fresnel';
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as Router from '../../utilities/router';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import ExplorerMenuMobileItem from '../single-item-page/ExplorerMenuMobileItem';
import {
  explorerInterfaces,
  isType,
} from '../explorer-helper-functions';
import { IInterest } from '../../../../../typings/radgrad';

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

interface ICardExplorerMenuMobileWidgetProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList: { item: IInterest, count: number }[] | undefined;
  type: 'plans' | 'career-goals' | 'courses' | 'interests' | 'opportunities';
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const ExplorerMultipleItemsMenuMobileWidget = (props: ICardExplorerMenuMobileWidgetProps) => {
  const { menuAddedList, menuCareerList } = props;
  const isStudent = Router.isUrlRoleStudent(props.match);
  return (
    <React.Fragment>
      <style>{mediaStyles}</style>
      {/* ####### The Menu underneath the Dropdown for MOBILE ONLY ####### */}
      {/* The following components are rendered ONLY for STUDENTS: Academic Plans, Courses, and Opportunities. */}
      <MediaContextProvider>
        <Media at="mobile">
          {(isType(EXPLORER_TYPE.ACADEMICPLANS, props.type) && isStudent) ?
            (
              <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY FAVORITE ACADEMIC PLANS</Dropdown.Header>
                  <Dropdown.Divider />
                  {
                    // eslint-disable-next-line react/prop-types
                    menuAddedList.map((listItem) => (
                      <ExplorerMenuMobileItem
                        type={EXPLORER_TYPE.ACADEMICPLANS}
                        listItem={listItem}
                        key={listItem.item._id}
                        match={props.match}
                      />
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            )
            : ''}

          {(isType(EXPLORER_TYPE.COURSES, props.type) && isStudent) ?
            (
              <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY FAVORITE COURSES</Dropdown.Header>
                  <Dropdown.Divider />
                  {
                    // eslint-disable-next-line react/prop-types
                    menuAddedList.map((listItem) => (
                      <ExplorerMenuMobileItem
                        type={EXPLORER_TYPE.COURSES}
                        listItem={listItem}
                        key={listItem.item._id}
                        match={props.match}
                      />
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            )
            : ''}

          {(isType(EXPLORER_TYPE.OPPORTUNITIES, props.type) && isStudent) ?
            (
              <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY FAVORITE OPPORTUNITIES</Dropdown.Header>
                  <Dropdown.Divider />
                  {
                    menuAddedList.map((listItem) => (
                      <ExplorerMenuMobileItem
                        type={EXPLORER_TYPE.OPPORTUNITIES}
                        listItem={listItem}
                        key={listItem.item._id}
                        match={props.match}
                      />
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            )
            : ''}

          {/* Components renderable to STUDENTS and FACULTY. */}
          {isType(EXPLORER_TYPE.INTERESTS, props.type) ?
            (
              <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY FAVORITE INTERESTS</Dropdown.Header>
                  <Dropdown.Divider />
                  {
                    menuAddedList.map((listItem) => (
                      <ExplorerMenuMobileItem
                        type={EXPLORER_TYPE.INTERESTS}
                        listItem={listItem}
                        key={listItem.item._id}
                        match={props.match}
                      />
                    ))
                  }

                  <Dropdown.Header as="h4">SUGGESTED CAREER GOAL INTERESTS</Dropdown.Header>
                  <Dropdown.Divider />
                  {
                    menuCareerList.map((listItem) => (
                      <ExplorerMenuMobileItem
                        type={EXPLORER_TYPE.INTERESTS}
                        listItem={listItem}
                        key={listItem.item._id}
                        match={props.match}
                      />
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            )
            : ''}

          {isType(EXPLORER_TYPE.CAREERGOALS, props.type) ?
            (
              <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY FAVORITE CAREER GOALS</Dropdown.Header>
                  <Dropdown.Divider />
                  {
                    menuAddedList.map((listItem) => (
                      <ExplorerMenuMobileItem
                        type={EXPLORER_TYPE.CAREERGOALS}
                        listItem={listItem}
                        key={listItem.item._id}
                        match={props.match}
                      />
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            )
            : ''}
        </Media>
      </MediaContextProvider>
    </React.Fragment>
  );
};

export const CardExplorerMenuMobileWidgetContainer = withRouter(ExplorerMultipleItemsMenuMobileWidget);

export default CardExplorerMenuMobileWidgetContainer;

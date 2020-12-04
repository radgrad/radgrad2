import { createMedia } from '@artsy/fresnel';
import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import {
  IAcademicPlan,
  ICareerGoal,
  ICourse,
  IInterest,
  IOpportunity,
} from '../../../../../typings/radgrad';
import * as Router from '../../utilities/router';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import ExplorerMenuMobileItem from './ExplorerMenuMobileItem';

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

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IInterest | IOpportunity;

interface IExplorerMenuMobileWidgetProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList?: { item: IInterest, count: number }[] | undefined;
  // eslint-disable-next-line react/no-unused-prop-types
  type: 'plans' | 'career-goals' | 'courses' | 'interests' | 'opportunities' | 'users'; // TODO should this be a defined type?
}

const isType = (typeToCheck: string, props: IExplorerMenuMobileWidgetProps): boolean => {
  const { type } = props;
  return type === typeToCheck;
};

const ExplorerMenuMobileWidget: React.FC<IExplorerMenuMobileWidgetProps> = (props) => {
  const { menuAddedList, menuCareerList } = props;
  const match = useRouteMatch();
  const isStudent = Router.isUrlRoleStudent(match);
  return (
    <React.Fragment>
      <style>{mediaStyles}</style>
      <MediaContextProvider>
        <Media lessThan="tablet">
          {(isType(EXPLORER_TYPE.ACADEMICPLANS, props) && isStudent) ?
            (
              <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY FAVORITE ACADEMIC PLANS</Dropdown.Header>
                  <Dropdown.Divider />
                  {
                    menuAddedList.map((listItem) => (
                      <ExplorerMenuMobileItem
                        type={EXPLORER_TYPE.ACADEMICPLANS}
                        listItem={listItem}
                        key={listItem.item._id}
                      />
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            )
            : ''}

          {(isType(EXPLORER_TYPE.COURSES, props) && isStudent) ?
            (
              <React.Fragment>
                <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                  <Dropdown.Menu>
                    <Dropdown.Header as="h4">MY FAVORITE COURSES</Dropdown.Header>
                    <Dropdown.Divider />
                    {
                      menuAddedList.map((listItem) => (
                        <ExplorerMenuMobileItem
                          type={EXPLORER_TYPE.COURSES}
                          listItem={listItem}
                          key={listItem.item._id}
                        />
                      ))
                    }
                  </Dropdown.Menu>
                </Dropdown>
              </React.Fragment>
            )
            : ''}

          {isType(EXPLORER_TYPE.OPPORTUNITIES, props) ?
            (
              <React.Fragment>
                {isStudent ?
                  (
                    <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                      <Dropdown.Menu>
                        <Dropdown.Header as="h4">MY FAVORITE OPPORTUNITIES</Dropdown.Header>
                        <Dropdown.Divider />
                        {menuAddedList.map((listItem) => (
                          <ExplorerMenuMobileItem
                            type={EXPLORER_TYPE.OPPORTUNITIES}
                            listItem={listItem}
                            key={listItem.item._id}
                          />
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )
                  : ''}
              </React.Fragment>
            )
            : ''}

          {/* Components renderable to STUDENTS and FACULTY. */}
          {isType(EXPLORER_TYPE.INTERESTS, props) ?
            (
              <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY FAVORITE INTERESTS</Dropdown.Header>
                  <Dropdown.Divider />
                  {menuAddedList.map((listItem) => (
                    <ExplorerMenuMobileItem
                      type={EXPLORER_TYPE.INTERESTS}
                      listItem={listItem}
                      key={listItem.item._id}
                    />
                  ))}

                  <Dropdown.Header as="h4">SUGGESTED CAREER GOAL INTERESTS</Dropdown.Header>
                  <Dropdown.Divider />
                  {menuCareerList.map((listItem) => (
                    <ExplorerMenuMobileItem
                      type={EXPLORER_TYPE.INTERESTS}
                      listItem={listItem}
                      key={listItem.item._id}
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )
            : ''}

          {isType(EXPLORER_TYPE.CAREERGOALS, props) ?
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

export default ExplorerMenuMobileWidget;

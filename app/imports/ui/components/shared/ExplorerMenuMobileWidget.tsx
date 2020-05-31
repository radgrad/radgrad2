import React from 'react';
import { Dropdown, Responsive } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import {
  IAcademicPlan,
  ICareerGoal,
  ICourse,
  IDesiredDegree,
  IInterest,
  IOpportunity,
  IProfile,
} from '../../../typings/radgrad';
import { Users } from '../../../api/user/UserCollection';
import * as Router from './RouterHelperFunctions';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import ExplorerMenuMobileItem from './ExplorerMenuMobileItem';


type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

interface IExplorerMenuMobileWidgetProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList?: { item: IInterest, count: number }[] | undefined;
  type: 'plans' | 'career-goals' | 'courses' | 'degrees' | 'interests' | 'opportunities' | 'users';
  role: 'student' | 'faculty' | 'mentor';
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  profile: IProfile;
}

const isType = (typeToCheck: string, props: IExplorerMenuMobileWidgetProps): boolean => {
  const { type } = props;
  return type === typeToCheck;
};

const ExplorerMenuMobileWidget = (props: IExplorerMenuMobileWidgetProps) => {

  const { menuAddedList, menuCareerList } = props;
  const isStudent = Router.isUrlRoleStudent(props.match);
  return (
    <React.Fragment>
      <Responsive {...Responsive.onlyMobile}>
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
                      match={props.match}
                    />
                  ))
                }
              </Dropdown.Menu>
            </Dropdown>
          )
          : ''}

        {
          isType(EXPLORER_TYPE.COURSES, props) ? (
            <React.Fragment>
              {
                  isStudent ? (
                    <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                      <Dropdown.Menu>
                        <Dropdown.Header as="h4">FAVORITE COURSES</Dropdown.Header>
                        <Dropdown.Divider />
                        {
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
                    : ''
                }
            </React.Fragment>
            )
            : ''
        }

        {
          isType(EXPLORER_TYPE.OPPORTUNITIES, props) ? (
            <React.Fragment>
              {
                  isStudent ? (
                    <Dropdown className="selection" fluid text="Select Item" style={{ marginTop: '1rem' }}>
                      <Dropdown.Menu>
                        <Dropdown.Header as="h4">FAVORITE OPPORTUNITIES</Dropdown.Header>
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
                    : ''
                }
            </React.Fragment>
            )
            : ''
        }

        {/* Components renderable to STUDENTS, FACULTY, and MENTORS. */}
        {
          isType(EXPLORER_TYPE.INTERESTS, props) ? (
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
            : ''
        }

        {
          isType(EXPLORER_TYPE.CAREERGOALS, props) ? (
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
            : ''
        }
      </Responsive>
    </React.Fragment>
  );
};

export const ExplorerMenuMobileWidgetCon = withTracker((props) => {
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  return {
    profile,
  };
})(ExplorerMenuMobileWidget);
export const ExplorerMenuMobileWidgetContainer = withRouter(ExplorerMenuMobileWidgetCon);
export default ExplorerMenuMobileWidgetContainer;

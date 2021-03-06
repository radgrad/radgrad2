import React from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';

export interface AdminDataModeMenuProps {
  academicTermCount: number;
  academicYearCount: number;
  careerGoalCount: number;
  courseInstanceCount: number;
  courseCount: number;
  feedCount: number;
  interestCount: number;
  interestTypeCount: number;
  opportunityCount: number;
  opportunityInstanceCount: number;
  opportunityTypeCount: number;
  reviewCount: number;
  slugCount: number;
  teaserCount: number;
  usersCount: number;
  verificationRequestCount: number;
}

const AdminDataModelMenu: React.FC<AdminDataModeMenuProps> = ({
  academicTermCount,
  academicYearCount,
  careerGoalCount,
  courseCount,
  courseInstanceCount,
  feedCount,
  interestCount,
  interestTypeCount,
  opportunityCount,
  opportunityInstanceCount,
  opportunityTypeCount,
  reviewCount,
  slugCount,
  teaserCount,
  usersCount,
  verificationRequestCount,
}) => {
  const { username } = useParams();
  const baseUrl = useRouteMatch().url;
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/datamodel/`;
  // console.log(this.props, baseRoute);
  return (
    <Menu vertical text id="leftHandMenu">
      <Menu.Item id="data-model-academic-terms" as={NavLink} exact to={`${baseRoute}academic-terms`}>
        Academic Terms ({academicTermCount})
      </Menu.Item>
      <Menu.Item id="data-model-academic-year-instances" as={NavLink} exact to={`${baseRoute}academic-year-instances`}>
        Academic Year Instances ({academicYearCount})
      </Menu.Item>
      <Menu.Item id="data-model-career-goals" as={NavLink} exact to={`${baseRoute}careergoals`}>
        Career Goals ({careerGoalCount})
      </Menu.Item>
      <Menu.Item id="data-model-course-instances" as={NavLink} exact to={`${baseRoute}course-instances`}>
        Course Instances ({courseInstanceCount})
      </Menu.Item>
      <Menu.Item id="data-model-courses" as={NavLink} exact to={`${baseRoute}courses`}>
        Courses ({courseCount})
      </Menu.Item>
      <Menu.Item id="data-model-feeds" as={NavLink} exact to={`${baseRoute}feeds`}>
        Feeds ({feedCount})
      </Menu.Item>
      <Menu.Item id="data-model-interests" as={NavLink} exact to={`${baseRoute}interests`}>
        Interests ({interestCount})
      </Menu.Item>
      <Menu.Item id="data-model-interest-types" as={NavLink} exact to={`${baseRoute}interest-types`}>
        Interest Types ({interestTypeCount})
      </Menu.Item>
      <Menu.Item id="data-model-opportunities" as={NavLink} exact to={`${baseRoute}opportunities`}>
        Opportunities ({opportunityCount})
      </Menu.Item>
      <Menu.Item id="data-model-opportunity-instances" as={NavLink} exact to={`${baseRoute}opportunity-instances`}>
        Opportunity Instances ({opportunityInstanceCount})
      </Menu.Item>
      <Menu.Item id="data-model-opportunity-types" as={NavLink} exact to={`${baseRoute}opportunity-types`}>
        Opportunity Types ({opportunityTypeCount})
      </Menu.Item>
      <Menu.Item id="data-model-reviews" as={NavLink} exact to={`${baseRoute}reviews`}>
        Reviews ({reviewCount})
      </Menu.Item>
      <Menu.Item id="data-model-slugs" as={NavLink} exact to={`${baseRoute}slugs`}>
        Slugs ({slugCount})
      </Menu.Item>
      <Menu.Item id="data-model-teasers" as={NavLink} exact to={`${baseRoute}teasers`}>
        Teasers ({teaserCount})
      </Menu.Item>
      <Menu.Item id="data-model-users" as={NavLink} exact to={`${baseRoute}users`}>
        Users ({usersCount})
      </Menu.Item>
      <Menu.Item id="data-model-verification-requests" as={NavLink} exact to={`${baseRoute}verification-requests`}>
        Verification Requests ({verificationRequestCount})
      </Menu.Item>
    </Menu>
  );
};

export default AdminDataModelMenu;

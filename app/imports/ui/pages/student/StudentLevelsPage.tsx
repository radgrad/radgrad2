import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import React from 'react';
import { Grid, Tab } from 'semantic-ui-react';
import StudentLevelsWidget from '../../components/student/levels/StudentLevelsWidget';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { ROLE } from '../../../api/role/Role';
import PageLayout from '../PageLayout';
import StudentLevelExplainerWidget from '../../components/student/levels/StudentLevelExplainerWidget';
import RadGradSegment from '../../components/shared/RadGradSegment';
import RadGradHeader from '../../components/shared/RadGradHeader';

interface StudentLevelsPageProps {
  profile: StudentProfile;
  students: StudentProfile[];
  profiles: StudentProfile[];
}

const headerPaneTitle = 'From Grasshopper to Ninja';
const headerPaneBody = `
RadGrad helps you mark your progress with six Levels.

This page helps you learn about Levels and how to reach the next one from where you are now.
`;
const headerPaneImage = 'header-level.png';

const getStudentsAtSameLevel = (currentProfile: StudentProfile, profiles): StudentProfile[] => {
  const students = [];
  profiles.forEach((profile) => {
    if (profile.level === currentProfile.level) {
      if (profile.userID !== currentProfile.userID) {
        students.push(profile);
      }
    }
  });
  return students;
};


const header = <RadGradHeader title='ABOUT THE LEVELS' />;

const StudentLevelsPage: React.FC<StudentLevelsPageProps> = ({ profile, students, profiles }) => {
  const panes = [
    { menuItem: 'Level 1', render: () => <Tab.Pane><StudentLevelExplainerWidget level={1} students={profiles} /></Tab.Pane> },
    { menuItem: 'Level 2', render: () => <Tab.Pane><StudentLevelExplainerWidget level={2} students={profiles} /></Tab.Pane> },
    { menuItem: 'Level 3', render: () => <Tab.Pane><StudentLevelExplainerWidget level={3} students={profiles} /></Tab.Pane> },
    { menuItem: 'Level 4', render: () => <Tab.Pane><StudentLevelExplainerWidget level={4} students={profiles} /></Tab.Pane> },
    { menuItem: 'Level 5', render: () => <Tab.Pane><StudentLevelExplainerWidget level={5} students={profiles} /></Tab.Pane> },
    { menuItem: 'Level 6', render: () => <Tab.Pane><StudentLevelExplainerWidget level={6} students={profiles} /></Tab.Pane> },
  ];
  return (
    <PageLayout id="student-levels-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <StudentLevelsWidget profile={profile} students={students} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <RadGradSegment header={header}>
              <Tab panes={panes} />
            </RadGradSegment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

const StudentLevelsPageContainer = withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username) as StudentProfile;
  const profiles = Users.findProfilesWithRole(ROLE.STUDENT, {}, {});
  const students: StudentProfile[] = getStudentsAtSameLevel(profile, profiles);
  return {
    profile,
    students,
    profiles,
  };
})(StudentLevelsPage);

export default StudentLevelsPageContainer;


import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import React from 'react';
import { Grid, Tab } from 'semantic-ui-react';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import StudentLevelInfo from '../../components/student/levels/StudentLevelInfo';
import { StudentProfile } from '../../../typings/radgrad';
import PageLayout from '../PageLayout';
import StudentLevelExplainerWidget from '../../components/student/levels/StudentLevelExplainerWidget';
import RadGradSegment from '../../components/shared/RadGradSegment';
import RadGradHeader from '../../components/shared/RadGradHeader';

interface StudentLevelsPageProps {
  profile: StudentProfile;
  allProfiles: StudentProfile[];
}

const headerPaneTitle = 'From Grasshopper to Ninja';
const headerPaneBody = `
RadGrad helps you mark your progress with six Levels.

This page helps you learn about Levels and how to reach the next one from where you are now.
`;
const headerPaneImage = 'header-level.png';

const getStudentsAtLevel = (currentProfile, level: number, profiles = []): StudentProfile[] => {
  const students = [];
  profiles.forEach((profile) => {
    if (profile.level === level) {
      if (profile.userID !== currentProfile.userID) {
        students.push(profile);
      }
    }
  });
  return students;
};

const header = <RadGradHeader title='ABOUT THE LEVELS' />;

const StudentLevelsPage: React.FC<StudentLevelsPageProps> = ({ profile, allProfiles }) => {
  const sameLevelStudents = getStudentsAtLevel(profile, profile.level, allProfiles);
  const level1Students = getStudentsAtLevel(profile, 1, allProfiles);
  const level2Students = getStudentsAtLevel(profile, 2, allProfiles);
  const level3Students = getStudentsAtLevel(profile, 3, allProfiles);
  const level4Students = getStudentsAtLevel(profile, 4, allProfiles);
  const level5Students = getStudentsAtLevel(profile, 5, allProfiles);
  const level6Students = getStudentsAtLevel(profile, 6, allProfiles);
  const panes = [
    { menuItem: 'Level 1', render: () => <Tab.Pane><StudentLevelExplainerWidget level={1} students={level1Students} /></Tab.Pane> },
    { menuItem: 'Level 2', render: () => <Tab.Pane><StudentLevelExplainerWidget level={2} students={level2Students} /></Tab.Pane> },
    { menuItem: 'Level 3', render: () => <Tab.Pane><StudentLevelExplainerWidget level={3} students={level3Students} /></Tab.Pane> },
    { menuItem: 'Level 4', render: () => <Tab.Pane><StudentLevelExplainerWidget level={4} students={level4Students} /></Tab.Pane> },
    { menuItem: 'Level 5', render: () => <Tab.Pane><StudentLevelExplainerWidget level={5} students={level5Students} /></Tab.Pane> },
    { menuItem: 'Level 6', render: () => <Tab.Pane><StudentLevelExplainerWidget level={6} students={level6Students} /></Tab.Pane> },
  ];
  return (
    <PageLayout id="student-levels-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <StudentLevelInfo profile={profile} students={sameLevelStudents} />
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
  const profile = StudentProfiles.getProfile(username);
  const allProfiles = StudentProfiles.find().fetch();
  return {
    profile,
    allProfiles,
  };
})(StudentLevelsPage);

export default StudentLevelsPageContainer;


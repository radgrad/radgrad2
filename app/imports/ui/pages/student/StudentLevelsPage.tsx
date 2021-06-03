import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import AllLevelsInfo from '../../components/student/levels/AllLevelsInfo';
import StudentLevelInfo from '../../components/student/levels/StudentLevelInfo';
import { StudentProfile } from '../../../typings/radgrad';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

interface StudentLevelsPageProps {
  profile: StudentProfile;
  allProfiles: StudentProfile[];
}

const headerPaneTitle = 'From Grasshopper to Ninja';
const headerPaneBody = `
RadGrad helps you mark your progress with six Levels.

This page helps you learn about Levels and how to reach the next one from where you are now.
`;
const headerPaneImage = 'images/header-panel/header-level.png';

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

const StudentLevelsPage: React.FC<StudentLevelsPageProps> = ({ profile, allProfiles }) => {
  const sameLevelStudents = getStudentsAtLevel(profile, profile.level, allProfiles);

  return (
    <PageLayout id={PAGEIDS.STUDENT_LEVELS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <StudentLevelInfo profile={profile} students={sameLevelStudents} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <AllLevelsInfo profile={profile} allProfiles={allProfiles} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

export default withTracker(() => {
  const { username } = useParams();
  const profile = StudentProfiles.getProfile(username);
  const allProfiles = StudentProfiles.find().fetch();
  return {
    profile,
    allProfiles,
  };
})(StudentLevelsPage);


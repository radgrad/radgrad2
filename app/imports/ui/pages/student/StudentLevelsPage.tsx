import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import React from 'react';
import { Grid, Segment, Divider } from 'semantic-ui-react';
import StudentLevelsWidget from '../../components/student/levels/StudentLevelsWidget';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { ROLE } from '../../../api/role/Role';
import PageLayout from '../PageLayout';
import StudentLevelExplainerWidget from '../../components/student/levels/StudentLevelExplainerWidget';

interface StudentLevelsPageProps {
  profile: StudentProfile;
  students: StudentProfile[];
}

const headerPaneTitle = 'From Grasshopper to Ninja';
const headerPaneBody = `
RadGrad helps you mark your progress with six Levels.

This page helps you learn about Levels and how to reach the next one from where you are now.
`;
const headerPaneImage = 'header-level.png';
let profiles = [];

const getStudentsAtSameLevel = (currentProfile: StudentProfile): StudentProfile[] => {
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




const StudentLevelsPage: React.FC<StudentLevelsPageProps> = ({ profile, students }) => (
    <PageLayout id="student-levels-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
        <Grid stackable>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Grid stackable columns="equal">
                        <Grid.Column stretched>
                            <StudentLevelsWidget profile={profile} students={students} />
                        </Grid.Column>
                    </Grid>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16} divided>
                    <Segment>
                        <StudentLevelExplainerWidget level={1} students={profiles}/>
                        <Divider />
                        <StudentLevelExplainerWidget level={2} students={profiles}/>
                        <Divider />
                        <StudentLevelExplainerWidget level={3} students={profiles}/>
                        <Divider />
                        <StudentLevelExplainerWidget level={4} students={profiles}/>
                        <Divider/>
                        <StudentLevelExplainerWidget level={5} students={profiles}/>
                        <Divider/>
                        <StudentLevelExplainerWidget level={6} students={profiles}/>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </PageLayout>
);
const StudentLevelsPageContainer = withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username) as StudentProfile;
  profiles = Users.findProfilesWithRole(ROLE.STUDENT, {}, {});
  const students: StudentProfile[] = getStudentsAtSameLevel(profile);
  return {
    profile,
    students,
  };
})(StudentLevelsPage);

export default StudentLevelsPageContainer;

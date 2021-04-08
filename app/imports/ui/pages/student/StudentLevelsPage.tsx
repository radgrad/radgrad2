import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import React from 'react';
import {Grid, Card, Image, Header, Icon} from 'semantic-ui-react';
import _ from 'lodash';
import {log} from 'util';
import StudentLevelsWidget from '../../components/student/levels/StudentLevelsWidget';
import StudentLevelsOthersWidget from '../../components/student/levels/StudentLevelsOthersWidget';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { ROLE } from '../../../api/role/Role';
import PageLayout from '../PageLayout';

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

const getStudentsAtSameLevel = (profiles, currentProfile: StudentProfile): StudentProfile[] => {
  const students = [];
  _.forEach(profiles, (profile) => {
    if (profile.level === currentProfile.level) {
      if (profile.userID !== currentProfile.userID) {
        students.push(profile);
      }
    }
  });
  return students;
};

const getStudentsAtLevel = (profiles, level) => {
  const students = [];
  _.forEach(profiles, (profile) => {
    if (profile.level === level) {
      students.push(profile);
    }
  });
  return students.length;
};


const StudentLevelsPage: React.FC<StudentLevelsPageProps> = ({ profile, students }) => {
  console.log(students);
  console.log(StudentProfiles);
  console.log(profiles);
    console.log(profile);
  return (
    <PageLayout id="student-levels-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
        <Grid stackable>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Grid stackable columns="equal">
                        <Grid.Column stretched>
                            <StudentLevelsWidget profile={profile} students={students} />
                            {/*<StudentLevelsOthersWidget students={students} profile={profile} />*/}
                        </Grid.Column>
                        {/*<Grid.Column stretched>*/}
                        {/*    /!*<StudentLevelsOthersWidget students={students} profile={profile} />*!/*/}
                        {/*</Grid.Column>*/}
                    </Grid>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={1}>
                        <Card>
                            <Card.Content>
                                <Grid >
                                    <Grid.Row>
                                        <Grid.Column width={2}>
                                            <div style={{textAlign:'center'}}>
                                                <Image floated="left" size="small" src="/images/level-icons/radgrad-level-1-icon.png" />
                                                <Header as='h2' color='grey'>GRAY</Header>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={10}>
                                            <Header as='h2' color='grey'>LEVEL 1</Header>
                                            <Card.Description>
                                                You begin your RadGrad experience at Level 1, and you will receive this laptop sticker when you first sign up for RadGrad with your advisor.{' '}
                                                <em>&quot;A journey of a thousand miles begins with a single step&quot; -- Lao Tzu</em>
                                                <Header as='h3' color='grey' style={{paddingTop: '9%'}}><Icon name='user circle'/> {getStudentsAtLevel(profiles,1)} Students at Level 1</Header>
                                            </Card.Description>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Grid >
                                    <Grid.Row>
                                        <Grid.Column width={2}>
                                            <div style={{textAlign:'center'}}>
                                                <Image floated="left" size="small" src="/images/level-icons/radgrad-level-2-icon.png" />
                                                <Header as='h2' color='yellow'>YELLOW</Header>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={10}>
                                            <Header as='h2' color='grey'>LEVEL 2</Header>
                                            <Card.Description>
                                                Successfully finish your first academic term of ICS coursework. Then meet with your advisor and ask him/her to update RadGrad with your current STAR data. That should bring you to Level 2, and earn you the Level 2 laptop
                                                sticker.
                                                <Header as='h3' color='grey' style={{paddingTop: '11%'}}><Icon name='user circle'/> {getStudentsAtLevel(profiles,2)} Students at Level 2</Header>
                                            </Card.Description>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Grid >
                                    <Grid.Row>
                                        <Grid.Column width={2}>
                                            <div style={{textAlign:'center'}}>
                                                <Image floated="left" size="small" src="/images/level-icons/radgrad-level-3-icon.png" />
                                                <Header as='h2' color='green'>GREEN</Header>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={10}>
                                            <Header as='h2' color='grey'>LEVEL 3</Header>
                                            <Card.Description>
                                                With any luck, you&apos;ll achieve Level 3 after you complete your second academic term of ICS coursework, as long as your grades are good. As before, meet with your Advisor to update RadGrad with your current STAR data,
                                                and if the system shows you&apos;ve gotten to Level 3, you&apos;ll get your Green laptop sticker.
                                                <Header as='h3' color='grey' style={{paddingTop: '10%'}}><Icon name='user circle'/> {getStudentsAtLevel(profiles,3)} Students at Level 3</Header>
                                            </Card.Description>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                {/* <Card.Header>LEVEL 3</Card.Header> */}
                                {/* <Card.Meta>GREEN</Card.Meta> */}
                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Grid >
                                    <Grid.Row>
                                        <Grid.Column width={2}>
                                            <div style={{textAlign:'center'}}>
                                                <Image floated="left" size="small" src="/images/level-icons/radgrad-level-4-icon.png" />
                                                <Header as='h2' color='blue'>BLUE</Header>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={10}>
                                            <Header as='h2' color='grey'>LEVEL 4</Header>
                                            <Card.Description>
                                                ICS has a &quot;core curriculum&quot;, and Level 4 students have not only finished it, but they have also thought beyond mere competency. Once your current STAR data is in RadGrad, and you&apos;ve achieved some verified
                                                opportunities, you might just find yourself at Level 4! Meet with your advisor to pick up your sticker, and bask in the glory it will bring to you!
                                                <Header as='h3' color='grey' style={{paddingTop: '10%'}}><Icon name='user circle'/> {getStudentsAtLevel(profiles,4)} Students at Level 4</Header>
                                            </Card.Description>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                {/* <Card.Header>LEVEL 4</Card.Header> */}
                                {/* <Card.Meta>BLUE</Card.Meta> */}

                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Grid >
                                    <Grid.Row>
                                        <Grid.Column width={2}>
                                            <div style={{textAlign:'center'}}>
                                                <Image floated="left" size="small" src="/images/level-icons/radgrad-level-5-icon.png" />
                                                <Header as='h2' color='brown'>BROWN</Header>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={10}>
                                            <Header as='h2' color='grey'>LEVEL 5</Header>
                                            <Card.Description>
                                                Level 5 students are far along in their degree program, and they&apos;ve made significant progress toward 100 verified points in each of the three ICE categories. You will probably be at least a Junior before Level 5
                                                becomes a realistic option for you. Keep your STAR data current in RadGrad, make sure your opportunities are verified, and good luck! Some students might graduate before reaching Level 5, so try to be one of the few that
                                                make it all the way to here!
                                                <Header as='h3' color='grey' style={{paddingTop: '10%'}}><Icon name='user circle'/> {getStudentsAtLevel(profiles,5)} Students at Level 5</Header>
                                            </Card.Description>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                {/* <Card.Header>LEVEL 5</Card.Header> */}
                                {/* <Card.Meta>BROWN</Card.Meta> */}
                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Grid >
                                    <Grid.Row>
                                        <Grid.Column width={2}>
                                            <div style={{textAlign:'center'}}>
                                                <Image floated="left" size="small" src="/images/level-icons/radgrad-level-6-icon.png" />
                                                <Header as='h2' color='black'>BLACK</Header>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={10}>
                                            <Header as='h2' color='grey'>LEVEL 6</Header>
                                            <Card.Description>
                                                If you achieve Level 6, you are truly one of the elite ICS students, and you will have demonstrated excellent preparation for entering the workforce, or going on to Graduate School, whichever you prefer. Congratulations!
                                                Note that in addition to fulfilling the ICE requirements, you&apos;ll also need to &quot;pay it forward&quot; to the RadGrad community in order to obtain your Black RadGrad laptop sticker.
                                                <Header as='h3' color='grey' style={{paddingTop: '10%'}}><Icon name='user circle'/> {getStudentsAtLevel(profiles,6)} Students at Level 6</Header>
                                            </Card.Description>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                </Grid.Column>
            </Grid.Row>

        </Grid>
    </PageLayout>
  );
};
const StudentLevelsPageContainer = withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username) as StudentProfile;
  profiles = Users.findProfilesWithRole(ROLE.STUDENT, {}, {});
  const students: StudentProfile[] = getStudentsAtSameLevel(profiles, profile);
  return {
    profile,
    students,
  };
})(StudentLevelsPage);

export default StudentLevelsPageContainer;

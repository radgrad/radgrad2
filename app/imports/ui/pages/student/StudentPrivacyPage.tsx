import moment from 'moment';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Icon, Segment, Form, Button } from 'semantic-ui-react';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../api/role/Role';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile, StudentProfileUpdate } from '../../../typings/radgrad';
import ProfileCard from '../../components/shared/profile/ProfileCard';
import UserLabel from '../../components/shared/profile/UserLabel';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Control what others see about you';
const headerPaneBody = `
This page allows you to control what aspects of your profile are visible to other RadGrad community members.

Providing access to information about your profile allows RadGrad to help you find similarly minded community members. You can opt-in or opt-out at any time.
`;
const headerPaneImage = 'header-privacy.png';

interface StudentPrivacyPageProps {
  profile: StudentProfile;
}

const StudentPrivacyPage: React.FC<StudentPrivacyPageProps> = ({ profile }) => {
  const [profileState, setProfileState] = useState<StudentProfile>(profile);
  const name = `${profile.firstName} ${profile.lastName}`;
  return (
    <PageLayout id="student-privacy-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>

      <Grid stackable>
          <Grid.Column width={4}>
            <Segment>
              <Header dividing><Icon name="eye"/> VISIBILITY</Header>
              <Form>
                <Form.Checkbox inline label="Picture" checked={profileState.sharePicture}/>
                <Form.Checkbox inline label="Website" checked={profileState.shareWebsite}/>
                <Form.Checkbox inline label="Interests" checked={profileState.shareInterests}/>
                <Form.Checkbox inline label="Career Goals" checked={profileState.shareCareerGoals}/>
                <Form.Checkbox inline label="Opportunities" checked={profileState.shareOpportunities}/>
                <Form.Checkbox inline label="Courses" checked={profileState.shareCourses}/>
                <Form.Checkbox inline label="Level" checked={profileState.shareLevel}/>
                <Form.Checkbox inline label="ICE" checked={profileState.shareICE}/>
                <Button type='submit'>Save</Button>
              </Form>
            </Segment>
          </Grid.Column>
          <Grid.Column width={12}>
            <Segment>
              <Header dividing><Icon name="user"/> PUBLIC PROFILE</Header>
              <UserLabel username={profile.username} />
              <ProfileCard email={profileState.username} name={name} careerGoals={profileState.careerGoals} interests={profileState.interests} courses={data.courses} ice={data.ice} image={data.picture} level={data.level} opportunities={data.opportunities} website={data.website} key={username} fluid={fluid}/>
            </Segment>
          </Grid.Column>
      </Grid>

    </PageLayout>
  );
};


export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username) as StudentProfile;
  if (profile.role === ROLE.STUDENT) {
    const lastVisited = moment().format('YYYY-MM-DD');
    if (lastVisited !== profile.lastVisitedPrivacy) {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = profile._id;
      updateData.lastVisitedPrivacy = lastVisited;
      updateMethod.call({ collectionName, updateData }, (error, result) => {
        if (error) {
          console.error('Error updating StudentProfile', collectionName, updateData, error);
        }
      });
    }
  }
  return {
    profile,
  };
})(StudentPrivacyPage);

import moment from 'moment';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Header, Icon, Segment, Form } from 'semantic-ui-react';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../api/role/Role';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { getPublicProfileData, PublicProfileData } from '../../../api/user/StudentProfileCollection.methods';
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

interface CheckboxState {
  sharePicture: boolean;
  shareWebsite: boolean;
  shareInterests: boolean;
  shareCareerGoals: boolean;
  shareOpportunities: boolean;
  shareCourses: boolean;
  shareLevel: boolean;
  shareICE: boolean;
}

// TODO:
// updatePublicProfile method will set a share field and return the new object.
// We need to:
// Like the UserProfileCard, get the data upon entry and display the card.
// We also need a stateful data object that holds the checklist button state. It's initialized upon entry from the profile.
// Use the new Meteor method to update that profile data object and the checklist data object when the user toggles a button.

const StudentPrivacyPage: React.FC<StudentPrivacyPageProps> = ({ profile }) => {
  // data will hold the public profile data for display in the <ProfileCard> when rendered.
  const [data, setData] = useState<PublicProfileData>({});
  // fetched is used to ensure that we only initialize the public profile data once.
  const [fetched, setFetched] = useState(false);
  // this useEffect is used to get the public profile data once when the page is first rendered.
  useEffect(() => {
    function fetchData() {
      getPublicProfileData.callPromise({ username: profile.username })
        .then(result => setData(result))
        .catch(error => { console.error(error); setData({});});
    }
    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  });
  const [checkboxState, setCheckboxState] = useState<CheckboxState>({sharePicture: profile.sharePicture, shareCareerGoals: profile.shareCareerGoals, shareCourses: profile.shareCourses, shareICE: profile.shareICE, shareInterests: profile.shareInterests, shareLevel: profile.shareLevel, shareOpportunities: profile.shareOpportunities, shareWebsite: profile.shareWebsite });
  const name = `${profile.firstName} ${profile.lastName}`;

  /* Update the checkboxState object whenever the user clicks a check box. */
  const handleCheckboxChange = (event, eventData) => {
    const updatedCheckboxState = _.create({}, checkboxState);
    updatedCheckboxState[eventData.name] = eventData.checked;
    setCheckboxState(updatedCheckboxState);
  };

  return (
    <PageLayout id="student-privacy-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>

      <Grid stackable>
          <Grid.Column width={4}>
            <Segment>
              <Header dividing><Icon name="eye"/> VISIBILITY</Header>
              <p>Control what data appears in your UserLabel and UserProfile:</p>
              <Form>
                <Form.Checkbox inline name="sharePicture" label="Picture" checked={checkboxState.sharePicture} onChange={handleCheckboxChange}/>
                <Form.Checkbox inline name="shareWebsite" label="Website" checked={checkboxState.shareWebsite} onChange={handleCheckboxChange}/>
                <Form.Checkbox inline name="shareInterests" label="Interests" checked={checkboxState.shareInterests} onChange={handleCheckboxChange}/>
                <Form.Checkbox inline name="shareCareerGoals" label="Career Goals" checked={checkboxState.shareCareerGoals} onChange={handleCheckboxChange}/>
                <Form.Checkbox inline name="shareOpportunities" label="Opportunities" checked={checkboxState.shareOpportunities} onChange={handleCheckboxChange}/>
                <Form.Checkbox inline name="shareCourses" label="Courses" checked={checkboxState.shareCourses} onChange={handleCheckboxChange}/>
                <Form.Checkbox inline name="shareLevel" label="Level" checked={checkboxState.shareLevel} onChange={handleCheckboxChange}/>
                <Form.Checkbox inline name="shareICE" label="ICE" checked={checkboxState.shareICE} onChange={handleCheckboxChange}/>
              </Form>
            </Segment>
          </Grid.Column>
          <Grid.Column width={12}>
            <Segment>
              <Header dividing><Icon name="user"/> PUBLIC PROFILE</Header>
              <p>This is your UserLabel which appears in pages matching your interests or other profile characteristics: </p>
              <UserLabel username={profile.username} />
              <p style={{paddingTop: '20px'}}>This is your UserProfile which pops up when a user clicks on your UserLabel: </p>
              <ProfileCard email={profile.username} name={name} careerGoals={data.careerGoals} interests={data.interests} courses={data.courses} ice={data.ice} image={data.picture} level={data.level} opportunities={data.opportunities} website={data.website} key={profile.username} fluid/>
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

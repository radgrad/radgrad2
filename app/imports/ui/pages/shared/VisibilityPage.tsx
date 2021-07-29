import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Form, Grid, Segment } from 'semantic-ui-react';
import {
  getPublicProfileData,
  PublicProfileData,
  setPublicProfileData,
} from '../../../api/user/StudentProfileCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import { AdvisorOrFacultyProfile, StudentProfile } from '../../../typings/radgrad';
import { SetPictureButton } from '../../components/shared/privacy/SetPictureButton';
import { SetWebsiteButton } from '../../components/shared/privacy/SetWebsiteButton';
import ProfileCard from '../../components/shared/profile/ProfileCard';
import ProfileLabel from '../../components/shared/profile/ProfileLabel';
import RadGradHeader from '../../components/shared/RadGradHeader';
import { COMPONENTIDS } from '../../utilities/ComponentIDs';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

// Technical Debt: Refactor this page with StudentVisibilityPage.

const headerPaneTitle = 'Specify your profile visibility';
const headerPaneBody = `
This page allows you to set your profile information and make it available to RadGrad community members.  

As faculty, admin, or advisor, it is useful to both fill out your profile and make it available. This makes it easier for students with similar interests to find you. 
`;
const headerPaneImage = 'images/header-panel/header-privacy.png';

interface VisibilityPageProps {
  profile: AdvisorOrFacultyProfile | StudentProfile;
}

interface CheckboxState {
  sharePicture: boolean;
  shareWebsite: boolean;
  shareInterests: boolean;
  shareCareerGoals: boolean;
  shareCourses: boolean;
  shareOpportunities: boolean;
}

const VisibilityPage: React.FC<VisibilityPageProps> = ({ profile }) => {
  // data will hold the public profile data for display in the <ProfileCard> when rendered.
  const [data, setData] = useState<PublicProfileData>({});
  // fetched is used to ensure that we only initialize the public profile data once.
  const [fetched, setFetched] = useState(false);
  // this useEffect is used to get the public profile data once when the page is first rendered.
  useEffect(() => {
    function fetchData() {
      // console.log('check for infinite loop');
      getPublicProfileData.callPromise({ username: profile.username })
        .then(result => setData(result))
        .catch(error => {
          console.error(error);
          setData({});
        });
    }

    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched, profile.username]);
  // checkboxState is an object containing booleans to indicate which fields are public, and thus which checkboxes should be checked.
  // It's initialized from the profile, then updated by the onClick handler (handleCheckboxChange).
  const [checkboxState, setCheckboxState] = useState<CheckboxState>({
    sharePicture: profile.sharePicture,
    shareCareerGoals: profile.shareCareerGoals,
    shareInterests: profile.shareInterests,
    shareWebsite: profile.shareWebsite,
    shareCourses: profile.shareCourses,
    shareOpportunities: profile.shareOpportunities,
  });
  const name = `${profile.firstName} ${profile.lastName}`;
  /*
   * Update the checkboxState object whenever the user clicks a check box,
   * then run a Meteor Method to update the user's profile and return the updated public profile data which refreshes the displayed card.
   */
  const handleCheckboxChange = (event, eventData) => {
    const updatedCheckboxState = _.create({}, checkboxState);
    updatedCheckboxState[eventData.name] = eventData.checked;
    setCheckboxState(updatedCheckboxState);
    setPublicProfileData.callPromise({ username: profile.username, fieldName: eventData.name, fieldValue: eventData.checked })
      .then(result => setData(result))
      .catch(error => {
        console.error(error);
      });
  };

  // Keep track of whether the user has specified a website and/or picture. Those checkboxes are readonly when those fields are empty.
  const [websiteExists, setWebsiteExists] = useState(!!profile.website);
  const [pictureExists, setPictureExists] = useState(!!profile.picture);

  const handleWebsiteChange = (newWebsiteURL) => {
    setPublicProfileData.callPromise({ username: profile.username, fieldName: 'website', fieldValue: newWebsiteURL })
      .then(result => {setData(result); setWebsiteExists(!!newWebsiteURL); })
      .catch(error => { console.error(error); });
  };

  const handlePictureChange = (newPictureURL) => {
    setPublicProfileData.callPromise({ username: profile.username, fieldName: 'picture', fieldValue: newPictureURL })
      .then(result => {setData(result); setPictureExists(!!newPictureURL); })
      .catch(error => { console.error(error); });
  };
  return (<PageLayout id={PAGEIDS.VISIBILITY} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
    headerPaneImage={headerPaneImage}>
    <Grid stackable>
      <Grid.Column width={4}>
        <Segment>
          <RadGradHeader title='visibility' icon='eye' dividing />
          <p>Control what data appears in your Label and Profile:</p>
          <Form>
            <Form.Group inline>
              <Form.Checkbox inline id={COMPONENTIDS.SHARE_PICTURE} name="sharePicture" label="Picture" checked={pictureExists && checkboxState.sharePicture} onChange={handleCheckboxChange} />
              <SetPictureButton picture={data.picture} handleChange={handlePictureChange}/>
            </Form.Group>
            <Form.Group inline>
              <Form.Checkbox id={COMPONENTIDS.SHARE_WEBSITE} inline name="shareWebsite" label="Website" checked={websiteExists && checkboxState.shareWebsite} onChange={handleCheckboxChange} />
              <SetWebsiteButton website={data.website} handleChange={handleWebsiteChange} />
            </Form.Group>
            <Form.Checkbox id={COMPONENTIDS.SHARE_INTERESTS} inline name="shareInterests" label="Interests" checked={checkboxState.shareInterests} onChange={handleCheckboxChange} />
            <Form.Checkbox id={COMPONENTIDS.SHARE_CAREER_GOALS} inline name="shareCareerGoals" label="Careers" checked={checkboxState.shareCareerGoals} onChange={handleCheckboxChange} />
            <Form.Checkbox id={COMPONENTIDS.SHARE_COURSES} inline name="shareCourses" label="Courses" checked={checkboxState.shareCourses} onChange={handleCheckboxChange} />
            <Form.Checkbox id={COMPONENTIDS.SHARE_OPPORTUNITIES} inline name="shareOpportunities" label="Opportunities" checked={checkboxState.shareOpportunities} onChange={handleCheckboxChange} />
          </Form>
        </Segment>
      </Grid.Column>
      <Grid.Column width={12}>
        <Segment>
          <RadGradHeader title='your label' icon='user' dividing />
          <p>Your Label appears in pages relevant to your public data: </p>
          <ProfileLabel name={name} image={checkboxState.sharePicture && data.picture} />
        </Segment>
        <Segment>
          <RadGradHeader title='your profile' icon='user' dividing />
          <p>Your Profile pops up when a user clicks on your Label: </p>
          <ProfileCard email={profile.username} name={name} careerGoals={data.careerGoals} interests={data.interests} courses={data.courses} ice={data.ice} image={data.picture} level={data.level} opportunities={data.opportunities}
            website={data.website} key={profile.username} fluid />
        </Segment>
      </Grid.Column>
    </Grid>
  </PageLayout>);
};

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username) as StudentProfile;
  return {
    profile,
  };
})(VisibilityPage);

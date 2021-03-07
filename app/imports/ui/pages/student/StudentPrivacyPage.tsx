import moment from 'moment';
import React from 'react';
import {Header} from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../api/role/Role';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfileUpdate } from '../../../typings/radgrad';
import PageLayout from '../PageLayout';
import ProfileLabel from '../../components/profile/ProfileLabel';

const headerPaneTitle = 'Control what others see about you';
const headerPaneBody = `
This page allows you to control what aspects of your profile are visible to other RadGrad community members.

Providing access to information about your profile allows RadGrad to help you find similarly minded community members. You can opt-in or opt-out at any time.
`;
const headerPaneImage = 'header-privacy.png';


const StudentPrivacyPage: React.FC = () => {
  const image = 'https://philipmjohnson.github.io/images/philip2.jpeg';
  const name = 'Philip Johnson';
  return (
    <PageLayout id="student-privacy-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Header>Student Privacy Page Placeholder</Header>
      <ProfileLabel image={image} name={name} level={1} />
      <ProfileLabel image={image} name={name} level={2} />
      <ProfileLabel image={image} name={name} level={3} />
      <ProfileLabel image={image} name={name} level={4} />
      <ProfileLabel image={image} name={name} level={5} />
      <ProfileLabel image={image} name={name} level={6} />
    </PageLayout>
  );
}


export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
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
})(StudentPrivacyPage);

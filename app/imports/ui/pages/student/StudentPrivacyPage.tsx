import moment from 'moment';
import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROLE } from '../../../api/role/Role';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile, StudentProfileUpdate } from '../../../typings/radgrad';
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
  const message = 'Privacy page';
  return (
    <PageLayout id="student-privacy-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>

      {message}

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

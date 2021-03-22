import React from 'react';
import { Icon, Label, SemanticSIZES } from 'semantic-ui-react';
import { StudentProfile } from '../../../typings/radgrad';

interface StudentPrivacySettingListProps {
  profile: StudentProfile;
  size: SemanticSIZES;
}

const StudentPrivacySettingList: React.FC<StudentPrivacySettingListProps> = ({ profile, size }) => {
  const share = [];
  const hide = [];
  if (profile.shareCareerGoals) {
    share.push('Career Goals');
  } else {
    hide.push('Career Goals');
  }
  if (profile.shareCourses) {
    share.push('Courses');
  } else {
    hide.push('Courses');
  }
  if (profile.shareInterests) {
    share.push('Interests');
  } else {
    hide.push('Interests');
  }
  if (profile.shareLevel) {
    share.push('Level');
  } else {
    hide.push('Level');
  }
  if (profile.shareICE) {
    share.push('ICE');
  } else {
    hide.push('ICE');
  }
  if (profile.shareOpportunities) {
    share.push('Opportunities');
  } else {
    hide.push('Opportunities');
  }
  if (profile.sharePicture) {
    share.push('Picture');
  } else {
    hide.push('Picture');
  }

  return (
    <Label.Group size={size}>
      {share.map((label) => <Label key={label}><Icon name="share"/>{label}</Label>)}
      {hide.map((label) => <Label key={label} color='red'><Icon name="hide"/>{label}</Label>)}
    </Label.Group>
  );
};

export default StudentPrivacySettingList;

import React from 'react';
import { Icon, Label, SemanticSIZES } from 'semantic-ui-react';
import { ROLE } from '../../../api/role/Role';
import { StudentProfile } from '../../../typings/radgrad';

interface StudentVisibilitySettingListProps {
  profile: StudentProfile;
  size: SemanticSIZES;
}

const VisibilitySettingList: React.FC<StudentVisibilitySettingListProps> = ({ profile, size }) => {
  const share = [];
  const hide = [];
  profile.shareCareerGoals ? share.push('Career Goals') : hide.push('Career Goals');
  profile.shareInterests ? share.push('Interests') : hide.push('Interests');
  profile.sharePicture ? share.push('Picture') : hide.push('Picture');
  profile.shareWebsite ? share.push('Website') : hide.push('Website');
  if (profile.role === ROLE.STUDENT) {
    profile.shareCourses ? share.push('Courses') : hide.push('Courses');
    profile.shareOpportunities ? share.push('Opportunities') : hide.push('Opportunities');
    profile.shareICE ? share.push('ICE') : hide.push('ICE');
    profile.shareLevel ? share.push('Level') : hide.push('Level');
  }
  if (profile.role === ROLE.ADVISOR || profile.role === ROLE.FACULTY) {
    profile.shareCourses ? share.push('Courses') : hide.push('Courses');
    profile.shareOpportunities ? share.push('Opportunities') : hide.push('Opportunities');
  }

  return (
    <Label.Group size={size}>
      {share.map((label) => <Label key={label}><Icon name="share"/>{label}</Label>)}
      {hide.map((label) => <Label key={label} color='red'><Icon name="hide"/>{label}</Label>)}
    </Label.Group>
  );
};

export default VisibilitySettingList;

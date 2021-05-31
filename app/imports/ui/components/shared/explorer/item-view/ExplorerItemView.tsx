import React from 'react';
import { Segment, SegmentGroup } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { ROLE } from '../../../../../api/role/Role';
import { CareerGoal, Course, Interest, InterestType, Opportunity, Profile } from '../../../../../typings/radgrad';
import EditCareerGoalButton from '../../manage/career-goal/EditCareerGoalButton';
import DeleteItemButton from '../../manage/DeleteItemButton';
import EditInterestButton from '../../manage/interest/EditInterestButton';
import ExplorerProfiles from './ExplorerProfiles';
import { Teasers } from '../../../../../api/teaser/TeaserCollection';
import TeaserVideo from '../../TeaserVideo';
import { EXPLORER_TYPE } from '../../../../utilities/ExplorerUtils';
import { PROFILE_ENTRY_TYPE } from '../../../../../api/user/profile-entries/ProfileEntryTypes';

interface ExplorerItemViewProps {
  profile: Profile;
  item: Interest | CareerGoal;
  opportunities: Opportunity[];
  courses: Course[];
  explorerType: EXPLORER_TYPE;
  interestTypes?: InterestType[];
  interests: Interest[];
}

const ExplorerItemView: React.FC<ExplorerItemViewProps> = ({ profile, item, courses, opportunities, explorerType, interestTypes, interests }) => {
  const teaser = Teasers.findNonRetired({ targetSlugID: item.slugID });
  const hasTeaser = teaser.length > 0;
  const isNotStudent = profile.role !== ROLE.STUDENT;
  const isAdmin = profile.role === ROLE.ADMIN;
  let editButton;
  let itemType;
  switch (explorerType) {
    case EXPLORER_TYPE.CAREERGOALS:
      editButton = <EditCareerGoalButton careerGoal={item as CareerGoal} interests={interests} />;
      itemType = PROFILE_ENTRY_TYPE.CAREERGOAL;
      break;
    case EXPLORER_TYPE.INTERESTS:
      editButton = <EditInterestButton interest={item as Interest} interestTypes={interestTypes} />;
      itemType = PROFILE_ENTRY_TYPE.INTEREST;
      break;
  }
  return (
    <div id="explorerItemViewWidget">
      <SegmentGroup>
        <Segment>
          {hasTeaser ? (<TeaserVideo id={teaser && teaser[0] && teaser[0].url} />) : ''}
          <Markdown escapeHtml source={item.description} />
          {isNotStudent ? editButton : ''}
          {isAdmin ? <DeleteItemButton item={item} type={itemType} /> : ''}
        </Segment>
        <ExplorerProfiles item={item} explorerType={explorerType}/>
      </SegmentGroup>
    </div>
  );
};

export default ExplorerItemView;

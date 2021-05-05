import React from 'react';
import { Segment, SegmentGroup } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { ROLE } from '../../../../../api/role/Role';
import { CareerGoal, Course, Interest, InterestType, Opportunity, Profile } from '../../../../../typings/radgrad';
import EditInterestButton from '../../manage/interest/EditInterestButton';
import ExplorerProfiles from './ExplorerProfiles';
import { Teasers } from '../../../../../api/teaser/TeaserCollection';
import TeaserVideo from '../../TeaserVideo';
import { EXPLORER_TYPE } from '../../../../utilities/ExplorerUtils';

interface ExplorerItemViewProps {
  profile: Profile;
  item: Interest | CareerGoal;
  opportunities: Opportunity[];
  courses: Course[];
  explorerType: EXPLORER_TYPE;
  interestTypes: InterestType[];
}

const ExplorerItemView: React.FC<ExplorerItemViewProps> = ({ profile, item, courses, opportunities, explorerType, interestTypes }) => {
  const teaser = Teasers.findNonRetired({ targetSlugID: item.slugID });
  const hasTeaser = teaser.length > 0;
  const isNotStudent = [ROLE.ADMIN, ROLE.ADVISOR].includes(profile.role);
  return (
        <div id="explorerItemViewWidget">
            <SegmentGroup>
                <Segment>
                  {hasTeaser ? (<TeaserVideo id={teaser && teaser[0] && teaser[0].url} />) : ''}
                  <Markdown escapeHtml source={item.description} />
                  {isNotStudent ? <EditInterestButton interest={item as Interest} interestTypes={interestTypes}/> : ''}
                </Segment>
                <ExplorerProfiles item={item} explorerType={explorerType}/>
            </SegmentGroup>
        </div>
  );
};

export default ExplorerItemView;

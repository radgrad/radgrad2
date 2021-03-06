import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Grid, Segment, SegmentGroup } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { Course, Interest, Opportunity, Profile } from '../../app/imports/typings/radgrad';
import ExplorerProfiles from '../../app/imports/ui/components/shared/explorer/item-view/ExplorerProfiles';
import * as Router from '../../app/imports/ui/components/shared/utilities/router';
import { Teasers } from '../../app/imports/api/teaser/TeaserCollection';
import TeaserVideo from '../../app/imports/ui/components/shared/TeaserVideo';
import { EXPLORER_TYPE } from '../../app/imports/ui/utilities/ExplorerUtils';

interface ExplorerInterestsWidgetProps {
  profile: Profile;
  interest: Interest;
  opportunities: Opportunity[];
  courses: Course[];
}

const ExplorerInterest: React.FC<ExplorerInterestsWidgetProps> = ({ profile, interest, courses, opportunities }) => {
  const teaser = Teasers.findNonRetired({ targetSlugID: interest.slugID });
  const hasTeaser = teaser.length > 0;
  const match = useRouteMatch();
  return (
    <div id="explorerInterestWidget">
      <SegmentGroup>
        <Segment>
          {hasTeaser ? (
            <Grid columns={2} stackable>
              <Grid.Column width={9}>
                <div>
                  <b>Description: </b>
                </div>
                <div>
                  <Markdown escapeHtml source={interest.description}
                            renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
                </div>
              </Grid.Column>
              <Grid.Column width={6}>
                <b>Teaser:</b>
                <TeaserVideo id={teaser && teaser[0] && teaser[0].url} />
              </Grid.Column>
            </Grid>
          ) : (
            <React.Fragment>
              <div>
                <b>Description: </b>
              </div>
              <div>
                <Markdown escapeHtml source={interest.description} />
              </div>
            </React.Fragment>
          )}
        </Segment>
        <ExplorerProfiles item={interest} explorerType={EXPLORER_TYPE.INTERESTS}/>
      </SegmentGroup>
    </div>
  );
};

export default ExplorerInterest;

import React from 'react';
import { Grid, Segment, SegmentGroup } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { useRouteMatch } from 'react-router-dom';
import {
  CareerGoal, Course,
  Opportunity,
  Profile,
} from '../../app/imports/typings/radgrad';
import { Teasers } from '../../app/imports/api/teaser/TeaserCollection';
import TeaserVideo from '../../app/imports/ui/components/shared/TeaserVideo';
import * as Router from '../../app/imports/ui/components/shared/utilities/router';
import ExplorerProfiles from '../../app/imports/ui/components/shared/explorer/item-view/ExplorerProfiles';
import { EXPLORER_TYPE } from '../../app/imports/ui/utilities/ExplorerUtils';

interface ExplorerCareerGoalProps {
  profile: Profile;
  careerGoal: CareerGoal;
  opportunities: Opportunity[];
  courses: Course[];
}

const ExplorerCareerGoal: React.FC<ExplorerCareerGoalProps> = ({ profile, courses, opportunities, careerGoal }) => {
  const teaser = Teasers.findNonRetired({ targetSlugID: careerGoal.slugID });
  const hasTeaser = teaser.length > 0;
  const match = useRouteMatch();
  return (
        <div id="explorerCareerGoalWidget">
            <SegmentGroup>
                <Segment>
                    {hasTeaser ? (
                        <Grid columns={2} stackable>
                            <Grid.Column width={9}>
                                <div>
                                    <b>Description: </b>
                                </div>
                                <div>
                                    <Markdown escapeHtml source={careerGoal.description}
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
                                <Markdown escapeHtml source={careerGoal.description} />
                            </div>
                        </React.Fragment>
                    )}
                </Segment>
                <ExplorerProfiles item={careerGoal} explorerType={EXPLORER_TYPE.CAREERGOALS}/>
            </SegmentGroup>
        </div>
  );
};

export default ExplorerCareerGoal;

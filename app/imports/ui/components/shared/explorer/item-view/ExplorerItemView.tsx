import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Grid, Segment, SegmentGroup } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { CareerGoal, Course, Interest, Opportunity, Profile } from '../../../../../typings/radgrad';
import ExplorerProfiles from './ExplorerProfiles';
import * as Router from '../../utilities/router';
import { Teasers } from '../../../../../api/teaser/TeaserCollection';
import TeaserVideo from '../../TeaserVideo';
import { EXPLORER_TYPE } from '../../../../utilities/ExplorerUtils';

interface ExplorerItemViewProps {
  profile: Profile;
  item: Interest | CareerGoal;
  opportunities: Opportunity[];
  courses: Course[];
  explorerType: EXPLORER_TYPE;
}

const ExplorerItemView: React.FC<ExplorerItemViewProps> = ({ profile, item, courses, opportunities, explorerType }) => {
  const teaser = Teasers.findNonRetired({ targetSlugID: item.slugID });
  const hasTeaser = teaser.length > 0;
  const match = useRouteMatch();
  return (
        <div id="explorerItemViewWidget">
            <SegmentGroup>
                <Segment>
                    {hasTeaser ? (
                        <Grid columns={2} stackable>
                            <Grid.Column width={9}>
                                <div>
                                    <b>Description: </b>
                                </div>
                                <div>
                                    <Markdown escapeHtml source={item.description}
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
                                <Markdown escapeHtml source={item.description} />
                            </div>
                        </React.Fragment>
                    )}
                </Segment>
                <ExplorerProfiles item={item} explorerType={explorerType}/>
            </SegmentGroup>
        </div>
  );
};

export default ExplorerItemView;

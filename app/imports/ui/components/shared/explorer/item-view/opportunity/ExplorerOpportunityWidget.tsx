import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { Divider, Grid, Header, Segment } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { AcademicTerms } from '../../../../../../api/academic-term/AcademicTermCollection';
import { RadGradProperties } from '../../../../../../api/radgrad/RadGradProperties';
import { OpportunityForecastCollection } from '../../../../../../startup/client/collections';
import { AcademicTerm, Opportunity, Review } from '../../../../../../typings/radgrad';
import StudentExplorerReviewWidget from '../../../../student/explorer/StudentExplorerReviewWidget';
import { Reviews } from '../../../../../../api/review/ReviewCollection';
import IceHeader from '../../../IceHeader';
import InterestList from '../../../InterestList';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import * as Router from '../../../utilities/router';
import AddToProfileButton from '../AddToProfileButton';
import { toUpper, replaceTermString, isSame } from '../../../utilities/general';
import FutureParticipation from '../../FutureParticipation';
import { Opportunities } from '../../../../../../api/opportunity/OpportunityCollection';
import { toId } from '../course/utilities/description-pair';
import { PROFILE_ENTRY_TYPE } from '../../../../../../api/user/profile-entries/ProfileEntryTypes';
import TeaserVideo from '../../../TeaserVideo';
import { Users } from '../../../../../../api/user/UserCollection';
import { ProfileOpportunities } from '../../../../../../api/user/profile-entries/ProfileOpportunityCollection';
// @ts-ignore
import ExplorerReviewWidget from '../ExplorerReviewWidget';

interface ExplorerOpportunitiesWidgetProps {
  name: string;
  descriptionPairs: any[];
  item: Opportunity;
  itemReviews: Review[];
  completed: boolean;
}

const review = (item: Opportunity, match): Review => {
  const reviews = Reviews.findNonRetired({
    studentID: Router.getUserIdFromRoute(match),
    revieweeID: item._id,
  });
  return reviews[0];
};

const teaserUrlHelper = (opportunitySlug): string => {
  const opportunityID = Slugs.getEntityID(opportunitySlug, 'Opportunity');
  const opportunity = Opportunities.findDoc(opportunityID);
  const oppTeaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID });
  if (oppTeaser.length > 1) {
    return undefined;
  }
  return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
};

const ExplorerOpportunityWidget: React.FC<ExplorerOpportunitiesWidgetProps> = ({ name, descriptionPairs, item, completed, itemReviews }) => {
  const segmentStyle = { backgroundColor: 'white' };
  const zeroMarginTopStyle = { marginTop: 0 };
  const fiveMarginTopStyle = { marginTop: '5px' };
  const clearingBasicSegmentStyle = {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  };
  const breakWordStyle: React.CSSProperties = { wordWrap: 'break-word' };

  const match = useRouteMatch();
  const { opportunity, username } = useParams();

  /* Header Variables */
  const upperName = toUpper(name);
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: item.slugID }).length > 0;
  const isStudent = Router.isUrlRoleStudent(match);

  const quarter = RadGradProperties.getQuarterSystem();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const numTerms = quarter ? 12 : 9;
  const academicTerms = AcademicTerms.findNonRetired(
    { termNumber: { $gte: currentTerm.termNumber } },
    {
      sort: { termNumber: 1 },
      limit: numTerms,
    },
  );
  const scores = [];
  academicTerms.forEach((term: AcademicTerm) => {
    const id = `${item._id} ${term._id}`;
    const score = OpportunityForecastCollection.find({ _id: id }).fetch() as { count: number }[];
    if (score.length > 0) {
      scores.push(score[0].count);
    } else {
      scores.push(0);
    }
  });
  const profile = Users.getProfile(username);
  const added = ProfileOpportunities.findNonRetired({ studentID: profile.userID, opportunityID: item._id }).length > 0;
  // console.log(profile.userID, item._id, item.name);
  return (
    <div id="explorerOpportunityWidget">
      <Segment padded className="container" style={segmentStyle}>
        <Segment clearing basic style={clearingBasicSegmentStyle}>
          <Header as="h4" floated="left">
            {upperName}
          </Header>
          <React.Fragment>
            {isStudent ? <AddToProfileButton item={item} studentID={Router.getUserIdFromRoute(match)} type={PROFILE_ENTRY_TYPE.OPPORTUNITY} added={added} /> : ''}

            {descriptionPairs.map((descriptionPair) => (
              <React.Fragment key={toId(descriptionPair)}>{isSame(descriptionPair.label, 'ICE') ? <IceHeader ice={descriptionPair.value} /> : ''}</React.Fragment>
            ))}
          </React.Fragment>
        </Segment>

        <Divider style={zeroMarginTopStyle} />
        <div style={fiveMarginTopStyle}>
          <InterestList item={item} size="mini" />
        </div>
        {hasTeaser ? (
          <Grid stackable columns={2}>
            <Grid.Column width={9}>
              {descriptionPairs.map((descriptionPair) => (
                <React.Fragment key={toId(descriptionPair)}>
                  {isSame(descriptionPair.label, 'Opportunity Type') ? (
                    <React.Fragment>
                      <b>{descriptionPair.label}: </b>
                      {descriptionPair.value ? (
                        <React.Fragment>
                          {descriptionPair.value}
                          <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                  {isSame(descriptionPair.label, 'Sponsor') ? (
                    <React.Fragment>
                      <b>{descriptionPair.label}: </b>
                      {descriptionPair.value ? (
                        <React.Fragment>
                          <span style={breakWordStyle}> {descriptionPair.value}</span>
                          <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                  {isSame(descriptionPair.label, 'Academic Terms') ? (
                    <React.Fragment>
                      <b>{descriptionPair.label}: </b>
                      {descriptionPair.value ? (
                        <React.Fragment>
                          <span style={breakWordStyle}> {replaceTermString(descriptionPair.value)}</span>
                          <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                  {isSame(descriptionPair.label, 'Description') ? (
                    <React.Fragment>
                      <b>{descriptionPair.label}: </b>
                      {descriptionPair.value ? <Markdown escapeHtml source={descriptionPair.value} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} /> : <React.Fragment> N/A </React.Fragment>}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ))}
            </Grid.Column>

            <Grid.Column width={7}>
              {descriptionPairs.map((descriptionPair) => (
                <React.Fragment key={toId(descriptionPair)}>
                  {isSame(descriptionPair.label, 'Event Date') ? (
                    <React.Fragment>
                      <b>{descriptionPair.label}: </b>
                      {descriptionPair.value ? (
                        <React.Fragment>
                          <span style={breakWordStyle}>{descriptionPair.value.toString()}</span>
                          <br />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          N/A <br />
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                  {isSame(descriptionPair.label, 'Teaser') && teaserUrlHelper(opportunity) ? (
                    <React.Fragment>
                      <b>{descriptionPair.label}: </b>
                      {descriptionPair.value ? <TeaserVideo id={teaserUrlHelper(opportunity)} /> : <p>N/A </p>}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ))}
            </Grid.Column>
          </Grid>
        ) : (
          <React.Fragment>
            <Grid stackable columns={2}>
              <Grid.Column width={5}>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={toId(descriptionPair)}>
                    {isSame(descriptionPair.label, 'Opportunity Type') ? (
                      <React.Fragment>
                        <b>{descriptionPair.label}: </b>
                        {descriptionPair.value ? (
                          <React.Fragment>
                            {descriptionPair.value} <br />
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            N/A <br />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                    {isSame(descriptionPair.label, 'Sponsor') ? (
                      <React.Fragment>
                        <b>{descriptionPair.label}: </b>
                        {descriptionPair.value ? (
                          <React.Fragment>
                            <span style={breakWordStyle}>{descriptionPair.value}</span>
                            <br />
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            N/A <br />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                ))}
              </Grid.Column>

              <Grid.Column width={11}>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={toId(descriptionPair)}>
                    {isSame(descriptionPair.label, 'Academic Terms') ? (
                      <React.Fragment>
                        <b>{descriptionPair.label}: </b>
                        {descriptionPair.value ? (
                          <React.Fragment>
                            <span style={breakWordStyle}>{replaceTermString(descriptionPair.value)}</span>
                            <br />
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            N/A <br />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                    {isSame(descriptionPair.label, 'Event Date') ? (
                      <React.Fragment>
                        <b>{descriptionPair.label}: </b>
                        {descriptionPair.value ? (
                          <React.Fragment>
                            <span style={breakWordStyle}>{descriptionPair.value.toString()}</span>
                            <br />
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            N/A <br />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                ))}
              </Grid.Column>
            </Grid>

            <Grid stackable columns={1}>
              <Grid.Column style={zeroMarginTopStyle}>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={toId(descriptionPair)}>
                    {isSame(descriptionPair.label, 'Description') ? (
                      <React.Fragment>
                        <b>{descriptionPair.label}: </b>
                        {descriptionPair.value ? <Markdown escapeHtml source={descriptionPair.value} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} /> : <React.Fragment> N/A </React.Fragment>}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                ))}
              </Grid.Column>
            </Grid>
          </React.Fragment>
        )}
      </Segment>

      <Segment textAlign="center">
        <Header>STUDENTS PARTICIPATING BY SEMESTER</Header>
        <Divider />
        <FutureParticipation academicTerms={academicTerms} scores={scores} />
      </Segment>

      {isStudent ? (
        <Segment>
          <StudentExplorerReviewWidget itemToReview={item} userReview={review(item, match)} completed={completed} reviewType="opportunity" itemReviews={itemReviews} />
        </Segment>
      ) : (
        <ExplorerReviewWidget itemReviews={itemReviews} reviewType="opportunity" />
      )}
    </div>
  );
};

export default ExplorerOpportunityWidget;

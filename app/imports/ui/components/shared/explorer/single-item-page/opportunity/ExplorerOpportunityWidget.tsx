import React from 'react';
import { withRouter } from 'react-router-dom';
import { Divider, Grid, Header, Segment } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { IOpportunity } from '../../../../../../typings/radgrad';
import StudentExplorerReviewWidget from '../../../../student/explorer/StudentExplorerReviewWidget';
import { Reviews } from '../../../../../../api/review/ReviewCollection';
import IceHeader from '../../../IceHeader';
import InterestList from '../../../InterestList';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import * as Router from '../../../utilities/router';
import FavoritesButton from '../FavoritesButton';
import { toUpper, replaceTermString, isSame } from '../../../utilities/general';
import { explorerOpportunityWidget } from '../../../shared-widget-names';
import FutureParticipation from '../../FutureParticipation';
import { Opportunities } from '../../../../../../api/opportunity/OpportunityCollection';
import { toId } from '../course/utilities/description-pair';
import { FAVORITE_TYPE } from '../../../../../../api/favorite/FavoriteTypes';
import TeaserVideo from '../../../TeaserVideo';

interface IExplorerOpportunitiesWidgetProps {
  name: string;
  descriptionPairs: any[];
  item: IOpportunity
  completed: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      opportunity: string;
    }
  };
}

const review = (props: IExplorerOpportunitiesWidgetProps): object => {
  const reviews = Reviews.findNonRetired({
    studentID: Router.getUserIdFromRoute(props.match),
    revieweeID: props.item._id,
  });
  return reviews[0];
};

const teaserUrlHelper = (props: IExplorerOpportunitiesWidgetProps): string => {
  const opportunityID = Slugs.getEntityID(props.match.params.opportunity, 'Opportunity');
  const opportunity = Opportunities.findDoc(opportunityID);
  const oppTeaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID });
  if (oppTeaser.length > 1) {
    return undefined;
  }
  return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
};

const ExplorerOpportunityWidget = (props: IExplorerOpportunitiesWidgetProps) => {
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

  const { name, descriptionPairs, item, completed, match } = props;
  /* Header Variables */
  const upperName = toUpper(name);
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: item.slugID }).length > 0;
  const isStudent = Router.isUrlRoleStudent(props.match);

  return (
    <div id={explorerOpportunityWidget}>
      <Segment padded className="container" style={segmentStyle}>
        <Segment clearing basic style={clearingBasicSegmentStyle}>
          <Header as="h4" floated="left">{upperName}</Header>
          <React.Fragment>
            {isStudent ?
              (
                <FavoritesButton
                  item={item}
                  studentID={Router.getUserIdFromRoute(props.match)}
                  type={FAVORITE_TYPE.OPPORTUNITY}
                />
              )
              : ''}

            {
              descriptionPairs.map((descriptionPair) => (
                <React.Fragment key={toId(descriptionPair)}>
                  {
                    isSame(descriptionPair.label, 'ICE') ?
                      <IceHeader ice={descriptionPair.value} />
                      : ''
                  }
                </React.Fragment>
              ))
            }
          </React.Fragment>
        </Segment>

        <Divider style={zeroMarginTopStyle} />
        <div style={fiveMarginTopStyle}>
          <InterestList item={item} size="mini" />
        </div>
        {hasTeaser ?
          (
            <Grid stackable columns={2}>
              <Grid.Column width={9}>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={toId(descriptionPair)}>
                    {isSame(descriptionPair.label, 'Opportunity Type') ?
                      (
                        <React.Fragment>
                          <b>{descriptionPair.label}: </b>
                          {descriptionPair.value ?
                            (
                              <React.Fragment>{descriptionPair.value}<br /></React.Fragment>
                            )
                            : (<React.Fragment>N/A <br /></React.Fragment>)}
                        </React.Fragment>
                      )
                      : ''}
                    {isSame(descriptionPair.label, 'Sponsor') ?
                      (
                        <React.Fragment>
                          <b>{descriptionPair.label}: </b>
                          {descriptionPair.value ?
                            (
                              <React.Fragment>
                                <span style={breakWordStyle}> {descriptionPair.value}</span><br />
                              </React.Fragment>
                            )
                            : (<React.Fragment>N/A <br /></React.Fragment>)}
                        </React.Fragment>
                      )
                      : ''}
                    {isSame(descriptionPair.label, 'Academic Terms') ?
                      (
                        <React.Fragment>
                          <b>{descriptionPair.label}: </b>
                          {descriptionPair.value ?
                            (
                              <React.Fragment>
                                <span style={breakWordStyle}> {replaceTermString(descriptionPair.value)}</span>
                                <br />
                              </React.Fragment>
                            )
                            : (<React.Fragment>N/A <br /></React.Fragment>)}
                        </React.Fragment>
                      )
                      : ''}
                    {isSame(descriptionPair.label, 'Description') ?
                      (
                        <React.Fragment>
                          <b>{descriptionPair.label}: </b>
                          {descriptionPair.value ?
                            (
                              <Markdown
                                escapeHtml
                                source={descriptionPair.value}
                                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
                              />
                            )
                            : <React.Fragment> N/A </React.Fragment>}
                        </React.Fragment>
                      )
                      : ''}
                  </React.Fragment>
                ))}
              </Grid.Column>

              <Grid.Column width={7}>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={toId(descriptionPair)}>
                    {isSame(descriptionPair.label, 'Event Date') ?
                      (
                        <React.Fragment>
                          <b>{descriptionPair.label}: </b>
                          {descriptionPair.value ?
                            (
                              <React.Fragment>
                                <span style={breakWordStyle}>{descriptionPair.value.toString()}</span>
                                <br />
                              </React.Fragment>
                            )
                            : (<React.Fragment>N/A <br /></React.Fragment>)}
                        </React.Fragment>
                      )
                      : ''}
                    {(isSame(descriptionPair.label, 'Teaser') && teaserUrlHelper(props)) ?
                      (
                        <React.Fragment>
                          <b>{descriptionPair.label}: </b>
                          {descriptionPair.value ?
                            (<TeaserVideo id={teaserUrlHelper(props)} />)
                            : <p>N/A </p>}
                        </React.Fragment>
                      )
                      : ''}
                  </React.Fragment>
                ))}
              </Grid.Column>
            </Grid>
          )
          :
          (
            <React.Fragment>
              <Grid stackable columns={2}>
                <Grid.Column width={5}>
                  {descriptionPairs.map((descriptionPair) => (
                    <React.Fragment key={toId(descriptionPair)}>
                      {isSame(descriptionPair.label, 'Opportunity Type') ?
                        (
                          <React.Fragment>
                            <b>{descriptionPair.label}: </b>
                            {descriptionPair.value ?
                              (
                                <React.Fragment>{descriptionPair.value} <br /></React.Fragment>
                              )
                              : (<React.Fragment>N/A <br /></React.Fragment>)}
                          </React.Fragment>
                        )
                        : ''}
                      {isSame(descriptionPair.label, 'Sponsor') ?
                        (
                          <React.Fragment>
                            <b>{descriptionPair.label}: </b>
                            {descriptionPair.value ?
                              (
                                <React.Fragment>
                                  <span style={breakWordStyle}>{descriptionPair.value}</span>
                                  <br />
                                </React.Fragment>
                              )
                              : (<React.Fragment>N/A <br /></React.Fragment>)}
                          </React.Fragment>
                        )
                        : ''}
                    </React.Fragment>
                  ))}
                </Grid.Column>

                <Grid.Column width={11}>
                  {descriptionPairs.map((descriptionPair) => (
                    <React.Fragment key={toId(descriptionPair)}>
                      {isSame(descriptionPair.label, 'Academic Terms') ?
                        (
                          <React.Fragment>
                            <b>{descriptionPair.label}: </b>
                            {descriptionPair.value ?
                              (
                                <React.Fragment>
                                  <span style={breakWordStyle}>{replaceTermString(descriptionPair.value)}</span>
                                  <br />
                                </React.Fragment>
                              )
                              : (<React.Fragment>N/A <br /></React.Fragment>)}
                          </React.Fragment>
                        )
                        : ''}
                      {isSame(descriptionPair.label, 'Event Date') ?
                        (
                          <React.Fragment>
                            <b>{descriptionPair.label}: </b>
                            {descriptionPair.value ?
                              (
                                <React.Fragment>
                                  <span style={breakWordStyle}>{descriptionPair.value.toString()}</span>
                                  <br />
                                </React.Fragment>
                              )
                              : (<React.Fragment>N/A <br /></React.Fragment>)}
                          </React.Fragment>
                        )
                        : ''}
                    </React.Fragment>
                  ))}
                </Grid.Column>
              </Grid>

              <Grid stackable columns={1}>
                <Grid.Column style={zeroMarginTopStyle}>
                  {descriptionPairs.map((descriptionPair) => (
                    <React.Fragment key={toId(descriptionPair)}>
                      {isSame(descriptionPair.label, 'Description') ?
                        (
                          <React.Fragment>
                            <b>{descriptionPair.label}: </b>
                            {descriptionPair.value ?
                              (
                                <Markdown
                                  escapeHtml
                                  source={descriptionPair.value}
                                  renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
                                />
                              )
                              : <React.Fragment> N/A </React.Fragment>}
                          </React.Fragment>
                        )
                        : ''}
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
        <FutureParticipation item={props.item} type="opportunity" />
      </Segment>

      {isStudent ?
        (
          <Segment>
            <StudentExplorerReviewWidget
              event={item}
              userReview={review(props)}
              completed={completed}
              reviewType="opportunity"
            />
          </Segment>
        )
        : ''}
    </div>
  );
};

export default withRouter(ExplorerOpportunityWidget);

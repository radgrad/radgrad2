import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Divider, Embed, Grid, Header, Segment } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
import StudentExplorerReviewWidget from '../student/StudentExplorerReviewWidget';
import { Reviews } from '../../../api/review/ReviewCollection';
import { UserInteractions } from '../../../api/analytic/UserInteractionCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import IceHeader from './IceHeader';
import InterestList from './InterestList';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import * as Router from './RouterHelperFunctions';
import FavoritesButton from './FavoritesButton';
import { toUpper, replaceTermString, isSame } from './helper-functions';
import { explorerOpportuntityWidget } from './shared-widget-names';

interface IExplorerOpportunitiesWidgetProps {
  name: string;
  descriptionPairs: any[];
  item: IOpportunity
  completed: boolean;
  role: string;
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
  const oppTeaser = Teasers.find({ opportunityID }).fetch();
  if (oppTeaser.length > 1) {
    return undefined;
  }
  return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
};


const ExplorerOpportunitiesWidget = (props: IExplorerOpportunitiesWidgetProps) => {
  const segmentGroupStyle = { backgroundColor: 'white' };
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
  const isStudent = Router.isUrlRoleStudent(props.match);

  return (
    <div id={explorerOpportuntityWidget}>
      <Segment.Group style={segmentGroupStyle}>
        <Segment padded={true} className="container">
          <Segment clearing={true} basic={true} style={clearingBasicSegmentStyle}>
            <Header as="h4" floated="left">{upperName}</Header>
            {
              isStudent ?
                <React.Fragment>
                  <FavoritesButton item={item} studentID={Router.getUserIdFromRoute(props.match)} type='opportunity'/>
                  {
                    descriptionPairs.map((descriptionPair, index) => (
                      <React.Fragment key={index}>
                        {
                          isSame(descriptionPair.label, 'ICE') ?
                            <IceHeader ice={descriptionPair.value}/>
                            : ''
                        }
                      </React.Fragment>
                    ))
                  }
                </React.Fragment>
                : ''
            }
          </Segment>

          <Divider style={zeroMarginTopStyle}/>

          <Grid stackable={true} columns={2}>
            <Grid.Column width={5}>
              {
                descriptionPairs.map((descriptionPair, index) => (
                  <React.Fragment key={index}>
                    {
                      isSame(descriptionPair.label, 'Opportunity Type') ?
                        <React.Fragment>
                          <b>{descriptionPair.label}:</b>
                          {
                            descriptionPair.value ?
                              <React.Fragment> {descriptionPair.value} <br/></React.Fragment>
                              :
                              <React.Fragment> N/A <br/></React.Fragment>
                          }
                        </React.Fragment>
                        : ''
                    }

                    {
                      isSame(descriptionPair.label, 'Sponsor') ?
                        <React.Fragment>
                          <b>{descriptionPair.label}:</b>
                          {
                            descriptionPair.value ?
                              <React.Fragment>
                                <span style={breakWordStyle}> {descriptionPair.value}</span> <br/>
                              </React.Fragment>
                              :
                              <React.Fragment> N/A <br/></React.Fragment>
                          }
                        </React.Fragment>
                        : ''
                    }
                  </React.Fragment>

                ))
              }
            </Grid.Column>

            <Grid.Column width={11}>
              {
                descriptionPairs.map((descriptionPair, index) => (
                  <React.Fragment key={index}>
                    {
                      isSame(descriptionPair.label, 'Semesters') ?
                        <React.Fragment>
                          <b>{descriptionPair.label}:</b>
                          {
                            descriptionPair.value ?
                              <React.Fragment>
                                <span style={breakWordStyle}> {replaceTermString(descriptionPair.value)}</span>
                                <br/>
                              </React.Fragment>
                              :
                              <React.Fragment> N/A <br/></React.Fragment>
                          }
                        </React.Fragment>
                        : ''
                    }

                    {
                      isSame(descriptionPair.label, 'Event Date') ?
                        <React.Fragment>
                          <b>{descriptionPair.label}:</b>
                          {
                            descriptionPair.value ?
                              <React.Fragment>
                                <span style={breakWordStyle}> {descriptionPair.value}</span> <br/>
                              </React.Fragment>
                              :
                              <React.Fragment> N/A <br/></React.Fragment>
                          }
                        </React.Fragment>
                        : ''
                    }
                  </React.Fragment>

                ))
              }
            </Grid.Column>
          </Grid>

          <Grid stackable={true}>
            <Grid.Column style={zeroMarginTopStyle}>
              {
                descriptionPairs.map((descriptionPair, index) => (
                  <React.Fragment key={index}>
                    {
                      isSame(descriptionPair.label, 'Description') ?
                        <React.Fragment>
                          <b>{descriptionPair.label}:</b>
                          {
                            descriptionPair.value ?
                              <Markdown escapeHtml={true} source={descriptionPair.value}
                                        renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}/>
                              :
                              <React.Fragment> N/A </React.Fragment>
                          }
                        </React.Fragment>
                        : ''
                    }

                    {
                      isSame(descriptionPair.label, 'Teaser') && teaserUrlHelper(props) ?
                        <React.Fragment>
                          <b>{descriptionPair.label}:</b>
                          {
                            descriptionPair.value ?
                              <Embed active={true} autoplay={false} source="youtube" id={teaserUrlHelper(props)}/>
                              :
                              <p> N/A </p>
                          }
                        </React.Fragment>
                        : ''
                    }

                    {
                      isSame(descriptionPair.label, 'Interests') ?
                        <div style={fiveMarginTopStyle}>
                          <InterestList item={item} size="mini"/>
                        </div>
                        : ''
                    }
                  </React.Fragment>

                ))
              }
            </Grid.Column>
          </Grid>
        </Segment>
      </Segment.Group>

      {
        isStudent ?
          <Grid stackable={true} className="column">
            <Grid.Column width={16}>
              <Segment padded={true}>
                <StudentExplorerReviewWidget event={item} userReview={review(props)} completed={completed}
                                             reviewType="opportunity"/>
              </Segment>
            </Grid.Column>
          </Grid>
          : ''
      }
    </div>
  );
};

const ExplorerOpportunitiesWidgetContainer = withTracker(() => {
  /* Reactive Sources to make StudentExplorerCoursesWidgetButton reactive */
  const reactiveSourceOne = OpportunityInstances.findNonRetired({});
  const reactiveSouceTwo = UserInteractions.find({}).fetch();

  /* Reactive Source to make StudentExplorerEditReviewForm reactive */
  const reactiveSourceThree = Reviews.find({}).fetch();

  return {
    reactiveSourceOne,
    reactiveSouceTwo,
    reactiveSourceThree,
  };
})(ExplorerOpportunitiesWidget);
export default withRouter(ExplorerOpportunitiesWidgetContainer);

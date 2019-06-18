import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, withRouter } from 'react-router-dom';
import { Divider, Embed, Grid, Header, Segment } from 'semantic-ui-react';
import * as _ from 'lodash';
import * as Markdown from 'react-markdown';
import { Users } from '../../../api/user/UserCollection';
import { IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line
import StudentExplorerReviewWidget from '../student/StudentExplorerReviewWidget';
import { Reviews } from '../../../api/review/ReviewCollection';
import { UserInteractions } from '../../../api/analytic/UserInteractionCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import IceHeader from './IceHeader';
import InterestList from './InterestList';
import { Slugs } from '../../../api/slug/SlugCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import StudentExplorerOpportunitiesWidgetButton from '../student/StudentExplorerOpportunitiesWidgetButton';

interface IExplorerOpportunitiesWidgetProps {
  name: string;
  slug: string;
  descriptionPairs: any[];
  id: string;
  item: IOpportunity
  completed: boolean;
  reviewed: boolean;
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

class ExplorerOpportunitiesWidget extends React.Component<IExplorerOpportunitiesWidgetProps> {
  constructor(props) {
    super(props);
  }

  private toUpper = (string: string): string => string.toUpperCase();

  private isRoleStudent = (): boolean => this.props.role === 'student';

  private getUserIdFromRoute = (): string => {
    const username = this.props.match.params.username;
    return username && Users.getID(username);
  }

  private isLabel = (label: string, str: string): boolean => label === str;

  private userStatus = (opportunity: IOpportunity): boolean => {
    let ret = false;
    const oi = OpportunityInstances.find({
      studentID: this.getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    if (oi.length > 0) {
      ret = true;
    }
    return ret;
  }

  private futureInstance = (opportunity: IOpportunity): boolean => {
    let ret = false;
    const oi = OpportunityInstances.find({
      studentID: this.getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    _.forEach(oi, (opportunityInstance) => {
      if (AcademicTerms.findDoc(opportunityInstance.termID).termNumber >=
        AcademicTerms.getCurrentAcademicTermDoc().termNumber) {
        ret = true;
      }
    });
    return ret;
  }

  private unverified = (opportunity: IOpportunity): boolean => {
    let ret = false;
    const oi = OpportunityInstances.find({
      studentID: this.getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    _.forEach(oi, (opportunityInstance) => {
      if (!opportunityInstance.verified) {
        ret = true;
      }
    });
    return ret;
  }

  private replaceTermString = (array: string[]): string => {
    const termString = array.join(', ');
    return termString.replace(/Summer/g, 'Sum').replace(/Spring/g, 'Spr');
  }

  private review = (): object => {
    const review = Reviews.find({
      studentID: this.getUserIdFromRoute(),
      revieweeID: this.props.item._id,
    }).fetch();
    return review[0];
  }

  private teaserUrlHelper = (): string => {
    const opportunityID = Slugs.getEntityID(this.props.match.params.opportunity, 'Opportunity');
    const oppTeaser = Teasers.find({ opportunityID }).fetch();
    return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
  }

  private routerLink = (props) => (
    props.href.match(/^(https?:)?\/\//)
      ? <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
      : <Link to={props.href}>{props.children}</Link>
  )

  private buildRouteName = (slug: string) => {
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/`;
    return `${baseRoute}explorer/courses/${slug}`;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
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

    const { name, descriptionPairs, item, completed } = this.props;
    /* Header Variables */
    const upperName = this.toUpper(name);
    const isStudent = this.isRoleStudent();
    const userStatus = this.userStatus(item);
    const futureInstance = this.futureInstance(item);
    const unverified = this.unverified(item);

    return (
      <div>
        <Segment.Group style={segmentGroupStyle}>
          <Segment padded={true} className="container">
            <Segment clearing={true} basic={true} style={clearingBasicSegmentStyle}>
              <Header as="h4" floated="left">{upperName}</Header>
              {
                isStudent ?
                  <React.Fragment>
                    {
                      userStatus ?
                        <React.Fragment>
                          {
                            futureInstance ?
                              <StudentExplorerOpportunitiesWidgetButton buttonType="remove" opportunity={item}/>
                              :
                              <React.Fragment>
                                {
                                  unverified ?
                                    <StudentExplorerOpportunitiesWidgetButton buttonType="remove" opportunity={item}/>
                                    : ''
                                }
                              </React.Fragment>
                          }
                        </React.Fragment>
                        : ''
                    }

                    <StudentExplorerOpportunitiesWidgetButton buttonType="add" opportunity={item}/>

                    {
                      descriptionPairs.map((descriptionPair, index) => (
                        <React.Fragment key={index}>
                          {
                            this.isLabel(descriptionPair.label, 'ICE') ?
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
                        this.isLabel(descriptionPair.label, 'Opportunity Type') ?
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
                        this.isLabel(descriptionPair.label, 'Sponsor') ?
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
                        this.isLabel(descriptionPair.label, 'Semesters') ?
                          <React.Fragment>
                            <b>{descriptionPair.label}:</b>
                            {
                              descriptionPair.value ?
                                <React.Fragment>
                                  <span style={breakWordStyle}> {this.replaceTermString(descriptionPair.value)}</span>
                                  <br/>
                                </React.Fragment>
                                :
                                <React.Fragment> N/A <br/></React.Fragment>
                            }
                          </React.Fragment>
                          : ''
                      }

                      {
                        this.isLabel(descriptionPair.label, 'Event Date') ?
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
                        this.isLabel(descriptionPair.label, 'Description') ?
                          <React.Fragment>
                            <b>{descriptionPair.label}:</b>
                            {
                              descriptionPair.value ?
                                <Markdown escapeHtml={true} source={descriptionPair.value}
                                          renderers={{ link: this.routerLink }}/>
                                :
                                <React.Fragment> N/A </React.Fragment>
                            }
                          </React.Fragment>
                          : ''
                      }

                      {
                        this.isLabel(descriptionPair.label, 'Teaser') ?
                          <React.Fragment>
                            <b>{descriptionPair.label}:</b>
                            {
                              descriptionPair.value ?
                                <Embed active={true} autoplay={false} source="youtube" id={this.teaserUrlHelper()}/>
                                :
                                <p> N/A </p>
                            }
                          </React.Fragment>
                          : ''
                      }

                      {
                        this.isLabel(descriptionPair.label, 'Interests') ?
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
                  <StudentExplorerReviewWidget event={item} userReview={this.review()} completed={completed}
                                               reviewType="opportunity"/>
                </Segment>
              </Grid.Column>
            </Grid>
            : ''
        }

        {/*  TODO: Back To Top Button */}
      </div>
    );
  }
}

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

import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { Button, Card, Container, Header, Icon, Segment } from 'semantic-ui-react';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import StudentTeaserWidgetVideo from './StudentTeaserWidgetVideo';
import InterestList from '../shared/InterestList';
import WidgetHeaderNumber from '../shared/WidgetHeaderNumber';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

interface IStudentTeaserWidgetProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class StudentTeaserWidget extends React.Component<IStudentTeaserWidgetProps> {
  constructor(props) {
    super(props);
  }

  private getUsername = () => this.props.match.params.username;

  private matchingTeasers = () => {
    if (this.getUsername()) {
      const allTeasers = Teasers.find().fetch();
      const matching = [];
      const profile = Users.getProfile(this.getUsername());
      const userInterests = [];
      let teaserInterests = [];
      _.forEach(Users.getInterestIDs(profile.userID), (id) => {
        userInterests.push(Interests.findDoc(id));
      });
      _.forEach(allTeasers, (teaser) => {
        teaserInterests = [];
        _.forEach(teaser.interestIDs, (id) => {
          teaserInterests.push(Interests.findDoc(id));
          _.forEach(teaserInterests, (teaserInterest) => {
            _.forEach(userInterests, (userInterest) => {
              if (_.isEqual(teaserInterest, userInterest)) {
                if (!_.includes(matching, teaser)) {
                  matching.push(teaser);
                }
              }
            });
          });
        });
      });
      return matching;
    }
    return [];
  }

  private teaserTitle = (teaser: any): string => teaser.title;

  private teaserAuthor = (teaser: any): string => teaser.author;

  private teaserUrl = (teaser: any): string => teaser.url;

  private teaserCount = (): number => this.matchingTeasers().length;

  private opportunitiesRouteName = (teaser) => {
    const opportunityName = this.opportunitySlug(teaser);
    return `/student/${this.getUsername()}/explorer/opportunities/${opportunityName}`;
  }

  private opportunitySlug = (teaser) => {
    let ret;
    if (teaser.opportunityID) {
      ret = Slugs.findDoc(Opportunities.findDoc(teaser.opportunityID).slugID).name;
    } else {
      ret = '#';
    }
    return ret;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const teasers = this.matchingTeasers();
    const teaserCount = this.teaserCount();

    const cardGroupStyle = {
      maxHeight: '500px',
      overflow: 'scroll',
      marginTop: '10px',
    };
    const teaserWidgetVideoStyle = { padding: '0' };
    const chevronCircleRightIconStyle = { marginRight: '1px' };

    return (
      <React.Fragment>
        <Container>
          <Segment padded={true}>
            <Header dividing={true}>
              <Header as="h4"> TEASERS <WidgetHeaderNumber inputValue={teaserCount}/> </Header>
            </Header>

            {
              teasers ?
                <Card.Group style={cardGroupStyle}>
                  {
                    teasers.map((teaser, index) => (
                      <React.Fragment key={index}>
                        <Card centered={true}>
                          <Card.Content>
                            <Card.Header>{this.teaserTitle(teaser)}</Card.Header>
                            <Card.Meta>By {this.teaserAuthor(teaser)} </Card.Meta>
                          </Card.Content>

                          <Card.Content style={teaserWidgetVideoStyle}>
                            <StudentTeaserWidgetVideo teaserUrl={this.teaserUrl(teaser)}/>
                          </Card.Content>

                          <Card.Content>
                            <InterestList item={teaser} size="mini"/>
                          </Card.Content>

                          {
                            teaser.opportunityID ?
                              <Link to={this.opportunitiesRouteName(teaser)}>
                                <Button attached="bottom">
                                  <Icon name="chevron circle right" style={chevronCircleRightIconStyle}/> View
                                  More
                                </Button>
                              </Link>
                              : ''
                          }
                        </Card>
                      </React.Fragment>
                    ))
                  }
                </Card.Group>
                :
                <p>Add interests to see recommendations here.</p>
            }
          </Segment>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(StudentTeaserWidget);

import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import * as _ from 'lodash';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Segment, Container, Header, Card, Button, Icon } from 'semantic-ui-react';
import StudentTeaserWidgetVideo from './StudentTeaserWidgetVideo';
import InterestList from '../shared/InterestList';
import WidgetHeaderNumber from '../shared/WidgetHeaderNumber';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

interface IStudentTeaserWidget {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class StudentTeaserWidget extends React.Component<IStudentTeaserWidget> {
  constructor(props) {
    super(props);
  }

  private getUsername = () => {
    return this.props.match.params.username;
  }

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

  private teaserTitle = (teaser: any): string => {
    return teaser.title;
  }

  private teaserAuthor = (teaser: any): string => {
    return teaser.author;
  }

  private teaserUrl = (teaser: any): string => {
    return teaser.url;
  }

  private teaserCount = (): number => {
    return this.matchingTeasers().length;
  }

  private opportunitiesRouteName = (teaser) => {
    const opportunityName = this.opportunitySlug(teaser);
    return `/student/${this.getUsername()}/explorer/opportunities/${opportunityName}`;
  }

  private opportunitySlug = (teaser) => {
    let ret;
    if (teaser.opportunityID) {
      ret = Slugs.findDoc(Opportunities.findDoc(teaser.opportunityID).slugID).name;
    } else {
      ret = '#'; // TODO: Not sure if I should have this # or empty string. Can't test until we have opportunity pages working.
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
    const cardContentStyle = { padding: '0' };

    const chevronCircleRightIconStyle = { marginRight: '1px' };
    return (
        <div>
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
                            <div key={index}>
                              <Card centered={true}>
                                <Card.Content>
                                  <Card.Header>{this.teaserTitle(teaser)}</Card.Header>
                                  <Card.Meta>By {this.teaserAuthor(teaser)} </Card.Meta>
                                </Card.Content>

                                <Card.Content style={cardContentStyle}>
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
                            </div>
                        ))
                      }
                    </Card.Group>
                    :
                    <p>Add interests to see recommendations here.</p>
              }
            </Segment>
          </Container>
        </div>
    );
  }
}

export default withRouter(StudentTeaserWidget);

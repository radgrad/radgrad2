import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Button, Card, Container, Header, Icon, Segment } from 'semantic-ui-react';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import StudentTeaserWidgetVideo from './StudentTeaserWidgetVideo';
import InterestList from '../shared/InterestList';
import WidgetHeaderNumber from '../shared/WidgetHeaderNumber';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getUsername, IMatchProps } from '../shared/RouterHelperFunctions'; // eslint-disable-line no-unused-vars
import { studentTeaserWidget } from './student-widget-names';

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

const matchingTeasers = (match: IMatchProps) => {
  if (getUsername(match)) {
    const allTeasers = Teasers.find().fetch();
    const matching = [];
    const profile = Users.getProfile(getUsername(match));
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
};

const teaserTitle = (teaser: any): string => teaser.title;

const teaserAuthor = (teaser: any): string => teaser.author;

const teaserUrl = (teaser: any): string => teaser.url;

const opportunitySlug = (teaser) => {
  let ret;
  if (teaser.opportunityID) {
    ret = Slugs.findDoc(Opportunities.findDoc(teaser.opportunityID).slugID).name;
  } else {
    ret = '#';
  }
  return ret;
};

const buildOpportunitiesRouteName = (teaser, props: IStudentTeaserWidgetProps) => {
  const opportunityName = opportunitySlug(teaser);
  const username = props.match.params.username;
  const baseUrl = props.match.url;
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/`;
  return `${baseRoute}explorer/opportunities/${opportunityName}`;
};


const StudentTeaserWidget = (props: IStudentTeaserWidgetProps) => {
  const teasers = matchingTeasers(props.match);
  const teaserCount = matchingTeasers(props.match).length;

  const cardGroupStyle = {
    maxHeight: '500px',
    overflow: 'scroll',
    marginTop: '10px',
  };
  const teaserWidgetVideoStyle = { padding: '0' };
  const chevronCircleRightIconStyle = { marginRight: '1px' };

  return (
    <Container id={`${studentTeaserWidget}`}>
      <Segment padded>
        <Header dividing>
          <Header as="h4">
            {' '}
TEASERS
            <WidgetHeaderNumber inputValue={teaserCount} />
            {' '}

          </Header>
        </Header>

        {
          teasers ? (
            <Card.Group style={cardGroupStyle}>
              {
                teasers.map((teaser, index) => (
                  <React.Fragment key={index}>
                    <Card centered>
                      <Card.Content>
                        <Card.Header>{teaserTitle(teaser)}</Card.Header>
                        <Card.Meta>
By
                          {teaserAuthor(teaser)}
                          {' '}

                        </Card.Meta>
                      </Card.Content>

                      <Card.Content style={teaserWidgetVideoStyle}>
                        <StudentTeaserWidgetVideo teaserUrl={teaserUrl(teaser)} />
                      </Card.Content>

                      <Card.Content>
                        <InterestList item={teaser} size="mini" />
                      </Card.Content>

                      {
                        teaser.opportunityID ? (
                          <Link to={buildOpportunitiesRouteName(teaser, props)}>
                            <Button attached="bottom">
                              <Icon name="chevron circle right" style={chevronCircleRightIconStyle} />
                              {' '}
View
                              More
                            </Button>
                          </Link>
                        )
                          : ''
                      }
                    </Card>
                  </React.Fragment>
                ))
              }
            </Card.Group>
          )
            :
            <p>Add interests to see recommendations here.</p>
        }
      </Segment>
    </Container>
  );
};

export default withRouter(StudentTeaserWidget);

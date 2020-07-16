import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Button, Card, Container, Header, Icon, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Teasers } from '../../../../api/teaser/TeaserCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import InterestList from '../../shared/InterestList';
import WidgetHeaderNumber from '../../shared/WidgetHeaderNumber';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { buildRouteName, getUsername, IMatchProps } from '../../shared/RouterHelperFunctions';
import { studentTeaserWidget } from '../student-widget-names';
import { ISlug, ITeaser } from '../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';
import TeaserVideo from '../../shared/TeaserVideo';

interface IStudentTeaserWidgetProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  teasers: ITeaser[];
}

const matchingTeasers = (match: IMatchProps) => {
  if (getUsername(match)) {
    const allTeasers: ITeaser[] = Teasers.findNonRetired({});
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

const teaserTitle = (teaser: ITeaser): string => teaser.title;

const teaserAuthor = (teaser: ITeaser): string => teaser.author;

const teaserUrl = (teaser: ITeaser): string => teaser.url;

const getType = (teaser: ITeaser): string => {
  const slugDoc: ISlug = Slugs.findDoc(teaser.targetSlugID);
  switch (slugDoc.entityName) {
    case 'CareerGoal':
      return 'CareerGoal';
    case 'Course':
      return 'Course';
    case 'Interest':
      return 'Interest';
    case 'Opportunity':
      return 'Opportunity';
    default:
      console.error(`Bad slugDoc.entityName: ${slugDoc.entityName}`);
      break;
  }
  return undefined;
};

const buildTeaserRouteName = (teaser: ITeaser, props: IStudentTeaserWidgetProps): string => {
  const type: string = getType(teaser);
  const slugDoc: ISlug = Slugs.findDoc(teaser.targetSlugID);
  const slugName: string = slugDoc.name;

  let category: string;
  switch (type) {
    case 'CareerGoal':
      category = EXPLORER_TYPE.CAREERGOALS;
      break;
    case 'Course':
      category = EXPLORER_TYPE.COURSES;
      break;
    case 'Interest':
      category = EXPLORER_TYPE.INTERESTS;
      break;
    case 'Opportunity':
      category = EXPLORER_TYPE.OPPORTUNITIES;
      break;
    default:
      break;
  }
  return buildRouteName(props.match, `/${EXPLORER_TYPE.HOME}/${category}/${slugName}`);
};

const StudentTeaserWidget = (props: IStudentTeaserWidgetProps) => {
  const { teasers } = props;
  const teaserCount = teasers.length;

  const cardGroupStyle: React.CSSProperties = {
    maxHeight: '656px',
    overflow: 'scroll',
    padding: '5px',
  };
  const teaserWidgetVideoStyle = { padding: '0' };
  const chevronCircleRightIconStyle = { marginRight: '1px' };
  return (
    <Container id={`${studentTeaserWidget}`}>
      <Segment padded>
        <Header dividing>
          <Header as="h4">
            TEASERS <WidgetHeaderNumber inputValue={teaserCount} />
          </Header>
        </Header>

        {
          teasers.length > 0 ?
            (
              <Card.Group style={cardGroupStyle}>
                {
                  teasers.map((teaser) => (
                    <React.Fragment key={teaser._id}>
                      <Card centered>
                        <Card.Content>
                          <Card.Header>{teaserTitle(teaser)}</Card.Header>
                          <Card.Meta>
                            By {teaserAuthor(teaser)}
                          </Card.Meta>
                        </Card.Content>

                        <Card.Content style={teaserWidgetVideoStyle}>
                          <TeaserVideo id={teaserUrl(teaser)} />
                        </Card.Content>

                        <Card.Content>
                          <InterestList item={teaser} size="mini" />
                        </Card.Content>

                        <Link to={buildTeaserRouteName(teaser, props)}>
                          <Button attached="bottom">
                            <Icon name="chevron circle right" style={chevronCircleRightIconStyle} />
                            View More
                          </Button>
                        </Link>
                      </Card>
                    </React.Fragment>
                  ))
                }
              </Card.Group>
            )
            : (
              <p>
                Add interests or career goals to see recommendations here. To add interests, click on
                the &quot;Explorer&quot; tab, then select &quot;Interests&quot; or &quot;Career Goals&quot; in the
                dropdown menu on that page.
              </p>
            )
        }
      </Segment>
    </Container>
  );
};

const StudentTeaserWidgetCon = withTracker(({ match }) => {
  const teasers: ITeaser[] = matchingTeasers(match);

  return {
    teasers,
  };
})(StudentTeaserWidget);
const StudentTeaserWidgetContainer = withRouter(StudentTeaserWidgetCon);

export default StudentTeaserWidgetContainer;

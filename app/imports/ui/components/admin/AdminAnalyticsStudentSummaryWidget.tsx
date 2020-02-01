import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Segment, Header } from 'semantic-ui-react';
import { ReduxTypes } from '../../../redux';
import { userInteractionFindMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { Users } from '../../../api/user/UserCollection';
import { ANALYTICS } from '../../../startup/client/route-constants';
import AdminAnalyticsDateSelectionWidget from './AdminAnalyticsDateSelectionWidget';
import SummaryStatisticsTabs from './SummaryStatisticsTabs';

export interface IBehavior {
  type: string;
  count: number;
  users: string[];
  description: string;
}

interface IDateRange {
  startDate: Date;
  endDate: Date;
}

interface IAdminAnalyticsStudentSummaryWidgetState {
  interactionsByUser: object;
  behaviors: IBehavior[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  }
}

const mapStateToProps = (state: ReduxTypes.State): { dateRange: { startDate: Date; endDate: Date; } } => ({
  dateRange: state.admin.analytics.studentSummary.dateRange,
});

class AdminAnalyticsStudentSummaryWidget extends React.Component<{}, IAdminAnalyticsStudentSummaryWidgetState> {
  constructor(props) {
    super(props);
    this.state = {
      interactionsByUser: {},
      behaviors: [],
    };
  }

  private dateRangeString = () => {
    if (this.state.dateRange) {
      const startDate = moment(this.state.dateRange.startDate).format('MM-DD-YYYY');
      const endDate = moment(this.state.dateRange.endDate).format('MM-DD-YYYY');
      return `${startDate} to ${endDate}`;
    }
    return '';
  }

  private handleSubmit = (doc) => {
    // console.log(doc);
    this.setState({ dateRange: { startDate: doc.startDate, endDate: doc.endDate } });
    const dateRange = { startDate: doc.startDate, endDate: doc.endDate };
    const selector = { timestamp: { $gte: dateRange.startDate, $lte: dateRange.endDate } };
    const options = { sort: { username: 1, timestamp: 1 } };
    userInteractionFindMethod.call({ selector, options }, (error, result) => {
      if (error) {
        console.log('Error finding user interactions.', error);
      } else {
        const users = _.groupBy(_.filter(result, (u) => Users.getProfile(u.username).role === 'STUDENT'), 'username');
        const behaviors: IBehavior[] = [{
          type: 'Log In', count: 0, users: [], description: 'Logged into application',
        },
        {
          type: 'Change Outlook', count: 0, users: [], description: 'Updated interests, career goals, or degree',
        },
          {
            type: 'Exploration', count: 0, users: [], description: 'Viewed entries in Explorer',
          },
          {
            type: 'Planning', count: 0, users: [], description: 'Added or removed course/opportunity',
          },
          {
            type: 'Verification', count: 0, users: [], description: 'Requested verification',
          },
          {
            type: 'Reviewing', count: 0, users: [], description: 'Reviewed a course',
          },
          {
            type: 'Mentorship', count: 0, users: [], description: 'Visited the MentorSpace page or asked a question',
          },
          {
            type: 'Level Up', count: 0, users: [], description: 'Leveled up',
          },
          {
            type: 'Complete Plan', count: 0, users: [], description: 'Created a plan with 100 ICE',
          },
          {
            type: 'Profile', count: 0, users: [], description: 'Updated personal image or website url',
          },
          {
            type: 'Favorite Item', count: 0, users: [], description: 'Favorited an item',
          },
          {
            type: 'Unfavorite Item', count: 0, users: [], description: 'Unfavorited an item',
          },
          {
            type: 'Log Out', count: 0, users: [], description: 'Logged out',
          }];
        _.each(users, function (interactions, user) {
          if (_.some(interactions, { type: 'login' })) {
            behaviors[0].count++;
            behaviors[0].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'careerGoalIDs' || i.type === 'interestIDs'
            || i.type === 'academicPlanID')) {
            behaviors[1].count++;
            behaviors[1].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'pageView' && i.typeData[0].includes('explorer/'))) {
            behaviors[2].count++;
            behaviors[2].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'addCourse' || i.type === 'removeCourse'
            || i.type === 'addOpportunity' || i.type === 'removeOpportunity')) {
            behaviors[3].count++;
            behaviors[3].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'verifyRequest')) {
            behaviors[4].count++;
            behaviors[4].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'addReview')) {
            behaviors[5].count++;
            behaviors[5].users.push(user);
          }
          if (_.some(interactions, (i) => (i.type === 'pageView' && i.typeData[0].includes('mentor-space'))
            || i.type === 'askQuestion')) {
            behaviors[6].count++;
            behaviors[6].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'level')) {
            behaviors[7].count++;
            behaviors[7].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'completePlan')) {
            behaviors[8].count++;
            behaviors[8].users.push(user);
          }
          if (_.some(interactions, (i) => i.type === 'picture' || i.type === 'website')) {
            behaviors[9].count++;
            behaviors[9].users.push(user);
          }
          if (_.some(interactions, { type: 'favoriteItem' })) {
            behaviors[10].count++;
            behaviors[10].users.push(user);
          }
          if (_.some(interactions, { type: 'unFavoriteItem' })) {
            behaviors[11].count++;
            behaviors[11].users.push(user);
          }
          if (_.some(interactions, { type: 'logout' })) {
            behaviors[12].count++;
            behaviors[12].users.push(user);
          }
        });
        console.log(behaviors, users);
        this.setState({
          interactionsByUser: users,
          behaviors,
        });
      }
    });

  }

  public render() {
    const dateRangeStr = ` ${this.dateRangeString()}`;
    return (
      <div>
        <AdminAnalyticsDateSelectionWidget page={ANALYTICS.STUDENTSUMMARY} />
        <Segment>
          <Header as="h4" dividing>
            SUMMARY STATISTICS:
            {dateRangeStr}
          </Header>
          <SummaryStatisticsTabs
            behaviors={this.state.behaviors}
            startDate={this.state.dateRange ? moment(this.state.dateRange.startDate).format('MM-DD-YYYY') : ''}
            endDate={this.state.dateRange ? moment(this.state.dateRange.endDate).format('MM-DD-YYYY') : ''}
            interactionsByUser={this.state.interactionsByUser}
          />
        </Segment>
      </div>
    );
  }
}

const AdminAnalyticsStudentSummaryWidgetCon = connect(mapStateToProps)(AdminAnalyticsStudentSummaryWidget);
export default withRouter(AdminAnalyticsStudentSummaryWidgetCon);

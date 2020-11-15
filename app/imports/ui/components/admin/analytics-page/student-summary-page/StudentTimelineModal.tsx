import React from 'react';
import { Button, Grid, Header, List, Modal, Segment } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';
import { FAVORITE_TYPE } from '../../../../../api/favorite/FavoriteTypes';
import { profileIDToFullname } from '../../../shared/utilities/data-model';
import { IUserInteraction } from '../../../../../typings/radgrad';
import { UserInteractionsTypes } from '../../../../../api/analytic/UserInteractionsTypes';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import { StudentSummaryBehaviorTypes } from './utilities/student-summary';

interface IStudentTimelineModalProps {
  username: string;
  startDate: string;
  endDate: string;
  // eslint-disable-next-line react/no-unused-prop-types
  interactions: IUserInteraction[];
}

// This defines the time between sessions
const gap = 10;

const getSessions = (props: IStudentTimelineModalProps): IUserInteraction[][] => {
  const sessions = [];
  let slicedIndex = 0;
  _.each(props.interactions, (interaction, index: number, interactions) => {
    if (index !== 0) {
      const prevTimestamp = moment(new Date(interactions[index - 1].timestamp));
      const timestamp = moment(new Date(interaction.timestamp));
      const difference = moment.duration(timestamp.diff(prevTimestamp)).asMinutes();
      if (difference >= gap) {
        sessions.push(_.slice(interactions, slicedIndex, index));
        slicedIndex = index;
      }
      if (index === interactions.length - 1) {
        sessions.push(_.slice(interactions, slicedIndex));
      }
    }
  });
  if (sessions.length === 0) {
    sessions.push(props.interactions);
  }
  return sessions;
};

const getSessionDuration = (sessionArr: IUserInteraction[]): string => {
  const firstTimestamp = moment(sessionArr[0].timestamp);
  const lastTimestamp = moment(sessionArr[sessionArr.length - 1].timestamp);
  return moment.duration(lastTimestamp.diff(firstTimestamp)).asMinutes().toFixed(2);
};

// Helper function to format the typeData of addCourse, removeCourse, updateCourse, addOpportunity, removeOpportunity, and updateOpportunity
// strArray is an array of strings, the expected format of a string input in this array is "Term, Year, slug"
// This helper function maps the array such that the string is reformatted to "slug (Term Year)"
const formatCourseOpportunitySlugMessages = (strArray: string[]): string[] => strArray.map((str) => {
  const split = str.split(', ');
  return `${split[2]} (${split[0]} ${split[1]})`;
});

// Helper function to format the typeData of addReview and editReview
// strArray is an array of strings, the format of the expected string input is ["reviewType, Term-Year, slug"
// This helper function maps the array such that the string is reformatted to "slug (Term Year)"
const formatReviewSlugMessages = (strArray: string[]): string => strArray.map((str) => {
  const split = str.split(', ');
  return `${split[2]} (${split[0]})`;
}).join(', ');

const getBehaviors = (sessionArr: IUserInteraction[]): { type: string, stats: string[] }[] => {
  const actions = {
    careerGoalIDs: [],
    interestIDs: [],
    academicPlanID: [],
    [UserInteractionsTypes.PAGEVIEW]: [],
    [UserInteractionsTypes.LOGIN]: [],
    [UserInteractionsTypes.LEVEL]: [],
    [UserInteractionsTypes.COMPLETEPLAN]: [],
    [UserInteractionsTypes.PICTURE]: [],
    [UserInteractionsTypes.WEBSITE]: [],
    [UserInteractionsTypes.SHAREINFORMATION]: [],
    [UserInteractionsTypes.ADDCOURSE]: [],
    [UserInteractionsTypes.REMOVECOURSE]: [],
    [UserInteractionsTypes.UPDATECOURSE]: [],
    [UserInteractionsTypes.ADDOPPORTUNITY]: [],
    [UserInteractionsTypes.REMOVEOPPORTUNITY]: [],
    [UserInteractionsTypes.UPDATEOPPORTUNITY]: [],
    [UserInteractionsTypes.FAVORITEITEM]: [],
    [UserInteractionsTypes.UNFAVORITEITEM]: [],
    [UserInteractionsTypes.ADDREVIEW]: [],
    [UserInteractionsTypes.EDITREVIEW]: [],
    [UserInteractionsTypes.VERIFYREQUEST]: [],
  };
  _.each(sessionArr, function (interaction) {
    actions[interaction.type].push(interaction.typeData.join(', '));
  });
  const behaviors = {
    [StudentSummaryBehaviorTypes.LOGIN]: [],
    [StudentSummaryBehaviorTypes.OUTLOOK]: [],
    [StudentSummaryBehaviorTypes.EXPLORATION]: [],
    [StudentSummaryBehaviorTypes.PLANNING]: [],
    [StudentSummaryBehaviorTypes.VERIFICATION]: [],
    [StudentSummaryBehaviorTypes.REVIEWING]: [],
    [StudentSummaryBehaviorTypes.LEVEL]: [],
    [StudentSummaryBehaviorTypes.COMPLETEPLAN]: [],
    [StudentSummaryBehaviorTypes.PROFILE]: [],
    [StudentSummaryBehaviorTypes.FAVORITE]: [],
    [StudentSummaryBehaviorTypes.UNFAVORITE]: [],
  };
  _.each(actions, function (array: string[], action: string) {
    if (array.length !== 0) {
      if (action === UserInteractionsTypes.LOGIN) {
        behaviors[StudentSummaryBehaviorTypes.LOGIN].push(`User logged in ${array.length} time(s)`);
      } else if (action === FAVORITE_TYPE.CAREERGOAL) {
        behaviors[StudentSummaryBehaviorTypes.OUTLOOK].push(`User modified career goals ${array.length} time(s)`);
        behaviors[StudentSummaryBehaviorTypes.OUTLOOK].push(`Career goals at end of session: ${_.last(array)}`);
      } else if (action === FAVORITE_TYPE.INTEREST) {
        behaviors[StudentSummaryBehaviorTypes.OUTLOOK].push(`User modified interests ${array.length} time(s)`);
        behaviors[StudentSummaryBehaviorTypes.OUTLOOK].push(`Interests at end of session: ${_.last(array)}`);
      } else if (action === FAVORITE_TYPE.ACADEMICPLAN) {
        behaviors[StudentSummaryBehaviorTypes.OUTLOOK].push(`User modified academic plan ${array.length} time(s)`);
        behaviors[StudentSummaryBehaviorTypes.OUTLOOK].push(`Academic plan at end of session: ${_.last(array)}`);
      } else if (action === UserInteractionsTypes.PAGEVIEW) {
        const explorerPages = {
          [EXPLORER_TYPE.ACADEMICPLANS]: [],
          [EXPLORER_TYPE.CAREERGOALS]: [],
          [EXPLORER_TYPE.COURSES]: [],
          [EXPLORER_TYPE.INTERESTS]: [],
          [EXPLORER_TYPE.OPPORTUNITIES]: [],
        };
        _.each(array, function (url) {
          if (url.includes('explorer/')) {
            const parsedUrl = url.split('/');
            if (parsedUrl.length > 2) {
              if (parsedUrl[1] === 'users') {
                // FIXME not exactly sure if this code is needed, since there isn't a third parameter after "users". Is this code necessary?
                parsedUrl[2] = parsedUrl[2].split(/[@%]/)[0];
              }
              explorerPages[parsedUrl[1]].push(parsedUrl[2]);
            }
          }
        });
        _.each(explorerPages, function (pages, pageName) {
          if (!_.isEmpty(pages)) {
            behaviors[StudentSummaryBehaviorTypes.EXPLORATION].push(`Entries viewed in ${pageName}: 
              ${_.uniq(pages).join(', ')}`);
          }
        });
      } else if (action === UserInteractionsTypes.ADDCOURSE) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Added the following courses: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.REMOVECOURSE) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Removed the following courses: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.UPDATECOURSE) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Updated the following courses: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.ADDOPPORTUNITY) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Added the following opportunities: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.REMOVEOPPORTUNITY) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Removed the following opportunities: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.UPDATEOPPORTUNITY) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Updated the following opportunities: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.VERIFYREQUEST) {
        behaviors[StudentSummaryBehaviorTypes.VERIFICATION].push(`Requested verification for: ${_.uniq(array).join(', ')}`);
      } else if (action === UserInteractionsTypes.ADDREVIEW) {
        behaviors[StudentSummaryBehaviorTypes.REVIEWING].push(`Added a review for the following items: ${formatReviewSlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.EDITREVIEW) {
        behaviors[StudentSummaryBehaviorTypes.REVIEWING].push(`Edited a review for the following items: ${formatReviewSlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.LEVEL) {
        behaviors[StudentSummaryBehaviorTypes.LEVEL].push(`Level updated ${array.length} time(s): ${array}`);
      } else if (action === UserInteractionsTypes.COMPLETEPLAN) {
        behaviors[StudentSummaryBehaviorTypes.COMPLETEPLAN].push(`User completed their plan with the following ICE points: ${array}`);
      } else if (action === UserInteractionsTypes.PICTURE) {
        behaviors[StudentSummaryBehaviorTypes.PROFILE].push(`User updated their picture ${array.length} time(s)`);
      } else if (action === UserInteractionsTypes.WEBSITE) {
        behaviors[StudentSummaryBehaviorTypes.PROFILE].push(`User updated their website ${array.length} time(s)`);
      } else if (action === UserInteractionsTypes.FAVORITEITEM) {
        behaviors[StudentSummaryBehaviorTypes.FAVORITE].push(`User favorited ${array.length} time(s)`);
        _.each(array, function (item) {
          behaviors[StudentSummaryBehaviorTypes.FAVORITE].push(`Item: ${item}`);
        });
      } else if (action === UserInteractionsTypes.UNFAVORITEITEM) {
        behaviors[StudentSummaryBehaviorTypes.UNFAVORITE].push(`User unfavorited ${array.length} time(s)`);
        _.each(array, function (item) {
          behaviors[StudentSummaryBehaviorTypes.UNFAVORITE].push(`Item: ${item}`);
        });
      }
    }
  });
  const behaviorsArray = [];
  _.each(behaviors, function (value, key) {
    if (!_.isEmpty(value)) {
      behaviorsArray.push({ type: key, stats: value });
    }
  });
  if (_.isEmpty(behaviorsArray)) {
    behaviorsArray.push({ type: 'No Behavior', stats: ['User browsed RadGrad with no significant behaviors.'] });
  }
  return behaviorsArray;
};

const StudentTimelineModal = (props: IStudentTimelineModalProps) => {
  const buttonStyle = {
    padding: 5,
    margin: 3,
  };
  const modalStyle = {
    height: 550,
    overflow: 'scroll',
  };
  const widthStyle = {
    width: '80%',
  };
  const headerStyle = {
    display: 'inline',
    color: '#6FBE44',
  };
  const colorStyle = {
    color: '#6FBE44',
  };
  return (
    <Modal trigger={(<Button color="grey" basic size="tiny" style={buttonStyle}>{props.username}</Button>)}>
      <Modal.Header>
        {profileIDToFullname(props.username)}&apos;s Timeline from {props.startDate} to {props.endDate}
      </Modal.Header>
      <Modal.Content>
        <Grid padded stackable centered style={modalStyle}>
          {getSessions(props).map((session, index) => {
            const day = moment(session[0].timestamp).utc(true).format('MMMM Do');
            const time = moment(session[0].timestamp).utc(true).format('h:mma');
            const duration = getSessionDuration(session);
            return (
              <Segment
                color="green"
                textAlign="left"
                style={widthStyle}
                key={`${_.uniqueId(`segment-${session[index].username}`)}`}
              >
                <Header dividing color="grey">
                  Day: <div style={headerStyle}>{day} </div>
                  Time: <div style={headerStyle}>{time} </div>
                  Duration: <div style={headerStyle}>{duration} </div>
                </Header>
                <Segment.Group>
                  {getBehaviors(session).map((behavior) => (
                    <Segment key={`${_.uniqueId(`behavior-segment-${behavior.type}`)}`}>
                      <Header as="h5">{behavior.type}</Header>
                      <List>
                        {behavior.stats.map((stat) => (
                          <List.Item style={colorStyle} key={`${_.uniqueId(`statkey:${stat}`)}`}>{stat}</List.Item>
                        ))}
                      </List>
                    </Segment>
                  ))}
                </Segment.Group>
              </Segment>
            );
          })}
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default StudentTimelineModal;

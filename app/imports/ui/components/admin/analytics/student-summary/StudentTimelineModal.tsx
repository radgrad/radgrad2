import React from 'react';
import { Button, Grid, Header, List, Modal, Segment } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';
import { PROFILE_ENTRY_TYPE } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import { profileIDToFullname } from '../../../shared/utilities/data-model';
import { UserInteraction } from '../../../../../typings/radgrad';
import { UserInteractionsTypes } from '../../../../../api/user-interaction/UserInteractionsTypes';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import { StudentSummaryBehaviorTypes } from './utilities/student-summary';

// TODO QA this is a very unstructured component.

interface StudentTimelineModalProps {
  username: string;
  startDate: string;
  endDate: string;
  // eslint-disable-next-line react/no-unused-prop-types
  interactions: UserInteraction[];
}

// This defines the time between sessions
const gap = 10;

const getSessions = (interactions: UserInteraction[]): UserInteraction[][] => {
  const sessions = [];
  let slicedIndex = 0;
  interactions.forEach((interaction, index: number, inters) => {
    if (index !== 0) {
      const prevTimestamp = moment(new Date(inters[index - 1].timestamp));
      const timestamp = moment(new Date(interaction.timestamp));
      const difference = moment.duration(timestamp.diff(prevTimestamp)).asMinutes();
      if (difference >= gap) {
        sessions.push(_.slice(inters, slicedIndex, index));
        slicedIndex = index;
      }
      if (index === inters.length - 1) {
        sessions.push(_.slice(inters, slicedIndex));
      }
    }
  });
  if (sessions.length === 0) {
    sessions.push(interactions);
  }
  return sessions;
};

const getSessionDuration = (sessionArr: UserInteraction[]): string => {
  const firstTimestamp = moment(sessionArr[0].timestamp);
  const lastTimestamp = moment(sessionArr[sessionArr.length - 1].timestamp);
  return moment.duration(lastTimestamp.diff(firstTimestamp)).asMinutes().toFixed(2);
};

// Helper function to format the typeData of addCourse, removeCourse, updateCourse, addOpportunity, removeOpportunity, and updateOpportunity
// strArray is an array of strings, the expected format of a string input in this array is "Term, Year, slug"
// This helper function maps the array such that the string is reformatted to "slug (Term Year)"
const formatCourseOpportunitySlugMessages = (strArray: string[]): string[] =>
  strArray.map((str) => {
    const split = str.split(', ');
    return `${split[2]} (${split[0]} ${split[1]})`;
  });

// Helper function to format the typeData of addReview and editReview
// strArray is an array of strings, the format of the expected string input is ["reviewType, Term-Year, slug"
// This helper function maps the array such that the string is reformatted to "slug (Term Year)"
const formatReviewSlugMessages = (strArray: string[]): string =>
  strArray
    .map((str) => {
      const split = str.split(', ');
      return `${split[2]} (${split[0]})`;
    })
    .join(', ');

const getBehaviors = (sessionArr: UserInteraction[]): { type: string; stats: string[] }[] => {
  const actions = {
    careerGoalIDs: [],
    interestIDs: [],
    [UserInteractionsTypes.PAGE_VIEW]: [],
    [UserInteractionsTypes.LOGIN]: [],
    [UserInteractionsTypes.LEVEL]: [],
    [UserInteractionsTypes.COMPLETE_PLAN]: [],
    [UserInteractionsTypes.PICTURE]: [],
    [UserInteractionsTypes.WEBSITE]: [],
    [UserInteractionsTypes.SHARE_INFORMATION]: [],
    [UserInteractionsTypes.ADD_COURSE]: [],
    [UserInteractionsTypes.REMOVE_COURSE]: [],
    [UserInteractionsTypes.UPDATE_COURSE]: [],
    [UserInteractionsTypes.ADD_OPPORTUNITY]: [],
    [UserInteractionsTypes.REMOVE_OPPORTUNITY]: [],
    [UserInteractionsTypes.UPDATE_OPPORTUNITY]: [],
    [UserInteractionsTypes.ADD_TO_PROFILE]: [],
    [UserInteractionsTypes.REMOVE_FROM_PROFILE]: [],
    [UserInteractionsTypes.ADD_REVIEW]: [],
    [UserInteractionsTypes.EDIT_REVIEW]: [],
    [UserInteractionsTypes.VERIFY_REQUEST]: [],
  };
  sessionArr.forEach((interaction) => {
    if (actions[interaction.type]) {
      // there are interaction types that we've removed, but are still in the UserInteractions
      actions[interaction.type].push(interaction.typeData.join(', '));
    }
  });
  const behaviors = {
    [StudentSummaryBehaviorTypes.LOGIN]: [],
    [StudentSummaryBehaviorTypes.OUTLOOK]: [],
    [StudentSummaryBehaviorTypes.EXPLORATION]: [],
    [StudentSummaryBehaviorTypes.PLANNING]: [],
    [StudentSummaryBehaviorTypes.VERIFICATION]: [],
    [StudentSummaryBehaviorTypes.REVIEWING]: [],
    [StudentSummaryBehaviorTypes.LEVEL]: [],
    [StudentSummaryBehaviorTypes.COMPLETE_PLAN]: [],
    [StudentSummaryBehaviorTypes.PROFILE]: [],
    [StudentSummaryBehaviorTypes.ADD_TO_PROFILE]: [],
    [StudentSummaryBehaviorTypes.REMOVE_FROM_PROFILE]: [],
  };
  // CAM actions is an object.
  _.each(actions, (array: string[], action: string) => {
    if (array.length !== 0) {
      if (action === UserInteractionsTypes.LOGIN) {
        behaviors[StudentSummaryBehaviorTypes.LOGIN].push(`User logged in ${array.length} time(s)`);
      } else if (action === PROFILE_ENTRY_TYPE.CAREERGOAL) {
        behaviors[StudentSummaryBehaviorTypes.OUTLOOK].push(`User modified career goals ${array.length} time(s)`);
        behaviors[StudentSummaryBehaviorTypes.OUTLOOK].push(`Career goals at end of session: ${_.last(array)}`);
      } else if (action === PROFILE_ENTRY_TYPE.INTEREST) {
        behaviors[StudentSummaryBehaviorTypes.OUTLOOK].push(`User modified interests ${array.length} time(s)`);
        behaviors[StudentSummaryBehaviorTypes.OUTLOOK].push(`Interests at end of session: ${_.last(array)}`);
      } else if (action === UserInteractionsTypes.PAGE_VIEW) {
        const explorerPages = {
          [EXPLORER_TYPE.CAREERGOALS]: [],
          [EXPLORER_TYPE.COURSES]: [],
          [EXPLORER_TYPE.INTERESTS]: [],
          [EXPLORER_TYPE.OPPORTUNITIES]: [],
        };
        array.forEach((url) => {
          if (url.includes('explorer/')) {
            const parsedUrl = url.split('/');
            if (parsedUrl.length > 2) {
              if (parsedUrl[1] === 'users') {
                // FIXME not exactly sure if this code is needed, since there isn't a third parameter after "users". Is this code necessary?
                parsedUrl[2] = parsedUrl[2].split(/[@%]/)[0];
              }
              if (explorerPages[parsedUrl[1]]) {
                // there are explorer pages that we removed.
                explorerPages[parsedUrl[1]].push(parsedUrl[2]);
              }
            }
          }
        });
        // CAM explorerPages is an object
        _.each(explorerPages, (pages, pageName) => {
          if (!_.isEmpty(pages)) {
            behaviors[StudentSummaryBehaviorTypes.EXPLORATION].push(`Entries viewed in ${pageName}: 
              ${_.uniq(pages).join(', ')}`);
          }
        });
      } else if (action === UserInteractionsTypes.ADD_COURSE) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Added the following courses: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.REMOVE_COURSE) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Removed the following courses: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.UPDATE_COURSE) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Updated the following courses: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.ADD_OPPORTUNITY) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Added the following opportunities: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.REMOVE_OPPORTUNITY) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Removed the following opportunities: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.UPDATE_OPPORTUNITY) {
        behaviors[StudentSummaryBehaviorTypes.PLANNING].push(`Updated the following opportunities: ${formatCourseOpportunitySlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.VERIFY_REQUEST) {
        behaviors[StudentSummaryBehaviorTypes.VERIFICATION].push(`Requested verification for: ${_.uniq(array).join(', ')}`);
      } else if (action === UserInteractionsTypes.ADD_REVIEW) {
        behaviors[StudentSummaryBehaviorTypes.REVIEWING].push(`Added a review for the following items: ${formatReviewSlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.EDIT_REVIEW) {
        behaviors[StudentSummaryBehaviorTypes.REVIEWING].push(`Edited a review for the following items: ${formatReviewSlugMessages(_.uniq(array))}`);
      } else if (action === UserInteractionsTypes.LEVEL) {
        behaviors[StudentSummaryBehaviorTypes.LEVEL].push(`Level updated ${array.length} time(s): ${array}`);
      } else if (action === UserInteractionsTypes.COMPLETE_PLAN) {
        behaviors[StudentSummaryBehaviorTypes.COMPLETE_PLAN].push(`User completed their plan with the following ICE points: ${array}`);
      } else if (action === UserInteractionsTypes.PICTURE) {
        behaviors[StudentSummaryBehaviorTypes.PROFILE].push(`User updated their picture ${array.length} time(s)`);
      } else if (action === UserInteractionsTypes.WEBSITE) {
        behaviors[StudentSummaryBehaviorTypes.PROFILE].push(`User updated their website ${array.length} time(s)`);
      } else if (action === UserInteractionsTypes.ADD_TO_PROFILE) {
        behaviors[StudentSummaryBehaviorTypes.ADD_TO_PROFILE].push(`User added items to profile ${array.length} time(s)`);
        array.forEach((item) => {
          behaviors[StudentSummaryBehaviorTypes.ADD_TO_PROFILE].push(`Item: ${item}`);
        });
      } else if (action === UserInteractionsTypes.REMOVE_FROM_PROFILE) {
        behaviors[StudentSummaryBehaviorTypes.REMOVE_FROM_PROFILE].push(`User removed items from profile ${array.length} time(s)`);
        array.forEach((item) => {
          behaviors[StudentSummaryBehaviorTypes.REMOVE_FROM_PROFILE].push(`Item: ${item}`);
        });
      }
    }
  });
  const behaviorsArray = [];
  // CAM behaviors is an object
  _.each(behaviors, (value, key) => {
    if (!_.isEmpty(value)) {
      behaviorsArray.push({ type: key, stats: value });
    }
  });
  if (_.isEmpty(behaviorsArray)) {
    behaviorsArray.push({ type: 'No Behavior', stats: ['User browsed RadGrad with no significant behaviors.'] });
  }
  return behaviorsArray;
};

const StudentTimelineModal: React.FC<StudentTimelineModalProps> = ({ endDate, username, startDate, interactions }) => {
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
    <Modal
      trigger={
        <Button color="grey" basic size="tiny" style={buttonStyle}>
          {username}
        </Button>
      }
    >
      <Modal.Header>
        {profileIDToFullname(username)}&apos;s Timeline from {startDate} to {endDate}
      </Modal.Header>
      <Modal.Content>
        <Grid padded stackable centered style={modalStyle}>
          {getSessions(interactions).map((session, index) => {
            const day = moment(session[0].timestamp).utc(true).format('MMMM Do');
            const time = moment(session[0].timestamp).utc(true).format('h:mma');
            const duration = getSessionDuration(session);
            return (
              <Segment color="green" textAlign="left" style={widthStyle} key={`${_.uniqueId(`segment-${session[index].username}`)}`}>
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
                          <List.Item style={colorStyle} key={`${_.uniqueId(`statkey:${stat}`)}`}>
                            {stat}
                          </List.Item>
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

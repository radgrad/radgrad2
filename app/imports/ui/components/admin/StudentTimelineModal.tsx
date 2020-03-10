import React from 'react';
import { Button, Grid, Header, List, Modal, Segment } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';
import { profileIDToFullname } from '../shared/data-model-helper-functions';

interface IStudentTimelineModalProps {
  username: string;
  startDate: string;
  endDate: string;
  interactions: any;
}

// This defines the time between sessions
const gap = 10;

const getSessions = (props: IStudentTimelineModalProps) => {
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
  // console.log(sessions);
  return sessions;
};

const getSessionDuration = (sessionArr) => {
  const firstTimestamp = moment(sessionArr[0].timestamp);
  const lastTimestamp = moment(sessionArr[sessionArr.length - 1].timestamp);
  return moment.duration(lastTimestamp.diff(firstTimestamp)).asMinutes().toFixed(2);
};

const getBehaviors = (sessionArr) => {
  const actions = {
    login: [], careerGoalIDs: [], interestIDs: [], academicPlanID: [], pageView: [],
    addCourse: [], removeCourse: [], addOpportunity: [], removeOpportunity: [], verifyRequest: [],
    addReview: [], askQuestion: [], level: [], picture: [], website: [], favoriteItem: [], unFavoriteItem: [],
  };
  _.each(sessionArr, function (interaction) {
    actions[interaction.type].push(interaction.typeData.join(', '));
  });
  const behaviors = {
    'Log In': [], 'Change Outlook': [], Exploration: [], Planning: [], Verification: [],
    Reviewing: [], Mentorship: [], 'Level Up': [], Profile: [], 'Favorite Item': [], 'Unfavorite Item': [],
  };
  _.each(actions, function (array, action) {
    if (array.length !== 0) {
      if (action === 'login') {
        behaviors['Log In'].push(`User logged in ${array.length} time(s)`);
      } else if (action === 'careerGoalIDs') {
        behaviors['Change Outlook'].push(`User modified career goals ${array.length} time(s)`);
        behaviors['Change Outlook'].push(`Career goals at end of session: ${_.last(array)}`);
      } else if (action === 'interestIDs') {
        behaviors['Change Outlook'].push(`User modified interests ${array.length} time(s)`);
        behaviors['Change Outlook'].push(`Interests at end of session: ${_.last(array)}`);
      } else if (action === 'academicPlanID') {
        behaviors['Change Outlook'].push(`User modified academic plan ${array.length} time(s)`);
        behaviors['Change Outlook'].push(`Academic plan at end of session: ${_.last(array)}`);
      } else if (action === 'pageView') {
        const explorerPages = {
          'career-goals': [], plans: [], opportunities: [], courses: [], users: [],
          interests: [], degrees: [],
        };
        let visitedMentor = false;
        _.each(array, function (url) {
          if (url.includes('explorer/')) {
            const parsedUrl = url.split('/');
            if (parsedUrl.length > 2) {
              if (parsedUrl[1] === 'users') {
                parsedUrl[2] = parsedUrl[2].split(/[@%]/)[0];
              }
              explorerPages[parsedUrl[1]].push(parsedUrl[2]);
            }
          } else if (url.includes('mentor-space')) {
            visitedMentor = true;
          }
        });
        _.each(explorerPages, function (pages, pageName) {
          if (!_.isEmpty(pages)) {
            behaviors.Exploration.push(`Entries viewed in ${pageName}: 
              ${_.uniq(pages).join(', ')}`);
          }
        });
        if (visitedMentor) {
          behaviors.Mentorship.push('User visited the Mentor Space page');
        }
      } else if (action === 'addCourse') {
        behaviors.Planning.push(`Added the following courses: ${_.uniq(array)}`);
      } else if (action === 'removeCourse') {
        behaviors.Planning.push(`Removed the following courses: ${_.uniq(array)}`);
      } else if (action === 'addOpportunity') {
        behaviors.Planning.push(`Added the following opportunites: ${_.uniq(array)}`);
      } else if (action === 'removeOpportunity') {
        behaviors.Planning.push(`Removed the following opportunities: ${_.uniq(array)}`);
      } else if (action === 'verifyRequest') {
        behaviors.Verification.push(`Requested verification for: ${_.uniq(array)}`);
      } else if (action === 'addReview') {
        behaviors.Reviewing.push(`Reviewed the following courses: ${_.uniq(array)}`);
      } else if (action === 'askQuestion') {
        behaviors.Mentorship.push(`Asked ${array.length} question(s): `);
        _.each(array, function (question) {
          behaviors.Mentorship.push(`Question: ${question}`);
        });
      } else if (action === 'level') {
        behaviors['Level Up'].push(`Level updated ${array.length} time(s): ${array}`);
      } else if (action === 'picture') {
        behaviors.Profile.push(`User updated their picture ${array.length} time(s)`);
      } else if (action === 'website') {
        behaviors.Profile.push(`User updated their website ${array.length} time(s)`);
      } else if (action === 'favoriteItem') {
        behaviors['Favorite Item'].push(`User added favorites ${array.length} time(s)`);
        _.each(array, function (item) {
          behaviors['Favorite Item'].push(`Item: ${item}`);
        });
      } else if (action === 'unFavoriteItem') {
        behaviors['Unfavorite Item'].push(`User removed favorites ${array.length} time(s)`);
        _.each(array, function (item) {
          behaviors['Unfavorite Item'].push(`Item: ${item}`);
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
  // console.log(props);
  const textAlignStyle = {
    textAlign: 'left',
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
    <Modal trigger={
      (
        <Button
          color="grey"
          size="tiny"
          basic
          fluid
          style={textAlignStyle}
          value={props.username}
        >
          {props.username}
        </Button>
      )
    }
    >
      <Modal.Header>
        {profileIDToFullname(props.username)}
        &apos;s Timeline from&nbsp;
        {props.startDate}
        &nbsp;to&nbsp;
        {props.endDate}
      </Modal.Header>
      <Modal.Content>
        <Grid padded stackable centered style={modalStyle}>
          {getSessions(props).map((session, index) => {
            const key = `segment-${index}`;
            return (
              <Segment color="green" textAlign="left" style={widthStyle} key={key}>
                <Header dividing color="grey">
                  Day:&nbsp;
                  <div style={headerStyle}>{moment(session[0].timestamp).utc(true).format('MMMM Do')}</div>
                  &nbsp;Time:&nbsp;
                  <div style={headerStyle}>{moment(session[0].timestamp).utc(true).format('h:mma')}</div>
                  &nbsp;Duration:&nbsp;
                  <div style={headerStyle}>{getSessionDuration(session)}</div>
                </Header>
                <Segment.Group>
                  {getBehaviors(session).map((b, ind) => {
                    const bkey = `behavior-segment-${ind}`;
                    return (
                      <Segment key={bkey}>
                        <Header as="h5">{b.type}</Header>
                        <List>
                          {b.stats.map((stat, i) => {
                            const statKey = `statkey${i}`;
                            return (<List.Item style={colorStyle} key={statKey}>{stat}</List.Item>);
                          })}
                        </List>
                      </Segment>
                    );
                  })}
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

import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Menu, Tab, Modal, Button } from 'semantic-ui-react';
import { useParams } from 'react-router';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { CareerGoal } from '../../../../typings/radgrad';
import RadGradTabHeader from '../../../components/shared/RadGradTabHeader';
import Task3Component from './Task3Component';
import { Users } from '../../../../api/user/UserCollection';
import Task2Segment from './Task2Segment';
import Task5Component from './Task5Component';



export interface Task7SegmentProps {
  loggedInUser: string;
  urlUser: string;
  count: number,
  careerGoals: CareerGoal[];
}
const Task7Component: React.FC<Task7SegmentProps> = ({ careerGoals, loggedInUser, urlUser }) => {
  const [open, setOpen] = useState(false);
  const Task7Header = <RadGradHeader title="TASK 7: Tabbed and Modal Component" icon = "server"/>;
  const Task1Header = <RadGradTabHeader title="TASK 3: CAREER GOAL"/>;
  const Task2Header = <RadGradTabHeader title="TASK 2:  WHO IS THE USER?"/>;
  const Task5Header = <RadGradTabHeader title="Task 5 SHOW ME THE DESCRIPTION"/>;

  const task7Pane = [
    {
      menuItem:<Menu.Item key='task1tab'>{Task2Header}</Menu.Item>,
      render: ()=> (
              <Task2Segment loggedInUser={loggedInUser} urlUser={urlUser}/> ),
    },
    {
      menuItem:<Menu.Item key='task2tab'>{Task1Header}</Menu.Item>,
      render: ()=> (
              <Task3Component/>
      ),
    },
    {
      menuItem:<Menu.Item key='task5tab'>{Task5Header}</Menu.Item>,
      render: ()=> (
              <Modal size='small'
                     onClose={() => setOpen(false)}
                     onOpen={() => setOpen(true)}
                     open={open}
                     trigger={<Button textAlign='centered'>SEE THE DIFFERENT INTERESTS</Button>}>
                  <Modal.Header>SEE THE DIFFERENT INTERESTS IN CS</Modal.Header>
                  <Modal.Content><Task5Component/></Modal.Content>
              </Modal>
      ),
    },
  ];
  return (
        <RadGradSegment header={Task7Header}>
            <Tab panes={task7Pane}/>
        </RadGradSegment>
  );
};
export default withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  const loggedInUser = Meteor.user() ? Meteor.user().username : '';
  const { username } = useParams();
  const urlUser = Users.getProfile(username).username;
  const count = CareerGoals.countNonRetired();
  return {
    careerGoals,
    urlUser,
    loggedInUser,
    count,
  };
})(Task7Component);

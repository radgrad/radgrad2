import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router-dom';
import React from 'react';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';

const Task2: React.FC = () => {

  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const { username } = useParams();

  return (
    <RadGradSegment header={<RadGradHeader title='TASK 2: WHO IS THE USER?' icon='user graduate' dividing />}>
      <p>The currently logged in user is: {currentUser}.</p>
      <p>The username appearing in the URL is: {username}.</p>
      <p>In RadGrad, these are not necessarily the same!</p>
    </RadGradSegment>
  );
};


export default Task2;
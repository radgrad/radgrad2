import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useParams } from 'react-router';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

const Task2: React.FC = () => {
  const header = <RadGradHeader title='Task 2: Who is the user?' icon='user graduate' />;
  const { username } = useParams();
  const loggedInUsername = Meteor.user() ? Meteor.user().username : '';
  return (
    <RadGradSegment header={header}>
      <p>The currently logged in user is: {loggedInUsername}.</p>

      <p>The username appearing in the URL is: {username}.</p>

      <p>In RadGrad, these are not necessarily the same!</p>
    </RadGradSegment>
  );
};

export default Task2;

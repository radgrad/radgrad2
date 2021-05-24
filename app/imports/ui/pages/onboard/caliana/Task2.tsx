import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router-dom';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

const Task2: React.FC = () => {
  const headerTask2 = <RadGradHeader title='Task 2: Who is the user?' icon='user graduate icon'/>;
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const { username } = useParams();

  return (
        <RadGradSegment header={headerTask2}>
            <p>The currently logged in user is: { currentUser }</p>
            <p>The username appearing in the URL is: { username }</p>
            <p>In RadGrad, these are not necessarily the same!</p>
        </RadGradSegment>
  );
};

export default Task2;

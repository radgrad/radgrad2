import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router-dom';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';
import { Users } from '../../../app/imports/api/user/UserCollection';

interface Task2Prop {
  user: string;
  urlName: string;
}

const Task2: React.FC<Task2Prop> = ({ user, urlName }) => {
  const style = {
    marginBottom: 30,
  };
  return (
    <div className='column'>
      <RadGradSegment header={<RadGradHeader title='TASK 2: WHO IS THE USER?' icon='user graduate'/>}>
        <p style={style}>The current logged in user is: {user}</p>
        <p style={style}>The username appearing in the URL is: {urlName}</p>
        <p style={style}>In RadGrad, these are not necessarily the same!</p>
      </RadGradSegment>
    </div>
  );
};

export default withTracker(() => {
  const user = Meteor.user() ? Meteor.user().username : '';
  const { username } = useParams();
  const urlName = Users.getProfile(username).username;
  return {
    user,
    urlName,
  };
})(Task2);

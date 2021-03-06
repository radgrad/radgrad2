import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Users } from '../../../app/imports/api/user/UserCollection';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';

const Task2Segment: React.FC = () => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const { username } = useParams();
  const urlUser = Users.getProfile(username).username;
  return (
    <RadGradSegment header={<RadGradHeader dividing title='Task 2: Who Is The User?' icon='user graduate'/>}>
    The currently logged in user is: {currentUser} <br/>
    The username appearing in the URL is: {urlUser} <br/>
    In RadGrad, these are not necessarily the same!
    </RadGradSegment>
  );
};
export default Task2Segment;

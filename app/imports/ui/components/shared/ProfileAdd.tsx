import * as React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { IAcademicPlan } from '../../../typings/radgrad'; // eslint-disable-line
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { Users } from '../../../api/user/UserCollection';

interface IProfileAddProps {
  item: IAcademicPlan;
  type: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class ProfileAdd extends React.Component<IProfileAddProps> {
  constructor(props) {
    super(props);
  }

  private getRoleByUrl = (): string => {
    const url = this.props.match.url;
    const username = this.props.match.params.username;
    const indexUsername = url.indexOf(username);
    return url.substring(1, indexUsername - 1);
  }

  private handleAddToProfile = (e: any): void => {
    e.preventDefault();
    const { item, type } = this.props;
    const username = this.props.match.params.username;
    if (username) {
      const updateData: { [key: string]: any } = {};
      const profile = Users.getProfile(username);
      updateData.id = profile._id;
      const role = this.getRoleByUrl();
      let collectionName = '';
      if (role === 'student') {
        collectionName = StudentProfiles.getCollectionName();
      } else if (role === 'faculty') {
        collectionName = FacultyProfiles.getCollectionName();
      } else {
        collectionName = MentorProfiles.getCollectionName();
      }
      if (type === 'careergoals') {
        updateData.careerGoals = profile.careerGoalIDs;
        updateData.careerGoals.push(item._id);
      } else if (type === 'interests') {
        updateData.interests = profile.interestIDs;
        updateData.interests.push(item._id);
      } else if (type === 'plans') {
        updateData.academicPlan = item._id;
      }
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.log('Error updating user ', error);
        }
      });
    }
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { type } = this.props;
    const isTypePlans = type === 'plans';

    return (
      isTypePlans ?
        <Button onClick={this.handleAddToProfile}><Icon name="plus"/><br/>Select Plan</Button>
        :
        <Button onClick={this.handleAddToProfile}><Icon name="plus"/><br/>Add to Profile</Button>
    );
  }
}

export default withRouter(ProfileAdd);

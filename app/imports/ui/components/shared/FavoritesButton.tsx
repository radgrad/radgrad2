import * as React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { _ } from 'lodash';
import { IAcademicPlan, ICareerGoal, ICourse, IInterest, IOpportunity } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import * as Router from './RouterHelperFunctions';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';

interface IFavoriteButtonProps {
  studentID: string;
  type: string;
  role: string;
  item: IAcademicPlan | ICareerGoal | ICourse | IInterest | IOpportunity;
  added: boolean;
}

class FavoritesButton extends React.Component<IFavoriteButtonProps> {
  constructor(props) {
    super(props);
    console.log('FavoritesButton ', props);
  }

  private handleAdd = () => {
    const profile = Users.getProfile(this.props.studentID);
    const student = profile.username;
    let collectionName;
    let definitionData: any;
    let cName: string;
    let updateData: any;
    switch (this.props.type) {
      case 'academicPlan':
        collectionName = FavoriteAcademicPlans.getCollectionName();
        definitionData = {
          student,
          academicPlan: Slugs.getNameFromID(this.props.item.slugID),
          retired: false,
        };
        break;
      case 'careerGoal':
        collectionName = FavoriteCareerGoals.getCollectionName();
        definitionData = {
          student,
          careerGoal: Slugs.getNameFromID(this.props.item.slugID),
          retired: false,
        };
        const careerGoals = profile.careerGoalIDs; // eslint-disable-line no-case-declarations
        careerGoals.push(this.props.item._id);
        updateData = {
          id: profile._id,
          careerGoals,
        };
        switch (this.props.role) {
          case 'student':
            cName = StudentProfiles.getCollectionName();
            break;
          default:
            cName = FacultyProfiles.getCollectionName();
        }
        updateMethod.call({ collectionName: cName, updateData }, (error) => {
          if (error) {
            console.error('Failed to update StudentProfile', error);
          }
        });
        break;
      case 'course':
        collectionName = FavoriteCourses.getCollectionName();
        definitionData = {
          student,
          course: Slugs.getNameFromID(this.props.item.slugID),
          retired: false,
        };
        break;
      case 'interest':
        collectionName = FavoriteInterests.getCollectionName();
        definitionData = {
          student,
          interest: Slugs.getNameFromID(this.props.item.slugID),
          retired: false,
        };
        const interests = profile.interestIDs; // eslint-disable-line no-case-declarations
        interests.push(this.props.item._id);
        updateData = {
          id: profile._id,
          interests,
        };
        switch (this.props.role) {
          case 'student':
            cName = StudentProfiles.getCollectionName();
            break;
          default:
            cName = FacultyProfiles.getCollectionName();
        }
        updateMethod.call({ collectionName: cName, updateData }, (error) => {
          if (error) {
            console.error('Failed to update StudentProfile', error);
          }
        });
        break;
      default:
        collectionName = FavoriteOpportunities.getCollectionName();
        definitionData = {
          student,
          opportunity: Slugs.getNameFromID(this.props.item.slugID),
          retired: false,
        };
    }
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('Failed to add favorites ', error);
      }
    });
  }

  private handleRemove = () => {
    const profile = Users.getProfile(this.props.studentID);
    let instance;
    let collectionName;
    let updateData: any;
    let cName: string;
    switch (this.props.type) {
      case 'academicPlan':
        collectionName = FavoriteAcademicPlans.getCollectionName();
        instance = FavoriteAcademicPlans.findNonRetired({
          studentID: this.props.studentID,
          academicPlanID: this.props.item._id,
        })[0]._id;
        break;
      case 'careerGoal':
        collectionName = FavoriteCareerGoals.getCollectionName();
        instance = FavoriteCareerGoals.findNonRetired({
          studentID: this.props.studentID,
          careerGoalID: this.props.item._id,
        })[0]._id;
        updateData = {
          id: profile._id,
          careerGoals: _.without(profile.careerGoalIDs, this.props.item._id),
        };
        switch (this.props.role) {
          case 'student':
            cName = StudentProfiles.getCollectionName();
            break;
          default:
            cName = FacultyProfiles.getCollectionName();
        }
        updateMethod.call({ collectionName: cName, updateData }, (error) => {
          if (error) {
            console.error('Failed to update StudentProfile', error);
          }
        });
        break;
      case 'course':
        collectionName = FavoriteCourses.getCollectionName();
        instance = FavoriteCourses.findNonRetired({
          studentID: this.props.studentID,
          courseID: this.props.item._id,
        })[0]._id;
        break;
      case 'interest':
        collectionName = FavoriteInterests.getCollectionName();
        instance = FavoriteInterests.findNonRetired({
          studentID: this.props.studentID,
          interestID: this.props.item._id,
        })[0]._id;
        updateData = {
          id: profile._id,
          interests: _.without(profile.interestIDs, this.props.item._id),
        };
        switch (this.props.role) {
          case 'student':
            cName = StudentProfiles.getCollectionName();
            break;
          default:
            cName = FacultyProfiles.getCollectionName();
        }
        updateMethod.call({ collectionName: cName, updateData }, (error) => {
          if (error) {
            console.error('Failed to update StudentProfile', error);
          }
        });
        break;
      default:
        collectionName = FavoriteOpportunities.getCollectionName();
        instance = FavoriteOpportunities.findNonRetired({
          studentID: this.props.studentID,
          opportunityID: this.props.item._id,
        })[0]._id;
    }
    removeItMethod.call({ collectionName, instance }, (error) => {
      if (error) {
        console.error('Failed to remove favorite', error);
      }
    });
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (<React.Fragment>{this.props.added ?
      <Button onClick={this.handleRemove} size={'mini'} color={'green'} floated={'right'} basic={true}><Icon
        name="heart outline" color='red'/><Icon name="minus"/>REMOVE FROM FAVORITES</Button>
      :
      <Button size={'mini'} onClick={this.handleAdd} color={'green'} floated={'right'} basic={true}><Icon name="heart"
                                                                                                          color="red"/><Icon
        name="plus"/>ADD TO
        FAVORITES</Button>}</React.Fragment>);
  }
}

export default withRouter(withTracker((props) => {
  const count = FavoriteAcademicPlans.findNonRetired({
      studentID: props.studentID,
      academicPlanID: props.item._id,
    }).length +
    FavoriteCareerGoals.findNonRetired({ studentID: props.studentID, careerGoalID: props.item._id }).length +
    FavoriteCourses.findNonRetired({ studentID: props.studentID, courseID: props.item._id }).length +
    FavoriteInterests.findNonRetired({ studentID: props.studentID, interestID: props.item._id }).length +
    FavoriteOpportunities.findNonRetired({ studentID: props.studentID, opportunityID: props.item._id }).length;
  const role = Router.getRoleByUrl(props.match);
  return {
    added: count > 0,
    role,
  };
})(FavoritesButton));

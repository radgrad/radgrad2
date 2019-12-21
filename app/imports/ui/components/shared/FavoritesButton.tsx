import * as React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { IAcademicPlan, ICareerGoal, ICourse, IInterest, IOpportunity } from '../../../typings/radgrad';
import { FavoriteAcademicPlans } from '../../../api/favorite/FavoriteAcademicPlanCollection';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';
import * as Router from './RouterHelperFunctions';

interface IFavoriteButtonProps {
  studentID: string;
  type: string;
  role: string;
  item: IAcademicPlan | ICareerGoal | ICourse | IInterest | IOpportunity;
  added: boolean;
}

const handleAdd = (props: IFavoriteButtonProps) => () => {
  // console.log('handleAdd', props);
  const profile = Users.getProfile(props.studentID);
  const student = profile.username;
  let collectionName;
  let definitionData: any;
  switch (props.type) {
    case 'academicPlan':
      collectionName = FavoriteAcademicPlans.getCollectionName();
      definitionData = {
        student,
        academicPlan: Slugs.getNameFromID(props.item.slugID),
        retired: false,
      };
      break;
    case 'careerGoal':
      collectionName = FavoriteCareerGoals.getCollectionName();
      definitionData = {
        username: student,
        careerGoal: Slugs.getNameFromID(props.item.slugID),
        retired: false,
      };
      break;
    case 'course':
      collectionName = FavoriteCourses.getCollectionName();
      definitionData = {
        student,
        course: Slugs.getNameFromID(props.item.slugID),
        retired: false,
      };
      break;
    case 'interest':
      collectionName = FavoriteInterests.getCollectionName();
      definitionData = {
        username: student,
        interest: Slugs.getNameFromID(props.item.slugID),
        retired: false,
      };
      break;
    default:
      collectionName = FavoriteOpportunities.getCollectionName();
      definitionData = {
        student,
        opportunity: Slugs.getNameFromID(props.item.slugID),
        retired: false,
      };
  }
  // console.log(collectionName, definitionData);
  defineMethod.call({ collectionName, definitionData }, (error) => {
    if (error) {
      console.error('Failed to add favorites ', error);
    }
  });
};

const handleRemove = (props: IFavoriteButtonProps) => () => {
  // console.log('handleRemove', props);
  let instance;
  let collectionName;
  switch (props.type) {
    case 'academicPlan':
      collectionName = FavoriteAcademicPlans.getCollectionName();
      instance = FavoriteAcademicPlans.findNonRetired({
        studentID: props.studentID,
        academicPlanID: props.item._id,
      })[0]._id;
      break;
    case 'careerGoal':
      collectionName = FavoriteCareerGoals.getCollectionName();
      instance = FavoriteCareerGoals.findNonRetired({
        userID: props.studentID,
        careerGoalID: props.item._id,
      })[0]._id;
      break;
    case 'course':
      collectionName = FavoriteCourses.getCollectionName();
      instance = FavoriteCourses.findNonRetired({
        studentID: props.studentID,
        courseID: props.item._id,
      })[0]._id;
      break;
    case 'interest':
      collectionName = FavoriteInterests.getCollectionName();
      instance = FavoriteInterests.findNonRetired({
        userID: props.studentID,
        interestID: props.item._id,
      })[0]._id;
      break;
    default:
      collectionName = FavoriteOpportunities.getCollectionName();
      instance = FavoriteOpportunities.findNonRetired({
        studentID: props.studentID,
        opportunityID: props.item._id,
      })[0]._id;
  }
  removeItMethod.call({ collectionName, instance }, (error) => {
    if (error) {
      console.error('Failed to remove favorite', error);
    }
  });
};


const FavoritesButton = (props: IFavoriteButtonProps) => (
  <React.Fragment>
    {props.added ? (
      <Button onClick={handleRemove(props)} size="mini" color="green" floated="right" basic>
        <Icon
          name="heart outline"
          color="red"
        />
        <Icon name="minus" />
REMOVE FROM FAVORITES
      </Button>
)
  : (
    <Button size="mini" onClick={handleAdd(props)} color="green" floated="right" basic>
      <Icon
        name="heart"
        color="red"
      />
      <Icon
        name="plus"
      />
ADD TO FAVORITES
    </Button>
)}
  </React.Fragment>
);

export default withRouter(withTracker((props) => {
  const count = FavoriteAcademicPlans.findNonRetired({
      studentID: props.studentID,
      academicPlanID: props.item._id,
    }).length +
    FavoriteCareerGoals.findNonRetired({ userID: props.studentID, careerGoalID: props.item._id }).length +
    FavoriteCourses.findNonRetired({ studentID: props.studentID, courseID: props.item._id }).length +
    FavoriteInterests.findNonRetired({ userID: props.studentID, interestID: props.item._id }).length +
    FavoriteOpportunities.findNonRetired({ studentID: props.studentID, opportunityID: props.item._id }).length;
  const role = Router.getRoleByUrl(props.match);
  return {
    added: count > 0,
    role,
  };
})(FavoritesButton));

import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
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
import { UserInteractionsDataType, UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { FAVORITE_TYPE } from '../../../api/favorite/FavoriteTypes';

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
  let interactionData: UserInteractionsDataType;
  const slug = Slugs.getNameFromID(props.item.slugID);
  switch (props.type) {
    case FAVORITE_TYPE.ACADEMICPLAN:
      collectionName = FavoriteAcademicPlans.getCollectionName();
      definitionData = {
        student,
        academicPlan: slug,
        retired: false,
      };
      interactionData = {
        username: student,
        type: UserInteractionsTypes.FAVACADEMICPLAN,
        typeData: slug,
      };
      break;
    case FAVORITE_TYPE.CAREERGOAL:
      collectionName = FavoriteCareerGoals.getCollectionName();
      definitionData = {
        username: student,
        careerGoal: slug,
        retired: false,
      };
      interactionData = {
        username: student,
        type: UserInteractionsTypes.FAVCAREERGOAL,
        typeData: slug,
      };
      break;
    case FAVORITE_TYPE.COURSE:
      collectionName = FavoriteCourses.getCollectionName();
      definitionData = {
        student,
        course: slug,
        retired: false,
      };
      interactionData = {
        username: student,
        type: UserInteractionsTypes.FAVCOURSE,
        typeData: slug,
      };
      break;
    case FAVORITE_TYPE.INTEREST:
      collectionName = FavoriteInterests.getCollectionName();
      definitionData = {
        username: student,
        interest: slug,
        retired: false,
      };
      interactionData = {
        username: student,
        type: UserInteractionsTypes.FAVINTEREST,
        typeData: slug,
      };
      break;
    default: // opportunity
      collectionName = FavoriteOpportunities.getCollectionName();
      definitionData = {
        student,
        opportunity: slug,
        retired: false,
      };
      interactionData = {
        username: student,
        type: UserInteractionsTypes.FAVOPPORTUNITY,
        typeData: slug,
      };
  }
  // console.log(collectionName, definitionData);
  defineMethod.call({ collectionName, definitionData }, (error) => {
    if (error) {
      Swal.fire({
        title: 'Failed to Favorite',
        icon: 'error',
        text: 'This item failed to be added to your favorites.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    } else {
      Swal.fire({
        title: 'Favorited',
        icon: 'success',
        text: 'You have successfully favorited this item.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
        if (userInteractionError) {
          console.log('Error creating UserInteraction.', userInteractionError);
        }
      });
    }
  });
};

const handleRemove = (props: IFavoriteButtonProps) => () => {
  // console.log('handleRemove', props);
  const profile = Users.getProfile(props.studentID);
  const student = profile.username;
  let instance;
  let collectionName;
  let interactionData: UserInteractionsDataType;
  const slug = Slugs.getNameFromID(props.item.slugID);
  switch (props.type) {
    case FAVORITE_TYPE.ACADEMICPLAN:
      collectionName = FavoriteAcademicPlans.getCollectionName();
      instance = FavoriteAcademicPlans.findNonRetired({
        studentID: props.studentID,
        academicPlanID: props.item._id,
      })[0]._id;
      interactionData = {
        username: student,
        type: UserInteractionsTypes.UNFAVACADEMICPLAN,
        typeData: slug,
      };
      break;
    case FAVORITE_TYPE.CAREERGOAL:
      collectionName = FavoriteCareerGoals.getCollectionName();
      instance = FavoriteCareerGoals.findNonRetired({
        userID: props.studentID,
        careerGoalID: props.item._id,
      })[0]._id;
      interactionData = {
        username: student,
        type: UserInteractionsTypes.UNFAVCAREERGOAL,
        typeData: slug,
      };
      break;
    case FAVORITE_TYPE.COURSE:
      collectionName = FavoriteCourses.getCollectionName();
      instance = FavoriteCourses.findNonRetired({
        studentID: props.studentID,
        courseID: props.item._id,
      })[0]._id;
      interactionData = {
        username: student,
        type: UserInteractionsTypes.UNFAVCOURSE,
        typeData: slug,
      };
      break;
    case FAVORITE_TYPE.INTEREST:
      collectionName = FavoriteInterests.getCollectionName();
      instance = FavoriteInterests.findNonRetired({
        userID: props.studentID,
        interestID: props.item._id,
      })[0]._id;
      interactionData = {
        username: student,
        type: UserInteractionsTypes.UNFAVINTEREST,
        typeData: slug,
      };
      break;
    default: // opportunity
      collectionName = FavoriteOpportunities.getCollectionName();
      instance = FavoriteOpportunities.findNonRetired({
        studentID: props.studentID,
        opportunityID: props.item._id,
      })[0]._id;
      interactionData = {
        username: student,
        type: UserInteractionsTypes.UNFAVOPPORTUNITY,
        typeData: slug,
      };
  }
  removeItMethod.call({ collectionName, instance }, (error) => {
    if (error) {
      console.error('Failed to remove favorite', error);
    }
  });
  userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
    if (userInteractionError) {
      console.log('Error creating UserInteraction.', userInteractionError);
    }
  });
};


const FavoritesButton = (props: IFavoriteButtonProps) => (
  <React.Fragment>
    {props.added
      ? (
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

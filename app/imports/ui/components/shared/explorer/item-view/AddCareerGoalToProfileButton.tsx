import React, { useState } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { AutoForm, SubmitField } from 'uniforms-semantic';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { defineMethod, removeItMethod } from '../../../../../api/base/BaseCollection.methods';
import { Interests } from '../../../../../api/interest/InterestCollection';
import slugify, { Slugs } from '../../../../../api/slug/SlugCollection';
import { ProfileCareerGoals } from '../../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { ProfileInterests } from '../../../../../api/user/profile-entries/ProfileInterestCollection';
import { CareerGoal } from '../../../../../typings/radgrad';
import MultiSelectField from '../../../form-fields/MultiSelectField';

interface AddCareerGoalToProfileButtonProps {
  careerGoal: CareerGoal;
  userID: string;
  added: boolean;
}

const AddCareerGoalToProfileButton: React.FC<AddCareerGoalToProfileButtonProps> = ({ careerGoal, userID, added }) => {
  const [open, setOpen] = useState(false);
  const careerGoalInterestIDs = careerGoal.interestIDs;
  const profileInterests = ProfileInterests.findNonRetired({ userID });
  const shareInterests = profileInterests.length > 0 ? profileInterests[0].share : false;
  const profileCareerGoals = ProfileCareerGoals.findNonRetired({ userID });
  const shareCareerGoals = profileCareerGoals.length > 0 ? profileCareerGoals[0].share : false;
  const interestIDs = profileInterests.map((doc) => doc.interestID);
  let diff = _.difference(careerGoalInterestIDs, interestIDs);
  if (added) {
    diff = _.intersection(interestIDs, careerGoalInterestIDs);
  }
  const diffInterests = diff.map((id) => Interests.findDoc(id));
  const diffNames = diffInterests.map((doc) => doc.name);
  const header = added ? 'Remove the Career Goal Interests?' : 'Add the Career Goal Interests?';
  const description = added ? 'Select the interests associated with the career goal you want to remove from your profile.' : 'Select the interests associated with the career goal you want to add to your profile.';
  const schema = new SimpleSchema({
    interests: { type: Array, optional: true },
    'interests.$': {
      type: String,
      allowedValues: diffNames,
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);

  const handleUpdate = (doc) => {
    const interestSlugs = doc.interests;
    if (added) {
      // console.log('removing', interestSlugs);
      if (interestSlugs) {
        interestSlugs.forEach((interestSlug) => {
          const slug = slugify(interestSlug);
          // console.log(slug);
          // console.log(Interests.findDocBySlug(slug));
          const interestID = Slugs.getEntityID(slug, 'Interest');
          // console.log(interestID);
          const instance = ProfileInterests.findDoc({ userID, interestID })._id;
          removeItMethod.call({ collectionName: ProfileInterests.getCollectionName(), instance }, (err) => {
            if (err) {
              console.error('failed to remove profile interest', err);
            }
          });
        });
      }
      const instance = ProfileCareerGoals.findDoc({ userID, careerGoalID: careerGoal._id })._id;
      removeItMethod.call({
        collectionName: ProfileCareerGoals.getCollectionName(),
        instance,
      }, (err) => {
        if (err) {
          console.error('failed to remove profile career goal', err);
        }
      });
    } else {
      if (interestSlugs) {
        interestSlugs.forEach((interestSlug) => {
          const slug = slugify(interestSlug);
          // console.log('adding profile interest', slug);
          defineMethod.call({
            collectionName: ProfileInterests.getCollectionName(),
            definitionData: { username: userID, interest: slug, share: shareInterests },
          }, (err) => {
            if (err) {
              console.error('failed to add interest', err);
            }
          });
        });
      }
      defineMethod.call({
        collectionName: ProfileCareerGoals.getCollectionName(),
        definitionData: { username: userID, careerGoal, share: shareCareerGoals },
      }, (err) => {
        if (err) {
          console.error('failed to add career goal', err);
        }
      });
    }
    setOpen(false);
  };
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        added ? (
          <Button size="mini" color="green" floated="right" basic>
            <Icon name="heart outline" color="red" />
            <Icon name="minus" />
            REMOVE FROM PROFILE
          </Button>
        ) : (
          <Button size="mini" color="green" floated="right" basic>
            <Icon name="heart" color="red" />
            <Icon name="plus" />
            ADD TO PROFILE
          </Button>
        )}
    >
      <Modal.Header>{`${header}`}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {description}
          <AutoForm schema={formSchema} onSubmit={handleUpdate}>
            <MultiSelectField name="interests" />
            <SubmitField inputRef={undefined} value="Update Profile" disabled={false} className="" />
          </AutoForm>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default AddCareerGoalToProfileButton;

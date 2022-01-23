import React, { useState } from 'react';
import { Button, Icon, Modal, SemanticFLOATS, Grid, Form } from 'semantic-ui-react';
import { defineMethod, removeItMethod } from '../../../../../api/base/BaseCollection.methods';
import { Interests } from '../../../../../api/interest/InterestCollection';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { CareerGoal, Interest, MeteorError, Profile } from '../../../../../typings/radgrad';
import { ProfileCareerGoals } from '../../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { PROFILE_ENTRY_TYPE } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import { createDefinitionData, getCollectionName, getSlug, getStudent } from './utilities/profile-button';
import { profileGetInterestIDs } from '../../utilities/data-model';

export interface AddCareerToProfileProps {
  careerGoal: CareerGoal;
  userID: string;
  added: boolean;
  inverted: boolean;
  floated?: SemanticFLOATS;
  profile: Profile;
}

const handleAdd = (userID: string, careerItem: CareerGoal, interestList: string[]) => {
  const interestType = PROFILE_ENTRY_TYPE.INTEREST;
  let collectionName = getCollectionName(interestType);
  let definitionData;
  interestList.forEach((interest) => {
    const interestItem: Interest = Interests.findDocBySlug(interest);
    definitionData = createDefinitionData(userID, interestItem, interestType);
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error: MeteorError) => {
        RadGradAlert.failure('Failed to add to profile', error.message);
      })
      .then(() => {
      });
  });

  collectionName = ProfileCareerGoals.getCollectionName();
  const username = getStudent(userID);
  const careerGoal = getSlug(careerItem.slugID);
  definitionData = { username, careerGoal };
  defineMethod.callPromise({ collectionName, definitionData })
    .catch((error: MeteorError) => {
      RadGradAlert.failure('Failed to add to profile', error.message);
    })
    .then(() => {
      RadGradAlert.success('Added to profile');
    });
};

const handleRemove = (userID: string, item: CareerGoal) => {
  const collectionName = ProfileCareerGoals.getCollectionName();
  const instance = ProfileCareerGoals.findNonRetired({
    userID: userID,
    careerGoalID: item._id,
  })[0]._id;
  removeItMethod.callPromise({ collectionName, instance })
    .catch((error) => {
      RadGradAlert.failure('Failed to remove from profile', error.message, error);
    });
};

const AddCareerToProfileButton: React.FC<AddCareerToProfileProps> = ({ userID, profile, careerGoal, added, inverted, floated }) => {
  const paddingStyle = { paddingLeft: 20, paddingTop: 5, paddingBottom: 5 };
  const [open, setOpen] = useState(false);
  let interestList: Array<string> = [];

  const onChangeCheckbox = (evt, data) => {
    data.checked ? interestList.push(data.label) : interestList = interestList.filter(label => label !== data.label);
  };


  const interestSlugs = careerGoal.interestIDs.map((id) => Interests.findSlugByID(id)).sort();
  const profileInterestSlugs = profileGetInterestIDs(profile).map((id) => Interests.findSlugByID(id));
  const interestInclude = [];
  interestSlugs.forEach((slug) => {
    if (profileInterestSlugs.includes(slug)) {
      interestInclude.push({ 'slug': slug, 'include': false, 'disable': true });
    } else {
      interestInclude.push({ 'slug': slug, 'include': true, 'disable': false });
      interestList.push(slug);
    }
  });

  return (
    <React.Fragment>
      {added ? (
        <Button id={COMPONENTIDS.REMOVE_FROM_PROFILE_BUTTON} onClick={() => {
          setOpen(false);
          handleRemove(userID, careerGoal);
        }} size="small" color="teal" floated={floated || 'right'} basic inverted={inverted}>
          <Icon name="user outline" color="grey" inverted={inverted} />
          <Icon name="minus" />
          REMOVE FROM PROFILE
        </Button>
      ) : (
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={<Button id={COMPONENTIDS.ADD_TO_PROFILE_MODAL_BUTTON} size="small" color="teal"
            floated={floated || 'right'} basic inverted={inverted}>
            <Icon name="user" color="grey" inverted={inverted} />
            <Icon name="plus" />
            ADD TO PROFILE
          </Button>}>
          <Modal.Header>Add Career To Profile</Modal.Header>
          <Modal.Description style={paddingStyle}>
            <p> Select the Interests to be automatically added to your profile when adding this Career Goal: </p>
            <Form>
              <Form.Group>
                <Grid>
                  {interestInclude.map((o, index) =>
                    <Grid.Column width={4} key={`key-${o.slug}`}>
                      <Form.Checkbox
                        id={`id_${o.slug}`}
                        key={`${o.slug}-checkbox`}
                        label={`${interestSlugs[index]}`}
                        defaultChecked={o.include}
                        disabled={o.disable}
                        onClick={(evt, data) => onChangeCheckbox(evt, data)} />
                    </Grid.Column>)}
                </Grid>
              </Form.Group>
            </Form>
          </Modal.Description>
          <Modal.Actions>
            <br />
            <Grid style={paddingStyle}>
              <Button id={COMPONENTIDS.ADD_TO_PROFILE_BUTTON} size="small"
                onClick={() => handleAdd(userID, careerGoal, interestList)} color="teal">
                <Icon name="user" color="grey" />
                <Icon name="plus" />
                ADD TO PROFILE
              </Button>
              <br />
            </Grid>
          </Modal.Actions>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default AddCareerToProfileButton;

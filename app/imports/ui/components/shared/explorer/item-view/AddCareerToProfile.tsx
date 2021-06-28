import React, { useState } from 'react';
import { Button, Icon, Modal, SemanticFLOATS, Grid, Form, Container } from 'semantic-ui-react';
import { defineMethod, removeItMethod } from '../../../../../api/base/BaseCollection.methods';
import { Interests } from '../../../../../api/interest/InterestCollection';
import RadGradAlert from '../../../../utilities/RadGradAlert';
import { CareerGoal, MeteorError } from '../../../../../typings/radgrad';
import { ProfileCareerGoals } from '../../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { PROFILE_ENTRY_TYPE, IProfileEntryTypes } from '../../../../../api/user/profile-entries/ProfileEntryTypes';
import { COMPONENTIDS } from '../../../../utilities/ComponentIDs';
import InterestList from '../../InterestList';
import { createDefinitionData, getCollectionName } from './utilities/profile-button';

export interface AddCareerToProfileProps {
  careerGoal: CareerGoal;
  userID: string;
  type: IProfileEntryTypes;
  added: boolean;
  inverted: boolean;
  floated?: SemanticFLOATS;
}

const handleAdd = (userID: string, item: CareerGoal, type: IProfileEntryTypes) => () => {
  const collectionName = getCollectionName(type);
  const definitionData = createDefinitionData(userID, item, type);
  defineMethod.callPromise({ collectionName, definitionData })
    .catch((error: MeteorError) => { RadGradAlert.failure('Failed to add to profile', error.message);})
    .then(() => { RadGradAlert.success('Added to profile');});
};

const handleRemove = (userID: string, item: CareerGoal, type: IProfileEntryTypes) => () => {
  const collectionName = getCollectionName(type);
  let instance;
  switch (type) {
    case PROFILE_ENTRY_TYPE.CAREERGOAL:
      instance = ProfileCareerGoals.findNonRetired({
        userID: userID,
        careerGoalID: item._id,
      })[0]._id;
      break;
    default:
      console.error(`Bad profile entry type: ${type}`);
      break;
  }
  removeItMethod.callPromise({ collectionName, instance })
    .catch((error) => { RadGradAlert.failure('Failed to remove from profile', error.message, error);});
};

const AddCareerToProfile: React.FC<AddCareerToProfileProps> = ({ userID, careerGoal, type, added, inverted, floated }) => {
  const [open, setOpen] = useState(false);

  const interestSlugs = careerGoal.interestIDs.map((id) => Interests.findSlugByID(id));

  return (
    <React.Fragment>
      {added ? (
        <Button id={COMPONENTIDS.REMOVE_FROM_PROFILE_BUTTON} onClick={handleRemove(userID, careerGoal, type)} size="small" color="teal" floated={floated || 'right'} basic inverted={inverted}>
          <Icon name="user outline" color="grey" inverted={inverted} />
          <Icon name="minus" />
          REMOVE FROM PROFILE
        </Button>
      ) : (
        <Modal
          onClose={() => setOpen(false)}
          onOpen ={() => setOpen(true)}
          open = {open}
          trigger = {<Button size="small" color="teal" floated={floated || 'right'} basic inverted={inverted}>
            <Icon name="user" color="grey" inverted={inverted} />
            <Icon name="plus" />
            ADD TO PROFILE
          </Button>}>
          <Modal.Header>Adding The Career To Profile</Modal.Header>
          <Modal.Description textAlign = 'center'>
            <p> Adding this Career Goal will automatically add the following new Interests to your profile.<br/>
              If you are OK with that, just press OK. </p>
            <Container textAlign='center'>
              <InterestList item={careerGoal} size="small"/>
            </Container>
            <Form>
              <Form.Group widths={2}>
                {interestSlugs.map((slug, index) => <Form.Checkbox id={`id_${slug}`} key={`${slug}-checkbox`} radio label={`${interestSlugs[index]}`}/>)}
              </Form.Group>
            </Form>
          </Modal.Description>
          <Modal.Actions>
            <br/>
            <Grid textAlign = 'center'>
              <Button id={COMPONENTIDS.ADD_TO_PROFILE_BUTTON} size="small" onClick={handleAdd(userID, careerGoal, type)} color="teal" basic>
                <Icon name="user" color="grey"/>
                <Icon name="plus" />
                ADD TO PROFILE
              </Button>
              <br/>
            </Grid>
          </Modal.Actions>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default AddCareerToProfile;

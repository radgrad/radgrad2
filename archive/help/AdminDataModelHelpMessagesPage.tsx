// @ts-ignore
import { withTracker } from 'meteor/react-meteor-data';
// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import { Confirm, Grid, Icon } from 'semantic-ui-react';
// @ts-ignore
import RadGradAlerts from '../../app/imports/ui/utilities/RadGradAlert';
// @ts-ignore
import AdminPageMenu from '../../components/admin/AdminPageMenu';
// @ts-ignore
import AdminDataModelMenu, { AdminDataModeMenuProps } from '../../components/admin/datamodel/AdminDataModelMenu';
// @ts-ignore
import ListCollectionWidget from '../../components/admin/datamodel/ListCollectionWidget';
// @ts-ignore
import { DescriptionPair, HelpMessage } from '../../../typings/radgrad';
// @ts-ignore
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
// @ts-ignore
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
// @ts-ignore
import AddHelpMessageForm from '../../components/admin/datamodel/help/AddHelpMessageForm';
// @ts-ignore
import UpdateHelpMessageForm from '../../components/admin/datamodel/help/UpdateHelpMessageForm';
// @ts-ignore
import BackToTopButton from '../../components/shared/BackToTopButton';
// @ts-ignore
import { dataModelActions } from '../../../redux/admin/data-model';
// @ts-ignore
import { getDatamodelCount } from './utilities/datamodel';

const collection = HelpMessages; // the collection to use.
const RadGradAlert = new RadGradAlerts();

/**
 * Returns an array of Description pairs used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const descriptionPairs = (item: HelpMessage): DescriptionPair[] => [
  { label: 'Route Name', value: item.routeName },
  { label: 'Title', value: item.title },
  { label: 'Text', value: item.text },
  { label: 'Retired', value: item.retired ? 'True' : 'False' },
];

/**
 * Returns the title string for the item. Used in the ListCollectionWidget.
 * @param item an item from the collection.
 */
const itemTitleString = (item: HelpMessage): string => `${item.routeName}`;

/**
 * Returns the ReactNode used in the ListCollectionWidget. By default we indicate if the item is retired.
 * @param item an item from the collection.
 */
const itemTitle = (item: HelpMessage): React.ReactNode => (
  <React.Fragment>
    {item.retired ? <Icon name="eye slash" /> : ''}
    <Icon name="dropdown" />
    {itemTitleString(item)}
  </React.Fragment>
);

interface AdminDataModelHelpMessagesPageProps extends AdminDataModeMenuProps {
  items: HelpMessage[];
}

// props not deconstructed because AdminDataModeMenuProps has 21 numbers.
const AdminDataModelHelpMessagesPage: React.FC<AdminDataModelHelpMessagesPageProps> = (props) => {
  // TODO deconstruct props
  const formRef = React.createRef();
  const [confirmOpenState, setConfirmOpen] = useState(false);
  const [idState, setId] = useState('');
  const [showUpdateFormState, setShowUpdateForm] = useState(false);

  const handleAdd = (doc) => {
    // console.log('HelpMessages.handleAdd(%o)', doc);
    const collectionName = collection.getCollectionName();
    const definitionData = doc; // create the definitionData may need to modify doc's values
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        RadGradAlert.failure('Add failed', error.message, 2500, error);
      } else {
        RadGradAlert.success('Add succeeded', '', 1500);
        // @ts-ignore
        formRef.current.reset();
      }
    });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setShowUpdateForm(false);
    setId('');
    setConfirmOpen(false);
  };

  const handleDelete = (event, inst) => {
    event.preventDefault();
    // console.log('handleDelete inst=%o', inst);
    setConfirmOpen(true);
    setId(inst.id);
  };

  const handleConfirmDelete = () => {
    const collectionName = collection.getCollectionName();
    const instance = idState;
    removeItMethod.callPromise({ collectionName, instance })
      .catch((error => { RadGradAlert.failure('Delete failed', error.message, 2500, error);}))
      .then(() => { RadGradAlert.success('Delete succeeded', '', 1500);})
      .finally(() => {
        setShowUpdateForm(false);
        setId('');
        setConfirmOpen(false);
      });
  };

  const handleOpenUpdate = (evt, inst) => {
    evt.preventDefault();
    // console.log('handleOpenUpdate inst=%o', evt, inst);
    setShowUpdateForm(true);
    setId(inst.id);
  };

  const handleUpdate = (doc) => {
    // console.log('handleUpdate doc=%o', doc);
    const collectionName = collection.getCollectionName();
    const updateData = doc;
    updateData.id = doc._id;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        RadGradAlert.failure('Update failed', error.message, 2500, error);
      } else {
        RadGradAlert.success('Update succeeded', '', 1500);
        setShowUpdateForm(false);
        setId('');
      }
    });
  };

  const paddedStyle = {
    paddingTop: 20,
  };
  const findOptions = {
    sort: { name: 1 }, // determine how you want to sort the items in the list
  };
  return (
    <div id="data-model-help-messages-page">
      <AdminPageMenu />
      <Grid container stackable style={paddedStyle}>
        <Grid.Column width={3}>
          <AdminDataModelMenu {...props} />
        </Grid.Column>

        <Grid.Column width={13}>
          {showUpdateFormState ? (
            <UpdateHelpMessageForm collection={collection} id={idState} formRef={formRef} handleUpdate={handleUpdate} handleCancel={handleCancel} itemTitleString={itemTitleString} />
          ) : (
            <AddHelpMessageForm formRef={formRef} handleAdd={handleAdd} />
          )}
          <ListCollectionWidget
            collection={collection}
            findOptions={findOptions}
            descriptionPairs={descriptionPairs}
            itemTitle={itemTitle}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
            setShowIndex={dataModelActions.setCollectionShowIndex}
            setShowCount={dataModelActions.setCollectionShowCount}
            items={props.items}
          />
        </Grid.Column>
      </Grid>
      <Confirm open={confirmOpenState} onCancel={handleCancel} onConfirm={handleConfirmDelete} header="Delete Help Message?" />

      <BackToTopButton />
    </div>
  );
};

const AdminDataModelHelpMessagesPageContainer = withTracker(() => {
  const items = HelpMessages.find({}).fetch();
  const modelCount = getDatamodelCount();
  return {
    ...modelCount,
    items,
  };
})(AdminDataModelHelpMessagesPage);

export default AdminDataModelHelpMessagesPageContainer;

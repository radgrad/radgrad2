import * as React from 'react';
import * as _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import AutoForm from 'uniforms-semantic/AutoForm';
import { IProfile, IProfileUpdate } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import InlineRadioField from '../form-fields/InlineRadioField';
import { capitalizeFirstLetter } from './helper-functions';
import { ROLE } from '../../../api/role/Role';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

export const sortOrderKeys = {
  match: 'match',
  i: 'innovation',
  e: 'experience',
  alpha: 'alphabetical',
};

interface IOpportunitySortOrderWidgetProps {
  profile: IProfile;
}

const handleChange = (props: IOpportunitySortOrderWidgetProps) => (model) => {
  const { profile } = props;
  let collectionName;
  switch (profile.role) {
    case ROLE.FACULTY:
      collectionName = FacultyProfiles.getCollectionName();
      break;
    case ROLE.ADVISOR:
      collectionName = AdvisorProfiles.getCollectionName();
      break;
    case ROLE.MENTOR:
      collectionName = MentorProfiles.getCollectionName();
      break;
    default:
      collectionName = StudentProfiles.getCollectionName();
  }
  const updateData: IProfileUpdate = {
    id: profile._id,
    opportunityExplorerSortOrder: model.sortOrder,
  };
  console.log(collectionName, updateData);
  updateMethod.call({ collectionName, updateData }, (error) => {
    if (error) {
      console.error(error.message);
    }
  });
};

const OpportunitySortOrderWidget = (props: IOpportunitySortOrderWidgetProps) => {
  const keys = _.map(_.values(sortOrderKeys), (v) => capitalizeFirstLetter(v));
  const schema = new SimpleSchema({
    sortOrder: {
      type: String,
      allowedValues: keys,
    },
  });
  return (
    <AutoForm schema={schema} onChangeModel={handleChange((props))}>
      <InlineRadioField name='sortOrder' inline={true}/>
    </AutoForm>
  );
};

export default OpportunitySortOrderWidget;

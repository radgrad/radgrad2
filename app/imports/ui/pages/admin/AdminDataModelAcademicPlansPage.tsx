import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { IAcademicPlan, IDescriptionPair } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';

const descriptionPairs = (plan: IAcademicPlan): IDescriptionPair[] => {
  return [
    { label: 'Name', value: plan.name },
    { label: 'Year', value: `${plan.year}` },
    { label: 'Course Choices', value: `${plan.courseList}` },
    { label: 'Retired', value: plan.retired ? 'True' : 'False' },
  ];
};

const itemTitle = (plan: IAcademicPlan): React.ReactNode => {
  const slug = Slugs.getNameFromID(plan.slugID);
  return (
    <React.Fragment>
      {plan.retired ? <Icon name="eye slash"/> : ''}
      <Icon name="dropdown"/>
      {`${plan.name} (${plan.year}) (${slug})`}
    </React.Fragment>
  );
};

const deleteDisabled = (plan: IAcademicPlan) => {
  const studentPlans = StudentProfiles.find({}, { fields: { academicPlanID: 1 } }).fetch();
  // console.log(studentPlans, plan._id, _.some(studentPlans, { academicPlanID: plan._id }));
  return _.some(studentPlans, { academicPlanID: plan._id });
};

const updateDisabled = (plan: IAcademicPlan) => false;

/**
 * The AcademicPlan data model page.
 */
class AdminDataModelAcademicPlansPage extends React.Component {
  public render() {
    const paddedStyle = {
      paddingTop: 20,
    };
    return (
      <div>
        <AdminPageMenuWidget/>
        <Grid container={true} stackable={true} style={paddedStyle}>

          <Grid.Column width={5}>
            <AdminDataModelMenu/>
          </Grid.Column>

          <Grid.Column width={11}>
            <ListCollectionWidget collection={AcademicPlans}
                                  descriptionPairs={descriptionPairs}
                                  itemTitle={itemTitle}
                                  deleteDisabled={deleteDisabled}
                                  updateDisabled={updateDisabled}/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AdminDataModelAcademicPlansPage;

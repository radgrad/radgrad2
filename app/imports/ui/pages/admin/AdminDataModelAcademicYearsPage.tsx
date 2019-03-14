import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import AdminPageMenuWidget from '../../components/admin/AdminPageMenuWidget';
import AdminDataModelMenu from '../../components/admin/AdminDataModelMenu';
import ListCollectionWidget from '../../components/admin/ListCollectionWidget';
import { Users } from '../../../api/user/UserCollection';
import { IAcademicYear, IDescriptionPair } from '../../../typings/radgrad';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';

const descriptionPairs = (year: IAcademicYear): IDescriptionPair[] => {
  return [
    { label: 'Student', value: Users.getFullName(year.studentID) },
    { label: 'Year', value: `${year.year}` },
  ];
};

const itemTitle = (year: IAcademicYear): React.ReactNode => {
  const name = Users.getFullName(year.studentID);
  return (
    <React.Fragment>
      <Icon name="dropdown"/>
      {`${name} ${year.year}`}
    </React.Fragment>
  );
};

const deleteDisabled = (year: IAcademicYear): boolean => true;
const updateDisabled = (year: IAcademicYear): boolean => true;

class AdminDataModelAcademicYearsPage extends React.Component {
  public render(): React.ReactNode {
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
            <ListCollectionWidget collection={AcademicYearInstances}
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

export default AdminDataModelAcademicYearsPage;

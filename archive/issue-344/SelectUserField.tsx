// import React from 'react';
// import { withTracker } from 'meteor/react-meteor-data';
// import _ from 'lodash';
// import { Form } from 'semantic-ui-react';
// import { ROLE } from '../../../api/role/Role';
// import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
// import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
// import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
//
// interface IUser {
//   _id: string;
//   username: string;
//   role: string[];
// }
//
// interface ISelectUserFieldProps {
//   label: string;
//   required?: boolean;
//   role: string;
//   users: IUser[];
// }
//
// const SelectUserField: React.FC<ISelectUserFieldProps> = ({ label, required, role, users }) => {
//   const options = _.map(users, (userInfo) => ({ key: userInfo._id, text: userInfo.username, value: userInfo._id }));
//   // console.log(options);
//   return (
//     <Form.Select
//       label={label}
//       options={options}
//       placeholder={`Select ${role}`}
//       required={required}
//     />
//   );
// };
//
// const SelectUserFieldContainer = withTracker((props) => {
//   let users;
//   switch (props.role) {
//     case ROLE.ALUMNI:
//       users = StudentProfiles.findNonRetired({ isAlumni: true });
//       break;
//     case ROLE.ADVISOR:
//       users = AdvisorProfiles.findNonRetired({});
//       break;
//     case ROLE.FACULTY:
//       users = FacultyProfiles.findNonRetired({});
//       break;
//     default:
//       users = StudentProfiles.findNonRetired({ isAlumni: true });
//   }
//   // console.log('users=%o', users);
//   return {
//     users,
//   };
// })(SelectUserField);
// export default SelectUserFieldContainer;

import React, {useEffect, useState} from 'react';
import {getStudentPublicData} from '../../../api/user/StudentProfileCollection.methods';
import ProfileCard from './ProfileCard';
import {StudentProfile} from '../../../typings/radgrad';

export interface StudentProfileCardMethodProps {
  studentProfile: StudentProfile;
}

const StudentProfileCardMethod: React.FC<StudentProfileCardMethodProps> = ({studentProfile}) => {
  const {username, firstName, lastName} = studentProfile;
  const name = `${firstName} ${lastName}`;
  // const awaitingData = 'Waiting to receive terms and conditions from server...';
  const [data, setData] = useState('');
  useEffect(() => {
    function fetchData() {
      getStudentPublicData.callPromise({})
        .then(result => setData(result))
        .catch(error => setData(`Server Error: ${error}`));
    }
    // Only fetch data if its hasn't been fetched before.
    data || fetchData();
  });

  return (
    <ProfileCard email={username} name={name} careerGoals={data.careerGoals} interests={data.interests} courses={data.courses} ice={data.ice} image={data.picture} level={data.level} opportunities={data.opportunities} website={data.website} key={username}/>
  );
};

export default StudentProfileCardMethod;

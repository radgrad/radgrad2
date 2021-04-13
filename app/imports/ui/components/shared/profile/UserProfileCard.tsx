import React, { useEffect, useState } from 'react';
import { getPublicProfileData, PublicProfileData } from '../../../../api/user/StudentProfileCollection.methods';
import ProfileCard from './ProfileCard';
import { Users } from '../../../../api/user/UserCollection';

export interface UserProfileCardProps {
  username: string;
  fluid?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ username, fluid = true }) => {
  const { firstName, lastName } = Users.getProfile(username);
  const name = `${firstName} ${lastName}`;
  const [data, setData] = useState<PublicProfileData>({});
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getPublicProfileData.callPromise({ username })
        .then(result => setData(result))
        .catch(error => { console.error(error); setData({});});
    }
    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched, username]);
  return (
    <ProfileCard email={username} name={name} careerGoals={data.careerGoals} interests={data.interests} courses={data.courses} ice={data.ice} image={data.picture} level={data.level} opportunities={data.opportunities} website={data.website} key={username} fluid={fluid}/>
  );
};

export default UserProfileCard;

import React from 'react';

interface ProfileIceCircleProps {
  earnedI: number;
  earnedC: number;
  earnedE: number;
}

const ProfileIceCircle: React.FC<ProfileIceCircleProps> = ({earnedI, earnedC, earnedE}) => (
  <span style={{paddingTop: '10px', display: 'inline-block'}}>
    &nbsp;
    <span style={{paddingTop: '2px'}} className='profileICEi'>{earnedI}</span>
    &nbsp;
    <span style={{paddingTop: '2px'}} className='profileICEc'>{earnedC}</span>
    &nbsp;
    <span style={{paddingTop: '2px'}} className='profileICEe'>{earnedE}</span>
  </span>
);

export default ProfileIceCircle;

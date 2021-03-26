import React from 'react';

interface ProfileIceCircleProps {
  i: number;
  c: number;
  e: number;
}

const ProfileIceCircle: React.FC<ProfileIceCircleProps> = ({i, c, e}) => (
  <span style={{paddingTop: '10px', display: 'inline-block'}}>
    &nbsp;
    <span style={{paddingTop: '2px'}} className='profileICEi'>{i}</span>
    &nbsp;
    <span style={{paddingTop: '2px'}} className='profileICEc'>{c}</span>
    &nbsp;
    <span style={{paddingTop: '2px'}} className='profileICEe'>{e}</span>
  </span>
);

export default ProfileIceCircle;

import React from 'react';
import {Card, Icon, Image} from 'semantic-ui-react';
import ProfileIceCircle from './ProfileIceCircle';
import MenuIceCircle from '../shared/MenuIceCircle';

export interface ProfileCardProps {
  name: string,
  email: string,
  image?: string,
  website?: string,
  level?: number,
  ice?: boolean,
  careerGoals?: string[],
  interests?: string[],
  courses?: string[],
  opportunities?: string[]
}

// innov, comp, exp

const ProfileCard: React.FC<ProfileCardProps> = ({name, email, image, website, level, ice, careerGoals, interests, courses, opportunities}) => {
  const levelIconURL = `/images/level-icons/radgrad-level-${level}-icon.png`;
  return (
    <Card style={{minWidth: '400px'}}>
      <Card.Content>
        { image ? <Image floated='left' size='tiny' src={image}/> : ''}
        <Card.Header>{name}</Card.Header>
        <Card.Meta><Icon name="mail"/>&nbsp;<a href={`mailto:${email}`}>{email}</a></Card.Meta>
        { website ? <Card.Meta><Icon name='linkify'/><a href={website}>{website}</a></Card.Meta> : ''}
        { level ? <Image size='mini' src={levelIconURL}/> : ''}
        {ice ?  <ProfileIceCircle earnedI={99} earnedC={87} earnedE={100}/>: ''}
      </Card.Content>
    </Card>
  );
};

export default ProfileCard;
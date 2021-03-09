import React from 'react';
import {Card, Icon, Image, Label, Tab} from 'semantic-ui-react';
import ProfileIceCircle from './ProfileIceCircle';

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

interface TabContentProps {
  items: string[],
}

const TabContent: React.FC<TabContentProps> = ({items}) => (
  <Tab.Pane>
    {items.map(item => <Label style={{margin: '1px'}} key={item}>{item}</Label>)}
  </Tab.Pane>
);


const ProfileCard: React.FC<ProfileCardProps> = ({name, email, image, website, level, ice, careerGoals, interests, courses, opportunities}) => {
  const levelIconURL = `/images/level-icons/radgrad-level-${level}-icon.png`;
  const tabPanes = [];
  if (interests) {
    tabPanes.push({menuItem: 'Interests', render: () => <TabContent items={interests}/>});
  }
  if (careerGoals) {
    tabPanes.push({menuItem: 'Careers', render: () => <TabContent items={careerGoals}/>});
  }
  if (courses) {
    tabPanes.push({menuItem: 'Courses', render: () => <TabContent items={courses}/>});
  }
  if (opportunities) {
    tabPanes.push({menuItem: 'Opportunities', render: () => <TabContent items={opportunities}/>});
  }
  return (
    <Card style={{minWidth: '500px'}}>
      <Card.Content>
        {image ? <Image floated='left' size='tiny' src={image}/> : ''}
        <Card.Header>{name}</Card.Header>
        <Card.Meta><Icon name="mail"/>&nbsp;<a href={`mailto:${email}`}>{email}</a></Card.Meta>
        {website ? <Card.Meta><Icon name='linkify'/><a href={website}>{website}</a></Card.Meta> : ''}
        {level ? <Image size='mini' src={levelIconURL}/> : ''}
        {ice ? <ProfileIceCircle earnedI={99} earnedC={87} earnedE={100}/> : ''}
      </Card.Content>
      { (tabPanes.length > 0) ? <Card.Content extra><Tab panes={tabPanes}/></Card.Content> : ''}
    </Card>
  );
};

export default ProfileCard;
import React from 'react';
import {Card, Icon, Image, Label, Tab} from 'semantic-ui-react';
import ProfileIceCircle from './ProfileIceCircle';
import CareerGoalLabel from '../label/CareerGoalLabel';
import {Users} from '../../../../api/user/UserCollection';
import InterestLabel from '../label/InterestLabel';

export interface ProfileCardProps {
  name: string,
  email: string,
  image?: string,
  website?: string,
  level?: number,
  ice?: { i: number, c: number, e: number },
  careerGoals?: string[],
  interests?: string[],
  courses?: string[],
  opportunities?: string[],
  fluid?: boolean
}

interface TabContentProps {
  items: string[],
}

const TabContent: React.FC<TabContentProps> = ({items}) => (
  <Tab.Pane>
    {items.map(item => <Label style={{margin: '1px'}} key={item}>{item}</Label>)}
  </Tab.Pane>
);


const ProfileCard: React.FC<ProfileCardProps> = ({name, email, image, website, level, ice, careerGoals, interests, courses, opportunities, fluid= false}) => {
  const levelIconURL = `/images/level-icons/radgrad-level-${level}-icon.png`;
  const userID = Users.getID(email);
  const tabPanes = [];
  if (interests) {
    // TODO: Why are interest slugs capitalized?
    tabPanes.push({menuItem: 'Interests', render: () => interests.map(interest => <InterestLabel key={interest} slug={interest.toLowerCase()} userID={userID} size='small'/>)});
  }
  if (careerGoals) {
    tabPanes.push({menuItem: 'Careers', render: () => careerGoals.map(careerGoal => <CareerGoalLabel key={careerGoal} slug={careerGoal} userID={userID} size='small'/>)});
  }
  if (courses) {
    tabPanes.push({menuItem: 'Courses', render: () => <TabContent items={courses}/>});
  }
  if (opportunities) {
    tabPanes.push({menuItem: 'Opportunities', render: () => <TabContent items={opportunities}/>});
  }
  return (
    <Card fluid={fluid} style={fluid ? {} : {minWidth: '500px'}}>
      <Card.Content>
        {image ? <Image floated='left' size='tiny' src={image}/> : ''}
        <Card.Header>{name}</Card.Header>
        <Card.Meta><Icon name="mail"/>&nbsp;<a href={`mailto:${email}`}>{email}</a></Card.Meta>
        {website ? <Card.Meta><Icon name='linkify'/><a href={website}>{website}</a></Card.Meta> : ''}
        {level ? <Image size='mini' src={levelIconURL}/> : ''}
        {ice ? <ProfileIceCircle i={ice.i} c={ice.c} e={ice.e}/> : ''}
      </Card.Content>
      { (tabPanes.length > 0) ? <Card.Content extra><Tab panes={tabPanes}/></Card.Content> : ''}
    </Card>
  );
};

export default ProfileCard;

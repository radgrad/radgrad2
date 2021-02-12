import React from 'react';
import { Card, Header, Icon, Label, List } from 'semantic-ui-react';
import { InterestOrCareerGoalFactoid } from '../../../../typings/radgrad';

const CareerGoalFactoid: React.FC<InterestOrCareerGoalFactoid> = ({
  name,
  description,
  numberOfCourses,
  numberOfOpportunities,
  numberOfStudents,
}) => (
  <div id='career-goal-factoid'>
    <Header inverted>Specify Career Goals to improve RadGrad recommendations.</Header>
    <Card fluid>
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <List horizontal>
          <List.Item>
            <List.Content><Label><Icon name='users' /> {numberOfStudents}</Label></List.Content>
          </List.Item>
          <List.Item>
            <List.Content><Label><Icon name='book' /> {numberOfCourses}</Label></List.Content>
          </List.Item>
          <List.Item>
            <List.Content><Label><Icon name='bullseye' /> {numberOfOpportunities}</Label></List.Content>
          </List.Item>
        </List>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
    </Card>
  </div>
);

export default CareerGoalFactoid;

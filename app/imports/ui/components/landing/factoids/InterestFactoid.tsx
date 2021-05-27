import React from 'react';
import Markdown from 'react-markdown';
import { Card, Header, Icon, Label, List } from 'semantic-ui-react';
import { InterestOrCareerGoalFactoidProps } from '../../../../typings/radgrad';
import styles from '../utilities/landing-styles';

const InterestFactoid: React.FC<InterestOrCareerGoalFactoidProps> = ({
  name,
  description,
  numberOfCourses,
  numberOfOpportunities,
  numberOfStudents,
}) => (
  <div id='interest-factoid'>
    <Header inverted style={styles['green-text']}>Specifying Interests helps RadGrad improve recommendations.</Header>
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
            {/* TODO Should this be lightbulb? */}
            <List.Content><Label><Icon name='bullseye' /> {numberOfOpportunities}</Label></List.Content>
          </List.Item>
        </List>
        <Card.Description>
          <Markdown escapeHtml source={description} />
        </Card.Description>
      </Card.Content>
    </Card>
  </div>
);

export default InterestFactoid;

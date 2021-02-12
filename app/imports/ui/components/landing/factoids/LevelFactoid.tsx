import React from 'react';
import { Card, Header, Icon, Label, List } from 'semantic-ui-react';
import { LevelFactoid } from '../../../../typings/radgrad';
import RadGradMenuLevel from '../../shared/RadGradMenuLevel';

const LevelFactoid: React.FC<LevelFactoid> = ({ level, numberOfStudents, description }) => (
    <div id="level-factoid">
      <Header inverted>&quot;Levels show progress from Grasshopper to Ninja.&quot;</Header>
      <Card>
        <Card.Content>
          <Card.Header>Level {level}: <RadGradMenuLevel level={level} /></Card.Header>
          <List horizontal>
            <List.Item>
              <List.Content><Label><Icon name='users' /> {numberOfStudents}</Label></List.Content>
            </List.Item>
          </List>
          <Card.Description>{description}</Card.Description>
        </Card.Content>
      </Card>
    </div>
);

export default LevelFactoid;

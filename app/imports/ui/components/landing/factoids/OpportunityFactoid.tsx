import React from 'react';
import { Card, Header, Icon, Label, List } from 'semantic-ui-react';
import { OpportunityFactoid } from '../../../../typings/radgrad';
import IceHeader from '../../shared/IceHeader';

const OpportunityFactiod: React.FC<OpportunityFactoid> = ({ picture, name, numberOfStudents, ice, description }) => (
  <div id="opportunity-factoid">
    <Header inverted>&quot;Get real world experience.&quot;</Header>
    <Card>
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <IceHeader ice={ice} />
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

export default OpportunityFactiod;

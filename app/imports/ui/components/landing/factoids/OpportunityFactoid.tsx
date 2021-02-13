import React from 'react';
import Markdown from 'react-markdown';
import { Card, Header, Icon, Label, List } from 'semantic-ui-react';
import { OpportunityFactoidProps } from '../../../../typings/radgrad';
import IceHeader from '../../shared/IceHeader';

const OpportunityFactiod: React.FC<OpportunityFactoidProps> = ({ picture, name, numberOfStudents, ice, description }) => (
  <div id="opportunity-factoid">
    <Header inverted>&quot;Get real world experience.&quot;</Header>
    <Card fluid>
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <IceHeader ice={ice} />
        <List horizontal>
          <List.Item>
            <List.Content><Label><Icon name='users' /> {numberOfStudents}</Label></List.Content>
          </List.Item>
        </List>
        <Card.Description>
          <Markdown escapeHtml source={description} />
        </Card.Description>
      </Card.Content>
    </Card>
  </div>
);

export default OpportunityFactiod;

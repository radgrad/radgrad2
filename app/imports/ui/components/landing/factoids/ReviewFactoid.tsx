import React from 'react';
import { Card, Header } from 'semantic-ui-react';
import { ReviewFactoidProps } from '../../../../typings/radgrad';
import styles from '../utilities/landing-styles';

const ReviewFactoid :React.FC<ReviewFactoidProps> = ({ name, description }) => (
  <div id="review-factoid">
    <Header inverted>&quot;<span style={styles['green-text']}>RadGrad</span> provides high quality reviews of courses and extracurricular activities.&quot;</Header>
    <Card fluid>
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
    </Card>
  </div>
);

export default ReviewFactoid;

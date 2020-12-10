import React from 'react';
import { Card, Grid } from 'semantic-ui-react';

const bg1 = { backgroundColor: '#6fbe44' };
const bg2 = { backgroundColor: '#2f9276' };
const bg3 = { backgroundColor: '#106735' };

const StudentHomeGuidedTour = () => (
  <Grid.Column>
    <Card.Group itemsPerRow={3}>
      <Card href="#" style={bg1}>
        <Card.Content>
          <div className="action-box action-box1">
            <h2>Develop your ability to innovate and to have professional experiences</h2>
            <p>Be a well-rounded graduate who is attractive to employers and/or graduate programs</p>
          </div>
        </Card.Content>
      </Card>
      <Card href="#" style={bg2}>
        <Card.Content>
          <div className="action-box action-box2">
            <h2>Explore Courses and Get Useful Information</h2>
            <p>The Courses Explorer enables you to take a deep dive into each of the courses associated with the
              degree program.</p>
          </div>
        </Card.Content>
      </Card>
      <Card href="#" style={bg3}>
        <Card.Content>
          <div className="action-box action-box3">
            <h2>Specify Your Career Goals</h2>
            <p>The set of career goals are curated by the faculty to represent a good selection of the most
              promising career paths.</p>
          </div>
        </Card.Content>
      </Card>
    </Card.Group>
  </Grid.Column>
);

export default StudentHomeGuidedTour;

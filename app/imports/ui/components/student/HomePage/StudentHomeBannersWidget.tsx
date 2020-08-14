import React from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { buildRouteName, IMatchProps } from '../../shared/RouterHelperFunctions';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';

interface IStudentHomeBannersProps {
  match: IMatchProps;
}

const bg1 = { backgroundColor: '#6fbe44' };
const bg2 = { backgroundColor: '#2f9276' };
const bg3 = { backgroundColor: '#106735' };

const StudentHomeBannersWidget = (props: IStudentHomeBannersProps) => {
  const { match } = props;
  return (
    <Grid.Column>
      <Card.Group itemsPerRow={3}>
        <Card style={bg1}>
          <Card.Content>
            <div className="action-box action-box1">
              <h2>Develop your ability to innovate and to have experiences</h2>
              <p>Be a well-rounded graduate who is attractive to employers and/or graduate programs</p>
              <Button
                as={Link}
                to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}`)}
                basic
                inverted
                color="yellow"
              >
                Learn More
              </Button>
            </div>
          </Card.Content>
        </Card>
        <Card style={bg2}>
          <Card.Content>
            <div className="action-box action-box2">
              <h2>Explore Courses and Get Useful Information</h2>
              <p>It enables you to take a deep dive into each of the courses associated with the degree program.</p>
              <Button
                as={Link}
                to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}`)}
                basic
                inverted
                color="yellow"
              >
                Learn More
              </Button>
            </div>
          </Card.Content>
        </Card>
        <Card style={bg3}>
          <Card.Content>
            <div className="action-box action-box3">
              <h2>Specify Your Career Goals</h2>
              <p>The set of career goals are curated by the faculty to represent a good selection of the most promising
                career paths.</p>
              <Button
                as={Link}
                to={buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}`)}
                basic
                inverted
                color="yellow"
              >
                Learn More
              </Button>
            </div>
          </Card.Content>
        </Card>
      </Card.Group>
    </Grid.Column>
  );
};

export default withRouter(StudentHomeBannersWidget);

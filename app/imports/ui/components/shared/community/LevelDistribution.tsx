import React from 'react';
import { Grid, Image, Statistic } from 'semantic-ui-react';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';

const levelIconURL = (level) => `/images/level-icons/radgrad-level-${level}-icon.png`;

const makeStatistic = (levelNum, levelName, numStudents) => (
  <Statistic>
    <Statistic.Value>
      <Image src={levelIconURL(levelNum)} className='inline' />
      {numStudents}
    </Statistic.Value>
    <Statistic.Label>
      Level {levelName}
    </Statistic.Label>
  </Statistic>
)

const LevelDistribution: React.FC = () => {
  const header = <RadGradHeader title='Students by level' icon='graduation cap' />;

  return (
    <RadGradSegment header={header}>
      <Grid columns='equal'>
        <Grid.Column>
          {makeStatistic(1, 'One', 43)}
        </Grid.Column>
        <Grid.Column>
          {makeStatistic(2, 'Two', 27)}
        </Grid.Column>
        <Grid.Column>
          {makeStatistic(3, 'Three', 34)}
        </Grid.Column>
        <Grid.Column>
          {makeStatistic(4, 'Four', 12)}
        </Grid.Column>
        <Grid.Column>
          {makeStatistic(5, 'Five', 4)}
        </Grid.Column>
        <Grid.Column>
          {makeStatistic(6, 'Six', 2)}
        </Grid.Column>
      </Grid>

    </RadGradSegment>
  );
};

export default LevelDistribution;

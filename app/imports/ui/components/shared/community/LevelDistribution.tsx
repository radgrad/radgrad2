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
);

interface LevelDistributionProps {
  data: { 1: number, 2: number, 3: number, 4: number, 5: number, 6: number };
}

const LevelDistribution: React.FC<LevelDistributionProps> = ({ data }) => {
  const header = <RadGradHeader title='Students by level' icon='graduation cap' />;
  return (
    <RadGradSegment header={header}>
      <Grid columns='equal'>
        <Grid.Column>
          {makeStatistic(1, 'One', data && data[1])}
        </Grid.Column>
        <Grid.Column>
          {makeStatistic(2, 'Two', data && data[2])}
        </Grid.Column>
        <Grid.Column>
          {makeStatistic(3, 'Three', data && data[3])}
        </Grid.Column>
        <Grid.Column>
          {makeStatistic(4, 'Four', data && data[4])}
        </Grid.Column>
        <Grid.Column>
          {makeStatistic(5, 'Five', data && data[5])}
        </Grid.Column>
        <Grid.Column>
          {makeStatistic(6, 'Six', data && data[6])}
        </Grid.Column>
      </Grid>

    </RadGradSegment>
  );
};

export default LevelDistribution;

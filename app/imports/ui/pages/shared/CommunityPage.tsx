import React, { useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { getMostPopular, MostPopularData } from '../../../api/utilities/MostPopular.methods';
import CommunityActivity from '../../components/shared/community/CommunityActivity';
import InterestInternshipCount from '../../components/shared/community/InterestInternshipCount';
import LevelDistribution from '../../components/shared/community/LevelDistribution';
import MostPopular, { MOSTPOPULAR } from '../../components/shared/community/MostPopular';
import UpcomingEvents from '../../components/shared/community/UpcomingEvents';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'What\'s happening in RadGrad?';
const headerPaneBody = `
Here are the latest updates in RadGrad, plus overviews of the RadGrad community.
`;
const headerPaneImage = 'images/header-panel/header-community.png';

const CommunityPage: React.FC = () => {
  // data will hold the MostPopularEntity information
  const [data, setData] = useState<MostPopularData>({});

  // fetched is used to ensure that we only get the data once.
  const [fetched, setFetched] = useState(false);
  // this useEffect is used to get theMostPopular data once when the page is first rendered.
  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getMostPopular.callPromise({})
        .then(result => setData(result))
        .catch(error => {
          console.error(error);
          setData({});
        });
    }

    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched]);

  return (
    <PageLayout id={PAGEIDS.COMMUNITY} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Grid stackable>
        <Grid.Row columns={1}>
          <Grid.Column>
            <LevelDistribution data={data.levels}/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Column>
            <MostPopular type={MOSTPOPULAR.CAREERGOAL} data={data.careergoals && data.careergoals.slice(0, 5)} />
          </Grid.Column>
          <Grid.Column>
            <MostPopular type={MOSTPOPULAR.INTEREST} data={data.careergoals && data.interests.slice(0, 5)} />
          </Grid.Column>
          <Grid.Column>
            <MostPopular type={MOSTPOPULAR.OPPORTUNITY} data={data.opportunities && data.opportunities.slice(0, 5)} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Column width={10}>
          <UpcomingEvents />
        </Grid.Column>
        <Grid.Column width={6}>
          <CommunityActivity />
        </Grid.Column>
        {Meteor.settings.public.internship.show ? (
          <Grid.Row>
            <Grid.Column>
              <InterestInternshipCount size='small' />
            </Grid.Column>
          </Grid.Row>
        ) : ''}
      </Grid>
    </PageLayout>
  );
};

export default CommunityPage;

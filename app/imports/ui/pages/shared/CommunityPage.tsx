import React, { useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { getMostPopular, MostPopularData } from '../../../api/utilities/MostPopular.methods';
import CommunityActivity from '../../components/shared/community/CommunityActivity';
import LevelDistribution from '../../components/shared/community/LevelDistribution';
import MostPopular, { MOSTPOPULAR } from '../../components/shared/community/MostPopular';
import UpcomingEvents from '../../components/shared/community/UpcomingEvents';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'What\'s happening in RadGrad?';
const headerPaneBody = `
Here are the latest updates in RadGrad, plus overviews of the RadGrad community.
`;
const headerPaneImage = 'header-community.png';

const CommunityPage: React.FC = () => {
  // data will hold the MostPopularEntity information
  const [data, setData] = useState<MostPopularData>({});
  // fetched is used to ensure that we only get the data once.
  const [fetched, setFetched] = useState(false);
  // this useEffect is used to get theMostPopular data once when the page is first rendered.
  useEffect(() => {
    function fetchData() {
      getMostPopular.callPromise({ })
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
  });
  return (
    <PageLayout id="community-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <LevelDistribution />
          </Grid.Column>
        </Grid.Row>
        <Grid.Column width={10}>
          <UpcomingEvents />
        </Grid.Column>
        <Grid.Column width={6}>
          <CommunityActivity />
          <MostPopular type={MOSTPOPULAR.CAREERGOAL} />
          <MostPopular type={MOSTPOPULAR.INTEREST} />
        </Grid.Column>
      </Grid>
    </PageLayout>
  );
};

export default CommunityPage;

import React from 'react';
import { Grid, Card } from 'semantic-ui-react';
import OpportunityBrowserView from '../../../components/shared/explorer/browser-view/OpportunityBrowserView';
import TeaserVideo from '../../../components/shared/TeaserVideo';
import { radgradVideos } from '../../../../api/radgrad/radgrad-videos';
import ExplorerSummerOpportunitiesWidget from '../../../components/shared/explorer/browser-view/ExplorerSummerOpportunitiesWidget';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';

const headerPaneTitle = 'Find interesting opportunities';
const headerPaneBody = `
Your degree experience isn't complete if you don't take advantage of extracurricular activities, which RadGrad calls **Opportunities**. An Opportunity can give you the chance to be Innovative and/or obtain professional Experience. 

 1. Use this explorer to find and add opportunities to your profile.
 2. Add them in your plan on the Degree Planner page. 
 
Once they are in your plan, RadGrad can update your Innovation and Experience points and do a better job of community building. 
`;
const headerPaneImage = 'header-opportunities.png';


const OpportunityBrowserViewPage: React.FC = () => {
  const opportunitiesVideoHeaderStyle: React.CSSProperties = {
    marginTop: '5px',
  };
  const opportunitiesInRadGradVideo: { title: string; youtubeID: string; author: string } = radgradVideos.filter((video) => video.title === 'Opportunities in RadGrad')[0];
  return (
    <PageLayout id={PAGEIDS.OPPORTUNITY_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Grid stackable divided="vertically">
          <Grid.Row>
            <Grid.Column width={11}>
              <OpportunityBrowserView />
            </Grid.Column>
            <Grid.Column width={5}>
              <ExplorerSummerOpportunitiesWidget />
              <Card fluid>
                <Card.Content>
                  <TeaserVideo id={opportunitiesInRadGradVideo.youtubeID} />
                  {/* TODO: Refactor to add RadGrad video details using a collection, see issue-281 and the FIGMA mockup */}
                  <Card.Header textAlign="left" style={opportunitiesVideoHeaderStyle}>
                    {opportunitiesInRadGradVideo.title}
                  </Card.Header>
                  <Card.Description>
                    {opportunitiesInRadGradVideo.author}
                    {/*  TODO: Video Upload Date; see issue-281 and FIGMA mockup */}
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
    </PageLayout>
  );
};

export default OpportunityBrowserViewPage;

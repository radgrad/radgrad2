import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Divider, Header, Segment } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { AcademicTerms } from '../../../../../../api/academic-term/AcademicTermCollection';
import { getFutureEnrollmentSingleMethod } from '../../../../../../api/utilities/FutureEnrollment.methods';
import { ENROLLMENT_TYPE, EnrollmentForecast } from '../../../../../../startup/both/RadGradForecasts';
import {
  AcademicTerm,
  BaseProfile,
  Interest,
  Opportunity,
  OpportunityType,
  Review,
} from '../../../../../../typings/radgrad';
import StudentExplorerReviewWidget from '../../../../student/explorer/StudentExplorerReviewWidget';
import { Reviews } from '../../../../../../api/review/ReviewCollection';
import IceHeader from '../../../IceHeader';
import InterestList from '../../../InterestList';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import * as Router from '../../../utilities/router';
import { toUpper, replaceTermString, isSame } from '../../../utilities/general';
import FutureParticipation from '../../FutureParticipation';
import { Opportunities } from '../../../../../../api/opportunity/OpportunityCollection';
import { toId } from '../course/utilities/description-pair';
import { PROFILE_ENTRY_TYPE } from '../../../../../../api/user/profile-entries/ProfileEntryTypes';
import TeaserVideo from '../../../TeaserVideo';
import { Users } from '../../../../../../api/user/UserCollection';
import { ProfileOpportunities } from '../../../../../../api/user/profile-entries/ProfileOpportunityCollection';
import ExplorerReviewWidget from '../ExplorerReviewWidget';

interface ExplorerOpportunitiesWidgetProps {
  opportunity: Opportunity;
  itemReviews: Review[];
  completed: boolean;
  sponsors: BaseProfile[];
  terms: AcademicTerm[];
  interests: Interest[];
  opportunityTypes: OpportunityType[];
  opportunities: Opportunity[];
}

const review = (item: Opportunity, match): Review => {
  const reviews = Reviews.findNonRetired({
    studentID: Router.getUserIdFromRoute(match),
    revieweeID: item._id,
  });
  return reviews[0];
};

const teaserUrlHelper = (opportunitySlug): string => {
  const opportunityID = Slugs.getEntityID(opportunitySlug, 'Opportunity');
  const opportunity = Opportunities.findDoc(opportunityID);
  const oppTeaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID });
  if (oppTeaser.length > 1) {
    return undefined;
  }
  return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
};

const ExplorerOpportunity: React.FC<ExplorerOpportunitiesWidgetProps> = ({ opportunity, opportunityTypes, opportunities, terms, interests, sponsors, completed, itemReviews }) => {
  const segmentStyle = { backgroundColor: 'white' };
  const zeroMarginTopStyle = { marginTop: 0 };
  const fiveMarginTopStyle = { marginTop: '5px' };
  const clearingBasicSegmentStyle = {
    margin: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  };
  const breakWordStyle: React.CSSProperties = { wordWrap: 'break-word' };

  const match = useRouteMatch();

  /* Header Variables */
  const upperName = toUpper(name);
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID }).length > 0;
  const isStudent = Router.isUrlRoleStudent(match);

  const [data, setData] = useState<EnrollmentForecast>({});
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getFutureEnrollmentSingleMethod.callPromise({ id: item._id, type: ENROLLMENT_TYPE.OPPORTUNITY })
        .then((result) => setData(result))
        .catch((error) => {
          console.error(error);
          setData({});
        });
    }

    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched, item._id]);
  let academicTerms = [];
  let scores = [];
  if (data?.enrollment) {
    academicTerms = data.enrollment.map((entry) => AcademicTerms.findDoc(entry.termID));
    scores = data.enrollment.map((entry) => entry.count);
  }
  const profile = Users.getProfile(username);
  const added = ProfileOpportunities.findNonRetired({ studentID: profile.userID, opportunityID: item._id }).length > 0;
  // console.log(profile.userID, item._id, item.name);
  return (
    <div id="explorerOpportunityWidget">
      <Segment padded className="container" style={segmentStyle}>
        {hasTeaser ? <TeaserVideo id={teaserUrlHelper(opportunity)} /> : ''}
        {/* <Segment clearing basic style={clearingBasicSegmentStyle}> */}

        {/*    {descriptionPairs.map((descriptionPair) => ( */}
        {/*      <React.Fragment key={toId(descriptionPair)}>{isSame(descriptionPair.label, 'ICE') ? <IceHeader ice={descriptionPair.value} /> : ''}</React.Fragment> */}
        {/*    ))} */}
        {/*  </React.Fragment> */}
        {/* </Segment> */}

        {/* <Divider style={zeroMarginTopStyle} /> */}
        {/* <div style={fiveMarginTopStyle}> */}
        {/*  <InterestList item={item} size="mini" /> */}
        {/* </div> */}
        {/* {hasTeaser ? ( */}
        {/*  <Grid stackable columns={2}> */}
        {/*    <Grid.Column width={9}> */}
        {/*      {descriptionPairs.map((descriptionPair) => ( */}
        {/*        <React.Fragment key={toId(descriptionPair)}> */}
        {/*          {isSame(descriptionPair.label, 'Opportunity Type') ? ( */}
        {/*            <React.Fragment> */}
        {/*              <b>{descriptionPair.label}: </b> */}
        {/*              {descriptionPair.value ? ( */}
        {/*                <React.Fragment> */}
        {/*                  {descriptionPair.value} */}
        {/*                  <br /> */}
        {/*                </React.Fragment> */}
        {/*              ) : ( */}
        {/*                <React.Fragment> */}
        {/*                  N/A <br /> */}
        {/*                </React.Fragment> */}
        {/*              )} */}
        {/*            </React.Fragment> */}
        {/*          ) : ( */}
        {/*            '' */}
        {/*          )} */}
        {/*          {isSame(descriptionPair.label, 'Sponsor') ? ( */}
        {/*            <React.Fragment> */}
        {/*              <b>{descriptionPair.label}: </b> */}
        {/*              {descriptionPair.value ? ( */}
        {/*                <React.Fragment> */}
        {/*                  <span style={breakWordStyle}> {descriptionPair.value}</span> */}
        {/*                  <br /> */}
        {/*                </React.Fragment> */}
        {/*              ) : ( */}
        {/*                <React.Fragment> */}
        {/*                  N/A <br /> */}
        {/*                </React.Fragment> */}
        {/*              )} */}
        {/*            </React.Fragment> */}
        {/*          ) : ( */}
        {/*            '' */}
        {/*          )} */}
        {/*          {isSame(descriptionPair.label, 'Academic Terms') ? ( */}
        {/*            <React.Fragment> */}
        {/*              <b>{descriptionPair.label}: </b> */}
        {/*              {descriptionPair.value ? ( */}
        {/*                <React.Fragment> */}
        {/*                  <span style={breakWordStyle}> {replaceTermString(descriptionPair.value)}</span> */}
        {/*                  <br /> */}
        {/*                </React.Fragment> */}
        {/*              ) : ( */}
        {/*                <React.Fragment> */}
        {/*                  N/A <br /> */}
        {/*                </React.Fragment> */}
        {/*              )} */}
        {/*            </React.Fragment> */}
        {/*          ) : ( */}
        {/*            '' */}
        {/*          )} */}
        {/*          {isSame(descriptionPair.label, 'Description') ? ( */}
        {/*            <React.Fragment> */}
        {/*              <b>{descriptionPair.label}: </b> */}
        {/*              {descriptionPair.value ? <Markdown escapeHtml source={descriptionPair.value} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} /> : <React.Fragment> N/A </React.Fragment>} */}
        {/*            </React.Fragment> */}
        {/*          ) : ( */}
        {/*            '' */}
        {/*          )} */}
        {/*        </React.Fragment> */}
        {/*      ))} */}
        {/*    </Grid.Column> */}

        {/*    <Grid.Column width={7}> */}
        {/*      {descriptionPairs.map((descriptionPair) => ( */}
        {/*        <React.Fragment key={toId(descriptionPair)}> */}
        {/*          {isSame(descriptionPair.label, 'Event Date') ? ( */}
        {/*            <React.Fragment> */}
        {/*              <b>{descriptionPair.label}: </b> */}
        {/*              {descriptionPair.value ? ( */}
        {/*                <React.Fragment> */}
        {/*                  <span style={breakWordStyle}>{descriptionPair.value.toString()}</span> */}
        {/*                  <br /> */}
        {/*                </React.Fragment> */}
        {/*              ) : ( */}
        {/*                <React.Fragment> */}
        {/*                  N/A <br /> */}
        {/*                </React.Fragment> */}
        {/*              )} */}
        {/*            </React.Fragment> */}
        {/*          ) : ( */}
        {/*            '' */}
        {/*          )} */}
        {/*          {isSame(descriptionPair.label, 'Teaser') && teaserUrlHelper(opportunity) ? ( */}
        {/*            <React.Fragment> */}
        {/*              <b>{descriptionPair.label}: </b> */}
        {/*              {descriptionPair.value ? <TeaserVideo id={teaserUrlHelper(opportunity)} /> : <p>N/A </p>} */}
        {/*            </React.Fragment> */}
        {/*          ) : ( */}
        {/*            '' */}
        {/*          )} */}
        {/*        </React.Fragment> */}
        {/*      ))} */}
        {/*    </Grid.Column> */}
        {/*  </Grid> */}
        {/* ) : ( */}
        {/*  <React.Fragment> */}
        {/*    <Grid stackable columns={2}> */}
        {/*      <Grid.Column width={5}> */}
        {/*        {descriptionPairs.map((descriptionPair) => ( */}
        {/*          <React.Fragment key={toId(descriptionPair)}> */}
        {/*            {isSame(descriptionPair.label, 'Opportunity Type') ? ( */}
        {/*              <React.Fragment> */}
        {/*                <b>{descriptionPair.label}: </b> */}
        {/*                {descriptionPair.value ? ( */}
        {/*                  <React.Fragment> */}
        {/*                    {descriptionPair.value} <br /> */}
        {/*                  </React.Fragment> */}
        {/*                ) : ( */}
        {/*                  <React.Fragment> */}
        {/*                    N/A <br /> */}
        {/*                  </React.Fragment> */}
        {/*                )} */}
        {/*              </React.Fragment> */}
        {/*            ) : ( */}
        {/*              '' */}
        {/*            )} */}
        {/*            {isSame(descriptionPair.label, 'Sponsor') ? ( */}
        {/*              <React.Fragment> */}
        {/*                <b>{descriptionPair.label}: </b> */}
        {/*                {descriptionPair.value ? ( */}
        {/*                  <React.Fragment> */}
        {/*                    <span style={breakWordStyle}>{descriptionPair.value}</span> */}
        {/*                    <br /> */}
        {/*                  </React.Fragment> */}
        {/*                ) : ( */}
        {/*                  <React.Fragment> */}
        {/*                    N/A <br /> */}
        {/*                  </React.Fragment> */}
        {/*                )} */}
        {/*              </React.Fragment> */}
        {/*            ) : ( */}
        {/*              '' */}
        {/*            )} */}
        {/*          </React.Fragment> */}
        {/*        ))} */}
        {/*      </Grid.Column> */}

        {/*      <Grid.Column width={11}> */}
        {/*        {descriptionPairs.map((descriptionPair) => ( */}
        {/*          <React.Fragment key={toId(descriptionPair)}> */}
        {/*            {isSame(descriptionPair.label, 'Academic Terms') ? ( */}
        {/*              <React.Fragment> */}
        {/*                <b>{descriptionPair.label}: </b> */}
        {/*                {descriptionPair.value ? ( */}
        {/*                  <React.Fragment> */}
        {/*                    <span style={breakWordStyle}>{replaceTermString(descriptionPair.value)}</span> */}
        {/*                    <br /> */}
        {/*                  </React.Fragment> */}
        {/*                ) : ( */}
        {/*                  <React.Fragment> */}
        {/*                    N/A <br /> */}
        {/*                  </React.Fragment> */}
        {/*                )} */}
        {/*              </React.Fragment> */}
        {/*            ) : ( */}
        {/*              '' */}
        {/*            )} */}
        {/*            {isSame(descriptionPair.label, 'Event Date') ? ( */}
        {/*              <React.Fragment> */}
        {/*                <b>{descriptionPair.label}: </b> */}
        {/*                {descriptionPair.value ? ( */}
        {/*                  <React.Fragment> */}
        {/*                    <span style={breakWordStyle}>{descriptionPair.value.toString()}</span> */}
        {/*                    <br /> */}
        {/*                  </React.Fragment> */}
        {/*                ) : ( */}
        {/*                  <React.Fragment> */}
        {/*                    N/A <br /> */}
        {/*                  </React.Fragment> */}
        {/*                )} */}
        {/*              </React.Fragment> */}
        {/*            ) : ( */}
        {/*              '' */}
        {/*            )} */}
        {/*          </React.Fragment> */}
        {/*        ))} */}
        {/*      </Grid.Column> */}
        {/*    </Grid> */}

        {/*    <Grid stackable columns={1}> */}
        {/*      <Grid.Column style={zeroMarginTopStyle}> */}
        {/*        {descriptionPairs.map((descriptionPair) => ( */}
        {/*          <React.Fragment key={toId(descriptionPair)}> */}
        {/*            {isSame(descriptionPair.label, 'Description') ? ( */}
        {/*              <React.Fragment> */}
        {/*                <b>{descriptionPair.label}: </b> */}
        {/*                {descriptionPair.value ? <Markdown escapeHtml source={descriptionPair.value} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} /> : <React.Fragment> N/A </React.Fragment>} */}
        {/*              </React.Fragment> */}
        {/*            ) : ( */}
        {/*              '' */}
        {/*            )} */}
        {/*          </React.Fragment> */}
        {/*        ))} */}
        {/*      </Grid.Column> */}
        {/*    </Grid> */}
        {/*  </React.Fragment> */}
        {/* )} */}
      </Segment>

      <Segment textAlign="center">
        <Header>STUDENTS PARTICIPATING BY SEMESTER</Header>
        <Divider />
        <FutureParticipation academicTerms={academicTerms} scores={scores} />
      </Segment>

      {isStudent ? (
        <Segment>
          <StudentExplorerReviewWidget itemToReview={item} userReview={review(item, match)} completed={completed} reviewType="opportunity" itemReviews={itemReviews} />
        </Segment>
      ) : (
        <ExplorerReviewWidget itemReviews={itemReviews} reviewType="opportunity" />
      )}
    </div>
  );
};

export default ExplorerOpportunity;

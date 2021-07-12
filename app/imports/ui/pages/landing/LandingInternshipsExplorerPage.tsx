import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Internship } from '../../../typings/radgrad';
import { Internships } from '../../../api/internship/InternshipCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';

interface InternshipCardExplorerProps  {
  internship: Internship[];
  count: number;
}

const headerPaneTitle = 'Internship Explorer';

const headerPaneBody = `
Registered users can add Internships to their profile which enables RadGrad to improve its ability to recommend career goals. 

This page provides an overview of the Internships currently available in RadGrad. 
`;

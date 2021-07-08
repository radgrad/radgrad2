import React from 'react';

import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const ManageInternshipsPage: React.FC = () => {
  const headerPaneTitle = 'Manage Internships';
  const headerPaneBody = `
In RadGrad, internships are first class objects. 
`;

  return (
    <PageLayout id={PAGEIDS.MANAGE_INTERNSHIPS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
      Placeholder.
    </PageLayout>
  );
};

export default ManageInternshipsPage;

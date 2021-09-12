import React, { useEffect, useState } from 'react';
import { SemanticSIZES } from 'semantic-ui-react';
import { getInternshipCountPerInterestMethod } from '../../../../api/internship/InternshipCollection.methods';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';
import InterestInternshipCountList from './InterestInternshipCountList';

interface InterestInternshipCountProps {
  size: SemanticSIZES;
}

const InterestInternshipCount: React.FC<InterestInternshipCountProps> = ({ size }) => {
  const [internshipCount, setInternshipCount] = useState({});
  // fetched is used to ensure that we only get the data once.
  const [fetched, setFetched] = useState(false);
  // this useEffect is used to get theMostPopular data once when the page is first rendered.
  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getInternshipCountPerInterestMethod
        .callPromise({})
        .then((result) => setInternshipCount(result))
        .catch((error) => {
          console.error(error);
          setInternshipCount({});
        });
    }

    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched]);

  const sortInterestInternships = (obj) => {
    const sortable = [];
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        sortable.push([key, obj[key]]);
      }
    }
    sortable.sort((a, b) => b[1] - a[1]);
    return sortable;
  };
  const sortedInterestCount = sortInterestInternships(internshipCount);

  const title = 'Interest - Internship Counts';
  const icon = 'heart';
  const header = <RadGradHeader title={title} icon={icon} />;
  const loading = sortedInterestCount.length === 0;
  return (
    <RadGradSegment header={header} loading={loading}>
      <InterestInternshipCountList internshipCounts={sortedInterestCount} size={size} />
    </RadGradSegment>
  );
};

export default InterestInternshipCount;

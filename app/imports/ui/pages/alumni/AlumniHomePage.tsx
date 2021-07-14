import React from 'react';
import { Grid } from 'semantic-ui-react';
import AlumniPageMenuWidget from '../../components/alumni/AlumniPageMenuWidget';
import AlumniMessageWidget from '../../components/alumni/AlumniMessageWidget';
import { PAGEIDS } from '../../utilities/PageIDs';

const AlumniHomePage: React.FC = () => {
  const moveDownStyle = {
    marginTop: 15,
  };
  return (
    <div id={PAGEIDS.ALUMNI_HOME}>
      <AlumniPageMenuWidget />
      <Grid textAlign="center" container style={moveDownStyle}>
        <AlumniMessageWidget />
      </Grid>
    </div>
  );
};

export default AlumniHomePage;

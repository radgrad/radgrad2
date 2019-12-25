import React from 'react';
import { Grid } from 'semantic-ui-react';
import AlumniPageMenuWidget from '../../components/alumni/AlumniPageMenuWidget';
import AlumniMessageWidget from '../../components/alumni/AlumniMessageWidget';

const AlumniHomePage = () => {
  const moveDownStyle = {
    marginTop: 15,
  };
  return (
    <div>
      <AlumniPageMenuWidget />
      <Grid textAlign="center" container style={moveDownStyle}>
        <AlumniMessageWidget />
      </Grid>
    </div>
  );
};

export default AlumniHomePage;

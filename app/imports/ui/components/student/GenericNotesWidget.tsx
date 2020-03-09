import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Button, Container } from "semantic-ui-react";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";

const GenericNotesWidget = () =>{
  return(
    <div>
      <Container>
      <Button> <Icon name="plus circle"/> Add Note </Button>

      </Container>
    </div>
  );
};

export default GenericNotesWidget;

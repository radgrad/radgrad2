import * as React from 'react';
import { $ } from 'meteor/jquery';
import { Card, Grid, Header, Icon, Image, Label, List, Loader, Segment } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';

const OpportunityTeaser = (props) => {
  setTimeout(() => {
    $('.ui.embed.teaser').embed({
      source: 'youtube',
      id: props.teaser.url,
    });
  }, 300);
  $('.ui.embed.teaser').embed('destroy');
  $('.ui.embed').embed('change', 'youtube', props.teaser.url);
  return (
    <div className="ui embed teaser"/>
  );
};

export default OpportunityTeaser;

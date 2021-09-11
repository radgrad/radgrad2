import React from 'react';
import { Item } from 'semantic-ui-react';
import { Location } from '../../../../../../typings/radgrad';

const LocationItem: React.FC<Location> = ({ city, country, zip, state }) => (<Item>
  <Item.Content>
    <Item.Header>Location:</Item.Header>
    <Item.Description>
      {city ? `${city} ` : ''}
      {state ? `${state} ` : ''}
      {zip ? `${zip} ` : ''}
      {country  || ''}
    </Item.Description>
  </Item.Content>
</Item>);

export default LocationItem;

import React, { useState } from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import _ from 'lodash';
import { IUserProfileCard } from '../../../../typings/radgrad';
import { defaultProfilePicture } from '../../../../api/user/BaseProfileCollection';
import { ROLE } from '../../../../api/role/Role';
import InterestList from '../InterestList';
import ExplorerUsersWidget from './ExplorerUsersWidget';
import { capitalizeFirstOnly } from '../utilities/general';

const UserProfileCard = (props: IUserProfileCard) => {
  const [isActiveState, setIsActive] = useState(false);

  const isRole = (compareRole: string, ...otherRoles: string[]): boolean => props.item.role === compareRole || _.includes(otherRoles, props.item.role);

  const openInNewTab = () => {
    const win = window.open(props.item.website, '_blank', 'noopener,noreferrer');
    win.focus();
  };

  const toggleFullSize = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    setIsActive(!isActiveState);
  };

  if (!(props.item)) return undefined;
  const p = props.item;
  const level = p.level;
  let sharedUsername;
  if (isRole(ROLE.STUDENT, ROLE.ALUMNI)) {
    sharedUsername = p.shareUsername ? (
      <React.Fragment>
        {p.username}
        <br />
      </React.Fragment>
    ) : undefined;
  }

  const cardStyle: React.CSSProperties = {
    textAlign: 'left',
  };
 const usernameStyle: React.CSSProperties = {
   wordWrap: 'break-word',
 };

  return (
    <Card fluid style={cardStyle}>
      <Card.Content>
        <Image src={p.picture ? p.picture : defaultProfilePicture} floated="right" size="tiny" />
        <Card.Header>{`${p.firstName} ${p.lastName}`}</Card.Header>
        <Card.Meta>
          {capitalizeFirstOnly(p.role)}
          <br />
          {level > 0 ? (
            <Image
              style={{ padding: '5px' }}
              size="mini"
              src={`/images/level-icons/radgrad-level-${level}-icon.png`}
            />
          ) : undefined}
          {isRole(ROLE.ADVISOR, ROLE.FACULTY) ? (
            <div style={usernameStyle}>
              {p.username}
              <br />
            </div>
          ) : undefined}
          {sharedUsername}
          <br />
        </Card.Meta>
        {p.website ? (
          <Button
            basic
            compact
            color="green"
            size="small"
            content="WEBSITE"
            onClick={openInNewTab}
          />
        ) : undefined}
      </Card.Content>
      <Card.Content extra>
        <InterestList item={p} size="mini" />
      </Card.Content>
      <Button onClick={toggleFullSize} content="View Profile" />
      <ExplorerUsersWidget
        userProfile={props.item}
        isActive={isActiveState}
        handleClose={toggleFullSize}
      />
    </Card>
  );
};

export default UserProfileCard;

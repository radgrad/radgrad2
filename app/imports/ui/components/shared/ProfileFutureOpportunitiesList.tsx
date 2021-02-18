import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Profile } from '../../../typings/radgrad';

interface ProfileFutureOpportunitiesListProps {
  profile: Profile;
  size: SemanticSIZES;
}

const ProfileFutureOpportunitiesList: React.FC<ProfileFutureOpportunitiesListProps> = ({ profile, size }) => {
  const match = useRouteMatch();
  const opportuntyInstances;
};

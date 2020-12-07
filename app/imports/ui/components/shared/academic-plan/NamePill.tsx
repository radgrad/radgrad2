import React from 'react';

interface INamePillProps {
  name: string;
}

const NamePill: React.FC<INamePillProps> = ({ name }) => (<b>{name}</b>);

export default NamePill;

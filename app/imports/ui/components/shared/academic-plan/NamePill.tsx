import React from 'react';

interface NamePillProps {
  name: string;
}

const NamePill: React.FC<NamePillProps> = ({ name }) => (<b>{name}</b>);

export default NamePill;

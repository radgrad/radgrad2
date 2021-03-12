import React from 'react';

interface DetailsBoxProps {
  description: string,
  children?: React.ReactNode
}

export const DetailsBox: React.FC<DetailsBoxProps> = ({ description, children }) => (
  <div className="highlightBox">
    <p>{description}</p>
    {children}
  </div>
)

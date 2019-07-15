import * as React from 'react';
import ContentLoader from 'react-content-loader';

const PageLoader = () => (
  <ContentLoader
    height={360}
    width={790}
    speed={0}
    primaryColor="#f3f3f3"
    secondaryColor="#737375"
  >
    <rect x="584" y="13" rx="0" ry="0" width="1" height="38" />
    <rect x="598" y="25" rx="0" ry="0" width="31" height="22" />
    <rect x="152" y="84" rx="0" ry="0" width="0" height="0" />
    <circle cx="558" cy="35" r="15" />
    <rect x="-20" y="62" rx="0" ry="0" width="807" height="22" />
    {/* <rect x="50" y="96" rx="0" ry="0" width="677" height="34" /> */} // Help panel widget
    <circle cx="527" cy="35" r="15" />
    <circle cx="497" cy="35" r="15" />
    <circle cx="462" cy="35" r="15" />
    <circle cx="27" cy="32" r="15" />
  </ContentLoader>
);

export default PageLoader;

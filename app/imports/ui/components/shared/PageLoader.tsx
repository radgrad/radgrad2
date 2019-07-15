import * as React from 'react';
import ContentLoader from 'react-content-loader';

const PageLoader = () => (
  <ContentLoader
    height={460}
    width={790}
    speed={0}
    primaryColor="#f3f3f3"
    secondaryColor="#737375"
  >
    <rect x="600" y="20" rx="0" ry="0" width="1" height="30" />
    <rect x="612" y="24" rx="0" ry="0" width="31" height="22" />
    <rect x="152" y="84" rx="0" ry="0" width="0" height="0" />
    <circle cx="572" cy="34" r="15" />
    <rect x="-19" y="60" rx="0" ry="0" width="807" height="22" />
    <rect x="50" y="96" rx="0" ry="0" width="677" height="34" />
    <circle cx="541" cy="34" r="15" />
    <circle cx="511" cy="34" r="15" />
    <circle cx="476" cy="34" r="15" />
    <circle cx="33" cy="28" r="15" />
    <rect x="52" y="155" rx="0" ry="0" width="94" height="114" />
    <rect x="161" y="153" rx="0" ry="0" width="566" height="302" />
  </ContentLoader>
);

export default PageLoader;

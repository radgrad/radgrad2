import * as React from 'react';
import ContentLoader from 'react-content-loader';

const PageLoader = () => (
  <ContentLoader
    height={160}
    width={590}
    speed={0.4}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="483" y="9" rx="0" ry="0" width="3" height="49"/>
    <rect x="492" y="17" rx="0" ry="0" width="40" height="33"/>
    <rect x="152" y="84" rx="0" ry="0" width="0" height="0"/>
    <circle cx="455" cy="34" r="18"/>
    <circle cx="410" cy="34" r="18"/>
    <circle cx="365" cy="34" r="18"/>
    <circle cx="320" cy="34" r="18"/>
    <circle cx="50" cy="34" r="25"/>
    <rect x="9" y="62" rx="0" ry="0" width="536" height="25"/>
  </ContentLoader>
);

export default PageLoader;

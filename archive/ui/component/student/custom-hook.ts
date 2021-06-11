import { useEffect } from 'react';
import { DegreePlannerStateNames } from '../../../../app/imports/ui/pages/student/StudentDegreePlannerPage';
import { useStickyState } from '../../../../app/imports/ui/utilities/StickyState';

export const useResize = (myRef) => {
  const [width, setWidth] = useStickyState(DegreePlannerStateNames.draggablePillWidth, 0);
  const [height, setHeight] = useStickyState(DegreePlannerStateNames.draggablePillHeight, 0);

  useEffect(() => {
    if (myRef.current) {
      setWidth(myRef.current.offsetWidth);
      setHeight(myRef.current.offsetHeight);
    }
    const handleResize = () => {
      setWidth(myRef.current.offsetWidth);
      setHeight(myRef.current.offsetHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [myRef, setHeight, setWidth]);

  return { width, height };
};

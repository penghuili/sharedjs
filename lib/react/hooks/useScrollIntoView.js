// useScrollToPost.js
import { useEffect, useRef } from 'react';

import useRefValue from '../../../../File37/src/shared/react/hooks/useRefValue';

function useScrollIntoView(id, onScrolled) {
  const postRefs = useRef({});
  const ref = useRefValue(onScrolled);

  useEffect(() => {
    if (id && postRefs.current[id]) {
      postRefs.current[id].scrollIntoView({ behavior: 'smooth' });
      if (ref.current) {
        ref.current();
      }
    }
  }, [id, ref]);

  const assignRef = postId => el => {
    if (postId) {
      postRefs.current[postId] = el;
    }
  };

  return assignRef;
}

export default useScrollIntoView;

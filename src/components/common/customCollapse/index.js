import React, { useEffect, useRef, useState } from 'react';
import './index.scss';

function CustomCollapse({ open = false, children }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (open && contentRef.current !== null) {
      setHeight(contentRef.current.clientHeight);
    } else if (!open && contentRef.current !== null) {
      setHeight(0);
    }
  }, [open, contentRef]);
  return (
    <div className="collapse-wrapper" style={{ height: height }}>
      <div className="collapse-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}

export default CustomCollapse;

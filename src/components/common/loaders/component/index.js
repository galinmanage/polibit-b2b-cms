import React, { useEffect, useState } from 'react';
import './index.scss';

const ComponentLoader = (props) => {

  const [isLoading, setIsLoading] = useState(props.loaderState);
  const { customClass } = props;
  useEffect(() => {
    setIsLoading(props.loaderState);
  }, [props.loaderState]);

  return (
    <>
      {isLoading && <div className={'loader ' + customClass}></div>}
    </>
  );
};
export default ComponentLoader;

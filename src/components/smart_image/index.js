import ComponentLoader from 'components/common/loaders/component';
import './index.scss';
import { useEffect, useState } from 'react';

export const SmartImage = ({
  mobileImg,
  desktopImg,
  tabletImg,
  placeholder,
  imgClassName,
  containerClassName,
  alt,
}) => {
  const [onLoad, setOnLoad] = useState(false);

  useEffect(() => {
    if (!alt) console.error('please send alt');
  }, []);

  const onHandleLoad = () => {
    setOnLoad(true);
  };

  return (
    <div className={containerClassName}>
      {!onLoad && (
        <div className="loader-container">
          <ComponentLoader loaderState={!onLoad} />
        </div>
      )}
      <picture>
        <source media="(min-width:768px)" srcSet={desktopImg} />
        <source media="(min-width:320px)" srcSet={tabletImg} />
        <source media="(max-width:320px)" srcSet={mobileImg} />
        <img
          className={imgClassName}
          onLoad={onHandleLoad}
          srcSet={placeholder}
          alt={alt}
        />
      </picture>
    </div>
  );
};

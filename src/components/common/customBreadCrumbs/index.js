import { useEffect, useState } from 'react';
import useTranslations from '../../../app/hooks/useTranslations';
import Arrow from '../../../assets/icons/arrow.svg';
import Link from '../../link';
import './index.scss';

export default function CustomBreadCrumbs({ className = '', path = '' }) {
  const [breadCrumbs, setBreadCrumbs] = useState(['/']);
  const [currentPath, setCurrentPath] = useState([]);
  const translate = useTranslations();

  useEffect(() => {
    setBreadCrumbs(['/']);
    convertCrumbsToArray();
  }, [path]);

  function convertCrumbsToArray() {
    if (path === '/') {
      setBreadCrumbs(['/']);
    } else {
      let parts = path.split('/');

      if (parts[0] === '') {
        parts.shift();
      } else {
        parts.unshift('/');
      }
      parts = parts.map((item) => '/' + item);
      setBreadCrumbs((prev) => [...prev, ...parts]);
      setCurrentPath(getPathArray(parts));
    }
  }

  function getPathArray(arr) {
    const paths = ['/'];
    let currentPath = '';

    for (let i = 0; i < arr.length; i++) {
      currentPath += arr[i];
      paths.push(currentPath);
    }

    return paths;
  }

  function formatBreadcrumbName(crumb) {
    let name = crumb.replace('/', '');
    if (name === '') name = 'homepage';
    if (isNaN(name)) {
      name = 'cms_' + name + '_breadcrumb';
    }
    name = name.charAt(0) + name.slice(1);
    return name;
  }

  return (
    breadCrumbs.length > 1 && (
      <div className={'custom-breadcrumbs ' + className} aria-label={'breadcrumbs'}>
        {breadCrumbs.map((crumb, index) => {
          const name = formatBreadcrumbName(crumb);
          const path = currentPath[index];
          const breadcrumbValue = !isNaN(name) ? name : translate(name);

          return (
            <Link key={index} to={path} className={'crumb-container'}>
							<span className={'crumb'} title={breadcrumbValue}>
								{breadcrumbValue}
							</span>

              <img className={'arrow'} src={Arrow} alt={'arrow'} />
            </Link>
          );
        })}
      </div>
    )
  );
}

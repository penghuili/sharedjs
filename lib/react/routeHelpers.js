import { getHook } from './hooksOutside';

export const routeHelpers = {
  navigate: path => {
    const [location, setLocation] = getHook('location');
    if (path === location) {
      return;
    }

    setLocation(path, { replace: false });
  },
  replace: path => {
    const [location, setLocation] = getHook('location');
    if (path === location) {
      return;
    }

    setLocation(path, { replace: true });
  },
  goBack() {
    if (history.length > 1) {
      history.back();
    } else {
      routeHelpers.navigate('/');
    }
  },
};

export function getQueryParams() {
  const obj = {};

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
}

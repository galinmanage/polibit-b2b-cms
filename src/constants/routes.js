const ROOT = '/';
const LOGIN = '/login';
const USERS = `/users`;
const TEXTS = `/translations`;
const MEDIA = `/media`;

// The permissions are from the gd
const ROUTES = {
  LOGIN: {
    text: '',
    path: LOGIN,
    component: 'Login',
    isProtected: false,
    showOnMenu: false,
    isAuth: true,
    subs: {},
  },
  ROOT: {
    text: 'cms_navItem_home',
    path: ROOT,
    component: 'Home',
    isProtected: true,
    showOnMenu: false,
    index: 'Dashboard',
    subs: {
      TextsPage: {
        text: 'cms_navItem_texts',
        path: TEXTS,
        component: 'TextsPage',
        isProtected: true,
        showOnMenu: true,
        subs: {},
      },
      MediaPage: {
        text: 'cms_navItem_media',
        path: MEDIA,
        component: 'MediaPage',
        isProtected: true,
        showOnMenu: true,
        subs: {},
      },
      // 'UsersPage': {
      //     text: 'cms_navItem_users',
      //     path: USERS,
      //     component: 'UsersPage',
      //     isProtected: true,
      //     showOnMenu: true,
      //     subs: {}
      // },
    },
  },
  404: {
    path: '*',
    component: 'Page404',
    isProtected: false,
    showOnHeader: false,
    subs: {},
  },
};

export default ROUTES;

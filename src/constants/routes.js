const ROOT = '/';
const LOGIN = '/login';
const DIRECT_QUOTING = '/direct-quoting';
const ELIGIBLE_MODELS = '/direct-quoting/eligible-models';
const API_ROUTED_COMPANIES = '/direct-quoting/api-routed-companies';
const BASE_PREMIUMS = '/direct-quoting/base-premiums';
const PREMIUM_EXCEPTIONS = '/direct-quoting/premium-exceptions';
const PRICING_FACTORS = '/direct-quoting/pricing-factors';

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
      // DirectQuoting: {
      //   text: 'cms_navItem_directQuoting',
      //   isProtected: true,
      //   showOnMenu: true,
      //   subs: {},
      // },
      EligibleModels: {
        text: 'cms_navItem_eligibleModels',
        path: ELIGIBLE_MODELS,
        component: 'EligibleModels',
        isProtected: true,
        showOnMenu: true,
        subs: {},
      },
      ApiRoutedCompanies: {
        text: 'cms_navItem_apiRoutedCompanies',
        path: API_ROUTED_COMPANIES,
        component: 'ApiRoutedCompanies',
        isProtected: true,
        showOnMenu: true,
        subs: {},
      },
      BasePremiums: {
        text: 'cms_navItem_basePremiums',
        path: BASE_PREMIUMS,
        component: 'BasePremiums',
        isProtected: true,
        showOnMenu: true,
        subs: {},
      },
      PremiumExceptions: {
        text: 'cms_navItem_premiumExceptions',
        path: PREMIUM_EXCEPTIONS,
        component: 'PremiumExceptions',
        isProtected: true,
        showOnMenu: true,
        subs: {},
      },
      PricingFactors: {
        text: 'cms_navItem_pricingFactors',
        path: PRICING_FACTORS,
        component: 'PricingFactors',
        isProtected: true,
        showOnMenu: true,
        subs: {},
      },
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

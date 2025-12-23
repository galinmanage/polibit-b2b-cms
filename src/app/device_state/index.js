import Actions from '../../redux/actions';

export default class deviceState {
  constructor(dispatch) {
    this.dispatch = dispatch; //redux action dispatch function
    this.debounce_delay = 250; //debounce delay in milliseconds
    this.start();
  }

  getScreenBasedOnMediaQuery = () => {
    const mobile = window.matchMedia('(max-width:767px)').matches;
    const tablet = window.matchMedia(
      '(min-width:768px) and (max-width:1199px)',
    ).matches;
    const desktop = window.matchMedia(
      '(min-width:1200px) and (max-width:1499px)',
    ).matches;
    const desktop_large = window.matchMedia(
      '(min-width:1500px) and (max-width:1919px)',
    ).matches;
    const desktop_max = window.matchMedia('(min-width:1920px').matches;

    return {
      device: '',
      isMobile: mobile,
      isTablet: tablet,
      isLaptop: desktop,
      isDesktopLarge: desktop_large,
      isDesktopMax: desktop_max,
      isDesktop: desktop || desktop_large || desktop_max,
      notDesktop: !desktop && !desktop_large && !desktop_max,
      notMobile: !mobile,
    };
  };

  getDevice = () => {
    //determine current device

    const deviceState = this.getScreenBasedOnMediaQuery();
    if (deviceState.isMobile) {
      deviceState.device = 'mobile';
      return deviceState;
    } else if (deviceState.isTablet) {
      deviceState.device = 'tablet';
      return deviceState;
    } else if (deviceState.isLaptop) {
      deviceState.device = 'desktop';
      return deviceState;
    } else if (deviceState.isDesktopLarge) {
      deviceState.device = 'desktop_large';
      return deviceState;
    } else if (deviceState.isDesktopMax) {
      deviceState.device = 'desktop_max';
      return deviceState;
    }
  };

  start = () => {
    //Listen for screen resize with a debounce
    var response = this.debounce(
      () => {
        //set device type in the redux store
        const payload = this.getDevice();


        this.dispatch(Actions.setDeviceState(payload));
      },
      this.debounce_delay,
      false,
    );

    window.addEventListener('resize', response);
    response();
  };

  //Debounce the device state function so that it is called only once every 250ms
  debounce(func, wait, immediate) {
    let timeout;
    return function() {
      let context = this,
        args = arguments;
      let later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}

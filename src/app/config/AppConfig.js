let instance = null;

class AppConfig {
  constructor() {
    if (!instance) {
      this.init();
      instance = this;
      this.server_url = '';
    }
    return instance;
  }

  init() {
    this.debug_mode = false;
    this.api = {
      https: true,
      baseUrl: window.apiUrl,
      path: 'website_api',
      platform: 'website',
      version: '1.0',
      requests: {
        generalDeclaration: 'generalDeclaration',

      },
    };
    this.full_path = (this.api.https ? 'https' : 'http') + '://' + window.baseUrl;
    this.media_path = (this.api.https ? 'https' : 'http') + '://' + window.mediaUrl;
    this.token = this.getToken();
  }

  /*--------------------------------------------------------------------------------------------------------------------*/
  //caching
  getToken = () => localStorage.getItem('token');
  setToken = (token) => localStorage.setItem('token', token);
}

export default AppConfig;

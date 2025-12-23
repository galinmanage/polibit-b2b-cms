import React, { useState } from 'react';
import './cookies.scss';

const Cookies = ({ text }) => {
  const [, forceUpdate] = useState({});

  const setCookie = (cname, cvalue) => {
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';domain=' + window.location.hostname + ';path=/;';
    forceUpdate({});
  };

  const getCookie = (cname) => {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  };

  const cookie = getCookie('ten_cookies_accepted');
  const show_msg = cookie !== 'true';

  return (
    <div className="cookies_container">
      {show_msg && (
        <div className="cookies_layer">
          <div className="msg">{text.web_cookies_msg}</div>
          <button
            className="accept"
            onClick={() => setCookie('ten_cookies_accepted', true)}
          >
            {text.web_cookies_btn}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cookies;

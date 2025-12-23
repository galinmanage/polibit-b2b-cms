import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';


class DynamicLink extends Component {

  render() {
    const { data = {}, className = '' } = this.props;
    let params = '';
    let component = <span className={className}> missing link data {this.props.children} </span>;

    if (data.type) {
      if (data.route === 'contentPage') {
        let content_page_id = data.parameters.id;
        if (data.parameters.id) {
          for (let route_name in this.props.contentRoutes) {
            if (this.props.contentRoutes[route_name] === content_page_id.toString()) {
              component = <NavLink to={'/' + route_name} className={className}>
                {this.props.children}
              </NavLink>;
            }
          }
        }
      } else {
        if (data.type === 'internal') {
          if (Object.keys(data.parameters).length > 0) {
            params = '/' + data.parameters.id;
          }
          component = <NavLink to={'/' + data.route + params} className={className}>
            {this.props.children}
          </NavLink>;
        } else {
          component = <a href={data.route} rel="noopener noreferrer" target="_blank" className={className}>
            {this.props.children}
          </a>;
        }
      }
    }

    return (
      <Fragment>
        {component}
      </Fragment>
    );
  }
}

//connect to redux store
const mapStateToProps = store => {
  return {
    contentRoutes: store.config.contentRoutes,
  };
};

export default connect(mapStateToProps, null, null, { pure: false })(DynamicLink);

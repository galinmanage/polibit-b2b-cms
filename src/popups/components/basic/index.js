import React, { Component } from 'react';
import { connect } from 'react-redux';
import Actions from '../../../redux/actions';
import PopupButton from '../add-button';
import './index.scss';

class BasicPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animation_class: '',
    };
  }

  /* add class for animation after it is inserted into the DOM */
  componentDidMount() {
    this.animateIn();
  }

  animateIn = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.setState({ animation_class: 'active' });
      });
    });
  };

  completeAnimation = () => {
    if (this.state.animation_class !== 'exit' && this.state.animation_class !== 'done') {
      this.setState({ animation_class: 'done' });
    }
  };

  /* first remove the active class for exit animation then call the callback and remove the popup */
  animateOut = (callback) => {
    this.setState({ animation_class: 'exit' });
    setTimeout(() => {
      if (callback) {
        callback();
      }
      this.props.removePopup();
    }, 200);
  };

  render() {
    let text = (this.props.payload && this.props.payload.text) ? this.props.payload.text : 'אירעה שגיאה כללית';
    let btnText = (this.props.payload && this.props.payload.btnText) ? this.props.payload.btnText : 'אישור';
    return (
      <div className={'backdrop general-msg ' + this.state.animation_class}
           onClick={() => this.animateOut()}
           onTransitionEnd={this.completeAnimation}>
        <div className={'popup_wrapper ' + this.state.animation_class} onClick={(e) => e.stopPropagation()}>
          <button className="x_close_icon" onClick={() => this.animateOut()}></button>
          <div className="popup_content">
            {text}
          </div>

          <PopupButton className={'accept-btn'} onClick={() => this.animateOut()}>{btnText}</PopupButton>
        </div>
      </div>
    );
  }
}

//add GD categories and deviceState to props
const mapStateToProps = store => {
  return {
    deviceState: store.deviceState,
  };
};
//map a doLgin function to props
const mapDispatchToProps = dispatch => {
  return {
    addPopup: (payload) => dispatch(Actions.addPopup(payload)),
    removePopup: () => dispatch(Actions.removePopup()),
  };
};

//connect to redux store - maps dispatch and redux state to props
export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(BasicPopup);

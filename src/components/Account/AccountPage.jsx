import React from 'react';
import PropTypes from 'prop-types';

import * as Icon from 'react-feather';

import {db} from 'Firebase';
import {BareModal, Modal, ModalBody} from 'Utils/Modal';

export default class AccountPage extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  state = {text: 'EMptuy tExT'};
  componentDidMount() {
    const {fetchCards} = this.props;
  }

  render() {
    const {onClose, style, authUser, setAuthUserInfo} = this.props;
    const {text} = this.state;

    const {username} = authUser;

    return (
      <div className="content-margin">
        <h1>{username}</h1>
        <input
          className="form-control"
          onChange={e =>
            this.setState({
              text: e.target.value,
            })
          }
        />
        <div className="text-4xl font-bold">{text}</div>
      </div>
    );
  }
}

/* {
  <!-- <button -->
    <!--   style={{ width: '100%' }} -->
    <!--   className={css(defaultStylesheet.btn)} -->
    <!--   onClick={() => extendUserInfo()} -->
    <!-- > -->
    <!--   <Icon.Edit /> -->
    <!-- </button> -->
  } */

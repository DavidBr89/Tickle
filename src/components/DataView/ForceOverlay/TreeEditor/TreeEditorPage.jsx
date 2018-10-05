import React, { Component} from 'react';
import PropTypes from 'prop-types';

class TreeEditorPage extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        test

      </div>
    );
  }
}

export default TreeEditorPage;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RelatedTags extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };


  render() {
    return (
      <div className="m-2">
        <div className="flex mb-2">
          <h2 className="tag-label">Tags</h2>
        </div>
        ass
      </div>
    );
  }
}

export default RelatedTags;

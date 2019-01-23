import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ScrollView, ScrollElement} from 'Utils/ScrollView';

class ScrollList extends Component {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
    className: PropTypes.string,
    children: PropTypes.func,
    style: PropTypes.object,
    maxHeight: PropTypes.number
  };

  static defaultProps = {
    data: [],
    className: '',
    style: {},
    className: '',
    children: d => d,
    maxHeight: 500,
    itemStyle: {}
  };

  state = {selected: null};

  componentDidUpdate() {
    const {selected} = this.state;

    console.log('this scroll', this._scroller);
    this._scroller.scrollTo(selected);
  }

  render() {
    const {
      data,
      children,
      maxHeight,
      className,
      style,
      itemStyle
    } = this.props;
    const {selected} = this.state;
    // TODO: change url;
    return (
      <div
        className={className}
        style={{
          width: '100%',
          // height: data.length > 0 ? '50vh' : null,
          maxHeight,
          overflowY: 'scroll',
          ...style
        }}>
        <ScrollView ref={scroller => (this._scroller = scroller)}>
          <div className={className} style={{height: '100%', ...style}}>
            {data.map(d => (
              <ScrollElement name={d.url}>
                <div
                  style={itemStyle}
                  onClick={() =>
                    this.setState(oldState => ({
                      selected:
                        oldState.selected !== d.url ? d.url : null
                    }))
                  }>
                  {children(d, d.url === selected)}
                </div>
              </ScrollElement>
            ))}
          </div>
        </ScrollView>
      </div>
    );
  }
}

export default ScrollList;
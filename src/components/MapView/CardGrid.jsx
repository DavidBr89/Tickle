import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisibilitySensor from 'react-visibility-sensor/visibility-sensor.js';
import Grid from 'mygrid/dist';
import { ScrollView, ScrollElement } from '../utils/ScrollView';
import { PreviewCard } from '../cards';

class CardGrid extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    onExtend: PropTypes.func.isRequired,
    controls: PropTypes.node.isRequired,
    setCardOpacity: PropTypes.func.isRequired,
    offset: PropTypes.number.isRequired,
    selected: PropTypes.number,
    style: PropTypes.object
  };

  static defaultProps = {
    style: {},
    selected: null,
    setCardOpacity(d) {
      return d;
    }
  };

  constructor(props) {
    super(props);
    this.id = null;
    this.box = null;
    this.state = { visibleCardId: props.selected };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.visibleCardId !== nextState.visibleCardId ||
      this.props.controls.key !== nextProps.controls.key
    ); // nextProps.selected !== this.props.selected;
    // return true;
  }
  componentDidUpdate(prevProps, prevState) {
    const { onSelect } = this.props;
    const { visibleCardId } = this.state;
    if (prevState.visibleCardId !== visibleCardId) {
      this._scroller.scrollTo(visibleCardId);
      onSelect(visibleCardId);
    }
  }

  render() {
    const { cards, onExtend, style, controls, onSelect } = this.props;
    const { visibleCardId } = this.state;

    const onChange = d => visible => {
      // TODO: big hack make issue in react visibility-sensor
      // clearTimeout(this.id);
      if (visible) {
        clearTimeout(this.id);
        this.id = setTimeout(() => {
          this.setState({ visibleCardId: d.id, lastScroll: new Date() });
          onSelect(d.id);
        }, 750);
      }
    };

    return (
      <div>
        <div
          ref={node => (this.node = node)}
          style={{
            position: 'absolute',
            left: '5vw',
            width: '70vw',
            height: '48vh'
            // border: '1px grey dashed'
          }}
        />

        <ScrollView ref={scroller => (this._scroller = scroller)}>
          <div
            style={{
              position: 'absolute',
              overflowX: 'scroll',
              overflowY: 'visible',
              width: '100%',
              height: '40vh',
              zIndex: 2000
            }}
          >
            <div style={{ ...style, display: 'flex' }}>
              {cards.map(d => (
                <div
                  key={d.id}
                  style={{
                    width: '28vw',
                    marginLeft: '5vw',
                    marginRight: '6vw'
                  }}
                >
                  <ScrollElement name={d.id}>
                    <div>
                      <div style={{ opacity: visibleCardId === d.id ? 1 : 0 }}>
                        {controls}
                      </div>
                    </div>
                    <VisibilitySensor
                      onChange={onChange(d)}
                      containment={this.node}
                    >
                      <PreviewCard
                        {...d}
                        onClick={() =>
                          visibleCardId === d.id
                            ? onExtend(d.id)
                            : this.setState({ visibleCardId: d.id })
                        }
                        selected={visibleCardId === d.id}
                        style={{
                          opacity: visibleCardId === d.id ? 1 : 0.56,
                          transform:
                            visibleCardId === d.id ? 'scale(1.2)' : null,
                          transition: 'transform 1s',
                          height: '100%',
                          padding: '10px'
                        }}
                      />
                    </VisibilitySensor>
                  </ScrollElement>
                </div>
              ))}
            </div>
          </div>
        </ScrollView>
      </div>
    );
  }
}
export default CardGrid;

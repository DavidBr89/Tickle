import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisibilitySensor from 'react-visibility-sensor';
import Grid from 'mygrid/dist';
import { PreviewCard } from '../cards';

class CardGrid extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    onExtend: PropTypes.func.isRequired,
    controls: PropTypes.node.isRequired,
    setCardOpacity: PropTypes.func.isRequired,
    offset: PropTypes.number.isRequired,
    style: PropTypes.object,
    selected: PropTypes.number
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

  render() {
    const {
      cards,
      onSelect,
      onExtend,
      style,
      setCardOpacity,
      controls
    } = this.props;
    const { visibleCardId } = this.state;

    const onChange = d => visible => {
      clearTimeout(this.id);
      if (visible) {
        onSelect(d.id);
        // TODO: fix
        this.id = setTimeout(() => this.setState({ visibleCardId: d.id }), 0);
      }
    };

    return (
      <div>
        <div
          ref={node => (this.node = node)}
          style={{
            position: 'absolute',
            left: '25vw',
            width: '40vw',
            height: '48vh'
            // border: '1px grey dashed'
          }}
        />
        <div
          style={{
            position: 'absolute',
            overflowX: 'scroll',
            overflowY: 'visible',
            width: '100%',
            height: '38vh',
            zIndex: 2000
          }}
        >
          <Grid
            rows={1}
            cols={Math.floor(cards.length) * 2}
            colSpan={2}
            rowSpan={1}
            gap={2}
            style={style}
          >
            {cards.map(d => (
              <div className="w-100" key={d.id}>
                <div className="w-100">
                  <div style={{ opacity: visibleCardId === d.id ? 1 : 0 }}>
                    {controls}
                  </div>
                </div>
                <VisibilitySensor
                  onChange={onChange(d)}
                  scrollCheck
                  containment={this.node}
                >
                  <PreviewCard
                    {...d}
                    onClick={() => visibleCardId === d.id && onExtend(d.id)}
                    selected={visibleCardId === d.id}
                    style={{
                      opacity: setCardOpacity(d),
                      transform: visibleCardId === d.id ? 'scale(1.2)' : null,
                      transition: 'transform 1s',
                      height: '100%',
                      padding: '10px'
                    }}
                  />
                </VisibilitySensor>
                {
                  // <button
                  // className="btn ml-3"
                  // style={{ background: 'whitesmoke' }}
                  // >
                  // Go
                  // </button>
                }
              </div>
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}
export default CardGrid;

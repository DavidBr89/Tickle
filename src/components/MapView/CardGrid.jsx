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
    setTimeout: PropTypes.func.isRequired,
    clearTimeout: PropTypes.func.isRequired,
    offset: PropTypes.number.isRequired,
    style: PropTypes.object,
    selected: PropTypes.number
  };

  static defaultProps = {
    style: {},
    selected: null
  };

  constructor(props) {
    super(props);
    this.id = null;
    this.box = null;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected;
    // return true;
  }

  render() {
    const {
      cards,
      onSelect,
      onExtend,
      style,
      selected

      // setTimeout,
      // clearTimeout
    } = this.props;

    const onChange = d => visible => {
      // TODO: check later
      clearTimeout(this.id);
      if (visible) {
        this.id = setTimeout(() => onSelect(d.id), 50);
      }
    };

    return (
      <div>
        <div
          ref={node => (this.node = node)}
          style={{
            position: 'absolute',
            left: '30vw',
            width: '40vw',
            height: '30vh'
          }}
        />
        <div
          style={{
            position: 'absolute',
            overflowX: 'scroll',
            width: '100%',
            height: '30vh',
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
              <div key={d.id}>
                <VisibilitySensor
                  onChange={onChange(d)}
                  scrollCheck
                  scrollDelay={0}
                  containment={this.node}
                >
                  <PreviewCard
                    {...d}
                    onClick={() => selected === d.id && onExtend(d.id)}
                    selected={selected === d.id}
                    style={{
                      opacity: selected !== d.id ? 0.56 : null,
                      transform: selected === d.id ? 'scale(1.2)' : null,
                      transition: 'transform 1s',
                      height: '100%',
                      padding: '10px'
                    }}
                  />
                </VisibilitySensor>
              </div>
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}
export default CardGrid;

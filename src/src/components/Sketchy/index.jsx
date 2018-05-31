import React from 'react';

// const ratio = 4;

function autoSizeText(container, attempts = 200) {
  const setChildrenToInheritFontSize = el => {
    el.style.fontSize = 'inherit';
    _.each(el.children, child => {
      setChildrenToInheritFontSize(child);
    });
  };

  const resizeText = el => {
    attempts--;
    let elNewFontSize;
    if (
      el.style.fontSize === '' ||
      el.style.fontSize === 'inherit' ||
      el.style.fontSize === 'NaN'
    ) {
      elNewFontSize = '140px'; // largest font to start with
    } else {
      elNewFontSize = `${parseInt(el.style.fontSize.slice(0, -2)) - 1}px`;
    }
    el.style.fontSize = elNewFontSize;

    // this function can crash the app, so we need to limit it
    if (attempts <= 0) {
      return;
    }

    if (el.scrollWidth > el.offsetWidth || el.scrollHeight > el.offsetHeight) {
      resizeText(el);
    }
  };
  setChildrenToInheritFontSize(container);
  resizeText(container);
}

class Tag extends React.Component {
  static propTypes() {
    return {
      children: React.PropTypes.array.isRequired,
      width: React.PropTypes.array.isRequired,
      height: React.PropTypes.number.isRequired,
      left: React.PropTypes.number.isRequired,
      top: React.PropTypes.number.isRequired
    };
  }

  componentDidMount() {
    // this.componentDidUpdate.bind(this)();
    const { width, height, color } = this.props;
    const node = ReactDom.findDOMNode(this);
    // console.log('node', node);
    autoSizeText(node, 200);
    d3
      .select(this.svg)
      .selectAll('*')
      .remove();

    const paths = sketchy
      .rectStroke({
        svg: d3.select(this.svg),
        x: 0,
        y: 0,
        width,
        height,
        density: 0,
        sketch: 1
      })
      .selectAll('path')
      .attr('stroke', color)
      .attr('stroke-width', '2');
  }

  render() {
    const {
      left,
      top,
      width,
      height,
      children,
      color,
      fill,
      onClick
    } = this.props;

    // const p = <rect stroke={color} width={width} height={height} />;
    const pad = 0;
    const st = {
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
      width: `${width}px`,
      height: `${height}px`
      // border: 'black groove',
      // borderRadius: '10%',
    };
    return (
      <div className={styles.tag} style={st} onClick={() => onClick(children)}>
        <span
          style={{
            lineHeight: `${height - pad}px`
          }}
        >
          {children}
        </span>
        <svg
          ref={svg => (this.svg = svg)}
          style={{
            width: `${width}px`,
            height: `${height}px`
          }}
        />
      </div>
    );
  }
}

Tag.defaultProps = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  children: 0,
  color: 'blue',
  fill: 'white',
  clickHandler: () => null
};

import React, {
  Component,
  useImperativeMethods,
  useRef,
  useEffect
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import scrollIntoView from 'scroll-into-view';

import scrollIntoView from 'scroll-into-view-if-needed';

if (!Element.prototype.scrollIntoViewIfNeeded) {
  Element.prototype.scrollIntoViewIfNeeded = function(centerIfNeeded) {
    centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;

    const parent = this.parentNode;

    const parentComputedStyle = window.getComputedStyle(parent, null);

    const parentBorderTopWidth = parseInt(
      parentComputedStyle.getPropertyValue('border-top-width')
    );

    const parentBorderLeftWidth = parseInt(
      parentComputedStyle.getPropertyValue('border-left-width')
    );

    const overTop =
      this.offsetTop - parent.offsetTop < parent.scrollTop;

    const overBottom =
      this.offsetTop -
        parent.offsetTop +
        this.clientHeight -
        parentBorderTopWidth >
      parent.scrollTop + parent.clientHeight;

    const overLeft =
      this.offsetLeft - parent.offsetLeft < parent.scrollLeft;

    const overRight =
      this.offsetLeft -
        parent.offsetLeft +
        this.clientWidth -
        parentBorderLeftWidth >
      parent.scrollLeft + parent.clientWidth;

    const alignWithTop = overTop && !overBottom;

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop =
        this.offsetTop -
        parent.offsetTop -
        parent.clientHeight / 2 -
        parentBorderTopWidth +
        this.clientHeight / 2;
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft =
        this.offsetLeft -
        parent.offsetLeft -
        parent.clientWidth / 2 -
        parentBorderLeftWidth +
        this.clientWidth / 2;
    }

    if (
      (overTop || overBottom || overLeft || overRight) &&
      !centerIfNeeded
    ) {
      this.scrollIntoView(alignWithTop);
    }
  };
}

const {Provider, Consumer} = React.createContext({
  register: null,
  unregister: null
});

const ScrollView = React.forwardRef(
  ({children, onScrollEnd = d => d}, ref) => {
    const elements = {};

    const register = (name, ref) => {
      elements[name] = ref;
    };

    const unregister = name => {
      delete elements[name];
    };

    const childRef = useRef();

    // console.log('Imperative ref', ref);
    useImperativeMethods(ref, () => ({
      scrollTo(name, opts = {}) {
        const node = ReactDOM.findDOMNode(elements[name].current);
        scrollIntoView(node, {
          behavior: 'smooth',
          inline: 'center',
          scrollMode: 'if-needed',
          ...opts
        });
      }
    }));

    return (
      <Provider value={{register, unregister}}>
        {React.cloneElement(children, {ref: childRef})}
      </Provider>
    );
  }
);

const ScrollConsumer = ({register, unregister, name, children}) => {
  const ref = React.createRef();

  useEffect(() => {
    register(name, ref);
    // TODO: blur;
    // console.log('elRef', ref);
    // ref.current.blur();
    return unregister;
  });

  return React.cloneElement(children, {ref});
};

const ScrollElement = ({name, children}) => (
  <Consumer>
    {({register, unregister}) => (
      <ScrollConsumer
        register={register}
        unregister={unregister}
        name={name}>
        {children}
      </ScrollConsumer>
    )}
  </Consumer>
);

export {ScrollView, ScrollElement};

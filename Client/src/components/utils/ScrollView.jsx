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

const {Provider, Consumer} = React.createContext({
  register: null,
  unregister: null
});

const ScrollView = React.forwardRef((props, ref) => {
  const {children, boundary, onScrollEnd = d => d} = props;
  const elements = {};

  const register = (name, ref) => {
    elements[name] = ref;
  };

  const unregister = name => {
    delete elements[name];
  };

  const childRef = useRef();

  useImperativeMethods(ref, () => ({
    scrollTo(name, opts = {}) {
      const node = ReactDOM.findDOMNode(elements[name].current);
      scrollIntoView(node, {
        behavior: 'smooth',
        inline: 'center',
        // scrollMode: 'if-needed',
        boundary: boundary
          ? boundary.current
          : document.getElementById('#content-container'),
        ...opts
      });
    }
  }));

  return (
    <Provider value={{register, unregister}}>
      {React.cloneElement(children, {ref: childRef})}
    </Provider>
  );
});

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

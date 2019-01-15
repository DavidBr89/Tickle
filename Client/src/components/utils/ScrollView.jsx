import React, {
  Component,
  useImperativeMethods,
  useRef,
  useEffect
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import scrollIntoView from 'scroll-into-view';

const {Provider, Consumer} = React.createContext({
  register: null,
  unregister: null
});

const ScrollView = React.forwardRef(({children}, ref) => {
  const elements = {};

  const register = (name, ref) => {
    elements[name] = ref;
  };

  const unregister = name => {
    delete elements[name];
  };

  // const childRef = useRef();

  useImperativeMethods(ref, () => ({
    scrollTo(name, opts = {time: 500, left: 1}) {
      const node = ReactDOM.findDOMNode(elements[name].current);
      const {time, left} = opts;
      scrollIntoView(node, {
        time,
        align: {
          left
          // leftOffset: 0
        }
      });
    }
  }));

  return (
    <Provider value={{register, unregister}}>
      {React.cloneElement(children)}
    </Provider>
  );
});

const ScrollConsumer = ({register, unregister, name, children}) => {
  const ref = React.createRef();

  useEffect(() => {
    register(name, ref);
    return unregister;
  });

  return React.cloneElement(children, {ref});
};

class ScrollElement extends Component {
  static contextTypes = {
    scroll: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.element,
    name: PropTypes.string
  };

  render() {
    const {name} = this.props;
    return (
      <Consumer>
        {({register, unregister}) => (
          <ScrollConsumer
            register={register}
            unregister={unregister}
            name={name}>
            {this.props.children}
          </ScrollConsumer>
        )}
      </Consumer>
    );
  }
}

export {ScrollView, ScrollElement};

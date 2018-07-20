import React from 'react';

//TODO understand

const createDecorator = () => {
  const { Provider: RawProvider, Consumer: RawConsumer } = React.createContext(
    null
  );

  const provider = value => WrappedClass =>
    class extends React.Component {
      constructor(props) {
        super(props);

        this.$update = v => {
          this.setState({ $value: v });
        };

        this.state = {
          $value: value,
          $update: this.$update
        };
      }
      render() {
        return (
          <RawProvider value={this.state}>
            <WrappedClass {...this.props} />
          </RawProvider>
        );
      }
    };

  const consumer = ctxName => WrappedClass => {
    if (!ctxName) {
      ctxName = 'ctx';
    }
    const ctxUpdateName = `set${ctxName.replace(/^\w/, chr =>
      chr.toUpperCase()
    )}`;

    return class extends React.Component {
      render() {
        const _consumerFunc = context => {
          const _ctxProps = {
            [ctxName]: context.$value,
            [ctxUpdateName]: context.$update
          };
          return <WrappedClass {...this.props} {..._ctxProps} />;
        };
        return <RawConsumer>{_consumerFunc}</RawConsumer>;
      }
    };
  };

  return {
    provider,
    consumer
  };
};

export default createDecorator;

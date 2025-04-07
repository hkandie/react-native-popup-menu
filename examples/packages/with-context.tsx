import React from 'react';

export function withContext(Context: any, propName = 'context') {
  return function wrap(Component: React.ComponentType<any>) {
    class EnhanceContext extends React.Component {
      props: any;
      render() {
        const { forwardedRef, ...rest } = this.props;

        return (
          <Context.Consumer>
            {(value: any) => {
              const custom = {
                [propName]: value,
                ref: forwardedRef
              };

              return (
                <Component
                  {...custom}
                  {...rest}
                />
              );
            }}
          </Context.Consumer>
        );
      }
    }

    const name = Component.displayName || Component.name || 'Component';
    const consumerName = Context.Consumer.displayName || Context.Consumer.name || 'Context.Consumer';

    function enhanceForwardRef(props: any, ref: React.Ref<any>) {
      return (
        <EnhanceContext
          {...props}
          forwardedRef={ref}
        />
      );
    }

    enhanceForwardRef.displayName = `enhanceContext-${consumerName}(${name})`;

    const FC = React.forwardRef(enhanceForwardRef);
    FC.defaultProps = Component.defaultProps;
    FC.propTypes = Component.propTypes;
    return FC;
  };
}

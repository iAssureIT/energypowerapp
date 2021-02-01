import React from 'react';

export const withToaster = WrappedComponent => {
  return props => {
    return (
      <>
        <WrappedComponent {...props} />
      </>
    );
  };
};
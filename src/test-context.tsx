import React from 'react'

export const testContext = React.createContext('test');

export const TestContext: React.FC<React.PropsWithChildren<{ val?: string }>> = ({ children, val }) => {

  return (
    <testContext.Provider value={val || 'test1'}>
      {children}
    </testContext.Provider>
  );

}
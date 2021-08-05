import React from 'react';
function Tabs ({ children, ...rest }) {
  return (
    <div {...rest}>
      {children}
    </div>
  )
}

export default Tabs;

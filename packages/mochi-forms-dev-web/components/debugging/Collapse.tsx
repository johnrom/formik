import { FunctionComponent, useState } from 'react';

export const Collapse: FunctionComponent = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setCollapsed(!collapsed)}>
        Collapse
      </button>
      <div
        style={{
          overflow: 'hidden',
          height: collapsed ? 0 : 'auto',
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

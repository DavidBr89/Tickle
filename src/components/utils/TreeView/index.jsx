import React from 'react';
import cxx from './TreeView.scss';

// const treeData = {
//   tag: 'Top Level',
//   children: [
//     {
//       tag: 'Level 2: A',
//       children: [
//         {tag: 'Son of A', children: []},
//         {tag: 'Daughter of A', children: []},
//       ],
//     },
//     {tag: 'Daughter of A', children: []},
//     {tag: 'Son of A', children: []},
//     {tag: 'Daughter of A', children: []},
//     {
//       tag: 'Level 2: B',
//       children: [],
//       children: [
//         {tag: 'Son of A', children: []},
//         {tag: 'Daughter of A', children: []},
//       ],
//     },
//   ],
// };
//
const liBeforeStyle = {
  display: 'block',
  width: 10 /* same with indentation */,
  height: 0,
  borderTop: '1px solid',
  marginTop: '-1px' /* border top width */,
  position: 'absolute',
  top: '1em' /* (line-height/2) */,
  left: 0,
};

const liStyle = {
  margin: 0,
  padding: '0 2.5em',
  lineHeight: '2em' /* default list item's `line-height` */,
  fontWeight: 'bold',
  //height: 80px;
  //width: 80px;
  position: 'relative',
};

const lastStyle = {
  background: 'whitesmoke',
  height: 'auto',
  top: '1em',
  bottom: 0,
};

function Branch({id, children, last, node = ({id}) => <div>{id}</div>}) {
  return (
    <li style={liStyle}>
      {last && <div className="last" style={lastStyle} />}
      <div style={liBeforeStyle} />
      {node({id})}
      <ul className={cxx.tree}>
        {children.map((c, i) => (
          <Branch
            {...c}
            key={c.id}
            node={node}
            last={children.length - 1 === i}
          />
        ))}
      </ul>
    </li>
  );
}

export default function TreeViewWrapper(props) {
  return (
    <ul className={cxx.tree}>
      <Branch {...props} />
    </ul>
  );
}

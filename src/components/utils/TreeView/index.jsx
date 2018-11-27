import React from 'react';
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
const liBeforeStyle = (indent, linkOffset) => ({
  display: 'block',
  width: `${indent}em` /* same with indentation */,
  height: 0,
  borderTop: '2px solid',
  marginTop: '-1px' /* border top width */,
  position: 'absolute',
  top: `${linkOffset / 2}em` /* (line-height/2) */,
  left: 0,
});

const liStyle = linkOffset => ({
  margin: 0,
  // padding: '0 2.5em',
  // lineHeight: `${linkOffset}em` /* default list item's `line-height` */,
  fontWeight: 'bold',
  // height: 80px;
  // width: 80px;
  position: 'relative',
});

const lastStyle = linkOffset => ({
  position: 'absolute',
  background: 'whitesmoke',
  height: `${linkOffset / 2}em`,
  borderLeft: '2px solid black',
});

const treeBefore = {
  content: '',
  display: 'block',
  width: 0,
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
};

const ulStyle = indent => ({
  padding: 0,
  listStyle: 'none',
  position: 'relative',
  marginLeft: `${indent}em`,
});

function Branch({...props}) {
  const {id, children, last, nodeCont, indent, linkOffset, data} = props;
  return (
    <li
      style={{
        ...liStyle(linkOffset),
        borderLeft: !last && '2px solid black',
      }}>
      {last && <div style={lastStyle(linkOffset)} />}
      <div style={{marginLeft: `${indent}em`}}>
        <div style={liBeforeStyle(indent, linkOffset)} />

        {nodeCont({...data, ...props})}
        <ul style={ulStyle(indent)}>
          {children.map((c, i) => (
            <Branch
              {...c}
              indent={indent}
              key={c.id}
              nodeCont={nodeCont}
              linkOffset={linkOffset}
              last={children.length - 1 === i}
            />
          ))}
        </ul>
      </div>
    </li>
  );
}

Branch.defaultProps = {
  id: null,
  children: [],
  last: false,
  nodeCont: ({id}) => <div>{id}</div>,
  indent: 5,
  linkOffset: 2,
};

export default function TreeViewWrapper({className, style, root, ...props}) {
  const {id, children, last, nodeCont, indent, linkOffset, data} = props;
  return (
    <div className={className} style={{transition: 'all 1s'}}>

        {nodeCont({...data, ...props})}
      <ul style={{...ulStyle(indent)}}>
        <Branch {...props} {...root} last />
      </ul>
    </div>
  );
}

TreeViewWrapper.defaultProps = {
  className: '',
  style: {},
  ...Branch.defaultProps,
};

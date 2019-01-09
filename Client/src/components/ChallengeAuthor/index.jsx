import React from 'react';
import PropTypes from 'prop-types';

import {ModalBody} from 'Utils/Modal';
import TextChallengeAuthor from './TextChallengeAuthor';
//
// class ChallengeAuthor extends React.Component {
//   static propTypes = {
//     style: PropTypes.object,
//     className: PropTypes.string,
//     uiColor: PropTypes.string,
//     onChange: PropTypes.func,
//     reset: PropTypes.bool,
//     defaultChallenge: PropTypes.oneOf([PropTypes.object, null]),
//   };
//
//   static defaultProps = {
//     style: {},
//     className: '',
//     uiColor: 'black',
//     onChange: d => d,
//     reset: false,
//     defaultChallenge: null,
//     challengeTypes: ['Photo Upload', 'Learning Object', 'Mini Game'],
//   };
//
//   // static getDerivedStateFromProps(nextProps) {
//   //   return {
//   //     challengeMap: {
//   //       PhotoUpload: <PhotoChallengeAuthor {...nextProps} />,
//   //       LearningObject: <TestComp {...nextProps} />,
//   //       MiniGame: <PhotoChallengeAuthor {...nextProps} />
//   //     }
//   //   };
//   // }
//
//   // constructor(props) {
//   //   super(props);
//   //
//   state = {
//     selectedKey: 'PhotoUpload',
//   };
//   // }
//
//   // TODO: remove
//   challengeMap = {
//     PhotoUpload: <PhotoChallengeAuthor {...this.props} />,
//     MiniGame: <PhotoChallengeAuthor {...this.props} />,
//   };
//
//   // shouldComponentUpdate(nextProps, nextState) {
//   //   return (
//   //     this.state.selectedKey !== nextState.selectedKey || nextProps.uiColor
//   //   );
//   // }
//
//   // componentWillReceiveProps(nextProps) {
//   //   this.setState({ challengeTypes });
//   // }
//
//   render() {
//     const {className, style} = this.props;
//     const {selectedKey} = this.state;
//     const challengeKeys = Object.keys(this.challengeMap);
//
//     return (
//       <div
//         className={className}
//         style={{
//           width: '100%',
//           height: '100%',
//           minHeight: 300,
//           ...style,
//         }}>
//         <div style={{display: 'flex', flexWrap: 'wrap'}}>
//           <div
//             className="p-2"
//             style={{
//               // width: selected === t.name ? '100%' : '20vh',
//               width: '100%',
//               // height: '100%',
//               maxHeight: 600,
//               // minHeight: 400
//             }}>
//             {challengeKeys.map(key => (
//               <div
//                 className="w-100 p-2"
//                 style={{display: selectedKey !== key && 'none'}}>
//                 {this.challengeMap.PhotoUpload}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

const FooterBtn = ({onClick, children, disabled, className, style = {}}) => (
  <button
    className={`${'btn '}${className}`}
    style={{...style, lineHeight: 0}}
    onClick={onClick}
    disabled={disabled}>
    {children}
  </button>
);

class ChallengeAuthor extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onChange: PropTypes.func,
    uiColor: PropTypes.string,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    children: <div />,
    className: '',
    onChange: d => d,
    onClose: d => d,
    uiColor: 'black',
  };

  constructor(props) {
    super(props);

    const {
      activity: {value: activityVal},
    } = props;

    this.state = {
      activity: {id: null, img: {url: null}, ...activityVal},
      added: activityVal !== null,
    };
  }

  render() {
    const {onClose, onChange} = this.props;
    const {activity, added} = this.state;
    const {title} = activity;
    // const btnClass = `btn ${activity === null && 'disabled'}`;

    const btnDisabled = activity.description === null;
    // TODO
    // activity.img.url === null;

    return (
      <ModalBody
        onClose={onClose}
        title={title}
        footer={
          <button
            className="btn"
            disabled={btnDisabled}
            style={{lineHeight: 0}}
            onClick={() => {
              if (added) onChange(null);
              else {
                onChange(activity);
              }
            }}>
            <div className="m-3">
              <strong>{added ? 'Remove' : 'Add'}</strong>
            </div>
          </button>
        }>
        <TextChallengeAuthor
          {...activity}
          onChange={ch => {
            this.setState({
              activity: {...ch},
              added: false,
            });
          }}
        />
      </ModalBody>
    );
  }
}

export default ChallengeAuthor;

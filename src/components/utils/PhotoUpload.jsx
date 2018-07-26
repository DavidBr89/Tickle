import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { DimWrapper } from 'Utils';

// import { createShadowStyle, UIthemeContext } from 'Cards/style';

function convertToImgSrc(fileList) {
  let file = null;

  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].type.match(/^image\//)) {
      file = fileList[i];
      break;
    }
  }

  if (file !== null) {
    return URL.createObjectURL(file);
  }
  return null;
}

// class ControlledPhotoUpload extends Component {
//   static propTypes = {
//     className: PropTypes.string,
//     style: PropTypes.object,
//     onChange: PropTypes.func,
//     placeholder: PropTypes.string,
//     defaultImg: PropTypes.any
//   };
//
//   static defaultProps = {
//     className: '',
//     style: {},
//     onChange: d => d,
//     uiColor: 'grey',
//     placeholder: 'Add your description',
//     defaultImg: null,
//     width: 250,
//     height: 250
//   };
//
//   state = {
//     imgUrl: this.props.defaultImgUrl,
//     imgFiles: null
//   };
//
//   shouldComponentUpdate(nextProps, nextState) {
//     return (
//       this.state.imgUrl !== nextState.imgUrl ||
//       this.props.defaultImgUrl !== nextProps.defaultImgUrl
//     );
//   }
//
//   componentDidUpdate(prevProps, prevState) {
//     const { imgUrl, imgFile } = this.state;
//     const { onChange } = this.props;
//     // console.log('imgFiles', imgFile);
//     if (prevState.imgUrl !== imgUrl) {
//       onChange({ url: imgUrl, file: imgFile });
//     }
//   }
//
//   // TODO: remove
//   contHeight = 300;
//
//   render() {
//     const {
//       className,
//       placeholder,
//       style,
//       onChange,
//       uiColor,
//       defaultImg,
//       width,
//       height
//     } = this.props;
//
//     const { imgUrl } = this.state;
//     return (
//       <div
//         className={className}
//         style={{ width: '100%', height: '100%', ...style }}
//       >
//         <div
//           style={{
//             overflow: 'hidden',
//             height: '100%'
//           }}
//         >
//           <div
//             style={{
//               // TODO: outsource
//               height,
//               width,
//               // minHeight: 80,
//               // maxHeight: 300,
//               border: `dashed 3px ${uiColor}`,
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center'
//             }}
//           >
//             {imgUrl ? (
//               <div
//                 style={{
//                   overflow: 'hidden',
//                   width: '100%'
//                   // height: this.contHeight
//                 }}
//               >
//                 <img src={imgUrl} width="100%" alt="test" />
//               </div>
//             ) : (
//               <h1
//                 className="pl-2 pr-2"
//                 style={{ background: uiColor, color: 'black', margin: '20%' }}
//               >
//                 {'No Image'}
//               </h1>
//             )}
//           </div>
//           <input
//             className="mt-3"
//             style={{ border: `${uiColor} 1px solid` }}
//             type="file"
//             accept="image#<{(|"
//             capture="environment"
//             onChange={e => {
//               this.setState({
//                 imgUrl: convertToImgSrc(e.target.files),
//                 imgFile: e.target.files[0]
//               });
//             }}
//           />
//         </div>
//       </div>
//     );
//   }
// }
//
export default class PhotoUpload extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    defaultImg: PropTypes.any
  };

  static defaultProps = {
    className: '',
    style: {},
    onChange: d => d,
    uiColor: 'grey',
    placeholder: 'Add your description',
    defaultImg: null,
    width: 250,
    height: 250
  };

  // state = {
  //   imgUrl: this.props.defaultImgUrl,
  //   imgFiles: null
  // };

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     this.state.imgUrl !== nextState.imgUrl ||
  //     this.props.iefaultImgUrl !== nextProps.defaultImgUrl
  //   );
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   const { imgUrl, imgFile } = this.state;
  //   const { onChange } = this.props;
  //   // console.log('imgFiles', imgFile);
  //   if (prevState.imgUrl !== imgUrl) {
  //     onChange({ url: imgUrl, file: imgFile });
  //   }
  // }

  // TODO: remove
  contHeight = 300;

  render() {
    const {
      className,
      placeholder,
      style,
      onChange,
      uiColor,
      defaultImg,
      // width,
      // height,
      imgUrl
    } = this.props;

    return (
      <div className={className} style={{ height: '100%' }}>
        <div
          style={{
            // overflow: 'hidden',
            height: '100%'
          }}
        >
          <div style={{ ...style }}>
            <div
              style={{
                // TODO: outsource
                height: '100%',
                width: '100%',
                // overflow: 'hidden',
                // minHeight: 80,
                border: `dashed 3px ${uiColor}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {imgUrl ? (
                <div
                  style={{
                    // overflow: 'hidden',
                    width: '100%',
                    maxHeight: 300
                    // height: this.contHeight
                  }}
                >
                  <img src={imgUrl} width="100%" alt="test" />
                </div>
              ) : (
                <h1
                  className="pl-2 pr-2 text-muted"
                  style={{
                    margin: '20%'
                  }}
                >
                  {'No Image'}
                </h1>
              )}
            </div>
            <input
              className="mt-3"
              style={{ border: `${uiColor} 1px solid` }}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={e => {
                onChange({
                  url: convertToImgSrc(e.target.files),
                  file: e.target.files[0]
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

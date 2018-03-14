var _jsxFileName = '/Users/patf/tinkering/react-panelgroup/src/Panel.js';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import ReactDOM from 'react-dom';

var Panel = function (_React$Component) {
  _inherits(Panel, _React$Component);

  function Panel() {
    var _temp, _this, _ret;

    _classCallCheck(this, Panel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.onResizeObjectLoad = function () {
      _this.refs.resizeObject.contentDocument.defaultView.addEventListener("resize", function () {
        return _this.calculateStretchWidth();
      });
    }, _this.onNextFrame = function (callback) {
      setTimeout(function () {
        window.requestAnimationFrame(callback);
      }, 0);
    }, _this.calculateStretchWidth = function () {
      if (_this.props.onWindowResize !== null) {
        var rect = ReactDOM.findDOMNode(_this).getBoundingClientRect();

        _this.props.onWindowResize(_this.props.panelID, { x: rect.width, y: rect.height }

        // recalcalculate again if the width is below minimum
        // Kinda hacky, but for large resizes like fullscreen/Restore
        // it can't solve it in one pass.
        // function() {this.onNextFrame(this.calculateStretchWidth)}.bind(this)
        );
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // Find the resizeObject if it has one
  Panel.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    if (this.props.resize === "stretch") {
      this.refs.resizeObject.addEventListener("load", function () {
        return _this2.onResizeObjectLoad();
      });
      this.refs.resizeObject.data = "about:blank";
      this.calculateStretchWidth();
    }
  };

  // Attach resize event listener to resizeObject


  // Utility function to wait for next render before executing a function


  // Recalculate the stretchy panel if it's container has been resized


  // Render component
  Panel.prototype.render = function render() {

    var style = {
      resizeObject: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        opacity: 0
      }

      // only attach resize object if panel is stretchy.  Others dont need it
    };var resizeObject = this.props.resize === "stretch" ? React.createElement('object', { style: style.resizeObject, ref: 'resizeObject', type: 'text/html', __source: {
        fileName: _jsxFileName,
        lineNumber: 61
      },
      __self: this
    }) : null;

    return React.createElement(
      'div',
      { className: 'panelWrapper', style: this.props.style, __source: {
          fileName: _jsxFileName,
          lineNumber: 64
        },
        __self: this
      },
      resizeObject,
      this.props.children
    );
  };

  return Panel;
}(React.Component);

export default Panel;
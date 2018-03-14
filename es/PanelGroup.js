var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = '/Users/patf/tinkering/react-panelgroup/src/PanelGroup.js';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import ReactDOM from 'react-dom';

import Panel from './Panel';
import Divider from './Divider';

var PanelGroup = function (_React$Component) {
  _inherits(PanelGroup, _React$Component);

  // Load initial panel configuration from props
  function PanelGroup() {
    _classCallCheck(this, PanelGroup);

    var _this = _possibleConstructorReturn(this, _React$Component.apply(this, arguments));

    _this.loadPanels = function (props) {
      var panels = [];

      if (props.children) {

        // Default values if none were provided
        var defaultSize = 256;
        var defaultMinSize = 48;
        var defaultMaxSize = 0;
        var defaultResize = "stretch";

        var stretchIncluded = false;
        var children = React.Children.toArray(props.children);

        for (var i = 0; i < children.length; i++) {

          if (i < props.panelWidths.length && props.panelWidths[i]) {
            var widthObj = {
              size: props.panelWidths[i].size !== undefined ? props.panelWidths[i].size : defaultSize,
              minSize: props.panelWidths[i].minSize !== undefined ? props.panelWidths[i].minSize : defaultMinSize,
              maxSize: props.panelWidths[i].maxSize !== undefined ? props.panelWidths[i].maxSize : defaultMaxSize,
              resize: props.panelWidths[i].resize ? props.panelWidths[i].resize : props.panelWidths[i].size ? "dynamic" : defaultResize,
              snap: props.panelWidths[i].snap !== undefined ? props.panelWidths[i].snap : []
            };
            panels.push(widthObj);
          } else {
            // default values if no props are given
            panels.push({ size: defaultSize, resize: defaultResize, minSize: defaultMinSize, maxSize: defaultMaxSize, snap: [] });
          }

          // if none of the panels included was stretchy, make the last one stretchy
          if (panels[i].resize === "stretch") stretchIncluded = true;
          if (!stretchIncluded && i === children.length - 1) panels[i].resize = "stretch";
        }
      }

      return {
        panels: panels
      };
    };

    _this.onUpdate = function (panels, isComplete) {
      if (_this.props.onUpdate) {
        _this.props.onUpdate(panels.slice(), !!isComplete);
      }
    };

    _this.getSizeDirection = function (caps) {
      if (caps) return _this.props.direction === "column" ? "Height" : "Width";else return _this.props.direction === "column" ? "height" : "width";
    };

    _this.handleResize = function (i, delta) {
      var tempPanels = _this.state.panels.slice();
      var returnDelta = _this.resizePanel(i, _this.props.direction === "row" ? delta.x : delta.y, tempPanels);
      _this.setState({ panels: tempPanels });
      _this.onUpdate(tempPanels);
      return returnDelta;
    };

    _this.onResizeComplete = function (i) {
      var tempPanels = _this.state.panels.slice();

      tempPanels[i].updated = true;
      _this.onUpdate(tempPanels, true);
    };

    _this.resizePanel = function (panelIndex, delta, panels) {

      // 1) first let's calculate and make sure all the sizes add up to be correct.
      var masterSize = 0;
      for (var iti = 0; iti < panels.length; iti += 1) {
        masterSize += panels[iti].size;
      }
      var boundingRect = ReactDOM.findDOMNode(_this).getBoundingClientRect();
      var boundingSize = (_this.props.direction == "column" ? boundingRect.height : boundingRect.width) - _this.props.spacing * (_this.props.children.length - 1);
      if (masterSize != boundingSize) {
        console.log(panels[0], panels[1]);
        console.log("ERROR! SIZES DON'T MATCH!: ", masterSize, boundingSize);
        // 2) Rectify the situation by adding all the unacounted for space to the first panel
        panels[panelIndex].size += boundingSize - masterSize;
      }

      var minsize;
      var maxsize;

      // track the progressive delta so we can report back how much this panel
      // actually moved after all the adjustments have been made
      var resultDelta = delta;

      // make the changes and deal with the consequences later
      panels[panelIndex].size += delta;
      panels[panelIndex + 1].size -= delta;

      // Min and max for LEFT panel
      minsize = _this.getPanelMinSize(panelIndex, panels);
      maxsize = _this.getPanelMaxSize(panelIndex, panels);

      // if we made the left panel too small
      if (panels[panelIndex].size < minsize) {
        var _delta = minsize - panels[panelIndex].size;

        if (panelIndex === 0) resultDelta = _this.resizePanel(panelIndex, _delta, panels);else resultDelta = _this.resizePanel(panelIndex - 1, -_delta, panels);
      };

      // if we made the left panel too big
      if (maxsize !== 0 && panels[panelIndex].size > maxsize) {
        var _delta2 = panels[panelIndex].size - maxsize;

        if (panelIndex === 0) resultDelta = _this.resizePanel(panelIndex, -_delta2, panels);else resultDelta = _this.resizePanel(panelIndex - 1, _delta2, panels);
      };

      // Min and max for RIGHT panel
      minsize = _this.getPanelMinSize(panelIndex + 1, panels);
      maxsize = _this.getPanelMaxSize(panelIndex + 1, panels);

      // if we made the right panel too small
      if (panels[panelIndex + 1].size < minsize) {
        var _delta3 = minsize - panels[panelIndex + 1].size;

        if (panelIndex + 1 === panels.length - 1) resultDelta = _this.resizePanel(panelIndex, -_delta3, panels);else resultDelta = _this.resizePanel(panelIndex + 1, _delta3, panels);
      };

      // if we made the right panel too big
      if (maxsize !== 0 && panels[panelIndex + 1].size > maxsize) {
        var _delta4 = panels[panelIndex + 1].size - maxsize;

        if (panelIndex + 1 === panels.length - 1) resultDelta = _this.resizePanel(panelIndex, _delta4, panels);else resultDelta = _this.resizePanel(panelIndex + 1, -_delta4, panels);
      };

      // Iterate through left panel's snap positions
      for (var i = 0; i < panels[panelIndex].snap.length; i++) {
        if (Math.abs(panels[panelIndex].snap[i] - panels[panelIndex].size) < 20) {

          var _delta5 = panels[panelIndex].snap[i] - panels[panelIndex].size;

          if (_delta5 !== 0 && panels[panelIndex].size + _delta5 >= _this.getPanelMinSize(panelIndex, panels) && panels[panelIndex + 1].size - _delta5 >= _this.getPanelMinSize(panelIndex + 1, panels)) resultDelta = _this.resizePanel(panelIndex, _delta5, panels);
        }
      }

      // Iterate through right panel's snap positions
      for (var _i = 0; _i < panels[panelIndex + 1].snap.length; _i++) {
        if (Math.abs(panels[panelIndex + 1].snap[_i] - panels[panelIndex + 1].size) < 20) {

          var _delta6 = panels[panelIndex + 1].snap[_i] - panels[panelIndex + 1].size;

          if (_delta6 !== 0 && panels[panelIndex].size + _delta6 >= _this.getPanelMinSize(panelIndex, panels) && panels[panelIndex + 1].size - _delta6 >= _this.getPanelMinSize(panelIndex + 1, panels)) resultDelta = _this.resizePanel(panelIndex, -_delta6, panels);
        }
      }

      // return how much this panel actually resized
      return resultDelta;
    };

    _this.getPanelMinSize = function (panelIndex, panels) {
      if (panels[panelIndex].resize === "fixed") {
        if (!panels[panelIndex].fixedSize) {
          panels[panelIndex].fixedSize = panels[panelIndex].size;
        }
        return panels[panelIndex].fixedSize;
      }
      return panels[panelIndex].minSize;
    };

    _this.getPanelMaxSize = function (panelIndex, panels) {
      if (panels[panelIndex].resize === "fixed") {
        if (!panels[panelIndex].fixedSize) {
          panels[panelIndex].fixedSize = panels[panelIndex].size;
        }
        return panels[panelIndex].fixedSize;
      }
      return panels[panelIndex].maxSize;
    };

    _this.getPanelGroupMinSize = function (spacing) {
      var size = 0;
      for (var i = 0; i < _this.state.panels.length; i++) {
        size += _this.getPanelMinSize(i, _this.state.panels);
      }
      return size + (_this.state.panels.length - 1) * spacing;
    };

    _this.getPanelGroupMaxSize = function (spacing) {
      var size = 0;
      for (var i = 0; i < _this.state.panels.length; i++) {
        size += _this.getPanelMaxSize(i, _this.state.panels);
      }
      return size + (_this.state.panels.length - 1) * spacing;
    };

    _this.setPanelSize = function (panelIndex, size, callback) {
      size = _this.props.direction === "column" ? size.y : size.x;
      if (size !== _this.state.panels[panelIndex].size) {
        var tempPanels = _this.state.panels;
        //make sure we can actually resize this panel this small
        if (size < tempPanels[panelIndex].minSize) {
          var diff = tempPanels[panelIndex].minSize - size;
          tempPanels[panelIndex].size = tempPanels[panelIndex].minSize;

          // 1) Find all of the dynamic panels that we can resize and
          // decrease them until the difference is gone
          for (var i = 0; i < tempPanels.length; i = i + 1) {
            if (i != panelIndex && tempPanels[i].resize === "dynamic") {
              var available = tempPanels[i].size - tempPanels[i].minSize;
              var cut = Math.min(diff, available);
              tempPanels[i].size = tempPanels[i].size - cut;
              // if the difference is gone then we are done!
              diff = diff - cut;
              if (diff == 0) {
                break;
              }
            }
          }
        } else {
          tempPanels[panelIndex].size = size;
        }
        _this.setState({ panels: tempPanels });

        if (panelIndex > 0) {
          _this.handleResize(panelIndex - 1, { x: 0, y: 0 });
        } else if (_this.state.panels.length > 2) {
          _this.handleResize(panelIndex + 1, { x: 0, y: 0 });
        }

        if (callback) {
          callback();
        }
      }
    };

    _this.state = _this.loadPanels(_this.props);
    return _this;
  }

  // reload panel configuration if props update


  PanelGroup.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {

    var nextPanels = nextProps.panelWidths;

    // Only update from props if we're supplying the props in the first place
    if (nextPanels.length) {

      // if the panel array is a different size we know to update
      if (this.state.panels.length !== nextPanels.length) {
        this.setState(this.loadPanels(nextProps));
      }
      // otherwise we need to iterate to spot any difference
      else {
          for (var i = 0; i < nextPanels.length; i++) {
            if (this.state.panels[i].size !== nextPanels[i].size || this.state.panels[i].minSize !== nextPanels[i].minSize || this.state.panels[i].maxSize !== nextPanels[i].maxSize || this.state.panels[i].resize !== nextPanels[i].resize) {
              this.setState(this.loadPanels(nextProps));
              break;
            }
          }
        }
    }
  };

  // load provided props into state


  // Pass internal state out if there's a callback for it
  // Useful for saving panel configuration


  // For styling, track which direction to apply sizing to


  // Render component
  PanelGroup.prototype.render = function render() {
    var _container;

    var style = {
      container: (_container = {
        width: "100%",
        height: "100%"
      }, _container["min" + this.getSizeDirection(true)] = this.getPanelGroupMinSize(this.props.spacing), _container.display = "flex", _container.flexDirection = this.props.direction, _container.flexGrow = 1, _container),
      panel: {
        flexGrow: 0,
        display: "flex"
      }

      // lets build up a new children array with added resize borders
    };var initialChildren = React.Children.toArray(this.props.children);
    var newChildren = [];
    var stretchIncluded = false;

    for (var i = 0; i < initialChildren.length; i++) {
      var _panelStyle;

      // setting up the style for this panel.  Should probably be handled
      // in the child component, but this was easier for now
      var panelStyle = (_panelStyle = {}, _panelStyle[this.getSizeDirection()] = this.state.panels[i].size, _panelStyle[this.props.direction === "row" ? "height" : "width"] = "100%", _panelStyle["min" + this.getSizeDirection(true)] = this.state.panels[i].resize === "stretch" ? 0 : this.state.panels[i].size, _panelStyle.flexGrow = this.state.panels[i].resize === "stretch" ? 1 : 0, _panelStyle.flexShrink = this.state.panels[i].resize === "stretch" ? 1 : 0, _panelStyle.display = "flex", _panelStyle.overflow = "hidden", _panelStyle.position = "relative", _panelStyle);

      // patch in the background color if it was supplied as a prop
      Object.assign(panelStyle, { backgroundColor: this.props.panelColor });

      // give position info to children
      var metadata = {
        isFirst: i === 0 ? true : false,
        isLast: i === initialChildren.length - 1 ? true : false,
        resize: this.state.panels[i].resize,

        // window resize handler if this panel is stretchy
        onWindowResize: this.state.panels[i].resize === "stretch" ? this.setPanelSize : null

        // if none of the panels included was stretchy, make the last one stretchy
      };if (this.state.panels[i].resize === "stretch") stretchIncluded = true;
      if (!stretchIncluded && metadata.isLast) metadata.resize = "stretch";

      // push children with added metadata
      newChildren.push(React.createElement(
        Panel,
        _extends({ style: panelStyle, key: "panel" + i, panelID: i }, metadata, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 166
          },
          __self: this
        }),
        initialChildren[i]
      ));

      // add a handle between panels
      if (i < initialChildren.length - 1) {
        newChildren.push(React.createElement(Divider, { borderColor: this.props.borderColor, key: "divider" + i, panelID: i, handleResize: this.handleResize, onResizeComplete: this.onResizeComplete, dividerWidth: this.props.spacing, direction: this.props.direction, showHandles: this.props.showHandles, __source: {
            fileName: _jsxFileName,
            lineNumber: 171
          },
          __self: this
        }));
      }
    }

    return React.createElement(
      'div',
      { className: 'panelGroup', style: style.container, __source: {
          fileName: _jsxFileName,
          lineNumber: 175
        },
        __self: this
      },
      newChildren
    );
  };

  // Entry point for resizing panels.
  // We clone the panel array and perform operations on it so we can
  // setState after the recursive operations are finished


  // Recursive panel resizing so we can push other panels out of the way
  // if we've exceeded the target panel's extents


  // Utility function for getting min pixel size of panel


  // Utility function for getting max pixel size of panel


  // Utility function for getting min pixel size of the entire panel group


  // Utility function for getting max pixel size of the entire panel group


  // Hard-set a panel's size
  // Used to recalculate a stretchy panel when the window is resized


  return PanelGroup;
}(React.Component);

PanelGroup.defaultProps = {
  spacing: 1,
  direction: "row",
  panelWidths: []
};

export default PanelGroup;
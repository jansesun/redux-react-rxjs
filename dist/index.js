'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineReducers = exports.RxStateProvider = exports.connect = exports.createActions = exports.createState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createState = exports.createState = function createState(reducer$) {
  var initialState$ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Rx2.default.Observable.of({});

  return initialState$.merge(reducer$).scan(function (state, stream) {
    if (Array.isArray(stream)) {
      var _stream = _slicedToArray(stream, 2),
          scope = _stream[0],
          _reducer = _stream[1];

      return _extends({}, state, _defineProperty({}, scope, _reducer(state[scope])));
    }
    var reducer = stream;
    return _extends({}, state, reducer(state));
  }).shareReplay();
};
var createActions = exports.createActions = function createActions(actions) {
  var result = {};
  actions.forEach(function (action) {
    result[action] = new _Rx2.default.Subject();
  });
  return result;
};
var connect = exports.connect = function connect() {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (state) {
    return state;
  };

  return function (WrappedComponent) {
    var _class, _temp;

    return _temp = _class = function (_Component) {
      _inherits(Connect, _Component);

      function Connect() {
        _classCallCheck(this, Connect);

        return _possibleConstructorReturn(this, (Connect.__proto__ || Object.getPrototypeOf(Connect)).apply(this, arguments));
      }

      _createClass(Connect, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          this.subscription = this.context.state$.map(selector).subscribe(this.setState.bind(this));
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.subscription.unsubscribe();
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, _extends({}, this.state, this.props));
        }
      }]);

      return Connect;
    }(_react.Component), _class.contextTypes = {
      state$: _propTypes2.default.object.isRequired
    }, _temp;
  };
};

var RxStateProvider = exports.RxStateProvider = function (_Component2) {
  _inherits(RxStateProvider, _Component2);

  function RxStateProvider() {
    _classCallCheck(this, RxStateProvider);

    return _possibleConstructorReturn(this, (RxStateProvider.__proto__ || Object.getPrototypeOf(RxStateProvider)).apply(this, arguments));
  }

  _createClass(RxStateProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        state$: this.props.state$
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return RxStateProvider;
}(_react.Component);

RxStateProvider.propTypes = {
  state$: _propTypes2.default.object.isRequired
};
RxStateProvider.childContextTypes = {
  state$: _propTypes2.default.object.isRequired
};
;
var combineReducers = exports.combineReducers = function combineReducers(reducers$) {
  var _Rx$Observable;

  var newReducers$ = Object.keys(reducers$).map(function (key) {
    return reducers$[key].map(function (payload) {
      return [key, payload];
    });
  });
  return (_Rx$Observable = _Rx2.default.Observable).merge.apply(_Rx$Observable, _toConsumableArray(newReducers$));
};

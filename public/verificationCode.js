(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["verificationCode"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'verificationCodeScreen',
  data: function data() {
    return {
      code: null,
      error: false,
      resendingEmail: false,
      isSubmitting: false
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('auth', {
    email: 'getPasswordRecoveryEmail'
  })),
  methods: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])('auth', ['recoverPassword', 'verifyRecoveryCode'])), {}, {
    onResendEmail: function onResendEmail() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.resendingEmail = true;
                _context.next = 3;
                return _this.recoverPassword(_this.email);

              case 3:
                _this.resendingEmail = false;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    onSubmit: function onSubmit() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this2.isSubmitting = true;
                _context2.next = 3;
                return _this2.verifyRecoveryCode(_this2.code).then(function (success) {
                  if (success) {
                    _this2.$router.push({
                      name: 'setNewPassword'
                    });
                  } else {
                    _this2.error = 'Invalid code';
                  }
                })["catch"](function (err) {
                  console.log('something went wrong');
                });

              case 3:
                _this2.isSubmitting = false;

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    }
  })
});

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".verification-code-screen h2[data-v-5df45498] {\n  margin-top: 10vh;\n}\n.verification-code-screen .retry-actions[data-v-5df45498] {\n  display: flex;\n  flex-direction: column;\n}\n.verification-code-screen .retry-actions .text-link[data-v-5df45498] {\n  margin-top: 20px;\n}\n.verification-code-screen form[data-v-5df45498] {\n  text-align: left;\n  margin-top: 10vh;\n}\n.verification-code-screen form button[data-v-5df45498] {\n  margin-top: 20px;\n}\n.verification-code-screen form .error-wrapper[data-v-5df45498] {\n  color: #ff395e;\n  font-weight: 500;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-top: -14px;\n  margin-bottom: -10px;\n}\n.verification-code-screen form .error-wrapper i[data-v-5df45498] {\n  color: #ff395e;\n  margin-right: 8px;\n}\n.verification-code-screen .show-pass[data-v-5df45498] {\n  cursor: pointer;\n}\n.verification-code-screen .show-pass[data-v-5df45498]:hover {\n  color: #1c293b;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=template&id=5df45498&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=template&id=5df45498&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "verification-code-screen" }, [
    _c("h2", [_vm._v("Enter verification code")]),
    _vm._v(" "),
    _c("h3", [
      _vm._v("We sent a 6-digit verification code to "),
      _c("strong", [_vm._v(_vm._s(_vm.email))])
    ]),
    _vm._v(" "),
    _c(
      "form",
      {
        on: {
          submit: function($event) {
            $event.preventDefault()
            return _vm.onSubmit($event)
          }
        }
      },
      [
        _c(
          "div",
          { staticClass: "form-element" },
          [
            _c("label", { attrs: { for: "verification-code" } }, [
              _vm._v("Verification code")
            ]),
            _vm._v(" "),
            _c("BaseInputField", {
              attrs: {
                id: "verification-code",
                type: "number",
                required: "",
                autocomplete: "one-time-code"
              },
              model: {
                value: _vm.code,
                callback: function($$v) {
                  _vm.code = $$v
                },
                expression: "code"
              }
            })
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "form-element retry-actions",
            staticStyle: { "text-align": "center" }
          },
          [
            _vm._m(0),
            _vm._v(" "),
            _c("p", [_vm._v("Try checking your spam folder")]),
            _vm._v(" "),
            !_vm.resendingEmail
              ? _c(
                  "button",
                  {
                    staticClass: "text-link",
                    on: { click: _vm.onResendEmail }
                  },
                  [_c("span", [_vm._v("Re-send verification code")])]
                )
              : _c("BaseLoader", { attrs: { msg: "re-sending e-mail" } }),
            _vm._v(" "),
            _c(
              "router-link",
              {
                staticClass: "text-link",
                attrs: { to: { name: "recoverPassword" } }
              },
              [_vm._v("Enter a different e-mail")]
            )
          ],
          1
        ),
        _vm._v(" "),
        _vm.error
          ? _c("div", { staticClass: "error-wrapper" }, [
              _c("i", { staticClass: "far fa-exclamation-triangle" }),
              _vm._v(" "),
              _c("span", [_vm._v(_vm._s(_vm.error))])
            ])
          : _vm._e(),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "form-element" },
          [
            !_vm.isSubmitting
              ? _c(
                  "button",
                  {
                    staticClass: "button dark full-width xl",
                    attrs: { type: "submit" },
                    on: { click: _vm.onSubmit }
                  },
                  [_c("span", [_vm._v("Verify")])]
                )
              : _c("BaseLoader")
          ],
          1
        )
      ]
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", [_c("strong", [_vm._v("Did you not receive an email?")])])
  }
]
render._withStripped = true



/***/ }),

/***/ "./resources/js/pages/LoginPage/VerificationCodeScreen.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/pages/LoginPage/VerificationCodeScreen.vue ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _VerificationCodeScreen_vue_vue_type_template_id_5df45498_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VerificationCodeScreen.vue?vue&type=template&id=5df45498&scoped=true& */ "./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=template&id=5df45498&scoped=true&");
/* harmony import */ var _VerificationCodeScreen_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VerificationCodeScreen.vue?vue&type=script&lang=js& */ "./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _VerificationCodeScreen_vue_vue_type_style_index_0_id_5df45498_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss& */ "./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _VerificationCodeScreen_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _VerificationCodeScreen_vue_vue_type_template_id_5df45498_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _VerificationCodeScreen_vue_vue_type_template_id_5df45498_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "5df45498",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/LoginPage/VerificationCodeScreen.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=script&lang=js&":
/*!******************************************************************************************!*\
  !*** ./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerificationCodeScreen_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./VerificationCodeScreen.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerificationCodeScreen_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss&":
/*!***************************************************************************************************************************!*\
  !*** ./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss& ***!
  \***************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VerificationCodeScreen_vue_vue_type_style_index_0_id_5df45498_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=style&index=0&id=5df45498&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VerificationCodeScreen_vue_vue_type_style_index_0_id_5df45498_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VerificationCodeScreen_vue_vue_type_style_index_0_id_5df45498_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VerificationCodeScreen_vue_vue_type_style_index_0_id_5df45498_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VerificationCodeScreen_vue_vue_type_style_index_0_id_5df45498_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_VerificationCodeScreen_vue_vue_type_style_index_0_id_5df45498_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=template&id=5df45498&scoped=true&":
/*!************************************************************************************************************!*\
  !*** ./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=template&id=5df45498&scoped=true& ***!
  \************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VerificationCodeScreen_vue_vue_type_template_id_5df45498_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./VerificationCodeScreen.vue?vue&type=template&id=5df45498&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/VerificationCodeScreen.vue?vue&type=template&id=5df45498&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VerificationCodeScreen_vue_vue_type_template_id_5df45498_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VerificationCodeScreen_vue_vue_type_template_id_5df45498_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
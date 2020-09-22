(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["SetNewPasswordScreen"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
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

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'loginScreen',
  data: function data() {
    return {
      password: '',
      error: false,
      showPassword: false
    };
  },
  computed: {
    nextUrl: function nextUrl() {
      return this.$route.params.nextUrl;
    }
  },
  methods: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('auth', ['login', 'setNewPassword'])), {}, {
    onSubmit: function onSubmit() {
      var _this = this;

      this.isSubmitting = true;
      this.setNewPassword(this.password).then(function (success) {
        if (success) {
          _this.$router.push({
            name: 'login'
          });
        } else {
          _this.error = 'Invalid password: Must be at least 8 characters long';
        } // this.$router.push('/')

      })["catch"](function (err) {
        _this.error = 'Something went wrong. Please refresh the page and try again.\nIf you continue to see this issue, please contact Kollekt support.';
      });
      this.isSubmitting = false;
    }
  })
});

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".set-password-screen .notice-box[data-v-ffa0b336] {\n  border-radius: 4px;\n  padding: 16px;\n  margin-bottom: -32px;\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);\n  background: #2a46ff;\n  color: white;\n}\n.set-password-screen .notice-box strong[data-v-ffa0b336] {\n  color: white;\n  display: block;\n  margin-bottom: 8px;\n}\n.set-password-screen .notice-box a[data-v-ffa0b336] {\n  text-decoration: underline;\n  font-weight: 500;\n  color: white;\n}\n.set-password-screen h2[data-v-ffa0b336] {\n  margin-top: 10vh;\n}\n.set-password-screen form[data-v-ffa0b336] {\n  text-align: left;\n  margin-top: 10vh;\n}\n.set-password-screen form button[data-v-ffa0b336] {\n  margin-top: 20px;\n}\n.set-password-screen form .error-wrapper[data-v-ffa0b336] {\n  color: #ff395e;\n  font-weight: 500;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-top: -14px;\n  margin-bottom: -10px;\n}\n.set-password-screen form .error-wrapper i[data-v-ffa0b336] {\n  color: #ff395e;\n  margin-right: 8px;\n}\n.set-password-screen .show-pass[data-v-ffa0b336] {\n  cursor: pointer;\n}\n.set-password-screen .show-pass[data-v-ffa0b336]:hover {\n  color: #1c293b;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss&");

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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=template&id=ffa0b336&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=template&id=ffa0b336&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "set-password-screen" }, [
    _c("h2", [_vm._v("Choose a new password")]),
    _vm._v(" "),
    _c("h3", [_vm._v("Must be at least 8 characters long")]),
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
            _c("label", { attrs: { for: "password" } }, [_vm._v("Password")]),
            _vm._v(" "),
            _c(
              "BaseInputField",
              {
                attrs: {
                  id: "password",
                  type: _vm.showPassword ? "text" : "password",
                  name: "password",
                  required: "",
                  autocomplete: "new-password"
                },
                model: {
                  value: _vm.password,
                  callback: function($$v) {
                    _vm.password = $$v
                  },
                  expression: "password"
                }
              },
              [
                _c("i", {
                  staticClass: "far show-pass",
                  class: _vm.showPassword ? "fa-eye" : "fa-eye-slash",
                  on: {
                    click: function($event) {
                      _vm.showPassword = !_vm.showPassword
                    }
                  }
                })
              ]
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
        _vm._m(0)
      ]
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-element" }, [
      _c(
        "button",
        { staticClass: "button dark full-width xl", attrs: { type: "submit" } },
        [_c("span", [_vm._v("Set password")])]
      )
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./resources/js/pages/LoginPage/SetNewPasswordScreen.vue":
/*!***************************************************************!*\
  !*** ./resources/js/pages/LoginPage/SetNewPasswordScreen.vue ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SetNewPasswordScreen_vue_vue_type_template_id_ffa0b336_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SetNewPasswordScreen.vue?vue&type=template&id=ffa0b336&scoped=true& */ "./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=template&id=ffa0b336&scoped=true&");
/* harmony import */ var _SetNewPasswordScreen_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SetNewPasswordScreen.vue?vue&type=script&lang=js& */ "./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _SetNewPasswordScreen_vue_vue_type_style_index_0_id_ffa0b336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss& */ "./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SetNewPasswordScreen_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SetNewPasswordScreen_vue_vue_type_template_id_ffa0b336_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SetNewPasswordScreen_vue_vue_type_template_id_ffa0b336_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "ffa0b336",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/LoginPage/SetNewPasswordScreen.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=script&lang=js&":
/*!****************************************************************************************!*\
  !*** ./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SetNewPasswordScreen_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./SetNewPasswordScreen.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SetNewPasswordScreen_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss&":
/*!*************************************************************************************************************************!*\
  !*** ./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss& ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SetNewPasswordScreen_vue_vue_type_style_index_0_id_ffa0b336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=style&index=0&id=ffa0b336&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SetNewPasswordScreen_vue_vue_type_style_index_0_id_ffa0b336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SetNewPasswordScreen_vue_vue_type_style_index_0_id_ffa0b336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SetNewPasswordScreen_vue_vue_type_style_index_0_id_ffa0b336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SetNewPasswordScreen_vue_vue_type_style_index_0_id_ffa0b336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SetNewPasswordScreen_vue_vue_type_style_index_0_id_ffa0b336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=template&id=ffa0b336&scoped=true&":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=template&id=ffa0b336&scoped=true& ***!
  \**********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SetNewPasswordScreen_vue_vue_type_template_id_ffa0b336_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./SetNewPasswordScreen.vue?vue&type=template&id=ffa0b336&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/LoginPage/SetNewPasswordScreen.vue?vue&type=template&id=ffa0b336&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SetNewPasswordScreen_vue_vue_type_template_id_ffa0b336_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SetNewPasswordScreen_vue_vue_type_template_id_ffa0b336_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
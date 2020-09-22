(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["UsersPage"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/AddUserModal.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/AddUserModal.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
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
  name: 'addUserModal',
  data: function data() {
    return {
      usersToAdd: [],
      userDefaultObject: {
        email: '',
        name: '',
        password: '',
        role: 'Member',
        status: null,
        emailErr: null,
        passwordErr: null,
        existsOnWorkspace: false,
        existsInForm: false
      },
      submitDisabled: false,
      ignoredUsers: [],
      usersExistingOnWorkspace: [],
      usersExistingInForm: [],
      usersExistingOnAnotherWorkspace: []
    };
  },
  props: ['users', 'show'],
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('workspaces', ['currentWorkspace'])),
  methods: _objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])('users', ['addUsersToWorkspace', 'searchForUser'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapMutations"])('alerts', ['SHOW_SNACKBAR'])), {}, {
    onAddUser: function onAddUser() {
      this.usersToAdd.push(JSON.parse(JSON.stringify(this.userDefaultObject))); // this.$nextTick(() => { this.$nextTick(() => {
      //     this.validateUsers()
      // })})
    },
    onRemoveUser: function onRemoveUser(index) {
      this.usersToAdd.splice(index, 1); // this.$nextTick(() => { this.$nextTick(() => {
      //     this.validateUsers()
      // })})
    },
    onPaste: function onPaste(e, index) {
      var _this = this;

      // e.preventDefault()
      // Get the clipData
      var clipData = e.clipboardData.getData('text/plain');
      clipData.trim('\r\n');
      var rows = clipData.split('\r\n');
      rows.forEach(function (row) {
        var cells = row.split('\t'); // Prevent fancy paste for simple pasting

        if (cells.length <= 1) return; // Else prevent default pasting
        else e.preventDefault(); // If the cell 0 has an @ character, add a user object

        if (cells[0].indexOf('@') >= 0) {
          var newUser = JSON.parse(JSON.stringify(_this.userDefaultObject));
          newUser.email = cells[0];
          newUser.name = cells[1];
          newUser.password = cells[2]; // If no email has been provided for the first user, replace the first user

          if (_this.usersToAdd[index].email && _this.usersToAdd[index].email.indexOf('@') >= 0) {
            _this.usersToAdd.push(newUser);
          } else {
            _this.$set(_this.usersToAdd, index, newUser);
          }
        }
      });
      this.validateUsers(); // Scroll to the last user

      this.$nextTick(function () {
        _this.$nextTick(function () {
          _this.$refs.userWrapper[_this.usersToAdd.length - 1].scrollIntoView();
        });
      });
    },
    onSubmit: function onSubmit(e) {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
        var userValidation;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                e.preventDefault(); // Check that the form fields are valid

                userValidation = _this2.validateUsers();

                if (userValidation.valid) {
                  _context2.next = 5;
                  break;
                }

                _this2.SHOW_SNACKBAR({
                  msg: "One or more users have an error",
                  type: 'info',
                  iconClass: 'fa-exclamation-circle',
                  callback: function callback() {
                    var errorIndex = userValidation.errorIndexes[0];
                    var errorEl = _this2.$refs.userWrapper[errorIndex];
                    errorEl.scrollIntoView();
                  },
                  callbackLabel: 'Go to error'
                });

                return _context2.abrupt("return");

              case 5:
                _context2.next = 7;
                return _this2.addUsersToWorkspace(_this2.usersToAdd.filter(function (x) {
                  return x.status != 'ignore';
                })).then( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(response) {
                    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (response) {
                              _this2.usersExistingOnAnotherWorkspace = response.data.existed_users;
                            }

                            _this2.usersExistingOnWorkspace = _this2.usersToAdd.filter(function (x) {
                              return x.existsOnWorkspace;
                            });
                            _this2.usersExistingInForm = _this2.usersToAdd.filter(function (x) {
                              return x.existsInForm;
                            });

                            if (!(_this2.usersExistingOnWorkspace.length + _this2.usersExistingInForm.length > 0)) {
                              _context.next = 6;
                              break;
                            }

                            _context.next = 6;
                            return _this2.$refs.ignoredUsersUsersDialog.show();

                          case 6:
                            _this2.reset();

                            _this2.$emit('close');

                          case 8:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x) {
                    return _ref.apply(this, arguments);
                  };
                }())["catch"](function (err) {
                  console.log('error when adding users to worksapce', err);
                });

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    validateEmail: function validateEmail(user, index) {
      var email = user.email; // Check if the email is valid

      var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var isValidEmail = regex.test(email);

      if (!isValidEmail) {
        user.emailErr = 'Email must be of form <i>example@email.com</i>, and must not be blank';
        user.status = 'error';
        return false;
      } // Check if there is a user earlier in this form with the same email


      var usersBefore = this.usersToAdd.slice(0, index);
      var emailExistsInForm = !!usersBefore.find(function (x) {
        return x.email == email;
      });

      if (emailExistsInForm) {
        user.emailErr = 'Duplicate: A user with this email already exists in this form';
        user.status = 'ignore';
        user.existsInForm = true;
        return true;
      } // Check if the user already exists on the dashboard


      var emailExists = !!this.users.find(function (x) {
        return x.email == email;
      });

      if (emailExists) {
        user.emailErr = 'A user with this email already exists on the workspace';
        user.existsOnWorkspace = true;
        user.status = 'ignore';
        return true;
      }

      user.emailErr = null;
      if (user.email && !user.emailErr && user.password && !user.passwordErr) user.status = 'success';
      return true;
    },
    validatePassword: function validatePassword(user, index) {
      if (user.status == 'ignore') return true;
      var password = user.password;

      if (password.length < 8) {
        user.passwordErr = 'Password must be at least <strong>8 characters</strong> long';
        user.status = 'error';
        return false;
      }

      if (user.email && !user.emailErr && user.password && !user.passwordErr) user.status = 'success';
      user.passwordErr = null;
      return true;
    },
    validateUsers: function validateUsers() {
      var _this3 = this;

      var valid = true;
      var errorIndexes = [];
      this.usersToAdd.forEach(function (user, index) {
        var emailValid = _this3.validateEmail(user, index);

        var passwordValid = _this3.validatePassword(user, index);

        if (!emailValid || !passwordValid) {
          valid = false;
          errorIndexes.push(index);
        }
      }); // this.submitDisabled = !valid

      return {
        valid: valid,
        errorIndexes: errorIndexes
      };
    },
    reset: function reset() {
      // this.submitDisabled = true
      this.usersToAdd = [JSON.parse(JSON.stringify(this.userDefaultObject))];
      this.ignoredUsers = [];
    }
  }),
  created: function created() {
    this.usersToAdd.push(JSON.parse(JSON.stringify(this.userDefaultObject)));
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _UsersTable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UsersTable */ "./resources/js/pages/UsersPage/UsersTable.vue");
/* harmony import */ var _components_AddUserModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/AddUserModal */ "./resources/js/components/AddUserModal.vue");
/* harmony import */ var _components_common_Breadcrumbs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/common/Breadcrumbs */ "./resources/js/components/common/Breadcrumbs.vue");
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




/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'usersPage',
  components: {
    UsersTable: _UsersTable__WEBPACK_IMPORTED_MODULE_1__["default"],
    AddUserModal: _components_AddUserModal__WEBPACK_IMPORTED_MODULE_2__["default"],
    Breadcrumbs: _components_common_Breadcrumbs__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {};
  },
  computed: _objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('auth', ['authUser'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('users', ['addNewUserModalVisible', 'users'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('workspaces', ['authUserWorkspaceRole', 'currentWorkspace'])),
  methods: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapMutations"])('users', ['setAddNewUserModalVisible']))
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _UsersPage_UsersTableRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../UsersPage/UsersTableRow */ "./resources/js/pages/UsersPage/UsersTableRow.vue");
/* harmony import */ var _mixins_sortArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../mixins/sortArray */ "./resources/js/mixins/sortArray.js");


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
  name: 'usersTable',
  props: [// 'users',
  ],
  mixins: [_mixins_sortArray__WEBPACK_IMPORTED_MODULE_3__["default"]],
  components: {
    UsersTableRow: _UsersPage_UsersTableRow__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: function data() {
    return {
      sortKey: 'id',
      sortAsc: true,
      editUser: {
        permission_level: ''
      },
      userToEdit: null,
      originalUser: null,
      usersFilteredBySearch: [],
      newUserPassword: '',
      oldUserPassword: '',
      selectedUsers: [],
      contextUser: null,
      contextMouseEvent: null
    };
  },
  computed: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('persist', ['availableCurrencies'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('workspaces', ['currentWorkspace', 'availableWorkspaceRoles', 'authUserWorkspaceRole'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('auth', ['authUser'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('users', ['getUsers', 'getUsersStatus'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('tables', ['getUsersTable'])), {}, {
    passwordSubmitDisabled: function passwordSubmitDisabled() {
      return this.newUserPassword.length < 8 || this.authUserWorkspaceRole != 'Admin' && this.oldUserPassword.length < 8;
    },
    currentTab: {
      get: function get() {
        var routeName = this.$route.name;
        if (routeName == 'teams') return 'Teams';
        if (routeName == 'users') return 'Users';
      },
      set: function set(newVal) {
        if (newVal == 'Teams') this.$router.push({
          name: 'teams'
        });
        if (newVal == 'Users') this.$router.push({
          name: 'users'
        });
      }
    },
    readyStatus: function readyStatus() {
      return this.getUsersStatus;
    },
    users: function users() {
      var _this = this;

      var users = this.getUsers;
      if (!users) return [];

      if (this.authUserWorkspaceRole != 'Admin') {
        return users.filter(function (x) {
          return x.id == _this.authUser.id;
        });
      }

      return users;
    },
    usersSorted: function usersSorted() {
      var _this2 = this;

      return this.usersFilteredBySearch.sort(function (a, b) {
        return a.id == _this2.authUser.id ? -1 : 0;
      });
    }
  }),
  watch: {
    getUsersStatus: function getUsersStatus(newVal, oldVal) {
      if (newVal == 'success') this.usersFilteredBySearch = this.users;
    },
    currentWorkspace: function currentWorkspace(newVal, oldVal) {
      this.initData(true);
    }
  },
  methods: _objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])('users', ['fetchUsers', 'updateWorkspaceUsers', 'updateUser', 'updateUserPassword', 'removeUsersFromWorkspace'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapMutations"])('tables', ['SET_TABLE_PROPERTY'])), {}, {
    initData: function initData(forceRefresh) {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(forceRefresh || _this3.getUsersStatus != 'success' && _this3.getUsersStatus != 'loading')) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return _this3.fetchUsers();

              case 3:
                // Initially set the filteredbySearch arrays
                if (_this3.getUsersStatus == 'success') _this3.usersFilteredBySearch = _this3.users;

                _this3.SET_TABLE_PROPERTY('usersTable', 'workspaceId', _this3.currentWorkspace.id);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    onSetUserPassword: function onSetUserPassword(mouseEvent, user) {
      var _this4 = this;

      var contextMenu = this.$refs.contextMenuUserPassword;
      contextMenu.item = user;
      contextMenu.show(mouseEvent); // Wait for the context menu to show in the DOM

      this.$nextTick(function () {
        // Set focus to the input field
        var input = _this4.$refs.userPasswordInput;
        input.focus();
        input.select();
      });
    },
    setUserPassword: function setUserPassword(user) {
      var password = this.newUserPassword;
      user.password = password;
      user.oldPassword = this.oldUserPassword;
      this.updateUserPassword(user);
    },
    onEditUserCurrency: function onEditUserCurrency(mouseEvent, user) {
      var _this5 = this;

      this.contextUser = user;
      this.userToEdit = JSON.parse(JSON.stringify(user));
      this.originalUser = user; // Wait for the context menu to show in the DOM

      this.$nextTick(function () {
        var contextMenu = _this5.$refs.contextMenuUserCurrency;
        contextMenu.item = user;
        contextMenu.show(mouseEvent);
      });
    },
    onEditUserRole: function onEditUserRole(mouseEvent, user) {
      this.userToEdit = JSON.parse(JSON.stringify(user));
      this.originalUser = user;
      this.contextUser = user;
      var contextMenu = this.$refs.contextMenuWorkspaceRole;
      contextMenu.item = user;
      contextMenu.show(mouseEvent);
    },
    onUpdateUsersCurrency: function onUpdateUsersCurrency() {
      // Define the user to base the new currency to set on
      var baseUser = this.userToEdit; // Check if we have a selection of users
      // If so, set the currency for all the selected users

      var usersToPost;

      if (this.selectedUsers.length > 0) {
        usersToPost = this.selectedUsers.map(function (user) {
          user.currency = baseUser.currency;
          return user;
        });
      } else usersToPost = [baseUser]; // Update all users


      this.updateWorkspaceUsers(usersToPost);
    },
    onUpdateUsersRole: function onUpdateUsersRole() {
      // Define the user to base the new role to set on
      var baseUser = this.userToEdit; // Check if we have a selection of users
      // If so, set the currency for all the selected users

      var usersToPost;

      if (this.selectedUsers.length > 0) {
        usersToPost = this.selectedUsers.map(function (user) {
          user.role = baseUser.role;
          return user;
        });
      } else usersToPost = [baseUser]; // Update all users


      this.updateWorkspaceUsers(usersToPost);
    },
    onNewUser: function onNewUser() {
      // emit open new user modal
      this.$emit('onNewUser');
    },
    showUserContext: function showUserContext(e, user) {
      // If we have a selection, show context menu for that selection instead
      var contextMenu = this.$refs.contextMenuUser;

      if (this.selectedUsers.length > 1) {
        contextMenu = this.$refs.contextMenuSelectedUsers;
      } else {
        contextMenu = this.$refs.contextMenuUser;
      }

      if (user) {
        this.contextUser = this.selectedUsers.length > 0 ? this.selectedUsers[0] : user;
      }

      contextMenu.show(e);
    },
    onDeleteUser: function onDeleteUser(user) {
      var _this6 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this6.$refs.confirmDeleteUser.confirm();

              case 2:
                if (!_context2.sent) {
                  _context2.next = 5;
                  break;
                }

                _this6.removeUsersFromWorkspace({
                  workspaceId: _this6.currentWorkspace.id,
                  users: [user]
                });

                _this6.selectedUsers = [];

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    onDeleteUsers: function onDeleteUsers() {
      var _this7 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _this7.$refs.confirmDeleteMultipleUsers.confirm();

              case 2:
                if (!_context3.sent) {
                  _context3.next = 5;
                  break;
                }

                _this7.removeUsersFromWorkspace({
                  workspaceId: _this7.currentWorkspace.id,
                  users: _this7.selectedUsers
                });

                _this7.selectedUsers = [];

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    sortUsers: function sortUsers(method, key) {
      this.onSortArray(this.users, method, key);
    },
    onSortArray: function onSortArray(array, method, key) {
      // If if we are already sorting by the given key, flip the sort order
      if (this.sortKey == key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = method;
      }

      var sortAsc = this.sortAsc;
      this.sortArray(array, this.sortAsc, this.sortKey);
    },
    hotkeyHandler: function hotkeyHandler(e) {
      var key = e.code;
      if (e.target.type == 'textarea' || e.target.tagName.toUpperCase() == 'INPUT' || this.singleVisible) return; // Don't mess with user input

      if (key == 'KeyS') {
        this.$refs.tableComp.focusSearch(); // this.$refs.searchField.setFocus()

        e.preventDefault(); // Avoid entering an "s" in the search field
      }
    }
  }),
  created: function created() {
    var forceRefresh = this.getUsersTable.workspaceId != this.currentWorkspace.id;
    this.initData(forceRefresh);
    document.addEventListener('keydown', this.hotkeyHandler);
  },
  destroyed: function destroyed() {
    document.removeEventListener('keydown', this.hotkeyHandler);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
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
  name: 'usersTableRow',
  props: ['user'],
  data: function data() {
    return {
      editName: false,
      editEmail: false,
      userToEdit: this.user
    };
  },
  computed: _objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('auth', ['authUser'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('workspaces', ['authUserWorkspaceRole'])), {}, {
    isSelf: function isSelf() {
      return this.authUser.id == this.user.id;
    }
  }),
  methods: {
    selectUser: function selectUser() {
      this.$refs.selectBox.check();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/index.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/index.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _UsersPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UsersPage */ "./resources/js/pages/UsersPage/UsersPage.vue");
/* harmony import */ var _components_common_PageLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/common/PageLoader */ "./resources/js/components/common/PageLoader.vue");
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'usersPageLoader',
  components: {
    UsersPage: _UsersPage__WEBPACK_IMPORTED_MODULE_1__["default"],
    PageLoader: _components_common_PageLoader__WEBPACK_IMPORTED_MODULE_2__["default"]
  }
});

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".modal[data-v-5d6d1d6c] {\n  background: #f4f6ff;\n}\n.user-wrapper[data-v-5d6d1d6c] {\n  padding: 20px 32px 40px;\n  box-shadow: 0 3px 4px 0 rgba(117, 134, 156, 0.1);\n  border-radius: 4px;\n  border: 1px solid #cddde8;\n  margin-bottom: 20px;\n  background: white;\n}\n.user-wrapper .info[data-v-5d6d1d6c] {\n  display: inline-block;\n}\n.user-wrapper.error[data-v-5d6d1d6c] {\n  border-left: 12px solid #ff395e;\n}\n.user-wrapper.ignore[data-v-5d6d1d6c] {\n  border-left: 12px solid #ffdc16;\n}\n.user-wrapper.success[data-v-5d6d1d6c] {\n  border-left: 12px solid #42e794;\n}\n.user-wrapper.ignore[data-v-5d6d1d6c], .user-wrapper.error[data-v-5d6d1d6c], .user-wrapper.success[data-v-5d6d1d6c] {\n  padding-left: 20px;\n}\n.user-wrapper h3[data-v-5d6d1d6c] {\n  margin: 0;\n}\n.user-wrapper .controls[data-v-5d6d1d6c] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 8px;\n}\n.user-wrapper .form-element[data-v-5d6d1d6c]:last-child {\n  margin-bottom: 0;\n}\n.input-wrapper.error[data-v-5d6d1d6c] {\n  border: solid 2px #ff395e;\n}\n.input-wrapper.error + .error-msg[data-v-5d6d1d6c] {\n  display: flex;\n}\n.error-msg[data-v-5d6d1d6c] {\n  display: none;\n  margin-top: 4px;\n  font-size: 12px;\n}\n.error-msg > i[data-v-5d6d1d6c] {\n  margin-right: 6px;\n  margin-top: 3px;\n}\n.ignored-users-list[data-v-5d6d1d6c] {\n  text-align: left;\n  font-size: 13px;\n  margin-top: 12px;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "h1[data-v-2a6e4074] {\n  margin-bottom: 16px;\n}\n.underline[data-v-2a6e4074] {\n  width: 100%;\n  border-bottom: solid 2px #dfdfdf;\n  margin-bottom: 20px;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".users-table[data-v-74841db2]  td.title, .users-table[data-v-74841db2]  th.title {\n  min-width: 264px;\n  max-width: 264px;\n  display: flex;\n  align-items: center;\n}\n.users-table[data-v-74841db2]  tr:not(.table-top-bar) th.email, .users-table[data-v-74841db2]  td.email {\n  flex: 2;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".user-row.self[data-v-5194eb3a] {\n  font-weight: 500;\n}\n.user-row.self .title i[data-v-5194eb3a] {\n  color: #2a46ff;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--7-2!../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../node_modules/vue-loader/lib??vue-loader-options!./AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss&");

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

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss&");

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

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss&");

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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/AddUserModal.vue?vue&type=template&id=5d6d1d6c&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/AddUserModal.vue?vue&type=template&id=5d6d1d6c&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "BaseModal",
    {
      ref: "addUserModal",
      attrs: { header: "Add new user to workspace", show: _vm.show },
      on: {
        close: function($event) {
          return _vm.$emit("close")
        }
      }
    },
    [
      _c(
        "form",
        {
          attrs: { novalidate: "" },
          on: {
            submit: function($event) {
              !_vm.submitDisabled && _vm.onSubmit($event)
            }
          }
        },
        [
          _vm._l(_vm.usersToAdd, function(user, index) {
            return _c(
              "div",
              {
                key: index,
                ref: "userWrapper",
                refInFor: true,
                staticClass: "user-wrapper",
                class: user.status
              },
              [
                user.status == "ignore"
                  ? _c(
                      "div",
                      {
                        directives: [
                          {
                            name: "tooltip",
                            rawName: "v-tooltip",
                            value:
                              "This user already exists and will not have their name or password updated.",
                            expression:
                              "'This user already exists and will not have their name or password updated.'"
                          }
                        ],
                        staticClass: "info"
                      },
                      [
                        _c("i", { staticClass: "far fa-info-circle" }),
                        _vm._v(" "),
                        _c("span", [_vm._v("User will be ignored")])
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.usersToAdd.length > 1
                  ? _c("div", { staticClass: "controls" }, [
                      _c("h3", [_vm._v("User " + _vm._s(index + 1))]),
                      _vm._v(" "),
                      _c(
                        "button",
                        {
                          on: {
                            click: function($event) {
                              return _vm.onRemoveUser(index)
                            }
                          }
                        },
                        [
                          _c("i", { staticClass: "fas fa-user-minus" }),
                          _c("span", [_vm._v("Remove")])
                        ]
                      )
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "form-element" },
                  [
                    _c("label", { attrs: { for: "new-user-email-" + index } }, [
                      _vm._v("Email *")
                    ]),
                    _vm._v(" "),
                    _c("BaseInputField", {
                      ref: "emailInput",
                      refInFor: true,
                      attrs: {
                        type: "email",
                        id: "new-user-email-" + index,
                        placeholder: "email",
                        autocomplete: "off",
                        errorTooltip: user.emailErr
                      },
                      on: {
                        paste: function($event) {
                          return _vm.onPaste($event, index)
                        },
                        input: function($event) {
                          user.emailErr && _vm.validateEmail(user, index)
                        },
                        blur: function($event) {
                          return _vm.validateEmail(user, index)
                        }
                      },
                      model: {
                        value: user.email,
                        callback: function($$v) {
                          _vm.$set(user, "email", $$v)
                        },
                        expression: "user.email"
                      }
                    })
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "form-element" },
                  [
                    _c("label", { attrs: { for: "new-user-name-" + index } }, [
                      _vm._v(" Name (optional)")
                    ]),
                    _vm._v(" "),
                    _c("BaseInputField", {
                      ref: "nameInput",
                      refInFor: true,
                      attrs: {
                        type: "text",
                        id: "new-user-name-" + index,
                        placeholder: "name",
                        autocomplete: "off",
                        readOnly: user.status == "ignore"
                      },
                      model: {
                        value: user.name,
                        callback: function($$v) {
                          _vm.$set(user, "name", $$v)
                        },
                        expression: "user.name"
                      }
                    })
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "form-element" },
                  [
                    _c(
                      "label",
                      { attrs: { for: "new-user-password-" + index } },
                      [_vm._v("Password *")]
                    ),
                    _vm._v(" "),
                    _c("BaseInputField", {
                      ref: "passwordInput",
                      refInFor: true,
                      attrs: {
                        type: "text",
                        id: "new-user-password-" + index,
                        autocomplete: "new-password",
                        errorTooltip: user.passwordErr,
                        readOnly: user.status == "ignore"
                      },
                      on: {
                        input: function($event) {
                          user.passwordErr && _vm.validatePassword(user, index)
                        },
                        blur: function($event) {
                          return _vm.validatePassword(user, index)
                        }
                      },
                      model: {
                        value: user.password,
                        callback: function($$v) {
                          _vm.$set(user, "password", $$v)
                        },
                        expression: "user.password"
                      }
                    })
                  ],
                  1
                )
              ]
            )
          }),
          _vm._v(" "),
          _c("div", { staticClass: "form-element" }, [
            _c(
              "button",
              {
                staticClass: "dark",
                attrs: { type: "button" },
                on: { click: _vm.onAddUser }
              },
              [
                _c("i", { staticClass: "fas fa-user-plus" }),
                _c("span", [_vm._v("Add user")])
              ]
            )
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "form-element" }, [
            _c(
              "button",
              {
                staticClass: "lg primary full-width",
                attrs: { type: "submit", disabled: _vm.submitDisabled },
                on: { click: _vm.onSubmit }
              },
              [
                _c(
                  "span",
                  [
                    _vm._v("Add"),
                    _vm.usersToAdd.length > 1
                      ? [_vm._v(" " + _vm._s(_vm.usersToAdd.length))]
                      : _vm._e(),
                    _vm._v(" user"),
                    _vm.usersToAdd.length > 1 ? [_vm._v("(s)")] : _vm._e()
                  ],
                  2
                )
              ]
            )
          ])
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "BaseDialog",
        {
          ref: "ignoredUsersUsersDialog",
          attrs: {
            type: "dialog",
            confirmColor: "primary",
            confirmText: "Got it"
          }
        },
        [
          _c("div", { staticClass: "icon-graphic" }, [
            _c("i", { staticClass: "lg primary far fa-users" }),
            _vm._v(" "),
            _c("i", { staticClass: "lg far fa-arrow-right" }),
            _vm._v(" "),
            _c("i", { staticClass: "lg dark far fa-building" })
          ]),
          _vm._v(" "),
          _c("h3", [_vm._v("Success!")]),
          _vm._v(" "),
          _vm.usersExistingInForm.length > 0
            ? _c("p", [
                _vm._v("The form contained "),
                _c("strong", [
                  _vm._v(_vm._s(_vm.usersExistingInForm.length) + " duplicates")
                ]),
                _vm._v(" that have been ignored.")
              ])
            : _vm._e(),
          _vm._v(" "),
          _vm.usersExistingOnWorkspace.length > 0
            ? _c("p", [
                _c("strong", [
                  _vm._v(_vm._s(_vm.usersExistingOnWorkspace.length) + " users")
                ]),
                _vm._v(" already exist on this workspace.\n        ")
              ])
            : _vm._e(),
          _vm._v(" "),
          _vm.usersExistingOnAnotherWorkspace.length > 0
            ? _c("p", [
                _c("strong", [
                  _vm._v(
                    _vm._s(_vm.usersExistingOnAnotherWorkspace.length) +
                      " users"
                  )
                ]),
                _vm._v(" already exist on another workspace.\n        ")
              ])
            : _vm._e(),
          _vm._v(" "),
          _vm.usersExistingOnAnotherWorkspace.length > 0 ||
          _vm.usersExistingOnWorkspace.length > 0
            ? _c("p", [_vm._v("We have not updated their name or password:")])
            : _vm._e(),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "ignored-users-list" },
            _vm._l(
              _vm.usersExistingOnWorkspace.concat(
                _vm.usersExistingOnAnotherWorkspace
              ),
              function(user, index) {
                return _c("li", { key: index }, [
                  _vm._v(_vm._s(user.name) + " (" + _vm._s(user.email) + ")")
                ])
              }
            ),
            0
          )
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=template&id=2a6e4074&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=template&id=2a6e4074&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "div",
    { staticClass: "users" },
    [
      _c("Breadcrumbs"),
      _vm._v(" "),
      _c("h1", [_vm._v("Users")]),
      _vm._v(" "),
      _c("UsersTable", {
        on: {
          onNewUser: function($event) {
            return _vm.setAddNewUserModalVisible(true)
          }
        }
      }),
      _vm._v(" "),
      _c("AddUserModal", {
        ref: "addUserModal",
        attrs: { show: _vm.addNewUserModalVisible, users: _vm.users },
        on: {
          close: function($event) {
            return _vm.setAddNewUserModalVisible(false)
          }
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=template&id=74841db2&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=template&id=74841db2&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "div",
    { staticClass: "users-table" },
    [
      _vm.currentTab == "Users"
        ? _c("BaseTable", {
            ref: "tableComp",
            attrs: {
              stickyHeader: "true",
              contentStatus: _vm.readyStatus,
              loadingMsg: "loading users",
              errorMsg: "error loading users",
              errorCallback: function() {
                return _vm.initData()
              },
              items: _vm.users,
              itemKey: "id",
              itemSize: 50,
              selected: _vm.selectedUsers,
              contextItem: _vm.contextUser,
              contextMouseEvent: _vm.contextMouseEvent,
              searchKey: ["name", "email"],
              searchResult: _vm.usersFilteredBySearch,
              itemType: "user"
            },
            on: {
              "update:selected": function($event) {
                _vm.selectedUsers = $event
              },
              "update:contextItem": function($event) {
                _vm.contextUser = $event
              },
              "update:context-item": function($event) {
                _vm.contextUser = $event
              },
              "update:contextMouseEvent": function($event) {
                _vm.contextMouseEvent = $event
              },
              "update:context-mouse-event": function($event) {
                _vm.contextMouseEvent = $event
              },
              "update:searchResult": function($event) {
                _vm.usersFilteredBySearch = $event
              },
              "update:search-result": function($event) {
                _vm.usersFilteredBySearch = $event
              },
              "show-contextmenu": _vm.showUserContext
            },
            scopedSlots: _vm._u(
              [
                _vm.authUserWorkspaceRole == "Admin"
                  ? {
                      key: "tabs",
                      fn: function() {
                        return [
                          _c("BaseTableTabs", {
                            attrs: {
                              tabs: ["Teams", "Users"],
                              activeTab: _vm.currentTab
                            },
                            model: {
                              value: _vm.currentTab,
                              callback: function($$v) {
                                _vm.currentTab = $$v
                              },
                              expression: "currentTab"
                            }
                          })
                        ]
                      },
                      proxy: true
                    }
                  : null,
                {
                  key: "header",
                  fn: function() {
                    return [
                      _c(
                        "BaseTableHeader",
                        {
                          staticClass: "title",
                          attrs: {
                            sortKey: "name",
                            currentSortKey: _vm.sortKey,
                            sortAsc: _vm.sortAsc
                          },
                          on: { sort: _vm.sortUsers }
                        },
                        [_vm._v("Name")]
                      ),
                      _vm._v(" "),
                      _c(
                        "BaseTableHeader",
                        {
                          attrs: {
                            sortKey: "email",
                            currentSortKey: _vm.sortKey,
                            sortAsc: _vm.sortAsc
                          },
                          on: { sort: _vm.sortUsers }
                        },
                        [_vm._v("E-mail")]
                      ),
                      _vm._v(" "),
                      _c(
                        "BaseTableHeader",
                        {
                          attrs: {
                            sortKey: "role",
                            currentSortKey: _vm.sortKey,
                            sortAsc: _vm.sortAsc
                          },
                          on: { sort: _vm.sortUsers }
                        },
                        [_vm._v("Workspace Role")]
                      ),
                      _vm._v(" "),
                      _c(
                        "BaseTableHeader",
                        {
                          attrs: {
                            sortKey: "currency",
                            currentSortKey: _vm.sortKey,
                            sortAsc: _vm.sortAsc
                          },
                          on: { sort: _vm.sortUsers }
                        },
                        [_vm._v("Currency")]
                      )
                    ]
                  },
                  proxy: true
                },
                {
                  key: "row",
                  fn: function(rowProps) {
                    return [
                      _c("UsersTableRow", {
                        attrs: {
                          user: rowProps.item,
                          selectedUsers: _vm.selectedUsers
                        },
                        on: {
                          editCurrency: _vm.onEditUserCurrency,
                          editRole: _vm.onEditUserRole,
                          "update:selectedUsers": function($event) {
                            _vm.selectedUsers = $event
                          },
                          "update:selected-users": function($event) {
                            _vm.selectedUsers = $event
                          },
                          "show-contextmenu": _vm.showUserContext
                        }
                      })
                    ]
                  }
                },
                {
                  key: "footer",
                  fn: function() {
                    return [
                      _c(
                        "td",
                        [
                          _c(
                            "BaseButton",
                            {
                              directives: [
                                {
                                  name: "tooltip",
                                  rawName: "v-tooltip",
                                  value:
                                    _vm.authUserWorkspaceRole != "Admin" &&
                                    "New users can only be added by a workspace admin",
                                  expression:
                                    "authUserWorkspaceRole != 'Admin' && 'New users can only be added by a workspace admin'"
                                }
                              ],
                              attrs: {
                                buttonClass: "primary invisible",
                                disabled: _vm.authUserWorkspaceRole != "Admin"
                              },
                              on: { click: _vm.onNewUser }
                            },
                            [_c("span", [_vm._v("Add new: User")])]
                          )
                        ],
                        1
                      )
                    ]
                  },
                  proxy: true
                }
              ],
              null,
              true
            )
          })
        : _vm._e(),
      _vm._v(" "),
      _c(
        "BaseContextMenu",
        { ref: "contextMenuUser", staticClass: "context-user" },
        [
          _vm.contextUser
            ? _c(
                "div",
                { staticClass: "item-group" },
                [
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: {
                        iconClass: "far fa-usd-circle",
                        disabled: _vm.authUserWorkspaceRole != "Admin",
                        disabledTooltip:
                          "Only admins can change currency of others.",
                        hotkey: "KeyC"
                      },
                      on: {
                        click: function($event) {
                          return _vm.onEditUserCurrency(
                            _vm.contextMouseEvent,
                            _vm.contextUser
                          )
                        }
                      }
                    },
                    [
                      _c("span", [
                        _c("u", [_vm._v("C")]),
                        _vm._v("hange "),
                        _c("u", [_vm._v("C")]),
                        _vm._v("urrency")
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: {
                        iconClass: "far fa-key",
                        disabled: _vm.authUserWorkspaceRole != "Admin",
                        disabledTooltip:
                          "Only admins can change workspace role",
                        hotkey: "KeyR"
                      },
                      on: {
                        click: function($event) {
                          return _vm.onEditUserRole(
                            _vm.contextMouseEvent,
                            _vm.contextUser
                          )
                        }
                      }
                    },
                    [
                      _c("span", [
                        _vm._v("Change Workspace "),
                        _c("u", [_vm._v("R")]),
                        _vm._v("ole")
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: {
                        iconClass: "far fa-lock",
                        disabled: _vm.contextUser.id != _vm.authUser.id,
                        disabledTooltip: "Can only set password of self",
                        hotkey: "KeyP"
                      },
                      on: {
                        click: function($event) {
                          return _vm.onSetUserPassword(
                            _vm.contextMouseEvent,
                            _vm.contextUser
                          )
                        }
                      }
                    },
                    [
                      _c("span", [
                        _vm._v("Change "),
                        _c("u", [_vm._v("P")]),
                        _vm._v("assword")
                      ])
                    ]
                  )
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "item-group" },
            [
              _c(
                "BaseContextMenuItem",
                {
                  attrs: {
                    iconClass: "far fa-trash-alt",
                    disabled: _vm.authUserWorkspaceRole != "Admin",
                    disabledTooltip: "Only admins can remove users",
                    hotkey: "KeyD"
                  },
                  on: {
                    click: function($event) {
                      return _vm.onDeleteUser(_vm.contextUser)
                    }
                  }
                },
                [
                  _c("span", [
                    _c("u", [_vm._v("D")]),
                    _vm._v("elete User from Workspace")
                  ])
                ]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuSelectedUsers",
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [
                _c("span", [
                  _vm._v(
                    "Choose action for " +
                      _vm._s(_vm.selectedUsers.length) +
                      " users"
                  )
                ])
              ]
            },
            proxy: true
          },
          {
            key: "default",
            fn: function() {
              return [
                _c(
                  "div",
                  { staticClass: "item-group" },
                  [
                    _c(
                      "BaseContextMenuItem",
                      {
                        attrs: { iconClass: "far fa-times", hotkey: "KeyL" },
                        on: {
                          click: function($event) {
                            _vm.selectedUsers = []
                          }
                        }
                      },
                      [
                        _c("span", [
                          _vm._v("C"),
                          _c("u", [_vm._v("l")]),
                          _vm._v("ear Selection")
                        ])
                      ]
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "item-group" },
                  [
                    _c(
                      "BaseContextMenuItem",
                      {
                        attrs: {
                          iconClass: "far fa-usd-circle",
                          disabled:
                            _vm.authUserWorkspaceRole != "Admin" &&
                            _vm.contextUser.id != _vm.authUser.id,
                          disabledTooltip:
                            "Can only set own currency. Only admins can change currency of others.",
                          hotkey: "KeyC"
                        },
                        on: {
                          click: function($event) {
                            return _vm.onEditUserCurrency(
                              _vm.contextMouseEvent,
                              _vm.contextUser
                            )
                          }
                        }
                      },
                      [
                        _c("span", [
                          _c("u", [_vm._v("C")]),
                          _vm._v("hange "),
                          _c("u", [_vm._v("C")]),
                          _vm._v("urrency")
                        ])
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "BaseContextMenuItem",
                      {
                        attrs: {
                          iconClass: "far fa-key",
                          disabled: _vm.authUserWorkspaceRole != "Admin",
                          disabledTooltip:
                            "Only admins can change workspace role",
                          hotkey: "KeyR"
                        },
                        on: {
                          click: function($event) {
                            return _vm.onEditUserRole(
                              _vm.contextMouseEvent,
                              _vm.contextUser
                            )
                          }
                        }
                      },
                      [
                        _c("span", [
                          _vm._v("Change Workspace "),
                          _c("u", [_vm._v("R")]),
                          _vm._v("ole")
                        ])
                      ]
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "item-group" },
                  [
                    _c(
                      "BaseContextMenuItem",
                      {
                        directives: [
                          {
                            name: "tooltip",
                            rawName: "v-tooltip",
                            value:
                              _vm.authUserWorkspaceRole != "Admin" &&
                              "Only admins can remove users",
                            expression:
                              "authUserWorkspaceRole != 'Admin' && 'Only admins can remove users'"
                          }
                        ],
                        attrs: {
                          disabled: _vm.authUserWorkspaceRole != "Admin",
                          iconClass: "far fa-trash-alt"
                        },
                        on: { click: _vm.onDeleteUsers }
                      },
                      [
                        _c("span", [
                          _c("u", [_vm._v("D")]),
                          _vm._v("elete Users from Workspace")
                        ])
                      ]
                    )
                  ],
                  1
                )
              ]
            },
            proxy: true
          }
        ])
      }),
      _vm._v(" "),
      _vm.userToEdit
        ? _c("BaseSelectButtonsContextMenu", {
            ref: "contextMenuUserCurrency",
            attrs: {
              header: "Change User Currency",
              type: "radio",
              options: _vm.availableCurrencies,
              search: true,
              unsetOption: "Clear",
              unsetValue: null
            },
            on: { submit: _vm.onUpdateUsersCurrency },
            model: {
              value: _vm.userToEdit.currency,
              callback: function($$v) {
                _vm.$set(_vm.userToEdit, "currency", $$v)
              },
              expression: "userToEdit.currency"
            }
          })
        : _vm._e(),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuWorkspaceRole",
        staticClass: "context-role",
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [_vm._v("\n            Change Workspace Role\n        ")]
            },
            proxy: true
          },
          {
            key: "default",
            fn: function(slotProps) {
              return [
                _c(
                  "div",
                  { staticClass: "item-group" },
                  [
                    _c("BaseSelectButtons", {
                      attrs: {
                        type: "radio",
                        options: _vm.availableWorkspaceRoles,
                        submitOnChange: true,
                        optionDescriptionKey: "description",
                        optionNameKey: "role",
                        optionValueKey: "role"
                      },
                      model: {
                        value: _vm.userToEdit.role,
                        callback: function($$v) {
                          _vm.$set(_vm.userToEdit, "role", $$v)
                        },
                        expression: "userToEdit.role"
                      }
                    })
                  ],
                  1
                ),
                _vm._v(" "),
                _c("div", { staticClass: "item-group" }, [
                  _c("div", { staticClass: "item-wrapper" }, [
                    _c(
                      "button",
                      {
                        staticClass: "primary",
                        on: {
                          click: function($event) {
                            _vm.onUpdateUsersRole()
                            slotProps.hide()
                          }
                        }
                      },
                      [_c("span", [_vm._v("Save")])]
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "invisible ghost-hover",
                        staticStyle: { "margin-left": "8px" },
                        on: {
                          click: function($event) {
                            slotProps.hide()
                            _vm.userToEdit.role = _vm.originalUser.role
                          }
                        }
                      },
                      [_c("span", [_vm._v("Cancel")])]
                    )
                  ])
                ])
              ]
            }
          }
        ])
      }),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuUserPassword",
        staticClass: "context-password",
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [_c("span", [_vm._v("Change Password")])]
            },
            proxy: true
          },
          {
            key: "default",
            fn: function(slotProps) {
              return [
                _c("div", { staticClass: "item-group" }, [
                  _c("div", { staticClass: "item-wrapper" }, [
                    _c(
                      "div",
                      [
                        _c("label", [_vm._v("New password")]),
                        _vm._v(" "),
                        _c("BaseInputField", {
                          ref: "userPasswordInput",
                          attrs: { type: "text", placeholder: "New password" },
                          model: {
                            value: _vm.newUserPassword,
                            callback: function($$v) {
                              _vm.newUserPassword = $$v
                            },
                            expression: "newUserPassword"
                          }
                        })
                      ],
                      1
                    )
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "item-wrapper" }, [
                    _c(
                      "div",
                      [
                        _c("label", [_vm._v("Old password")]),
                        _vm._v(" "),
                        _c("BaseInputField", {
                          attrs: { type: "text", placeholder: "Old password" },
                          model: {
                            value: _vm.oldUserPassword,
                            callback: function($$v) {
                              _vm.oldUserPassword = $$v
                            },
                            expression: "oldUserPassword"
                          }
                        })
                      ],
                      1
                    )
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "item-group" }, [
                  _c("div", { staticClass: "item-wrapper" }, [
                    _c(
                      "button",
                      {
                        staticClass: "primary",
                        class: { disabled: _vm.passwordSubmitDisabled },
                        staticStyle: { "margin-right": "8px" },
                        on: {
                          click: function($event) {
                            _vm.setUserPassword(_vm.contextUser)
                            slotProps.hide()
                          }
                        }
                      },
                      [_c("span", [_vm._v("Save")])]
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "invisible ghost-hover",
                        on: {
                          click: function($event) {
                            return slotProps.hide()
                          }
                        }
                      },
                      [_c("span", [_vm._v("Cancel")])]
                    )
                  ])
                ])
              ]
            }
          }
        ])
      }),
      _vm._v(" "),
      _c(
        "BaseDialog",
        {
          ref: "confirmDeleteMultipleUsers",
          attrs: {
            type: "confirm",
            confirmColor: "red",
            confirmText: "Yes, delete them",
            cancelText: "No, keep them"
          }
        },
        [
          _c("div", { staticClass: "icon-graphic" }, [
            _c("i", { staticClass: "lg primary far fa-user" }),
            _vm._v(" "),
            _c("i", { staticClass: "lg far fa-arrow-right" }),
            _vm._v(" "),
            _c("i", { staticClass: "lg dark far fa-trash" })
          ]),
          _vm._v(" "),
          _c("h3", [
            _vm._v(
              "Really delete " +
                _vm._s(_vm.selectedUsers.length) +
                " users from your workspace??"
            )
          ])
        ]
      ),
      _vm._v(" "),
      _c(
        "BaseDialog",
        {
          ref: "confirmDeleteUser",
          attrs: {
            type: "confirm",
            confirmColor: "red",
            confirmText: "Yes, delete this user",
            cancelText: "No, keep this user"
          }
        },
        [
          _c("div", { staticClass: "icon-graphic" }, [
            _c("i", { staticClass: "lg primary far fa-user" }),
            _vm._v(" "),
            _c("i", { staticClass: "lg far fa-arrow-right" }),
            _vm._v(" "),
            _c("i", { staticClass: "lg dark far fa-trash" })
          ]),
          _vm._v(" "),
          _c("h3", [_vm._v("Really delete this user from your workspace?")])
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=template&id=5194eb3a&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=template&id=5194eb3a&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************/
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
  return _c("BaseTableInnerRow", [
    _vm.editName
      ? _c(
          "td",
          { staticClass: "title" },
          [
            _c("i", {
              staticClass: "fa-user",
              class: _vm.user.id ? "fas" : "far"
            }),
            _vm._v(" "),
            _c("BaseEditInputWrapper", {
              ref: "editName",
              attrs: {
                activateOnMount: true,
                type: "text",
                value: _vm.userToEdit.name,
                oldValue: _vm.user.name
              },
              on: {
                submit: function($event) {
                  _vm.updateUser(_vm.userToEdit)
                  _vm.editName = false
                },
                cancel: function($event) {
                  _vm.$emit("cancelEditName")
                  _vm.editName = false
                }
              },
              model: {
                value: _vm.userToEdit.name,
                callback: function($$v) {
                  _vm.$set(_vm.userToEdit, "name", $$v)
                },
                expression: "userToEdit.name"
              }
            })
          ],
          1
        )
      : _c("td", { staticClass: "title" }, [
          _c("i", { staticClass: "fas fa-user" }),
          _vm._v(" "),
          _c(
            "span",
            {
              directives: [
                {
                  name: "tooltip",
                  rawName: "v-tooltip",
                  value: _vm.user.name.length > 26 && _vm.user.name,
                  expression: "user.name.length > 26 && user.name"
                }
              ]
            },
            [
              _vm._v(
                _vm._s(_vm._f("truncate")(_vm.user.name, 26)) +
                  _vm._s(_vm.isSelf ? " (You)" : "")
              )
            ]
          )
        ]),
    _vm._v(" "),
    _vm.editEmail
      ? _c(
          "td",
          { staticClass: "email" },
          [
            _c("BaseEditInputWrapper", {
              ref: "editEmail",
              attrs: {
                activateOnMount: true,
                type: "text",
                value: _vm.userToEdit.email,
                oldValue: _vm.user.email
              },
              on: {
                submit: function($event) {
                  _vm.updateUser(_vm.userToEdit)
                  _vm.editEmail = false
                },
                cancel: function($event) {
                  _vm.$emit("cancelEditEmail")
                  _vm.editEmail = false
                }
              },
              model: {
                value: _vm.userToEdit.email,
                callback: function($$v) {
                  _vm.$set(_vm.userToEdit, "email", $$v)
                },
                expression: "userToEdit.email"
              }
            })
          ],
          1
        )
      : _c(
          "td",
          {
            directives: [
              {
                name: "tooltip",
                rawName: "v-tooltip",
                value: _vm.user.email.length > 34 && _vm.user.email,
                expression: "user.email.length > 34 && user.email"
              }
            ],
            staticClass: "email"
          },
          [_vm._v(_vm._s(_vm._f("truncate")(_vm.user.email, 34)))]
        ),
    _vm._v(" "),
    _c("td", { staticClass: "role" }, [
      _vm.authUserWorkspaceRole == "Admin"
        ? _c(
            "button",
            {
              staticClass: "ghost editable sm",
              on: {
                click: function($event) {
                  return _vm.$emit("editRole", $event, _vm.user)
                }
              }
            },
            [_c("span", [_vm._v(_vm._s(_vm.user.role))])]
          )
        : _c("span", [_vm._v(_vm._s(_vm.user.role))])
    ]),
    _vm._v(" "),
    _c("td", { staticClass: "currency" }, [
      _vm.authUserWorkspaceRole == "Admin"
        ? _c(
            "button",
            {
              staticClass: "ghost editable sm",
              on: {
                click: function($event) {
                  return _vm.$emit("editCurrency", $event, _vm.user)
                }
              }
            },
            [
              _c("span", [
                _vm._v(
                  _vm._s(_vm.user.currency ? _vm.user.currency : "Set currency")
                )
              ])
            ]
          )
        : _c("span", [
            _vm._v(
              _vm._s(_vm.user.currency ? _vm.user.currency : "No currency set")
            )
          ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/index.vue?vue&type=template&id=1658d601&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/UsersPage/index.vue?vue&type=template&id=1658d601&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************/
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
  return _c("PageLoader", [_c("UsersPage")], 1)
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./resources/js/components/AddUserModal.vue":
/*!**************************************************!*\
  !*** ./resources/js/components/AddUserModal.vue ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AddUserModal_vue_vue_type_template_id_5d6d1d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AddUserModal.vue?vue&type=template&id=5d6d1d6c&scoped=true& */ "./resources/js/components/AddUserModal.vue?vue&type=template&id=5d6d1d6c&scoped=true&");
/* harmony import */ var _AddUserModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AddUserModal.vue?vue&type=script&lang=js& */ "./resources/js/components/AddUserModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _AddUserModal_vue_vue_type_style_index_0_id_5d6d1d6c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss& */ "./resources/js/components/AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AddUserModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AddUserModal_vue_vue_type_template_id_5d6d1d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _AddUserModal_vue_vue_type_template_id_5d6d1d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "5d6d1d6c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/AddUserModal.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/AddUserModal.vue?vue&type=script&lang=js&":
/*!***************************************************************************!*\
  !*** ./resources/js/components/AddUserModal.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AddUserModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./AddUserModal.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/AddUserModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AddUserModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss&":
/*!************************************************************************************************************!*\
  !*** ./resources/js/components/AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss& ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AddUserModal_vue_vue_type_style_index_0_id_5d6d1d6c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader!../../../node_modules/css-loader!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--7-2!../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../node_modules/vue-loader/lib??vue-loader-options!./AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/AddUserModal.vue?vue&type=style&index=0&id=5d6d1d6c&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AddUserModal_vue_vue_type_style_index_0_id_5d6d1d6c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AddUserModal_vue_vue_type_style_index_0_id_5d6d1d6c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AddUserModal_vue_vue_type_style_index_0_id_5d6d1d6c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AddUserModal_vue_vue_type_style_index_0_id_5d6d1d6c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AddUserModal_vue_vue_type_style_index_0_id_5d6d1d6c_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/components/AddUserModal.vue?vue&type=template&id=5d6d1d6c&scoped=true&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/components/AddUserModal.vue?vue&type=template&id=5d6d1d6c&scoped=true& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AddUserModal_vue_vue_type_template_id_5d6d1d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./AddUserModal.vue?vue&type=template&id=5d6d1d6c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/AddUserModal.vue?vue&type=template&id=5d6d1d6c&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AddUserModal_vue_vue_type_template_id_5d6d1d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AddUserModal_vue_vue_type_template_id_5d6d1d6c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersPage.vue":
/*!****************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersPage.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _UsersPage_vue_vue_type_template_id_2a6e4074_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UsersPage.vue?vue&type=template&id=2a6e4074&scoped=true& */ "./resources/js/pages/UsersPage/UsersPage.vue?vue&type=template&id=2a6e4074&scoped=true&");
/* harmony import */ var _UsersPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UsersPage.vue?vue&type=script&lang=js& */ "./resources/js/pages/UsersPage/UsersPage.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _UsersPage_vue_vue_type_style_index_0_id_2a6e4074_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss& */ "./resources/js/pages/UsersPage/UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _UsersPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _UsersPage_vue_vue_type_template_id_2a6e4074_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _UsersPage_vue_vue_type_template_id_2a6e4074_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "2a6e4074",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/UsersPage/UsersPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersPage.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersPage.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersPage.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss&":
/*!**************************************************************************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss& ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersPage_vue_vue_type_style_index_0_id_2a6e4074_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=style&index=0&id=2a6e4074&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersPage_vue_vue_type_style_index_0_id_2a6e4074_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersPage_vue_vue_type_style_index_0_id_2a6e4074_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersPage_vue_vue_type_style_index_0_id_2a6e4074_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersPage_vue_vue_type_style_index_0_id_2a6e4074_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersPage_vue_vue_type_style_index_0_id_2a6e4074_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersPage.vue?vue&type=template&id=2a6e4074&scoped=true&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersPage.vue?vue&type=template&id=2a6e4074&scoped=true& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersPage_vue_vue_type_template_id_2a6e4074_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersPage.vue?vue&type=template&id=2a6e4074&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersPage.vue?vue&type=template&id=2a6e4074&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersPage_vue_vue_type_template_id_2a6e4074_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersPage_vue_vue_type_template_id_2a6e4074_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersTable.vue":
/*!*****************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersTable.vue ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _UsersTable_vue_vue_type_template_id_74841db2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UsersTable.vue?vue&type=template&id=74841db2&scoped=true& */ "./resources/js/pages/UsersPage/UsersTable.vue?vue&type=template&id=74841db2&scoped=true&");
/* harmony import */ var _UsersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UsersTable.vue?vue&type=script&lang=js& */ "./resources/js/pages/UsersPage/UsersTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _UsersTable_vue_vue_type_style_index_0_id_74841db2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss& */ "./resources/js/pages/UsersPage/UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _UsersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _UsersTable_vue_vue_type_template_id_74841db2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _UsersTable_vue_vue_type_template_id_74841db2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "74841db2",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/UsersPage/UsersTable.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersTable.vue?vue&type=script&lang=js&":
/*!******************************************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersTable.vue?vue&type=script&lang=js& ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersTable.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss&":
/*!***************************************************************************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss& ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTable_vue_vue_type_style_index_0_id_74841db2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=style&index=0&id=74841db2&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTable_vue_vue_type_style_index_0_id_74841db2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTable_vue_vue_type_style_index_0_id_74841db2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTable_vue_vue_type_style_index_0_id_74841db2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTable_vue_vue_type_style_index_0_id_74841db2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTable_vue_vue_type_style_index_0_id_74841db2_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersTable.vue?vue&type=template&id=74841db2&scoped=true&":
/*!************************************************************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersTable.vue?vue&type=template&id=74841db2&scoped=true& ***!
  \************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTable_vue_vue_type_template_id_74841db2_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersTable.vue?vue&type=template&id=74841db2&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTable.vue?vue&type=template&id=74841db2&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTable_vue_vue_type_template_id_74841db2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTable_vue_vue_type_template_id_74841db2_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersTableRow.vue":
/*!********************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersTableRow.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _UsersTableRow_vue_vue_type_template_id_5194eb3a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UsersTableRow.vue?vue&type=template&id=5194eb3a&scoped=true& */ "./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=template&id=5194eb3a&scoped=true&");
/* harmony import */ var _UsersTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UsersTableRow.vue?vue&type=script&lang=js& */ "./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _UsersTableRow_vue_vue_type_style_index_0_id_5194eb3a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss& */ "./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _UsersTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _UsersTableRow_vue_vue_type_template_id_5194eb3a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _UsersTableRow_vue_vue_type_template_id_5194eb3a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "5194eb3a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/UsersPage/UsersTableRow.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersTableRow.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss&":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss& ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTableRow_vue_vue_type_style_index_0_id_5194eb3a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=style&index=0&id=5194eb3a&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTableRow_vue_vue_type_style_index_0_id_5194eb3a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTableRow_vue_vue_type_style_index_0_id_5194eb3a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTableRow_vue_vue_type_style_index_0_id_5194eb3a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTableRow_vue_vue_type_style_index_0_id_5194eb3a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTableRow_vue_vue_type_style_index_0_id_5194eb3a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=template&id=5194eb3a&scoped=true&":
/*!***************************************************************************************************!*\
  !*** ./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=template&id=5194eb3a&scoped=true& ***!
  \***************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTableRow_vue_vue_type_template_id_5194eb3a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./UsersTableRow.vue?vue&type=template&id=5194eb3a&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/UsersTableRow.vue?vue&type=template&id=5194eb3a&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTableRow_vue_vue_type_template_id_5194eb3a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_UsersTableRow_vue_vue_type_template_id_5194eb3a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/UsersPage/index.vue":
/*!************************************************!*\
  !*** ./resources/js/pages/UsersPage/index.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_1658d601_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=1658d601&scoped=true& */ "./resources/js/pages/UsersPage/index.vue?vue&type=template&id=1658d601&scoped=true&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/pages/UsersPage/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_1658d601_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_1658d601_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "1658d601",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/UsersPage/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/UsersPage/index.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/pages/UsersPage/index.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/UsersPage/index.vue?vue&type=template&id=1658d601&scoped=true&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/pages/UsersPage/index.vue?vue&type=template&id=1658d601&scoped=true& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_1658d601_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=1658d601&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/UsersPage/index.vue?vue&type=template&id=1658d601&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_1658d601_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_1658d601_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
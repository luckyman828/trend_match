(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["FilesPage"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_sortArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mixins/sortArray */ "./resources/js/mixins/sortArray.js");
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


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'fileApproversTable',
  props: ['file'],
  mixins: [_mixins_sortArray__WEBPACK_IMPORTED_MODULE_1__["default"]],
  data: function data() {
    return {
      sortKey: null,
      sortAsc: true,
      selected: [],
      usersToAdd: []
    };
  },
  computed: {
    availableUsers: function availableUsers() {
      var _this = this;

      var allUsers = User.all(); // Filter the available users to exclude users already added

      return allUsers.filter(function (user) {
        return !_this.file.approvers.find(function (approver) {
          return approver.id == user.id;
        });
      });
    }
  },
  methods: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('entities/collections', ['addApproversToFile', 'removeApproverFromFile'])), {}, {
    showUserContext: function showUserContext(e, user) {
      var contextMenu = this.$refs.contextMenuUser;
      contextMenu.item = user;
      contextMenu.show(e);
    },
    onAddUser: function onAddUser(e) {
      var contextMenu = this.$refs.contextMenuAddUsers;
      contextMenu.show(e);
    },
    onAddUsersToFile: function onAddUsersToFile(usersToAdd) {
      this.addApproversToFile({
        file: this.file,
        usersToAdd: this.usersToAdd
      });
    },
    sortUsers: function sortUsers(method, key) {
      // If if we are already sorting by the given key, flip the sort order
      if (this.sortKey == key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = method;
      }

      var sortAsc = this.sortAsc;
      this.sortArray(this.file.approvers, this.sortAsc, this.sortKey);
    },
    onRemoveUser: function onRemoveUser(user) {
      // If we have a selection, loop through the selection and remove those
      // Else, remove the parsed user
      this.removeApproverFromFile({
        file: this.file,
        user: user
      });
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileApproversFlyin/index.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/FileApproversFlyin/index.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _FileApproversTable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileApproversTable */ "./resources/js/components/FileApproversFlyin/FileApproversTable.vue");
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


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'fileApproversFlyin',
  components: {
    FileApproversTable: _FileApproversTable__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  props: ['show', 'file'],
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('users', ['users', 'loadingUsers'])),
  methods: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('users', ['fetchUsers'])),
  created: function created() {
    // Check if we have any workspace users, else fetch them
    if (!this.users && !this.loadingUsers) this.fetchUsers();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_sortArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mixins/sortArray */ "./resources/js/mixins/sortArray.js");
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


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'fileOwnersTable',
  props: ['file'],
  mixins: [_mixins_sortArray__WEBPACK_IMPORTED_MODULE_1__["default"]],
  data: function data() {
    return {
      sortKey: null,
      sortAsc: true,
      selected: [],
      usersToAdd: []
    };
  },
  computed: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('users', ['users'])), {}, {
    availableUsers: function availableUsers() {
      var _this = this;

      var allUsers = this.users; // Filter the available users to exclude users already added

      return allUsers.filter(function (user) {
        return !_this.file.owners.find(function (owner) {
          return owner.id == user.id;
        });
      });
    }
  }),
  methods: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('files', ['addUsersToFile', 'removeUserFromFile'])), {}, {
    showUserContext: function showUserContext(e, user) {
      var contextMenu = this.$refs.contextMenuUser;
      contextMenu.item = user;
      contextMenu.show(e);
    },
    onAddUser: function onAddUser(e) {
      var contextMenu = this.$refs.contextMenuAddUsers;
      contextMenu.show(e);
    },
    onAddUsersToFile: function onAddUsersToFile(usersToAdd) {
      this.addUsersToFile({
        file: this.file,
        users: this.usersToAdd
      });
    },
    sortUsers: function sortUsers(method, key) {
      // If if we are already sorting by the given key, flip the sort order
      if (this.sortKey == key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = method;
      }

      var sortAsc = this.sortAsc;
      this.sortArray(this.file.owners, this.sortAsc, this.sortKey);
    },
    onRemoveUser: function onRemoveUser(user) {
      // If we have a selection, loop through the selection and remove those
      // Else, remove the parsed user
      this.removeUserFromFile({
        file: this.file,
        user: user
      });
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileOwnersFlyin/index.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/FileOwnersFlyin/index.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _FileOwnersTable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileOwnersTable */ "./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue");
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


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'fileOwnersFlyin',
  components: {
    FileOwnersTable: _FileOwnersTable__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  props: ['file', 'show'],
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('users', ['users', 'loadingUsers'])),
  watch: {
    file: function file(newVal, oldVal) {
      if (!oldVal || newVal.id != oldVal.id) {
        // If we have a new file
        // -> Fetch file owners
        this.fetchFileOwners(this.file);
      }
    }
  },
  methods: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('files', ['fetchFileOwners'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('users', ['fetchUsers'])),
  created: function created() {
    // Check if we have any workspace users, else fetch them
    if (!this.users && !this.loadingUsers) this.fetchUsers();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_sortArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mixins/sortArray */ "./resources/js/mixins/sortArray.js");


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


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'selectionTeamsTable',
  mixins: [_mixins_sortArray__WEBPACK_IMPORTED_MODULE_2__["default"]],
  data: function data() {
    return {
      sortKey: null,
      sortAsc: true,
      selected: [],
      teamsToAdd: [],
      contextTeam: null,
      contextMouseEvent: null,
      authUserIsOwner: false,
      teamsFilteredBySearch: []
    };
  },
  computed: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('workspaces', ['currentWorkspace'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('teams', {
    teams: 'teams',
    getTeamsStatus: 'getTeamsStatus',
    teamsWorkspaceId: 'getWorkspaceFetchedFromId'
  })), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('selections', {
    selection: 'getCurrentSelection',
    getAuthUserHasSelectionEditAccess: 'getAuthUserHasSelectionEditAccess',
    getSelectionTeamsStatus: 'getSelectionTeamsStatus'
  })), {}, {
    readyStatus: function readyStatus() {
      if (this.getTeamsStatus == 'error' || this.getSelectionTeamsStatus == 'error') return 'error';
      if (this.getTeamsStatus == 'loading' || this.getSelectionTeamsStatus == 'loading') return 'loading';
      return 'success';
    },
    userHasEditAccess: function userHasEditAccess() {
      return this.getAuthUserHasSelectionEditAccess(this.selection) || this.authUserIsOwner;
    },
    availableTeams: function availableTeams() {
      var _this = this;

      if (!this.selection.teams) return [];
      var allTeams = this.teams; // Filter the available teams to exclude teams already added

      return allTeams.filter(function (team) {
        return !_this.selection.teams.find(function (x) {
          return x.id == team.id;
        });
      });
    }
  }),
  watch: {// selection
  },
  methods: _objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])('selections', ['addTeamsToSelection', 'removeTeamsFromSelection', 'updateSelection', 'fetchSelection'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])('teams', ['fetchTeamUsers', 'fetchTeams'])), {}, {
    initData: function initData(forceRefresh) {
      // Check if we have any workspace teams, else fetch them
      if (!this.teamsWorkspaceId != this.currentWorkspace.id || this.getTeamsStatus != 'success' && this.getTeamsStatus != 'loading') this.fetchTeams(); // Fetch selection with users and teams

      if (forceRefresh || this.getSelectionTeamsStatus != 'loading' && !this.selection.teams) {
        this.fetchSelection({
          selectionId: this.selection.id,
          addToState: false
        });
      }

      this.authUserIsOwner = this.selection.your_role == 'Owner';
    },
    showTeamContext: function showTeamContext(e) {
      if (!this.userHasEditAccess) return;
      e.preventDefault();
      var contextMenu = this.$refs.contextMenuTeam;
      contextMenu.show(e);
    },
    onAddTeam: function onAddTeam(e) {
      var contextMenu = this.$refs.contextMenuAddTeams;
      contextMenu.show(e);
    },
    onAddTeamsToSelection: function onAddTeamsToSelection(teams) {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // If it is the first team added to the selection and the selection doesnt already have a currency set
                // -> set the selection currency = the team currency
                if (_this2.selection.teams.length <= 0 && !_this2.selection.currency && !!teams[0].currency) {
                  _this2.selection.currency = teams[0].currency;

                  _this2.updateSelection(_this2.selection);
                } // Add the team to the selection


                _this2.addTeamsToSelection({
                  selection: _this2.selection,
                  teams: teams
                });

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    sortTeams: function sortTeams(method, key) {
      // If if we are already sorting by the given key, flip the sort order
      if (this.sortKey == key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = method;
      }

      var sortAsc = this.sortAsc;
      this.sortArray(this.selection.teams, this.sortAsc, this.sortKey);
    },
    onRemoveTeams: function onRemoveTeams(team) {
      // If we have a selection, loop through the selection and remove those
      // Else, remove the parsed team
      var teamsToRemove;

      if (this.selected.length > 0) {
        teamsToRemove = JSON.parse(JSON.stringify(this.selected));
      } else {
        teamsToRemove = [team];
      }

      this.removeTeamsFromSelection({
        selection: this.selection,
        teams: teamsToRemove
      });
      this.selected = [];
    }
  }),
  created: function created() {
    this.initData();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_sortArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mixins/sortArray */ "./resources/js/mixins/sortArray.js");
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


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'selectionUsersTable',
  mixins: [_mixins_sortArray__WEBPACK_IMPORTED_MODULE_1__["default"]],
  data: function data() {
    return {
      sortKey: null,
      selected: [],
      usersToAdd: [],
      userToEdit: null,
      contextUser: null,
      contextMouseEvent: null,
      currentUsersTableTab: 'Members',
      authUserIsOwner: false,
      usersFilteredBySearch: []
    };
  },
  computed: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('selections', {
    selection: 'getCurrentSelection',
    getAuthUserHasSelectionEditAccess: 'getAuthUserHasSelectionEditAccess',
    getSelectionUsersStatus: 'getSelectionUsersStatus',
    availableSelectionRoles: 'availableSelectionRoles',
    availableSelectionJobs: 'getAvailableSelectionJobs'
  })), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('auth', ['authUser'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('workspaces', ['authUserWorkspaceRole', 'currentWorkspace'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('users', {
    workspaceUsers: 'users',
    getUsersStatus: 'getUsersStatus',
    usersWorkspaceId: 'getWorkspaceFetchedFromId'
  })), {}, {
    readyStatus: function readyStatus() {
      if (this.getUsersStatus == 'error' || this.getSelectionUsersStatus == 'error') return 'error';
      if (this.getUsersStatus == 'loading' || this.getSelectionUsersStatus == 'loading') return 'loading';
      return 'success';
    },
    userHasEditAccess: function userHasEditAccess() {
      return this.getAuthUserHasSelectionEditAccess(this.selection) || this.authUserIsOwner;
    },
    filteredAvailableSelectionJobs: function filteredAvailableSelectionJobs() {
      var _this = this;

      return this.availableSelectionJobs.filter(function (x) {
        return _this.selection.type != 'Master' ? x.role != 'Approver' : true;
      });
    },
    availableUsers: function availableUsers() {
      var _this2 = this;

      if (!this.selection.users || !this.workspaceUsers) return []; // Users who are on the workspace and not on the team

      var allUsers = JSON.parse(JSON.stringify(this.workspaceUsers));
      return allUsers.filter(function (user) {
        return !_this2.selection.users.find(function (x) {
          return x.id == user.id;
        });
      }).sort(function (a, b) {
        if (a.id == _this2.authUser.id) return -1;
      });
    }
  }),
  methods: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('selections', ['addUsersToSelection', 'updateSelectionUsers', 'removeUsersFromSelection', 'reAddUsersToSelection', 'fetchSelection', 'sendLinkToSelectionUsers'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('users', ['fetchUsers'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapMutations"])('selections', ['UPDATE_SELECTION'])), {}, {
    initData: function initData(forceRefresh) {
      // Check if we have any workspace teams, else fetch them
      if (!this.usersWorkspaceId != this.currentWorkspace.id || this.getUsersStatus != 'success' && this.getUsersStatus != 'loading') this.fetchUsers(); // Fetch selection with users and teams

      if (forceRefresh || this.getSelectionUsersStatus != 'loading' && !this.selection.users) {
        this.fetchSelection({
          selectionId: this.selection.id,
          addToState: false
        });
      }

      this.authUserIsOwner = this.selection.your_role == 'Owner';
    },
    showUserContext: function showUserContext(e) {
      if (this.currentUsersTableTab == 'Excluded') {
        this.showExcludedUserContext(e);
        return;
      }

      e.preventDefault();
      var contextMenu = this.$refs.contextMenuUser;
      contextMenu.show(e);
    },
    showExcludedUserContext: function showExcludedUserContext(e) {
      e.preventDefault();
      var contextMenu = this.$refs.contextMenuExcludedUser;
      contextMenu.show(e);
    },
    showRoleContext: function showRoleContext(e, user) {
      var contextMenu = this.$refs.contextMenuRole;
      this.contextUser = user; // this.userToEdit = JSON.parse(JSON.stringify(user))

      this.userToEdit = user;
      contextMenu.show(e);
    },
    showJobContext: function showJobContext(e, user) {
      var contextMenu = this.$refs.contextMenuJob;
      this.contextUser = user; // this.userToEdit = JSON.parse(JSON.stringify(user))

      this.userToEdit = user;
      contextMenu.show(e);
    },
    onAddUser: function onAddUser(e) {
      var contextMenu = this.$refs.contextMenuAddUsers;
      contextMenu.show(e);
    },
    onAddUsersToSelection: function onAddUsersToSelection(usersToAdd) {
      this.addUsersToSelection({
        selection: this.selection,
        users: usersToAdd
      });
    },
    onReAddUsersToSelection: function onReAddUsersToSelection(usersToAdd) {
      // this.reAddUsersToSelection({selection: this.selection, users: usersToAdd})
      this.addUsersToSelection({
        selection: this.selection,
        users: usersToAdd
      });
      this.selected = [];
    },
    onUpdateSelectionUsersRole: function onUpdateSelectionUsersRole() {
      var _this3 = this;

      // Define the user to base the new role to set on
      var baseUser = this.userToEdit; // Check if we have a selection of users
      // If so, set the currency for all the selected users

      var usersToPost;

      if (this.selected.length > 0) {
        usersToPost = this.selected.map(function (user) {
          user.role = baseUser.role;
          return user;
        });
      } else usersToPost = [baseUser]; // Update users


      this.updateSelectionUsers({
        selection: this.selection,
        users: usersToPost
      }); // Loop thorugh the users to post and test if they include the authUser. If they do update our selection role

      var authUser = usersToPost.find(function (x) {
        return x.id == _this3.authUser.id;
      });

      if (authUser) {
        this.selection.your_role = authUser.role;
        if (authUser.role == 'Member') this.selection.your_job = 'Feedback';else if (authUser.role == 'Owner') this.selection.your_job = 'Alignment';else if (authUser.role == 'Approver') this.selection.your_job = 'Approval';else this.selection.your_job == null;
        this.UPDATE_SELECTION(this.selection);
      }
    },
    onUpdateSelectionUsersJob: function onUpdateSelectionUsersJob() {
      var _this4 = this;

      // Define the user to base the new role to set on
      var baseUser = this.userToEdit; // Check if we have a selection of users
      // If so, set the currency for all the selected users

      var usersToPost;

      if (this.selected.length > 0) {
        usersToPost = this.selected.map(function (user) {
          user.job = baseUser.job;
          return user;
        });
      } else usersToPost = [baseUser]; // Update users


      this.updateSelectionUsers({
        selection: this.selection,
        users: usersToPost
      }); // Loop thorugh the users to post and test if they include the authUser. If they do update our selection role

      var authUser = usersToPost.find(function (x) {
        return x.id == _this4.authUser.id;
      });

      if (authUser) {
        this.selection.your_job = authUser.job;
        this.UPDATE_SELECTION(this.selection);
      }
    },
    sortUsers: function sortUsers(method, key) {
      // If if we are already sorting by the given key, flip the sort order
      this.sortKey = key;
      this.sortArray(this.usersFilteredBySearch, method, key);
    },
    onRemoveUsers: function onRemoveUsers(user) {
      // If we have a selection, loop through the selection and remove those
      // Else, remove the parsed user
      var usersToRemove;

      if (this.selected.length > 0) {
        usersToRemove = JSON.parse(JSON.stringify(this.selected));
      } else {
        usersToRemove = [user];
      }

      this.removeUsersFromSelection({
        selection: this.selection,
        users: usersToRemove
      });
      this.selected = [];
    },
    onSendSelectionLink: function onSendSelectionLink(users) {
      // Filter out users whose role is not Member
      var usersFiltered = users.filter(function (x) {
        return x.role == 'Member' && !x.selectionLinkSent;
      });
      this.sendLinkToSelectionUsers({
        selection: this.selection,
        users: usersFiltered
      });
    }
  }),
  created: function created() {
    this.initData();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _SelectionUsersTable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectionUsersTable */ "./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue");
/* harmony import */ var _SelectionTeamsTable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SelectionTeamsTable */ "./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue");
//
//
//
//
//
//
//
//
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
  name: 'selectionUsersFlyin',
  components: {
    SelectionUsersTable: _SelectionUsersTable__WEBPACK_IMPORTED_MODULE_1__["default"],
    SelectionTeamsTable: _SelectionTeamsTable__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  props: ['show', 'selection']
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileEditorsTable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileEditorsTable */ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue");
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'fileEditorsFlyin',
  components: {
    FileEditorsTable: _FileEditorsTable__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  props: ['show', 'selection', 'file']
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _FileEditorsTableRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileEditorsTableRow */ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue");
/* harmony import */ var _mixins_sortArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../mixins/sortArray */ "./resources/js/mixins/sortArray.js");
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



/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'fileEditorsTable',
  components: {
    FileEditorsTableRow: _FileEditorsTableRow__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  mixins: [_mixins_sortArray__WEBPACK_IMPORTED_MODULE_2__["default"]],
  props: ['file'],
  data: function data() {
    return {
      sortKey: null,
      sortAsc: true,
      selectedUsers: [],
      contextItem: null,
      contextMouseEvent: null,
      usersFilteredBySearch: null,
      usersToAdd: []
    };
  },
  computed: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('users', ['users', 'getUsersStatus'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('auth', ['authUser'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('workspaces', ['authUserWorkspaceRole'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('files', ['getFileUsersStatus'])), {}, {
    readyStatus: function readyStatus() {
      if (this.getUsersStatus == 'error' || this.getFileUsersStatus == 'error') return 'error';
      if (this.getUsersStatus == 'loading' || this.getFileUsersStatus == 'loading') return 'loading';
      return 'success';
    },
    availableUsers: function availableUsers() {
      var _this = this;

      if (!this.file.users || !this.users) return []; // Users who are on the workspace and not on the team

      var allUsers = JSON.parse(JSON.stringify(this.users));
      return allUsers.filter(function (workspaceUser) {
        return !_this.file.users.find(function (fileUser) {
          return fileUser.id == workspaceUser.id;
        });
      }).sort(function (a, b) {
        if (a.id == _this.authUser.id) return -1;
      });
    }
  }),
  methods: _objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('files', ['removeUsersFromFile', 'addUsersToFile', 'fetchFileUsers'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('users', ['fetchUsers'])), {}, {
    initData: function initData(forceRefresh) {
      if (forceRefresh || this.file.users == null) {
        // Check if we have any workspace users, else fetch them
        if (this.getUsersStatus != 'success' && this.getUsersStatus != 'loading') this.fetchUsers(); // Fetch selection with users and teams

        if (forceRefresh || this.getFileUsersStatus != 'loading' && !this.file.users) {
          this.fetchFileUsers(this.file);
        }
      }
    },
    onAddUser: function onAddUser(e) {
      var contextMenu = this.$refs.contextMenuAddUsers;
      contextMenu.show(e);
    },
    onRemoveUsersFromFile: function onRemoveUsersFromFile(users) {
      this.removeUsersFromFile({
        users: JSON.parse(JSON.stringify(this.selectedUsers)),
        team: this.team
      });
      this.selectedUsers = [];
    },
    sortUsers: function sortUsers(method, key) {
      // If if we are already sorting by the given key, flip the sort order
      if (this.sortKey == key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = method;
      }

      var sortAsc = this.sortAsc;
      this.sortArray(this.team.users, this.sortAsc, this.sortKey);
    }
  }),
  created: function created() {
    this.initData();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************/
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

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'fileEditorsTableRow',
  props: ['user', 'file', 'selectedUsers'],
  computed: {
    localSelectedUsers: {
      get: function get() {
        return this.selectedUsers;
      },
      set: function set(localSelectedUsers) {
        this.$emit('input', localSelectedUsers);
      }
    }
  },
  methods: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('files', ['removeUsersFromFile']))
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _SelectionsTableRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SelectionsTableRow */ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue");
/* harmony import */ var _mixins_sortArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../mixins/sortArray */ "./resources/js/mixins/sortArray.js");


function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'selectionsTable',
  components: {
    SelectionsTableRow: _SelectionsTableRow__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  mixins: [_mixins_sortArray__WEBPACK_IMPORTED_MODULE_3__["default"]],
  data: function data() {
    return {
      fileSelectionMagicLinkSent: false,
      selectedSelections: [],
      sortKey: null,
      selectionToEdit: null,
      contextSelection: null,
      contextSelectionComponent: null,
      contextSelectionParent: null,
      contextMouseEvent: null,
      moveSelectionActive: false,
      selectionToMove: null,
      selectionToMoveParent: null,
      fileToClone: null,
      loadingSelectionSettings: false,
      contextSelectionOption: null,
      contextSelectionSettings: null,
      contextSelectionSettingsKey: null,
      selectionToCloneSettingsFrom: null,
      parentLevelOptions: [{
        value: 'Ancestors',
        label: 'All'
      }, {
        value: 'Parent',
        label: 'Parent'
      }, {
        value: 'None',
        label: 'None'
      }],
      childLevelOptions: [{
        value: 'Descendants',
        label: 'All'
      }, {
        value: 'Children',
        label: 'Children'
      }, {
        value: 'None',
        label: 'None'
      }],
      displayLevelOptions: [{
        value: 'Member',
        label: 'Everyone'
      }, {
        value: 'Owner',
        label: 'Owners'
      }],
      displayAuthorOptions: [{
        value: 'Member',
        label: 'Everyone'
      }, {
        value: 'Owner',
        label: 'Owners'
      }, {
        value: 'None',
        label: 'No one'
      }],
      ticketLevelOptions: [{
        value: 'Multiple',
        label: 'Multiple'
      }, {
        value: 'Single',
        label: 'Single'
      }, {
        value: 'None',
        label: 'None'
      }],
      cloningSetup: false,
      settingsSelections: []
    };
  },
  computed: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('persist', ['availableCurrencies'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('files', ['currentFile', 'files', 'allFiles', 'getCurrentFileChanged'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('workspaces', ['authUserWorkspaceRole'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('selections', ['getAuthUserHasSelectionEditAccess', 'selections', 'getSelectionsTree', 'getSelectionsStatus', 'getSelections'])), {}, {
    allSelections: function allSelections() {
      return this.selections;
    },
    readyStatus: function readyStatus() {
      if (this.getSelectionsStatus == 'error') return 'error';
      if (this.getSelectionsStatus == 'loading' || this.cloningSetup) return 'loading';
      return 'success';
    },
    loadingMsg: function loadingMsg() {
      if (this.cloningSetup) return 'Cloning selections';
      return 'Loading selections';
    }
  }),
  watch: {
    currentFile: function currentFile(newVal, oldVal) {
      this.initData(true);
    }
  },
  methods: _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])('selections', ['fetchSelections', 'createSelectionTree', 'insertSelection', 'updateSelection', 'addTeamsToSelection', 'addUsersToSelection', 'fetchSelection', 'fetchSelectionSettings', 'updateSelectionSettings', 'deleteSelection', 'sendSelectionLink'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapMutations"])('selections', ['insertSelections', 'DELETE_SELECTION'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])('files', ['fetchAllFiles', 'cloneFileSelections'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapMutations"])('files', ['SET_CURRENT_FILE_CHANGED'])), {}, {
    initData: function initData(forceRefresh) {
      if (forceRefresh || this.getCurrentFileChanged || this.getSelectionsStatus != 'success' && this.getSelectionsStatus != 'loading') {
        this.fetchSelections({
          fileId: this.currentFile.id
        });
        this.SET_CURRENT_FILE_CHANGED(false);
      }
    },
    onSort: function onSort(sortAsc, sortKey) {
      this.sortKey = sortKey;
      this.sortArray(this.getSelectionsTree, sortAsc, sortKey);
    },
    rowClick: function rowClick(e, component) {
      if (this.moveSelectionActive) {
        e.stopPropagation();
        this.endMoveSelection(component.selection, component);
      }
    },
    showSettingsContext: function showSettingsContext(e, selection) {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var contextMenu;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_this.contextSelection) {
                  _this.contextSelection = selection;
                  Vue.set(_this.contextSelection, selection);
                } else {
                  _this.contextSelection = selection;
                } // Load the selections settings


                _this.loadingSelectionSettings = true;
                _context.next = 4;
                return _this.fetchSelectionSettings(selection);

              case 4:
                _this.loadingSelectionSettings = false;
                contextMenu = _this.$refs.contextMenuOptions; // If the parsed selection is part of the selected selection, edit settings for all of them

                if (_this.selectedSelections.find(function (x) {
                  return x.id == selection.id;
                })) {
                  _this.settingsSelections = _this.selectedSelections;
                } // If the parsed selection is not part of the selected selections, only display settings for that one
                else {
                    _this.settingsSelections = [selection];
                  } // this.contextSelection = selection
                // Position the contextual menu


                _this.$nextTick(function () {
                  contextMenu.show(e);
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    showSelectionCurrencyContext: function showSelectionCurrencyContext(_ref) {
      var _this2 = this;

      var selection = _ref.selection,
          e = _ref.e;
      this.contextSelection = selection;
      this.$nextTick(function () {
        _this2.$refs.contextCurrency.show(e);
      });
    },
    showParentLevelContext: function showParentLevelContext(e, option) {
      this.contextSelectionOption = option;
      this.$refs.contextChildLevel.hide();
      this.$refs.contextDisplayLevel.hide();
      this.$refs.contextAuthorLevel.hide();
      this.$refs.contextTicketLevel.hide();
      this.$refs.contextParentLevel.show(e);
    },
    showChildLevelContext: function showChildLevelContext(e, option) {
      this.contextSelectionOption = option;
      this.$refs.contextParentLevel.hide();
      this.$refs.contextDisplayLevel.hide();
      this.$refs.contextAuthorLevel.hide();
      this.$refs.contextTicketLevel.hide();
      this.$refs.contextChildLevel.show(e);
    },
    showDisplayLevelContext: function showDisplayLevelContext(e, settings, key) {
      this.contextSelectionSettings = settings;
      this.contextSelectionSettingsKey = key;
      this.$refs.contextParentLevel.hide();
      this.$refs.contextChildLevel.hide();
      this.$refs.contextAuthorLevel.hide();
      this.$refs.contextTicketLevel.hide();
      this.$refs.contextDisplayLevel.show(e);
    },
    showDisplayAuthorContext: function showDisplayAuthorContext(e, settings, key) {
      this.contextSelectionSettings = settings;
      this.contextSelectionSettingsKey = key;
      this.$refs.contextParentLevel.hide();
      this.$refs.contextChildLevel.hide();
      this.$refs.contextDisplayLevel.hide();
      this.$refs.contextTicketLevel.hide();
      this.$refs.contextAuthorLevel.show(e);
    },
    showTicketLevelContext: function showTicketLevelContext(e, settings, key) {
      this.contextSelectionSettings = settings;
      this.contextSelectionSettingsKey = key;
      this.$refs.contextParentLevel.hide();
      this.$refs.contextChildLevel.hide();
      this.$refs.contextDisplayLevel.hide();
      this.$refs.contextAuthorLevel.hide();
      this.$refs.contextTicketLevel.show(e);
    },
    onCloneSettings: function onCloneSettings(e) {
      this.$refs.contextCloneSettings.show(e);
    },
    cloneSettings: function cloneSettings() {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
        var settingsToClone;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this3.fetchSelectionSettings(_this3.selectionToCloneSettingsFrom);

              case 2:
                settingsToClone = _context2.sent;

                // Set the settings on the context selection
                _this3.$set(_this3.contextSelection, 'settings', settingsToClone);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    onSaveSelectionSettings: function onSaveSelectionSettings() {
      var _this4 = this;

      // Send API request to update the selections settings.
      if (this.settingsSelections.length > 1) {
        this.settingsSelections.map(function (selection) {
          // Set the selection settings of this selection to a copy of the context selection's
          // Use Vue.set to instantiate 'settings' as a reactive property on the selection
          Vue.set(selection, 'settings', JSON.parse(JSON.stringify(_this4.contextSelection.settings)));

          _this4.updateSelectionSettings(selection);
        });
      } else {
        this.updateSelectionSettings(this.contextSelection);
      }
    },
    showContextMenuSelection: function showContextMenuSelection(e, selection, component, parent) {
      if (!this.getAuthUserHasSelectionEditAccess(selection)) return;
      e.preventDefault(); // Set the current context menu item

      if (this.selectedSelections.length > 0) {
        this.contextSelection = this.selectedSelections[0];
      } else {
        this.contextSelection = selection;
      }

      this.contextSelectionComponent = component;
      this.contextSelectionParent = parent; // Save a reference to the clicked element

      this.contextMouseEvent = e; // Show the move context instead if we are in the proces of moving something

      if (this.moveSelectionActive) {
        this.showContextMenuMove(e);
      } else {
        var selectionContext = this.$refs.contextMenuSelection;

        if (this.selectedSelections.length > 1) {
          selectionContext = this.$refs.contextMenuSelectedSelections;
        } // Position the contextual menu


        selectionContext.show(e);
      }
    },
    onMoveSelection: function onMoveSelection(selection, parent) {
      this.selectionToMove = selection;
      this.selectionToMoveParent = parent;
      this.moveSelectionActive = true; // Add event listener to listen for mousemove

      document.addEventListener('mousemove', this.moveSelectionMouseFollowHandler); // Call the event handler to set the initial position

      this.moveSelectionMouseFollowHandler(this.contextMouseEvent); // Add event listener to listen for right clicks to show a special context menu

      document.addEventListener('contextmenu', this.moveSelectionClickHandler);
    },
    endMoveSelection: function endMoveSelection(selection, component) {
      var _this5 = this;

      if (this.moveSelectionActive) {
        // Add the selection to the selected selection
        selection.children.push(this.selectionToMove); // Remove the selection from it's old position

        var parent = this.selectionToMoveParent;

        if (parent) {
          var index = parent.children.findIndex(function (x) {
            return x.id == _this5.selectionToMove.id;
          });
          parent.children.splice(index, 1);
        } else {
          var _index = this.getSelectionsTree.findIndex(function (x) {
            return x.id == _this5.selectionToMove.id;
          });

          this.getSelectionsTree.splice(_index, 1);
        } // Expand the component


        component.childrenExpanded = true; // Remove event listener to listen for mousemove

        document.removeEventListener('mousemove', this.moveSelectionMouseFollowHandler); // Remove event listener to listen for right clicks to show a special context menu

        document.removeEventListener('contextmenu', this.moveSelectionClickHandler); // --- Send request to API --- //
        // Reset the selection to move

        this.clearMoveSelection();
      }
    },
    clearMoveSelection: function clearMoveSelection() {
      // Reset the selection to move
      this.selectionToMove = null;
      this.selectionToMoveParent = null;
      this.moveSelectionActive = false;
    },
    moveSelectionMouseFollowHandler: function moveSelectionMouseFollowHandler(e) {
      var el = this.$refs.moveSelectionIndicator;
      el.style.left = "".concat(e.clientX + 20, "px");
      el.style.top = "".concat(e.clientY, "px");
    },
    moveSelectionClickHandler: function moveSelectionClickHandler(e) {
      this.contextSelection = null;
      this.contextSelectionParent = null;
      this.contextSelectionComponent = null;
      this.showContextMenuMove(e);
    },
    showContextMenuMove: function showContextMenuMove(e) {
      e.preventDefault();
      e.stopPropagation();
      var moveContext = this.$refs.contextMenuMove;
      this.contextMouseEvent = e; // Position the contextual menu

      moveContext.show(e);
    },
    onNewSelection: function onNewSelection(_ref2) {
      var _this6 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3() {
        var parent, type, newSelection;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                parent = _ref2.parent, type = _ref2.type;

                if (!_this6.getSelectionsTree.find(function (x) {
                  return x.id == null;
                })) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                // Else instantiate a new master object in the table
                newSelection = {
                  id: null,
                  file_id: _this6.currentFile.id,
                  name: '',
                  type: type,
                  currency: null,
                  user_count: 0,
                  team_count: 0,
                  children: [],
                  visible_from: null,
                  visible_to: null,
                  open_from: null,
                  open_to: null,
                  completed_at: null,
                  your_role: null,
                  is_presenting: null,
                  budget: 0,
                  budget_spend: 0
                }; // Push new selection to the parent

                if (parent) {
                  // If we are creating a sbu selection
                  newSelection.name = 'New Sub Selection';
                  newSelection.parent_id = parent.id;
                  newSelection.is_presenting = parent.is_presenting; // Instantiate a children array on the parent

                  if (!parent.children) {
                    _this6.$set(parent, 'children', []);
                  } // parent.children.push(newSelection)


                  _this6.insertSelections({
                    selections: [newSelection],
                    method: 'add'
                  }); // Expand the selection the new selection is added to
                  // Loop through the children to find the selectionrow in question


                  _this6.contextSelectionComponent.childrenExpanded = true;
                } else {
                  // If no parent, we are creating a new master
                  newSelection.name = 'New Master Selection';
                  newSelection.parent_id = 0; // this.selections.push(newSelection)

                  _this6.insertSelections({
                    selections: [newSelection],
                    method: 'add'
                  });
                } // Wait for changes to the dom to take effect


                _this6.$nextTick(function () {
                  // Activate title edit of new folder
                  _this6.selectionToEdit = {
                    selection: newSelection,
                    field: 'name'
                  };
                });

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    onDeleteSelection: function onDeleteSelection(selection) {
      var _this7 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4() {
        var i, selectionToDelete;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _this7.$refs.deleteSelectionDialog.confirm();

              case 2:
                if (!_context4.sent) {
                  _context4.next = 4;
                  break;
                }

                // If we have a selection, delete all those selections
                if (_this7.selectedSelections.length > 1) {
                  for (i = _this7.selectedSelections.length - 1; i >= 0; i--) {
                    selectionToDelete = _this7.selectedSelections[i];

                    _this7.deleteSelection(selectionToDelete);
                  } // Reset the selected selections


                  _this7.selectedSelections = [];
                } // If we don't have a selection just delete the provided selection 
                else {
                    _this7.deleteSelection(selection);
                  }

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    clearToEdit: function clearToEdit() {
      // Clear the current edit
      this.selectionToEdit = null;
    },
    clearUnsaved: function clearUnsaved(_ref3) {
      var selection = _ref3.selection,
          parent = _ref3.parent;

      // Check if the selection is saved
      if (!selection.id) {
        this.DELETE_SELECTION(selection);
      }
    },
    onShowCloneSetupContext: function onShowCloneSetupContext(e) {
      var _this8 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5() {
        var contextMenu;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _this8.fetchAllFiles();

              case 2:
                // }
                contextMenu = _this8.$refs.contextMenuCloneSetup;
                contextMenu.show(e);

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    onClone: function onClone(file) {
      var _this9 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee6() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _this9.cloningSetup = true;
                _context6.next = 3;
                return _this9.cloneFileSelections({
                  destination: _this9.currentFile,
                  from: file
                });

              case 3:
                _this9.cloningSetup = false; // Force refresh the data, to fetch the cloned selections

                _this9.initData(true); // Clone selections and their users to the new file
                // Fetch file selections
                // const selections = await this.fetchSelections({fileId: file.id, addToState: false})
                // // We have to copy the selection structure as well
                // // This means we have to insert one level of selections at a time
                // // Transform the selections into a tree structure 
                // const selectionTree = await this.createSelectionTree(selections)
                // // Loop through all selections and upload them
                // for (const rootSelection of selectionTree) {
                //     await this.cloneSelectionTree(rootSelection)
                // }
                // // Update the settings of all the newly created selection to sync relationsships
                // const newSelectionTree = this.getSelectionsTree
                // console.log('end for. New selections:', newSelectionTree)
                // for (const rootSelection of newSelectionTree) {
                //     this.syncSelectionTreeSettings(rootSelection)
                // }


              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }))();
    },
    cloneSelectionTree: function cloneSelectionTree(selection) {
      var _this10 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee7() {
        var newSelection, selectionWithTeamsAndUsers, _iterator, _step, childSelection;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                // Recursive function that calls itself for all children of a selection until there are no more children
                // Make a clone of the selection to upload
                newSelection = JSON.parse(JSON.stringify(selection)); // Fetch the selection with its teams and users so we can add them to the clone

                _context7.next = 3;
                return _this10.fetchSelection({
                  selectionId: selection.id,
                  addToState: false
                });

              case 3:
                selectionWithTeamsAndUsers = _context7.sent;
                // Set the selection ID to null, so we create a new selection
                newSelection.id = null;
                _context7.next = 7;
                return _this10.insertSelection({
                  file: _this10.currentFile,
                  selection: newSelection
                });

              case 7:
                _context7.next = 9;
                return _this10.fetchSelectionSettings(selection);

              case 9:
                // Save selection settings to the new selection
                newSelection.settings = selection.settings; // this.updateSelectionSettings(newSelection)
                // Upload the fetched users and teams to our new selection

                if (selectionWithTeamsAndUsers.users.length > 0) _this10.addUsersToSelection({
                  selection: newSelection,
                  users: selectionWithTeamsAndUsers.users,
                  ignoreRole: false
                }); // Add denied users

                _this10.addUsersToSelection({
                  selection: newSelection,
                  users: selectionWithTeamsAndUsers.denied_users.map(function (user) {
                    user.role = 'Denied';
                    return user;
                  }),
                  ignoreRole: false
                });

                if (selectionWithTeamsAndUsers.teams.length > 0) _this10.addTeamsToSelection({
                  selection: newSelection,
                  teams: selectionWithTeamsAndUsers.teams
                }); // Loop through the selections children and repeat

                _iterator = _createForOfIteratorHelper(selection.children);
                _context7.prev = 14;

                _iterator.s();

              case 16:
                if ((_step = _iterator.n()).done) {
                  _context7.next = 23;
                  break;
                }

                childSelection = _step.value;
                // Set the parent id
                childSelection.parent_id = newSelection.id;
                _context7.next = 21;
                return _this10.cloneSelectionTree(childSelection);

              case 21:
                _context7.next = 16;
                break;

              case 23:
                _context7.next = 28;
                break;

              case 25:
                _context7.prev = 25;
                _context7.t0 = _context7["catch"](14);

                _iterator.e(_context7.t0);

              case 28:
                _context7.prev = 28;

                _iterator.f();

                return _context7.finish(28);

              case 31:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[14, 25, 28, 31]]);
      }))();
    },
    syncSelectionTreeSettings: function syncSelectionTreeSettings(selection) {
      // Update the selections settings and loop through its tree and do the same
      this.updateSelectionSettings(selection);

      var _iterator2 = _createForOfIteratorHelper(selection.children),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var childSelection = _step2.value;
          this.syncSelectionTreeSettings(childSelection);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    },
    onSendSelectionLink: function onSendSelectionLink(selection) {
      var selectionsToPost = [selection];
      this.sendSelectionLink({
        selectionList: selectionsToPost
      });
      Vue.set(selection, 'selectionLinkSent', true);
    },
    onToggleAllSelectionsLocked: function onToggleAllSelectionsLocked(selections) {
      var _this11 = this;

      var makeLocked = null;
      selections.map(function (selection) {
        if (selection.is_presenting) return;
        var hasChange = false;
        if (makeLocked == null) makeLocked = selection.is_open; // Check if the selection is locked

        if (makeLocked && !selection.is_open) return;
        if (!makeLocked && selection.is_open) return;

        if (makeLocked) {
          selection.open_from = new Date("9999");
          selection.open_to = null;
          hasChange = true;
        } else {
          selection.open_from = null;
          selection.open_to = null;
          hasChange = true;
        }

        if (hasChange) _this11.updateSelection(selection);
      });
    },
    onToggleAllSelectionsVisibility: function onToggleAllSelectionsVisibility(selections) {
      var _this12 = this;

      // Use the first selection to determine if we are opening or closing all
      var makeHidden = null;
      selections.map(function (selection) {
        if (selection.is_presenting) return;
        if (makeHidden == null) makeHidden = selection.is_visible;
        var hasChange = false;
        if (makeHidden && !selection.is_visible) return;
        if (!makeHidden && selection.is_visible) return; // Check if the selection is visible

        if (makeHidden) {
          // Set To to now
          selection.visible_from = new Date("9999");
          selection.visible_to = null;
          hasChange = true;
        } else {
          selection.visible_from = null;
          selection.visible_to = null;
          hasChange = true;
        }

        if (hasChange) _this12.updateSelection(selection);
      });
    },
    onSendMagicLinkToAll: function onSendMagicLinkToAll() {
      this.fileSelectionMagicLinkSent = true;
      this.sendSelectionLink({
        selectionList: this.getSelections
      });
    }
  }),
  created: function created() {
    this.initData();
  },
  destroyed: function destroyed() {
    document.removeEventListener('mousemove', this.moveSelectionMouseFollowHandler);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _SelectionsTableRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectionsTableRow */ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue");
/* harmony import */ var _components_SelectionPresenterModeButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../components/SelectionPresenterModeButton */ "./resources/js/components/SelectionPresenterModeButton.vue");
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



/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'selectionsTableRow',
  components: {
    'selectionsTableRow': _SelectionsTableRow__WEBPACK_IMPORTED_MODULE_1__["default"],
    SelectionPresenterModeButton: _components_SelectionPresenterModeButton__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  props: ['selection', 'depth', 'selectionToEdit', 'parent', 'moveSelectionActive', 'path', 'file', 'selectedSelections'],
  data: function data() {
    return {
      childrenExpanded: true,
      newBudget: 0
    };
  },
  computed: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('selections', ['getAuthUserHasSelectionEditAccess'])), {}, {
    localSelectedSelections: {
      get: function get() {
        return this.selectedSelections;
      },
      set: function set(localSelectedSelections) {
        this.$emit('input', localSelectedSelections);
      }
    },
    isMaster: function isMaster() {
      return this.selection.type == 'Master';
    },
    indent: function indent() {
      var baseIndent = 48;
      var indentAmount = 24;
      return {
        maxWidth: "".concat(this.depth * indentAmount + baseIndent, "px"),
        minWidth: "".concat(this.depth * indentAmount + baseIndent, "px")
      };
    },
    selectionWidth: function selectionWidth() {
      var baseWidth = 300;
      var indentAmount = 24;
      return {
        maxWidth: "".concat(baseWidth - this.depth * indentAmount, "px"),
        minWidth: "".concat(baseWidth - this.depth * indentAmount, "px")
      };
    },
    isHidden: function isHidden() {
      return !this.userHasEditAccess && !this.selection.is_visible;
    },
    selectionDepth: function selectionDepth() {
      // If the selection is not visible to the user, then set the depth equal to the previous depth
      if (this.isHidden) return this.depth;else return this.depth + 1;
    },
    userHasEditAccess: function userHasEditAccess() {
      return this.getAuthUserHasSelectionEditAccess(this.selection);
    },
    budgetSpendPercentage: function budgetSpendPercentage() {
      return (this.selection.budget_spend / this.selection.budget * 100).toFixed(1);
    }
  }),
  methods: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('selections', ['insertSelection', 'updateSelection', 'togglePresenterMode', 'updateSelectionBudget'])), {}, {
    toggleExpanded: function toggleExpanded() {
      this.childrenExpanded = !this.childrenExpanded;
    },
    onShowBudgetInput: function onShowBudgetInput() {
      var _this = this;

      this.newBudget = this.selection.budget;
      setTimeout(function () {
        // For some reason this.$nextTick() doesn't work here
        _this.$refs.budgetInput.focus();
      }, 100);
    },
    onGoToSelection: function onGoToSelection() {
      if (!this.moveSelectionActive) {
        this.$router.push({
          name: 'selection',
          params: {
            fileId: this.selection.file_id,
            selectionId: this.selection.id
          }
        });
      }
    },
    onClick: function onClick(e) {
      if (this.path.length <= 1) {
        this.$emit('onClick', e, this);
      }

      this.$emit('emitOnClick', e, this);
    },
    emitOnClick: function emitOnClick(e, component) {
      if (this.path.length <= 1) {
        this.$emit('onClick', e, component);
      }

      this.$emit('emitOnClick', e, component);
    },
    emitShowContext: function emitShowContext(mouseEvent) {
      this.$emit('showContext', mouseEvent, this.selection, this, this.parent);
    },
    emitEmissionShowContext: function emitEmissionShowContext(mouseEvent, selection, component, parent) {
      // This is the event that goes to the selectionsTable component
      this.$emit('showContext', mouseEvent, selection, component, parent);
    },
    onToggleLocked: function onToggleLocked(selection) {
      // Check if the selection is locked
      if (selection.is_open) {
        selection.open_from = new Date("9999"); // Set To to now

        selection.open_to = null;
      } else {
        selection.open_from = null;
        selection.open_to = null;
      }

      this.updateSelection(selection);
    },
    onToggleHidden: function onToggleHidden(selection) {
      // Check if the selection is visible
      if (selection.is_visible) {
        // Set To to now
        selection.visible_from = new Date("9999");
        selection.visible_to = null;
      } else {
        selection.visible_from = null;
        selection.visible_to = null;
      }

      this.updateSelection(selection);
    },
    onUpdateSelection: function onUpdateSelection(selection) {
      // Check if we are inserting or updating
      if (!selection.id) {
        this.insertSelection({
          file: this.file,
          selection: selection,
          addToState: false
        });
      } else {
        this.updateSelection(selection);
      }
    },
    onUpdateBudget: function onUpdateBudget(selection) {
      selection.budget = this.newBudget;
      this.updateSelectionBudget(selection);
      this.newBudget = 0;
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _SelectionsTable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectionsTable */ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue");
/* harmony import */ var _FileEditorsFlyin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FileEditorsFlyin */ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue");
/* harmony import */ var _components_SelectionUsersFlyin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../components/SelectionUsersFlyin */ "./resources/js/components/SelectionUsersFlyin/index.vue");
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




/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'fileFlyin',
  props: ['file', 'show'],
  components: {
    SelectionsTable: _SelectionsTable__WEBPACK_IMPORTED_MODULE_1__["default"],
    SelectionUsersFlyin: _components_SelectionUsersFlyin__WEBPACK_IMPORTED_MODULE_3__["default"],
    FileEditorsFlyin: _FileEditorsFlyin__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: function data() {
    return {
      showFileEditorsFlyin: false
    };
  },
  // watch: {
  //     currentFile(newVal) {
  //         console.log('new file', newVal)
  //     }
  // },
  computed: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('files', ['nextFile', 'prevFile', 'currentFile'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('selections', ['selectionsStatus', 'currentSelection', 'getSelectionUsersFlyinIsVisible', 'getSelections'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('workspaces', ['authUserWorkspaceRole'])), {}, {
    SelectionUsersFlyinVisible: {
      get: function get() {
        return this.getSelectionUsersFlyinIsVisible;
      },
      set: function set(value) {
        this.SET_SELECTION_USERS_FLYIN_VISIBLE(value);
      }
    }
  }),
  methods: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('selections', ['updateSelection'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapMutations"])('files', ['SET_CURRENT_FILE'])), Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapMutations"])('selections', ['SET_CURRENT_SELECTIONS', 'SET_SELECTION_USERS_FLYIN_VISIBLE'])), {}, {
    showSelectionUsersFlyin: function showSelectionUsersFlyin(selection) {
      this.SET_CURRENT_SELECTIONS([selection]);
      this.SelectionUsersFlyinVisible = true;
    },
    showEditorsFlyin: function showEditorsFlyin() {
      this.showFileEditorsFlyin = true;
    },
    showNext: function showNext() {
      if (this.nextFile) this.SET_CURRENT_FILE(this.nextFile);
    },
    showPrev: function showPrev() {
      if (this.prevFile) this.SET_CURRENT_FILE(this.prevFile);
    },
    goToEditSingle: function goToEditSingle() {
      this.$router.push({
        name: 'editFile',
        params: {
          fileId: this.file.id
        }
      });
    },
    onToggleAllSelectionsLocked: function onToggleAllSelectionsLocked(selections) {
      var _this = this;

      var makeLocked = null;
      selections.map(function (selection) {
        if (selection.is_presenting) return;
        var hasChange = false;
        if (makeLocked == null) makeLocked = selection.is_open; // Check if the selection is locked

        if (makeLocked && !selection.is_open) return;
        if (!makeLocked && selection.is_open) return;

        if (makeLocked) {
          selection.open_from = new Date("9999");
          selection.open_to = null;
          hasChange = true;
        } else {
          selection.open_from = null;
          selection.open_to = null;
          hasChange = true;
        }

        if (hasChange) _this.updateSelection(selection);
      });
    },
    onToggleAllSelectionsVisibility: function onToggleAllSelectionsVisibility(selections) {
      var _this2 = this;

      // Use the first selection to determine if we are opening or closing all
      var makeHidden = null;
      selections.map(function (selection) {
        if (selection.is_presenting) return;
        if (makeHidden == null) makeHidden = selection.is_visible;
        var hasChange = false;
        if (makeHidden && !selection.is_visible) return;
        if (!makeHidden && selection.is_visible) return; // Check if the selection is visible

        if (makeHidden) {
          // Set To to now
          selection.visible_from = new Date("9999");
          selection.visible_to = null;
          hasChange = true;
        } else {
          selection.visible_from = null;
          selection.visible_to = null;
          hasChange = true;
        }

        if (hasChange) _this2.updateSelection(selection);
      });
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vuedraggable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuedraggable */ "./node_modules/vuedraggable/dist/vuedraggable.common.js");
/* harmony import */ var vuedraggable__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vuedraggable__WEBPACK_IMPORTED_MODULE_1__);
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
  name: 'fileTableRow',
  components: {
    Draggable: vuedraggable__WEBPACK_IMPORTED_MODULE_1___default.a
  },
  props: ['file', 'fileToEdit', 'dragActive'],
  methods: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('files', ['insertOrUpdateFile'])), {}, {
    onCancelEdit: function onCancelEdit() {
      this.$emit('update:fileToEdit', {});
    },
    onShowSingleFile: function onShowSingleFile() {
      this.$emit('show-single-file', this.file);
    },
    onSubmitEdit: function onSubmitEdit() {
      this.insertOrUpdateFile({
        file: this.fileToEdit,
        addToState: false
      });
      this.$emit('update:fileToEdit', {});
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _FilesTable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FilesTable */ "./resources/js/pages/FilesPage/FilesTable.vue");
/* harmony import */ var _FileFlyin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FileFlyin */ "./resources/js/pages/FilesPage/FileFlyin/index.vue");
/* harmony import */ var _components_FileOwnersFlyin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/FileOwnersFlyin */ "./resources/js/components/FileOwnersFlyin/index.vue");
/* harmony import */ var _components_FileApproversFlyin__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/FileApproversFlyin */ "./resources/js/components/FileApproversFlyin/index.vue");
/* harmony import */ var _components_common_Breadcrumbs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/common/Breadcrumbs */ "./resources/js/components/common/Breadcrumbs.vue");


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






/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'filesPage',
  components: {
    FilesTable: _FilesTable__WEBPACK_IMPORTED_MODULE_2__["default"],
    FileFlyin: _FileFlyin__WEBPACK_IMPORTED_MODULE_3__["default"],
    FileOwnersFlyin: _components_FileOwnersFlyin__WEBPACK_IMPORTED_MODULE_4__["default"],
    FileApproversFlyin: _components_FileApproversFlyin__WEBPACK_IMPORTED_MODULE_5__["default"],
    Breadcrumbs: _components_common_Breadcrumbs__WEBPACK_IMPORTED_MODULE_6__["default"]
  },
  data: function data() {
    return {
      fileOwnersFlyinVisible: false,
      fileApproversFlyinVisible: false
    };
  },
  computed: _objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('files', ['files', 'currentFile', 'currentFolder', 'currentFolderId', 'getCurrentFilePath', 'getFileFlyinIsVisible'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('workspaces', ['currentWorkspace', 'authUserWorkspaceRole'])),
  methods: _objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])('files', ['setCurrentFolder', 'fetchFile', 'fetchFolder'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapMutations"])('files', ['SET_CURRENT_FILE', 'SET_FILE_FLYIN_VISIBLE'])), {}, {
    showSingleFile: function showSingleFile(file) {
      // Set the current file id
      this.SET_CURRENT_FILE(file); // Show the flyin

      this.SET_FILE_FLYIN_VISIBLE(true);
    },
    showFileOwnersFlyin: function showFileOwnersFlyin(file) {
      // Set the current file id
      this.SET_CURRENT_FILE(file);
      this.fileOwnersFlyinVisible = true;
    },
    showFileApproversFlyin: function showFileApproversFlyin(file) {
      // Set the current file id
      this.SET_CURRENT_FILE(file);
      this.fileApproversFlyinVisible = true;
    },
    onSetCurrentFolder: function onSetCurrentFolder(folder) {
      this.setCurrentFolder(folder);
    }
  }),
  created: function created() {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
      var routeFileId, file, routeFolderId, folder;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // If the route has a fileId param set, then show that file in a flyin and set the current folder to the files parent
              routeFileId = _this.$route.params.fileId;

              if (!routeFileId) {
                _context.next = 10;
                break;
              }

              if (!(!_this.currentFile || _this.currentFile.id != routeFileId)) {
                _context.next = 8;
                break;
              }

              _context.next = 5;
              return _this.fetchFile(routeFileId);

            case 5:
              file = _context.sent;
              _context.next = 9;
              break;

            case 8:
              file = _this.currentFile;

            case 9:
              // Show the file flyin
              _this.showSingleFile(file);

            case 10:
              routeFolderId = _this.$route.params.folderId;

              if (!(routeFolderId && routeFolderId != 0)) {
                _context.next = 16;
                break;
              }

              _context.next = 14;
              return _this.fetchFolder(routeFolderId);

            case 14:
              folder = _context.sent;

              _this.setCurrentFolder(folder);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _mixins_sortArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mixins/sortArray */ "./resources/js/mixins/sortArray.js");
/* harmony import */ var _FileTableRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FileTableRow */ "./resources/js/pages/FilesPage/FileTableRow.vue");
/* harmony import */ var _FolderTableRow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FolderTableRow */ "./resources/js/pages/FilesPage/FolderTableRow.vue");


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
//
//
//
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
  name: 'filesTable',
  props: [],
  components: {
    FolderTableRow: _FolderTableRow__WEBPACK_IMPORTED_MODULE_4__["default"],
    FileTableRow: _FileTableRow__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  mixins: [_mixins_sortArray__WEBPACK_IMPORTED_MODULE_2__["default"]],
  data: function data() {
    return {
      filesFilteredBySearch: [],
      selected: [],
      contextMouseEvent: null,
      sortKey: null,
      showMoveModal: false,
      fileToEdit: null,
      filesToAdd: [],
      uploadingToFile: false,
      contextMenuItem: null,
      filesToMove: [],
      destinationFolder: null,
      destinationFolderContent: [],
      dragActive: false,
      dragHoverId: null
    };
  },
  computed: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('files', ['files', 'getCurrentFolderStatus', 'getCurrentFolder', 'getFilesStatus'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('workspaces', ['currentWorkspace', 'authUserWorkspaceRole'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapGetters"])('tables', ['getFilesTable'])), {}, {
    folder: function folder() {
      return this.getCurrentFolder;
    },
    foldersToShow: function foldersToShow() {
      return this.files.filter(function (x) {
        return x.type == 'Folder';
      });
    },
    filesToShow: function filesToShow() {
      return this.files.filter(function (x) {
        return x.type == 'File';
      });
    },
    readyStatus: function readyStatus() {
      if (this.getCurrentFolderStatus == 'error') return 'error';
      if (this.getCurrentFolderStatus == 'loading') return 'loading';
      return 'success';
    }
  }),
  watch: {
    currentWorkspace: function currentWorkspace(newVal, oldVal) {
      this.initData(true);
    },
    getCurrentFolder: function getCurrentFolder(newVal, oldVal) {
      this.selected = [];
    }
  },
  methods: _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])('files', ['deleteFile', 'uploadToExistingFile', 'deleteMultipleFiles', 'fetchFolder', 'fetchFolderContent', 'fetchFiles', 'moveFiles', 'setCurrentFolder'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])('folders', ['deleteFolder', 'updateFolder'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapMutations"])('tables', ['SET_TABLE_PROPERTY'])), {}, {
    initData: function initData(forceRefresh) {
      if (forceRefresh || this.getCurrentFolderStatus != 'success' && this.getCurrentFolderStatus != 'loading') this.setCurrentFolder(this.getCurrentFolder);
      this.SET_TABLE_PROPERTY('filesTable', 'workspaceId', this.currentWorkspace.id);
    },
    showFileOwnersFlyin: function showFileOwnersFlyin(file) {
      this.$emit('showFileOwnersFlyin', file);
    },
    showContextMenu: function showContextMenu(e) {
      if (this.selected.length > 1) {
        this.showMultiItemContextMenu(e);
        return;
      }

      var folderMenu = this.$refs.contextMenuFolder;
      var fileMenu = this.$refs.contextMenuFile; // Hide any current contextMenus

      if (fileMenu) fileMenu.hide();
      if (folderMenu) folderMenu.hide(); // Save a reference to the contextual menu to show

      var contextMenu;

      if (this.contextMenuItem.type == 'Folder') {
        contextMenu = folderMenu;
      } else {
        contextMenu = fileMenu;
      } // Position the contextual menu


      contextMenu.show(e);
    },
    showSingleFile: function showSingleFile(file) {
      this.$emit('showSingleFile', file);
    },
    onDragStart: function onDragStart(file) {
      this.dragActive = true;
      this.filesToMove = [file];
    },
    onDragEnd: function onDragEnd() {
      var _this = this;

      this.dragActive = false;
      var destinationFolder = this.foldersToShow.find(function (x) {
        return x.id == _this.dragHoverId;
      });
      if (!destinationFolder || destinationFolder.id == this.filesToMove[0].id) return;
      this.moveFiles({
        destinationFolderId: destinationFolder.id,
        filesToMove: this.filesToMove
      });
      this.dragHoverId = null;
    },
    onDragenter: function onDragenter(file) {
      if (this.dragActive == true) {
        this.dragHoverId = file.id;
      }
    },
    onDragLeave: function onDragLeave() {
      if (this.dragActive == true) {
        this.dragHoverId = null;
      }
    },
    onMoveFiles: function onMoveFiles() {
      // If we have a selection then move that, else move the context file
      if (this.selected.length > 0) {
        this.filesToMove = this.selected;
      } else {
        this.filesToMove = [this.contextMenuItem];
      }

      this.destinationFolder = this.folder || {
        id: this.currentWorkspace.id,
        parent_id: null
      };
      this.destinationFolderContent = this.files;
      this.showMoveModal = true;
    },
    setDestinationFolder: function setDestinationFolder(folderId) {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(folderId == 0 || !folderId)) {
                  _context.next = 7;
                  break;
                }

                _this2.destinationFolder = {
                  id: _this2.currentWorkspace.id,
                  parent_id: null
                };
                _context.next = 4;
                return _this2.fetchFiles(false);

              case 4:
                _this2.destinationFolderContent = _context.sent;
                _context.next = 13;
                break;

              case 7:
                _context.next = 9;
                return _this2.fetchFolder(folderId);

              case 9:
                _this2.destinationFolder = _context.sent;
                _context.next = 12;
                return _this2.fetchFolderContent(folderId);

              case 12:
                _this2.destinationFolderContent = _context.sent;

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    submitMoveItem: function submitMoveItem() {
      this.moveFiles({
        destinationFolderId: this.destinationFolder.id,
        filesToMove: this.filesToMove
      });
      this.showMoveModal = false;
      this.selected = [];
    },
    onDeleteFolder: function onDeleteFolder(folder) {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this3.$refs.deleteFolderDialog.confirm();

              case 2:
                if (!_context2.sent) {
                  _context2.next = 5;
                  break;
                }

                _this3.deleteFile(folder); // Remove the item from our selection


                _this3.selected = _this3.selected.filter(function (x) {
                  return x.id != folder.id;
                });

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    onNewFolder: function onNewFolder() {
      // Check if we already have added a new folder
      var existingNewFolder = this.files.find(function (x) {
        return x.id == null && type == 'Folder';
      }); // If we already have a new folder, focus the edit title field

      if (existingNewFolder) {
        this.fileToEdit = existingNewFolder; // Focus the edit field

        this.$refs['editTitleInput-null'][0].setActive();
      } // Else create a new folder
      else {
          var newFolder = {
            id: 0,
            name: 'New folder',
            type: 'Folder',
            parent_id: this.folder ? this.folder.id : 0,
            workspace_id: this.currentWorkspace.id,
            children: [],
            owners: [],
            children_count: 0,
            owner_count: 0
          }; // Push new folder to the current folder

          this.files.push(newFolder); // Activate title edit of new folder

          this.fileToEdit = newFolder;
        }
    },
    onSort: function onSort(sortAsc, sortKey) {
      this.sortKey = sortKey;
      this.sortArray(this.files, sortAsc, sortKey);
    },
    onGoToEditFile: function onGoToEditFile(fileId) {
      this.$router.push({
        name: 'editFile',
        params: {
          fileId: fileId
        }
      });
    },
    onDeleteFile: function onDeleteFile(file) {
      var _this4 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _this4.$refs.deleteFileDialog.confirm();

              case 2:
                if (!_context3.sent) {
                  _context3.next = 5;
                  break;
                }

                _this4.deleteFile(file); // Remove the item from our selection


                _this4.selected = _this4.selected.filter(function (x) {
                  return x.id != file.id;
                });

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    onRenameFile: function onRenameFile(file) {
      this.fileToEdit = file;
    },
    showMultiItemContextMenu: function showMultiItemContextMenu(e) {
      this.$refs.contextMenuMultipleItems.show(e);
    },
    onDeleteMultipleFiles: function onDeleteMultipleFiles(files) {
      var _this5 = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _this5.$refs.deleteMultipleDialog.confirm();

              case 2:
                if (!_context4.sent) {
                  _context4.next = 5;
                  break;
                }

                _this5.deleteMultipleFiles(files);

                _this5.selected = [];

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
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
    var forceRefresh = this.getFilesTable.workspaceId != this.currentWorkspace.id;
    this.initData(forceRefresh);
    document.addEventListener('keydown', this.hotkeyHandler);
  },
  destroyed: function destroyed() {
    document.removeEventListener('keydown', this.hotkeyHandler);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vuedraggable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuedraggable */ "./node_modules/vuedraggable/dist/vuedraggable.common.js");
/* harmony import */ var vuedraggable__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(vuedraggable__WEBPACK_IMPORTED_MODULE_2__);


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


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'baseTableInnerRow',
  components: {
    Draggable: vuedraggable__WEBPACK_IMPORTED_MODULE_2___default.a
  },
  props: ['folder', 'fileToEdit', 'dragActive', 'dragHoverId'],
  methods: _objectSpread(_objectSpread(_objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])('files', ['insertOrUpdateFile', 'removeUnsavedFiles', 'setCurrentFolder'])), Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapMutations"])('files', ['REMOVE_UNSAVED_FILES'])), {}, {
    onCancelEdit: function onCancelEdit() {
      this.REMOVE_UNSAVED_FILES();
      this.$emit('update:fileToEdit', {});
    },
    onSubmitEdit: function onSubmitEdit() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.REMOVE_UNSAVED_FILES();

                _this.insertOrUpdateFile({
                  file: _this.fileToEdit,
                  addToState: !_this.folder.id ? true : false
                });

                _this.$emit('update:fileToEdit', {});

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/index.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/index.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _FilesPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FilesPage */ "./resources/js/pages/FilesPage/FilesPage.vue");
/* harmony import */ var _components_common_PageLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/common/PageLoader */ "./resources/js/components/common/PageLoader.vue");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'filesLoader',
  components: {
    FilesPage: _FilesPage__WEBPACK_IMPORTED_MODULE_1__["default"],
    PageLoader: _components_common_PageLoader__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapGetters"])('workspaces', ['currentWorkspace'])),
  watch: {
    currentWorkspace: function currentWorkspace(newVal, oldVal) {
      this.SET_CURRENT_PATH_FOLDER();
    }
  },
  methods: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapMutations"])('files', ['SET_CURRENT_PATH_FOLDER']))
});

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".user-row.self[data-v-e268aa38] {\n  font-weight: 500;\n}\n.user-row.self .title i[data-v-e268aa38] {\n  color: #2a46ff;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".selections-table[data-v-4340491c]  .flex-table tr:not(.table-top-bar) > * {\n  flex: 0 1 auto;\n}\n.selections-table[data-v-4340491c]  tr > *.locked {\n  min-width: 16px;\n  max-width: 16px;\n  margin: 0;\n}\n.selections-table[data-v-4340491c]  tr > *.locked i {\n  margin: 0;\n}\n.selections-table[data-v-4340491c]  tr > *.expand {\n  min-width: 48px;\n  max-width: 48px;\n}\n.selections-table[data-v-4340491c]  tr > *.title {\n  min-width: 300px;\n  max-width: 300px;\n}\n.selections-table[data-v-4340491c]  tr > *.teams {\n  margin-left: auto;\n}\n.selections-table[data-v-4340491c]  tr > *.budget {\n  min-width: 100px;\n  max-width: 100px;\n  margin-left: auto;\n  text-align: right;\n}\n.selections-table[data-v-4340491c]  tr > *.budget-spend {\n  min-width: 64px;\n  max-width: 64px;\n  text-align: right;\n  padding-right: 8px;\n}\n.selections-table[data-v-4340491c]  tr > *.currency {\n  min-width: 100px;\n  max-width: 100px;\n}\n.selections-table[data-v-4340491c]  tr > *.teams, .selections-table[data-v-4340491c]  tr > *.users {\n  min-width: 76px;\n  max-width: 76px;\n}\n.selections-table[data-v-4340491c]  tr > *.status {\n  min-width: 156px;\n  max-width: 156px;\n  margin-left: auto;\n}\n.selections-table[data-v-4340491c]  tr > *.presentation {\n  min-width: 72px;\n  max-width: 72px;\n  margin-left: auto;\n}\n.selections-table[data-v-4340491c]  tr > *.action {\n  min-width: 112px;\n  max-width: 112px;\n  margin-left: auto;\n}\n.move-selection-indicator[data-v-4340491c] {\n  position: fixed;\n  display: none;\n  background: white;\n  padding: 2px 8px;\n  box-shadow: 0 3px 8px rgba(28, 41, 59, 0.2);\n  font-weight: 700;\n  border-radius: 4px;\n}\n.move-selection-indicator.active[data-v-4340491c] {\n  display: block;\n}\n.setup-wrapper[data-v-4340491c] {\n  height: 400px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  background: white;\n  margin-bottom: 2px;\n}\n.setup-wrapper button[data-v-4340491c] {\n  width: 280px;\n}\n.setup-wrapper > *[data-v-4340491c]:not(:last-child) {\n  margin-bottom: 24px;\n}\n.context-menu.context-options .item-wrapper[data-v-4340491c] {\n  display: block;\n}\n.context-menu.context-options .footer[data-v-4340491c] {\n  display: flex;\n  justify-content: flex-end;\n}\n.context-menu.context-options .footer .input-field[data-v-4340491c] {\n  max-width: 208px;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".selection.is-hidden[data-v-59757838] {\n  display: none;\n}\n.title[data-v-59757838] {\n  display: flex;\n  align-items: center;\n}\n.title i[data-v-59757838] {\n  margin-right: 8px;\n  width: 24px;\n  font-size: 16px;\n}\n.title i[data-v-59757838]:first-child {\n  margin-right: 8px;\n}\n.title i.master[data-v-59757838] {\n  position: relative;\n}\n.title i.master i[data-v-59757838] {\n  position: absolute;\n  left: -3px;\n  bottom: 5px;\n  font-size: 11px;\n  color: #2a46ff;\n  margin: 0;\n  width: auto;\n}\n.title i.master[data-v-59757838]::after {\n  opacity: 1;\n}\n.expand i[data-v-59757838] {\n  font-size: 16px;\n  color: #a8a8a8;\n}\n.expand.active i[data-v-59757838] {\n  transform: rotate(180deg);\n  color: #707070;\n}\n.expand[data-v-59757838]:hover {\n  cursor: pointer;\n}\n.expand:hover i[data-v-59757838] {\n  color: #2a46ff;\n}\n.status[data-v-59757838]  button {\n  min-width: 72px;\n}\n.budget-input-wrapper[data-v-59757838] {\n  position: relative;\n}\n.budget-input-wrapper .currency[data-v-59757838] {\n  position: absolute;\n  right: 8px;\n  bottom: 5px;\n}\n.budget-spend[data-v-59757838] {\n  font-size: 13px;\n  cursor: default;\n}\n.budget-spend[data-v-59757838]:hover {\n  font-weight: 700;\n}\n.budget-spend.over[data-v-59757838] {\n  font-weight: 700;\n  color: #ff395e;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "h1[data-v-4986bbe4] {\n  margin-bottom: 16px;\n}\n.underline[data-v-4986bbe4] {\n  width: 100%;\n  border-bottom: solid 2px #dfdfdf;\n  margin-bottom: 20px;\n}\n.filters[data-v-4986bbe4] {\n  display: flex;\n  justify-content: space-between;\n}\n.item-filter-button[data-v-4986bbe4] {\n  min-width: 120px;\n  background: #dfdfdf;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".sortable-drag[data-v-3ebb98c9] {\n  opacity: 1 !important;\n  z-index: 999;\n  background: white;\n  padding: 8px 16px 8px 8px;\n  border-radius: 4px;\n  border: solid 1px #adc9db;\n  box-shadow: 0 3px 4px 0 rgba(117, 134, 156, 0.1) !important;\n  height: auto !important;\n}\n.sortable-drag span[data-v-3ebb98c9] {\n  width: 100%;\n  overflow: hidden;\n}\n.folders-table[data-v-3ebb98c9] {\n  position: relative;\n}\n.folders-table th.title[data-v-3ebb98c9], .folders-table[data-v-3ebb98c9]  td.title {\n  min-width: 244px;\n  max-width: 244px;\n  display: flex;\n  align-items: center;\n}\n.clickable[data-v-3ebb98c9] {\n  cursor: pointer;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n.show-more[data-v-3ebb98c9] {\n  width: 100%;\n  margin: 16px auto 0;\n  text-align: center;\n  display: inline-block;\n}\n.view-single[data-v-3ebb98c9] {\n  font-size: 12px;\n  font-weight: 700;\n  cursor: pointer;\n}\n.catalogue-totals[data-v-3ebb98c9] {\n  position: absolute;\n  right: 0;\n  top: -40px;\n  height: 40px;\n  line-height: 40px;\n}\n.catalogue-totals span[data-v-3ebb98c9] {\n  font-weight: 500;\n  font-size: 14px;\n  margin-right: 20px;\n}\n.edit-title.hidden[data-v-3ebb98c9] {\n  display: none;\n}\n.file-list p[data-v-3ebb98c9] {\n  position: relative;\n}\n.file-list p:hover .remove[data-v-3ebb98c9] {\n  opacity: 1;\n}\n.file-list .remove[data-v-3ebb98c9] {\n  opacity: 0;\n  transition: 0.3s;\n  margin-left: 4px;\n  cursor: pointer;\n}\n.file-list .remove[data-v-3ebb98c9]:hover {\n  color: #ff395e;\n}\n.move-item-modal .folders-wrapper[data-v-3ebb98c9] {\n  display: block;\n  min-height: 40px;\n  border: solid 1px #f3f3f3;\n  color: #3c3b54;\n  border-radius: 4px;\n  padding: 8px 12px;\n  background: white;\n  width: 100%;\n}\n.move-item-modal .folder[data-v-3ebb98c9]:not(:last-child) {\n  margin-bottom: 8px;\n}\n.move-item-modal .folder:hover i[data-v-3ebb98c9] {\n  color: #43425d;\n}\n.move-item-modal .folder .disabled[data-v-3ebb98c9] {\n  cursor: default;\n}\n.move-item-modal .controls button[data-v-3ebb98c9] {\n  margin-left: 8px;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss&");

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

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--7-2!../../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--7-2!../../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--7-2!../../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--7-2!../../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss&");

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

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss&");

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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=template&id=419eac2c&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=template&id=419eac2c&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "file-approvers-table" },
    [
      _c("BaseFlexTable", {
        scopedSlots: _vm._u([
          {
            key: "topBar",
            fn: function() {
              return [
                _c("BaseTableTopBar", {
                  scopedSlots: _vm._u([
                    {
                      key: "right",
                      fn: function() {
                        return [_c("span", [_vm._v("0 records")])]
                      },
                      proxy: true
                    }
                  ])
                })
              ]
            },
            proxy: true
          },
          {
            key: "header",
            fn: function() {
              return [
                _c(
                  "BaseTableHeader",
                  { staticClass: "select" },
                  [_c("BaseCheckbox")],
                  1
                ),
                _vm._v(" "),
                _c(
                  "BaseTableHeader",
                  {
                    staticClass: "name",
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
                _c("BaseTableHeader", { staticClass: "action" }, [
                  _vm._v("Action")
                ])
              ]
            },
            proxy: true
          },
          {
            key: "body",
            fn: function() {
              return _vm._l(_vm.file.approvers, function(user) {
                return _c(
                  "tr",
                  {
                    key: user.id,
                    ref: "userRow",
                    refInFor: true,
                    staticClass: "user-row table-row",
                    on: {
                      contextmenu: function($event) {
                        $event.preventDefault()
                        return _vm.showUserContext($event, user)
                      }
                    }
                  },
                  [
                    _c(
                      "td",
                      { staticClass: "select" },
                      [_c("BaseCheckbox")],
                      1
                    ),
                    _vm._v(" "),
                    _c("td", { staticClass: "title clickable" }, [
                      _c("i", { staticClass: "fas fa-user" }),
                      _vm._v(" "),
                      _c("span", [_vm._v(_vm._s(user.name))])
                    ]),
                    _vm._v(" "),
                    _c("td", { staticClass: "email" }, [
                      _vm._v(_vm._s(user.email))
                    ]),
                    _vm._v(" "),
                    _c("td", { staticClass: "action" }, [
                      _c(
                        "button",
                        {
                          staticClass: "invisible ghost-hover",
                          on: {
                            click: function($event) {
                              $event.stopPropagation()
                              return _vm.showUserContext($event, user)
                            }
                          }
                        },
                        [_c("i", { staticClass: "far fa-ellipsis-h medium" })]
                      )
                    ])
                  ]
                )
              })
            },
            proxy: true
          },
          {
            key: "footer",
            fn: function() {
              return [
                _c("td", [
                  _c(
                    "button",
                    {
                      staticClass: "primary invisible",
                      on: {
                        click: function($event) {
                          return _vm.onAddUser($event)
                        }
                      }
                    },
                    [
                      _c("i", { staticClass: "far fa-plus" }),
                      _c("span", [_vm._v("Add Approver(s) to File")])
                    ]
                  )
                ])
              ]
            },
            proxy: true
          }
        ])
      }),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuUser",
        staticClass: "context-user",
        scopedSlots: _vm._u([
          {
            key: "default",
            fn: function(slotProps) {
              return [
                _c(
                  "div",
                  { staticClass: "item-group" },
                  [
                    _c(
                      "BaseContextMenuItem",
                      {
                        staticClass: "item",
                        attrs: {
                          iconClass: "far fa-trash-alt",
                          hotkey: "KeyR"
                        },
                        on: {
                          click: function($event) {
                            return _vm.onRemoveUser(slotProps.item)
                          }
                        }
                      },
                      [
                        _c("u", [_vm._v("R")]),
                        _vm._v("emove User\n            ")
                      ]
                    )
                  ],
                  1
                )
              ]
            }
          }
        ])
      }),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuAddUsers",
        staticClass: "context-add-users",
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [_vm._v("\n            Add Approver(s) to File\n        ")]
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
                        type: "checkbox",
                        options: _vm.availableUsers,
                        submitOnChange: true,
                        optionDescriptionKey: "email",
                        optionNameKey: "name",
                        search: true
                      },
                      model: {
                        value: _vm.usersToAdd,
                        callback: function($$v) {
                          _vm.usersToAdd = $$v
                        },
                        expression: "usersToAdd"
                      }
                    })
                  ],
                  1
                ),
                _vm._v(" "),
                _c("div", { staticClass: "item-group" }, [
                  _c("div", { staticClass: "item" }, [
                    _c(
                      "button",
                      {
                        staticClass: "primary",
                        class: { disabled: _vm.usersToAdd.length < 1 },
                        on: {
                          click: function($event) {
                            _vm.onAddUsersToFile()
                            _vm.usersToAdd = []
                            slotProps.hide()
                          }
                        }
                      },
                      [
                        _c(
                          "span",
                          [
                            _vm._v("Add "),
                            _vm.usersToAdd.length > 0
                              ? [
                                  _vm._v(
                                    _vm._s(_vm.usersToAdd.length) +
                                      " \n                        "
                                  )
                                ]
                              : _vm._e(),
                            _vm._v("user"),
                            _vm.usersToAdd.length > 1 ? [_vm._v("s")] : _vm._e()
                          ],
                          2
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "invisible ghost-hover",
                        on: {
                          click: function($event) {
                            slotProps.hide()
                            _vm.usersToAdd = []
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
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileApproversFlyin/index.vue?vue&type=template&id=52d93798&":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/FileApproversFlyin/index.vue?vue&type=template&id=52d93798& ***!
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
  return _c("BaseFlyin", {
    ref: "fileApproversFlyin",
    attrs: { show: _vm.show },
    on: {
      close: function($event) {
        return _vm.$emit("close")
      }
    },
    scopedSlots: _vm._u([
      {
        key: "header",
        fn: function() {
          return [
            _vm.show
              ? _c("BaseFlyinHeader", {
                  attrs: {
                    title: "File Approvers: " + _vm.file.name,
                    disableNavigation: "true"
                  },
                  on: {
                    close: function($event) {
                      return _vm.$emit("close")
                    }
                  }
                })
              : _vm._e()
          ]
        },
        proxy: true
      },
      {
        key: "default",
        fn: function() {
          return [
            _vm.show
              ? _c("FileApproversTable", { attrs: { file: _vm.file } })
              : _vm._e()
          ]
        },
        proxy: true
      }
    ])
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=template&id=3ce634a4&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=template&id=3ce634a4&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "file-owners-table" },
    [
      _c("BaseFlexTable", {
        scopedSlots: _vm._u([
          {
            key: "topBar",
            fn: function() {
              return [
                _c("BaseTableTopBar", {
                  scopedSlots: _vm._u([
                    {
                      key: "right",
                      fn: function() {
                        return [
                          _c("span", [
                            _vm._v(
                              _vm._s(_vm.file.owner_count || 0) + " records"
                            )
                          ])
                        ]
                      },
                      proxy: true
                    }
                  ])
                })
              ]
            },
            proxy: true
          },
          {
            key: "header",
            fn: function() {
              return [
                _c(
                  "BaseTableHeader",
                  { staticClass: "select" },
                  [_c("BaseCheckbox")],
                  1
                ),
                _vm._v(" "),
                _c(
                  "BaseTableHeader",
                  {
                    staticClass: "name",
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
                _c("BaseTableHeader", { staticClass: "action" }, [
                  _vm._v("Action")
                ])
              ]
            },
            proxy: true
          },
          {
            key: "body",
            fn: function() {
              return _vm._l(_vm.file.owners, function(user) {
                return _c(
                  "tr",
                  {
                    key: user.id,
                    ref: "userRow",
                    refInFor: true,
                    staticClass: "user-row table-row",
                    on: {
                      contextmenu: function($event) {
                        $event.preventDefault()
                        return _vm.showUserContext($event, user)
                      }
                    }
                  },
                  [
                    _c(
                      "td",
                      { staticClass: "select" },
                      [_c("BaseCheckbox")],
                      1
                    ),
                    _vm._v(" "),
                    _c("td", { staticClass: "title clickable" }, [
                      _c("i", { staticClass: "fas fa-user" }),
                      _vm._v(" "),
                      _c("span", [_vm._v(_vm._s(user.name))])
                    ]),
                    _vm._v(" "),
                    _c("td", { staticClass: "email" }, [
                      _vm._v(_vm._s(user.email))
                    ]),
                    _vm._v(" "),
                    _c("td", { staticClass: "action" }, [
                      _c(
                        "button",
                        {
                          staticClass: "invisible ghost-hover",
                          on: {
                            click: function($event) {
                              $event.stopPropagation()
                              return _vm.showUserContext($event, user)
                            }
                          }
                        },
                        [_c("i", { staticClass: "far fa-ellipsis-h medium" })]
                      )
                    ])
                  ]
                )
              })
            },
            proxy: true
          },
          {
            key: "footer",
            fn: function() {
              return [
                _c("td", [
                  _c(
                    "button",
                    {
                      staticClass: "primary invisible",
                      on: {
                        click: function($event) {
                          return _vm.onAddUser($event)
                        }
                      }
                    },
                    [
                      _c("i", { staticClass: "far fa-plus" }),
                      _c("span", [_vm._v("Add Owner(s) to File")])
                    ]
                  )
                ])
              ]
            },
            proxy: true
          }
        ])
      }),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuUser",
        staticClass: "context-user",
        scopedSlots: _vm._u([
          {
            key: "default",
            fn: function(slotProps) {
              return [
                _c(
                  "div",
                  { staticClass: "item-group" },
                  [
                    _c(
                      "BaseContextMenuItem",
                      {
                        staticClass: "item",
                        attrs: {
                          iconClass: "far fa-trash-alt",
                          hotkey: "KeyR"
                        },
                        on: {
                          click: function($event) {
                            return _vm.onRemoveUser(slotProps.item)
                          }
                        }
                      },
                      [
                        _c("u", [_vm._v("R")]),
                        _vm._v("emove User\n            ")
                      ]
                    )
                  ],
                  1
                )
              ]
            }
          }
        ])
      }),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuAddUsers",
        staticClass: "context-add-users",
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [_vm._v("\n            Add Owner(s) to File\n        ")]
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
                        type: "checkbox",
                        options: _vm.availableUsers,
                        submitOnChange: true,
                        optionDescriptionKey: "email",
                        optionNameKey: "name",
                        search: true
                      },
                      model: {
                        value: _vm.usersToAdd,
                        callback: function($$v) {
                          _vm.usersToAdd = $$v
                        },
                        expression: "usersToAdd"
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
                        class: { disabled: _vm.usersToAdd.length < 1 },
                        on: {
                          click: function($event) {
                            _vm.onAddUsersToFile()
                            _vm.usersToAdd = []
                            slotProps.hide()
                          }
                        }
                      },
                      [
                        _c(
                          "span",
                          [
                            _vm._v("Add "),
                            _vm.usersToAdd.length > 0
                              ? [
                                  _vm._v(
                                    _vm._s(_vm.usersToAdd.length) +
                                      " \n                        "
                                  )
                                ]
                              : _vm._e(),
                            _vm._v("user"),
                            _vm.usersToAdd.length > 1 ? [_vm._v("s")] : _vm._e()
                          ],
                          2
                        )
                      ]
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
                            _vm.usersToAdd = []
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
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileOwnersFlyin/index.vue?vue&type=template&id=25947da4&":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/FileOwnersFlyin/index.vue?vue&type=template&id=25947da4& ***!
  \************************************************************************************************************************************************************************************************************************/
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
  return _c("BaseFlyin", {
    attrs: { show: _vm.show },
    on: {
      close: function($event) {
        return _vm.$emit("close")
      }
    },
    scopedSlots: _vm._u([
      {
        key: "header",
        fn: function() {
          return [
            _vm.show && _vm.file
              ? _c("BaseFlyinHeader", {
                  attrs: { disableNavigation: "true" },
                  on: {
                    close: function($event) {
                      return _vm.$emit("close")
                    }
                  },
                  scopedSlots: _vm._u(
                    [
                      {
                        key: "left",
                        fn: function() {
                          return [
                            _c("h3", [
                              _vm._v(
                                _vm._s(_vm.file.type) +
                                  " Owners: " +
                                  _vm._s(_vm.file.name)
                              )
                            ])
                          ]
                        },
                        proxy: true
                      }
                    ],
                    null,
                    false,
                    1162887485
                  )
                })
              : _vm._e()
          ]
        },
        proxy: true
      },
      {
        key: "default",
        fn: function() {
          return [
            _vm.show && _vm.file
              ? _c("FileOwnersTable", { attrs: { file: _vm.file } })
              : _vm._e()
          ]
        },
        proxy: true
      }
    ])
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=template&id=caf51a14&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=template&id=caf51a14&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "selection-teams-table" },
    [
      _c("h3", [_vm._v("Selection Teams")]),
      _vm._v(" "),
      _c("BaseTable", {
        attrs: {
          stickyHeader: false,
          contentStatus: _vm.readyStatus,
          loadingMsg: "loading teams",
          errorMsg: "error loading teams",
          errorCallback: function() {
            return _vm.initData()
          },
          items: _vm.selection.teams,
          itemKey: "id",
          itemSize: 50,
          selected: _vm.selected,
          contextItem: _vm.contextTeam,
          contextMouseEvent: _vm.contextMouseEvent,
          searchKey: "title",
          searchResult: _vm.teamsFilteredBySearch
        },
        on: {
          "update:selected": function($event) {
            _vm.selected = $event
          },
          "update:contextItem": function($event) {
            _vm.contextTeam = $event
          },
          "update:context-item": function($event) {
            _vm.contextTeam = $event
          },
          "update:contextMouseEvent": function($event) {
            _vm.contextMouseEvent = $event
          },
          "update:context-mouse-event": function($event) {
            _vm.contextMouseEvent = $event
          },
          "update:searchResult": function($event) {
            _vm.teamsFilteredBySearch = $event
          },
          "update:search-result": function($event) {
            _vm.teamsFilteredBySearch = $event
          },
          "show-contextmenu": _vm.showTeamContext
        },
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [
                _c(
                  "BaseTableHeader",
                  {
                    staticClass: "name",
                    attrs: {
                      sortKey: "title",
                      currentSortKey: _vm.sortKey,
                      sortAsc: _vm.sortAsc
                    },
                    on: { sort: _vm.sortTeams }
                  },
                  [_vm._v("Name")]
                ),
                _vm._v(" "),
                _c(
                  "BaseTableHeader",
                  {
                    attrs: {
                      sortKey: "users",
                      currentSortKey: _vm.sortKey,
                      sortAsc: _vm.sortAsc
                    },
                    on: { sort: _vm.sortTeams }
                  },
                  [_vm._v("Users")]
                )
              ]
            },
            proxy: true
          },
          {
            key: "row",
            fn: function(rowProps) {
              return [
                _c("BaseTableInnerRow", [
                  _c("td", { staticClass: "title" }, [
                    _c("i", { staticClass: "fas fa-users" }),
                    _vm._v(" "),
                    _c("span", [_vm._v(_vm._s(rowProps.item.title))])
                  ]),
                  _vm._v(" "),
                  _c("td", { staticClass: "users" }, [
                    _c("span", [_vm._v(_vm._s(rowProps.item.user_count))])
                  ])
                ])
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
                              !_vm.userHasEditAccess &&
                              "Only admins can add users to selections",
                            expression:
                              "!userHasEditAccess && 'Only admins can add users to selections'"
                          }
                        ],
                        attrs: {
                          buttonClass: "primary invisible",
                          disabled: !_vm.userHasEditAccess
                        },
                        on: {
                          click: function($event) {
                            return _vm.onAddTeam($event)
                          }
                        }
                      },
                      [
                        _c("i", { staticClass: "far fa-plus" }),
                        _c("span", [_vm._v("Add Teams(s) to Selection")])
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
      _c(
        "BaseContextMenu",
        {
          ref: "contextMenuTeam",
          staticClass: "context-team",
          scopedSlots: _vm._u(
            [
              _vm.selected.length > 1
                ? {
                    key: "header",
                    fn: function() {
                      return [
                        _c("span", [
                          _vm._v(
                            "Choose action for " +
                              _vm._s(_vm.selected.length) +
                              " teams"
                          )
                        ])
                      ]
                    },
                    proxy: true
                  }
                : null
            ],
            null,
            true
          )
        },
        [
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "item-group" },
            [
              _c(
                "BaseContextMenuItem",
                {
                  attrs: { iconClass: "far fa-trash-alt", hotkey: "KeyR" },
                  on: {
                    click: function($event) {
                      return _vm.onRemoveTeams(_vm.contextTeam)
                    }
                  }
                },
                [
                  _c("u", [_vm._v("R")]),
                  _vm._v(
                    "emove Team" +
                      _vm._s(_vm.selected.length > 1 ? "s" : "") +
                      "\n            "
                  )
                ]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c("BaseSelectButtonsContextMenu", {
        ref: "contextMenuAddTeams",
        attrs: {
          header: "Add Team(s) to Selection",
          options: _vm.availableTeams,
          submitDisabled: _vm.teamsToAdd.length < 1,
          emitOnChange: true,
          optionNameKey: "title",
          search: true,
          submitText:
            "Add " +
            _vm.teamsToAdd.length +
            " team" +
            (_vm.teamsToAdd.length > 1 ? "s" : "")
        },
        on: {
          submit: function($event) {
            _vm.onAddTeamsToSelection(_vm.teamsToAdd)
            _vm.teamsToAdd = []
          },
          cancel: function($event) {
            _vm.teamsToAdd = []
          }
        },
        model: {
          value: _vm.teamsToAdd,
          callback: function($$v) {
            _vm.teamsToAdd = $$v
          },
          expression: "teamsToAdd"
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=template&id=e268aa38&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=template&id=e268aa38&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "selection-users-table" },
    [
      _c("h3", [_vm._v("Selection Members")]),
      _vm._v(" "),
      _c("BaseTable", {
        attrs: {
          stickyHeader: false,
          contentStatus: _vm.readyStatus,
          loadingMsg: "loading users",
          errorMsg: "error loading users",
          errorCallback: function() {
            return _vm.initData()
          },
          items:
            _vm.currentUsersTableTab == "Members"
              ? _vm.selection.users
              : _vm.selection.denied_users,
          itemKey: "id",
          itemSize: 50,
          selected: _vm.selected,
          contextItem: _vm.contextUser,
          contextMouseEvent: _vm.contextMouseEvent,
          searchKey: ["name", "email"],
          searchResult: _vm.usersFilteredBySearch,
          itemType: "user"
        },
        on: {
          "update:selected": function($event) {
            _vm.selected = $event
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
        scopedSlots: _vm._u([
          {
            key: "tabs",
            fn: function() {
              return [
                _c("BaseTableTab", {
                  attrs: {
                    label: "Members",
                    count: _vm.selection.users ? _vm.selection.users.length : 0,
                    modelValue: "Members"
                  },
                  on: {
                    change: function($event) {
                      _vm.selected = []
                    }
                  },
                  model: {
                    value: _vm.currentUsersTableTab,
                    callback: function($$v) {
                      _vm.currentUsersTableTab = $$v
                    },
                    expression: "currentUsersTableTab"
                  }
                }),
                _vm._v(" "),
                _c("BaseTableTab", {
                  attrs: {
                    label: "Excluded",
                    count: _vm.selection.denied_users
                      ? _vm.selection.denied_users.length
                      : 0,
                    modelValue: "Excluded"
                  },
                  on: {
                    change: function($event) {
                      _vm.selected = []
                    }
                  },
                  model: {
                    value: _vm.currentUsersTableTab,
                    callback: function($$v) {
                      _vm.currentUsersTableTab = $$v
                    },
                    expression: "currentUsersTableTab"
                  }
                })
              ]
            },
            proxy: true
          },
          {
            key: "header",
            fn: function() {
              return [
                _c(
                  "BaseTableHeader",
                  {
                    staticClass: "name",
                    attrs: { sortKey: "name", currentSortKey: _vm.sortKey },
                    on: { sort: _vm.sortUsers }
                  },
                  [_vm._v("Name")]
                ),
                _vm._v(" "),
                _c(
                  "BaseTableHeader",
                  {
                    attrs: { sortKey: "email", currentSortKey: _vm.sortKey },
                    on: { sort: _vm.sortUsers }
                  },
                  [_vm._v("E-mail")]
                ),
                _vm._v(" "),
                _vm.currentUsersTableTab == "Members"
                  ? _c(
                      "BaseTableHeader",
                      {
                        attrs: { sortKey: "role", currentSortKey: _vm.sortKey },
                        on: { sort: _vm.sortUsers }
                      },
                      [_vm._v("Role")]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "action" })
              ]
            },
            proxy: true
          },
          {
            key: "row",
            fn: function(rowProps) {
              return [
                _vm.currentUsersTableTab == "Members"
                  ? _c("BaseTableInnerRow", [
                      _c("td", { staticClass: "title" }, [
                        _c("i", { staticClass: "fas fa-user" }),
                        _vm._v(" "),
                        _c("span", [_vm._v(_vm._s(rowProps.item.name))])
                      ]),
                      _vm._v(" "),
                      _c("td", { staticClass: "email" }, [
                        _vm._v(_vm._s(rowProps.item.email))
                      ]),
                      _vm._v(" "),
                      _c("td", { staticClass: "role" }, [
                        _vm.userHasEditAccess
                          ? _c(
                              "button",
                              {
                                staticClass: "ghost editable sm",
                                on: {
                                  click: function($event) {
                                    return _vm.showRoleContext(
                                      $event,
                                      rowProps.item
                                    )
                                  }
                                }
                              },
                              [_c("span", [_vm._v(_vm._s(rowProps.item.role))])]
                            )
                          : _c("span", [_vm._v(_vm._s(rowProps.item.role))])
                      ]),
                      _vm._v(" "),
                      _c(
                        "td",
                        { staticClass: "action" },
                        [
                          !rowProps.item.selectionLinkSent
                            ? _c(
                                "BaseButton",
                                {
                                  attrs: {
                                    buttonClass: "ghost editable sm",
                                    disabled: rowProps.item.role != "Member",
                                    disabledTooltip:
                                      "Only selection members can be sent a link"
                                  },
                                  on: {
                                    click: function($event) {
                                      return _vm.onSendSelectionLink([
                                        rowProps.item
                                      ])
                                    }
                                  }
                                },
                                [
                                  _c("i", {
                                    staticClass: "far fa-paper-plane"
                                  }),
                                  _vm._v(" "),
                                  _c("span", [_vm._v("Send link")])
                                ]
                              )
                            : _c("div", { staticClass: "ghost sm" }, [
                                _c("i", { staticClass: "far fa-check" }),
                                _vm._v(" "),
                                _c("span", [_vm._v("Link sent")])
                              ])
                        ],
                        1
                      )
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _vm.currentUsersTableTab == "Excluded"
                  ? _c("BaseTableInnerRow", [
                      _c("td", { staticClass: "title" }, [
                        _c("i", { staticClass: "fas fa-user" }),
                        _vm._v(" "),
                        _c("span", [_vm._v(_vm._s(rowProps.item.name))])
                      ]),
                      _vm._v(" "),
                      _c("td", { staticClass: "email" }, [
                        _vm._v(_vm._s(rowProps.item.email))
                      ]),
                      _vm._v(" "),
                      _c("td", { staticClass: "action" }, [
                        _vm.userHasEditAccess
                          ? _c(
                              "button",
                              {
                                staticClass: "primary ghost-hover invisible",
                                on: {
                                  click: function($event) {
                                    return _vm.onReAddUsersToSelection(
                                      _vm.selected.length > 0
                                        ? _vm.selected
                                        : [rowProps.item]
                                    )
                                  }
                                }
                              },
                              [_c("span", [_vm._v("Add user")])]
                            )
                          : _vm._e()
                      ])
                    ])
                  : _vm._e()
              ]
            }
          },
          {
            key: "footer",
            fn: function() {
              return [
                _vm.currentUsersTableTab == "Members"
                  ? _c(
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
                                  !_vm.userHasEditAccess &&
                                  "Only admins can add users to selections",
                                expression:
                                  "!userHasEditAccess && 'Only admins can add users to selections'"
                              }
                            ],
                            attrs: {
                              buttonClass: "primary invisible",
                              disabled: !_vm.userHasEditAccess
                            },
                            on: {
                              click: function($event) {
                                return _vm.onAddUser($event)
                              }
                            }
                          },
                          [
                            _c("i", { staticClass: "far fa-plus" }),
                            _c("span", [_vm._v("Add Users(s) to Selection")])
                          ]
                        )
                      ],
                      1
                    )
                  : _vm._e()
              ]
            },
            proxy: true
          }
        ])
      }),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuUser",
        staticClass: "context-user",
        scopedSlots: _vm._u(
          [
            _vm.selected.length > 1
              ? {
                  key: "header",
                  fn: function() {
                    return [
                      _c("span", [
                        _vm._v(
                          "Choose action for " +
                            _vm._s(_vm.selected.length) +
                            " users"
                        )
                      ])
                    ]
                  },
                  proxy: true
                }
              : null,
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
                          attrs: {
                            iconClass: "far fa-user-shield",
                            hotkey: "KeyC"
                          },
                          on: {
                            click: function($event) {
                              return _vm.showRoleContext(
                                _vm.contextMouseEvent,
                                _vm.contextUser
                              )
                            }
                          }
                        },
                        [
                          _c("span", [
                            _c("u", [_vm._v("C")]),
                            _vm._v(
                              "hange role" +
                                _vm._s(_vm.selected.length > 0 ? "s" : "")
                            )
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
                            iconClass: "far fa-user-shield",
                            tooltip:
                              "Send the user(s) a link to join the selection on the iOS app.",
                            disabled:
                              _vm.selected.length > 0
                                ? !_vm.selected.find(function(x) {
                                    return x.role == "Member"
                                  })
                                : _vm.contextUser.role != "Member",
                            disabledTooltip:
                              "Only Selection Members can be invited to join the iOS app.",
                            hotkey: ["KeyL", "KeyS"]
                          },
                          on: {
                            click: function($event) {
                              return _vm.onSendSelectionLink(
                                _vm.selected.length > 0
                                  ? _vm.selected
                                  : [_vm.contextUser]
                              )
                            }
                          }
                        },
                        [
                          _c("span", [
                            _c("u", [_vm._v("S")]),
                            _vm._v("end "),
                            _c("u", [_vm._v("l")]),
                            _vm._v("ink")
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
                            hotkey: ["KeyR", "KeyE"],
                            iconClass:
                              _vm.contextUser.inherit_from_teams ||
                              _vm.selected.length > 1
                                ? "far fa-user-times"
                                : "far fa-trash-alt"
                          },
                          on: {
                            click: function($event) {
                              return _vm.onRemoveUsers(_vm.contextUser)
                            }
                          }
                        },
                        [
                          _c("span", [
                            _vm.selected.length > 1
                              ? _c("span", [
                                  _c("u", [_vm._v("R")]),
                                  _vm._v("emove / "),
                                  _c("u", [_vm._v("E")]),
                                  _vm._v("xclude ")
                                ])
                              : _vm.contextUser.inherit_from_teams
                              ? _c("span", [
                                  _c("u", [_vm._v("E")]),
                                  _vm._v("xclude ")
                                ])
                              : _c("span", [
                                  _c("u", [_vm._v("R")]),
                                  _vm._v("emove ")
                                ]),
                            _vm._v(
                              "\n                        User" +
                                _vm._s(_vm.selected.length > 1 ? "s" : "") +
                                "\n                    "
                            )
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
          ],
          null,
          true
        )
      }),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuExcludedUser",
        staticClass: "context-user",
        scopedSlots: _vm._u(
          [
            _vm.selected.length > 1
              ? {
                  key: "header",
                  fn: function() {
                    return [
                      _c("span", [
                        _vm._v(
                          "Choose action for " +
                            _vm._s(_vm.selected.length) +
                            " users"
                        )
                      ])
                    ]
                  },
                  proxy: true
                }
              : null,
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
                          attrs: {
                            iconClass: "far fa-user-plus",
                            hotkey: "KeyR"
                          },
                          on: {
                            click: function($event) {
                              return _vm.onReAddUsersToSelection(
                                _vm.selected.length > 0
                                  ? _vm.selected
                                  : [_vm.contextUser]
                              )
                            }
                          }
                        },
                        [
                          _c("span", [
                            _c("u", [_vm._v("R")]),
                            _vm._v(
                              "e-add User" +
                                _vm._s(_vm.selected.length > 0 ? "s" : "")
                            )
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
          ],
          null,
          true
        )
      }),
      _vm._v(" "),
      _c("BaseSelectButtonsContextMenu", {
        ref: "contextMenuAddUsers",
        attrs: {
          header: "Add User(s) to Selection",
          options: _vm.availableUsers,
          submitDisabled: _vm.usersToAdd.length < 1,
          emitOnChange: true,
          optionDescriptionKey: "email",
          optionNameKey: "name",
          search: true,
          submitText:
            "Add " +
            _vm.usersToAdd.length +
            " user" +
            (_vm.usersToAdd.length > 1 ? "s" : "")
        },
        on: {
          submit: function($event) {
            _vm.onAddUsersToSelection(_vm.usersToAdd)
            _vm.usersToAdd = []
          },
          cancel: function($event) {
            _vm.usersToAdd = []
          }
        },
        model: {
          value: _vm.usersToAdd,
          callback: function($$v) {
            _vm.usersToAdd = $$v
          },
          expression: "usersToAdd"
        }
      }),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuRole",
        staticClass: "context-role",
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [_vm._v("\n            Change Selection Role\n        ")]
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
                      ref: "userCurrencySelector",
                      attrs: {
                        type: "radio",
                        options: _vm.availableSelectionRoles,
                        submitOnChange: true,
                        optionDescriptionKey: "description",
                        optionNameKey: "role",
                        optionValueKey: "role"
                      },
                      on: {
                        submit: function($event) {
                          _vm.onUpdateSelectionUsersRole()
                          slotProps.hide()
                        }
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
                )
              ]
            }
          }
        ])
      }),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuJob",
        staticClass: "context-role",
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [_vm._v("\n            Change Selection Job\n        ")]
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
                      ref: "userCurrencySelector",
                      attrs: {
                        type: "radio",
                        options: _vm.filteredAvailableSelectionJobs,
                        submitOnChange: true,
                        optionDescriptionKey: "description",
                        optionNameKey: "role",
                        optionValueKey: "role"
                      },
                      on: {
                        submit: function($event) {
                          _vm.onUpdateSelectionUsersJob()
                          slotProps.hide()
                        }
                      },
                      model: {
                        value: _vm.userToEdit.job,
                        callback: function($$v) {
                          _vm.$set(_vm.userToEdit, "job", $$v)
                        },
                        expression: "userToEdit.job"
                      }
                    })
                  ],
                  1
                )
              ]
            }
          }
        ])
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=template&id=059bfff8&":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=template&id=059bfff8& ***!
  \****************************************************************************************************************************************************************************************************************************/
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
  return _c("BaseFlyin", {
    ref: "flyin",
    attrs: { show: _vm.show },
    on: {
      close: function($event) {
        return _vm.$emit("close")
      }
    },
    scopedSlots: _vm._u([
      {
        key: "header",
        fn: function() {
          return [
            _vm.show
              ? _c("BaseFlyinHeader", {
                  attrs: { disableNavigation: "true" },
                  on: {
                    close: function($event) {
                      return _vm.$emit("close")
                    }
                  },
                  scopedSlots: _vm._u(
                    [
                      {
                        key: "left",
                        fn: function() {
                          return [
                            _c("h3", [
                              _vm._v(
                                "Selection Users: " + _vm._s(_vm.selection.name)
                              )
                            ])
                          ]
                        },
                        proxy: true
                      }
                    ],
                    null,
                    false,
                    2997286461
                  )
                })
              : _vm._e()
          ]
        },
        proxy: true
      },
      {
        key: "default",
        fn: function() {
          return [
            _c("SelectionTeamsTable"),
            _vm._v(" "),
            _c("SelectionUsersTable", { staticStyle: { "margin-top": "40px" } })
          ]
        },
        proxy: true
      }
    ])
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=template&id=29fcf4b3&":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=template&id=29fcf4b3& ***!
  \**********************************************************************************************************************************************************************************************************************************/
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
  return _c("BaseFlyin", {
    ref: "flyin",
    attrs: { show: _vm.show },
    on: {
      close: function($event) {
        return _vm.$emit("close")
      }
    },
    scopedSlots: _vm._u([
      {
        key: "header",
        fn: function() {
          return [
            _vm.show
              ? _c("BaseFlyinHeader", {
                  attrs: { disableNavigation: "true" },
                  on: {
                    close: function($event) {
                      return _vm.$emit("close")
                    }
                  },
                  scopedSlots: _vm._u(
                    [
                      {
                        key: "left",
                        fn: function() {
                          return [
                            _c("h3", [
                              _vm._v("File Editors " + _vm._s(_vm.file.name))
                            ])
                          ]
                        },
                        proxy: true
                      }
                    ],
                    null,
                    false,
                    2854950999
                  )
                })
              : _vm._e()
          ]
        },
        proxy: true
      },
      {
        key: "default",
        fn: function() {
          return [
            _c("FileEditorsTable", { attrs: { file: _vm.file } }),
            _vm._v(" "),
            _c("p", { staticStyle: { "margin-top": "12px" } }, [
              _c("i", { staticClass: "fas fa-info-circle" }),
              _vm._v(" "),
              _c("span", { staticStyle: { "margin-left": "4px" } }, [
                _vm._v("Editor's can create/edit/delete products in the file.")
              ])
            ])
          ]
        },
        proxy: true
      }
    ])
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=template&id=12fe7ca9&":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=template&id=12fe7ca9& ***!
  \**********************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "file-users-table" },
    [
      _c("BaseFlexTable", {
        attrs: {
          contentStatus: _vm.readyStatus,
          loadingMsg: "loading users",
          errorMsg: "error loading users",
          errorCallback: function() {
            return _vm.initData()
          }
        },
        scopedSlots: _vm._u([
          {
            key: "topBar",
            fn: function() {
              return [
                _c("BaseTableTopBar", {
                  scopedSlots: _vm._u([
                    {
                      key: "left",
                      fn: function() {
                        return [
                          _c("BaseSearchField", {
                            ref: "searchField",
                            attrs: {
                              searchKey: ["name", "email"],
                              arrayToSearch: _vm.file.users
                            },
                            model: {
                              value: _vm.usersFilteredBySearch,
                              callback: function($$v) {
                                _vm.usersFilteredBySearch = $$v
                              },
                              expression: "usersFilteredBySearch"
                            }
                          })
                        ]
                      },
                      proxy: true
                    },
                    {
                      key: "right",
                      fn: function() {
                        return [
                          _c("span", [
                            _vm._v(
                              _vm._s(
                                _vm.file.users ? _vm.file.users.length : 0
                              ) + " records"
                            )
                          ])
                        ]
                      },
                      proxy: true
                    }
                  ])
                })
              ]
            },
            proxy: true
          },
          {
            key: "header",
            fn: function() {
              return [
                _c(
                  "BaseTableHeader",
                  { staticClass: "select" },
                  [
                    _c("BaseCheckbox", {
                      attrs: {
                        value: _vm.selectedUsers.length > 0,
                        modelValue: true
                      },
                      on: {
                        change: function(checked) {
                          return checked
                            ? (_vm.selectedUsers = _vm.team.users)
                            : (_vm.selectedUsers = [])
                        }
                      }
                    })
                  ],
                  1
                ),
                _vm._v(" "),
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
                _c("BaseTableHeader", { staticClass: "action" }, [
                  _vm._v("Action")
                ])
              ]
            },
            proxy: true
          },
          {
            key: "body",
            fn: function() {
              return _vm._l(_vm.usersFilteredBySearch, function(user, index) {
                return _c("FileEditorsTableRow", {
                  key: user.id,
                  attrs: {
                    user: user,
                    index: index,
                    file: _vm.file,
                    selectedUsers: _vm.selectedUsers
                  },
                  model: {
                    value: _vm.selectedUsers,
                    callback: function($$v) {
                      _vm.selectedUsers = $$v
                    },
                    expression: "selectedUsers"
                  }
                })
              })
            },
            proxy: true
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
                              "Only admins can add team members",
                            expression:
                              "authUserWorkspaceRole != 'Admin' && 'Only admins can add team members'"
                          }
                        ],
                        attrs: {
                          buttonClass: "primary invisible",
                          disabled: _vm.authUserWorkspaceRole != "Admin"
                        },
                        on: {
                          click: function($event) {
                            return _vm.onAddUser($event)
                          }
                        }
                      },
                      [
                        _c("i", { staticClass: "far fa-plus" }),
                        _c("span", [_vm._v("Add User(s) to Team")])
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
      _c("BaseSelectButtonsContextMenu", {
        ref: "contextMenuAddUsers",
        attrs: {
          header: "Add User(s) to File",
          type: "checkbox",
          options: _vm.availableUsers,
          emitOnChange: true,
          optionDescriptionKey: "email",
          optionNameKey: "name",
          search: true,
          submitText:
            "Add " +
            _vm.usersToAdd.length +
            " user" +
            (_vm.usersToAdd.length > 1 ? "s" : ""),
          submitDisabled: _vm.usersToAdd.length < 1
        },
        on: {
          submit: function($event) {
            _vm.addUsersToFile({ file: _vm.file, users: _vm.usersToAdd })
            _vm.usersToAdd = []
          },
          cancel: function($event) {
            _vm.usersToAdd = []
          }
        },
        model: {
          value: _vm.usersToAdd,
          callback: function($$v) {
            _vm.usersToAdd = $$v
          },
          expression: "usersToAdd"
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=template&id=7d3f90be&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=template&id=7d3f90be&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************/
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
  return _c("tr", [
    _c(
      "td",
      { staticClass: "select" },
      [
        _c("BaseCheckbox", {
          ref: "selectBox",
          attrs: { value: _vm.user, modelValue: _vm.localSelectedUsers },
          model: {
            value: _vm.localSelectedUsers,
            callback: function($$v) {
              _vm.localSelectedUsers = $$v
            },
            expression: "localSelectedUsers"
          }
        })
      ],
      1
    ),
    _vm._v(" "),
    _c("td", { staticClass: "title" }, [
      _c("i", { staticClass: "fas fa-user" }),
      _vm._v(" "),
      _c("span", [_vm._v(_vm._s(_vm.user.name))])
    ]),
    _vm._v(" "),
    _c("td", { staticClass: "email" }, [_vm._v(_vm._s(_vm.user.email))]),
    _vm._v(" "),
    _c("td", { staticClass: "action" }, [
      _c(
        "button",
        {
          staticClass: "primary invisible ghost-hover",
          on: {
            click: function($event) {
              return _vm.removeUsersFromFile({
                file: _vm.file,
                users: [_vm.user]
              })
            }
          }
        },
        [
          _c("i", { staticClass: "far fa-user-times" }),
          _vm._v(" "),
          _c("span", [_vm._v("Remove user")])
        ]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=template&id=4340491c&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=template&id=4340491c&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "selections-table" },
    [
      _c("BaseFlexTable", {
        staticClass: "flex-table-root",
        attrs: {
          contentStatus: _vm.readyStatus,
          loadingMsg: _vm.loadingMsg,
          errorMsg: "error loading selections",
          errorCallback: function() {
            return _vm.initData()
          }
        },
        scopedSlots: _vm._u([
          {
            key: "topBar",
            fn: function() {
              return [
                _c("BaseTableTopBar", {
                  scopedSlots: _vm._u([
                    {
                      key: "right",
                      fn: function() {
                        return [
                          _c(
                            "BaseButton",
                            {
                              directives: [
                                {
                                  name: "tooltip",
                                  rawName: "v-tooltip",
                                  value:
                                    "Send a link to all selection members of this file",
                                  expression:
                                    "'Send a link to all selection members of this file'"
                                }
                              ],
                              attrs: {
                                buttonClass: "ghost sm",
                                disabled:
                                  _vm.authUserWorkspaceRole != "Admin" ||
                                  _vm.fileSelectionMagicLinkSent
                              },
                              on: { click: _vm.onSendMagicLinkToAll }
                            },
                            [
                              !_vm.fileSelectionMagicLinkSent
                                ? [
                                    _c("i", {
                                      staticClass: "far fa-paper-plane"
                                    }),
                                    _vm._v(" "),
                                    _c("span", [_vm._v("Send link")])
                                  ]
                                : [
                                    _c("i", { staticClass: "far fa-check" }),
                                    _vm._v(" "),
                                    _c("span", [_vm._v("Link sent")])
                                  ]
                            ],
                            2
                          ),
                          _vm._v(" "),
                          _c(
                            "BaseButton",
                            {
                              attrs: {
                                buttonClass: "ghost sm",
                                disabled: _vm.authUserWorkspaceRole != "Admin",
                                disabledTooltip:
                                  "Only admins can hide/unhide selections"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.onToggleAllSelectionsLocked(
                                    _vm.allSelections
                                  )
                                }
                              }
                            },
                            [
                              _c("i", { staticClass: "far fa-lock" }),
                              _vm._v(" "),
                              _c("span", [_vm._v("Lock/Undlock all")])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "BaseButton",
                            {
                              attrs: {
                                buttonClass: "ghost sm",
                                disabled: _vm.authUserWorkspaceRole != "Admin",
                                disabledTooltip:
                                  "Only admins can lock/unlock selections"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.onToggleAllSelectionsVisibility(
                                    _vm.allSelections
                                  )
                                }
                              }
                            },
                            [
                              _c("i", { staticClass: "far fa-eye" }),
                              _vm._v(" "),
                              _c("span", [_vm._v("Hide/Show all")])
                            ]
                          ),
                          _vm._v(" "),
                          _c("span", [
                            _c("strong", [
                              _vm._v(_vm._s(_vm.getSelectionsTree.length))
                            ]),
                            _vm._v(" records")
                          ])
                        ]
                      },
                      proxy: true
                    }
                  ])
                })
              ]
            },
            proxy: true
          },
          {
            key: "header",
            fn: function() {
              return [
                _c(
                  "BaseTableHeader",
                  { staticClass: "select" },
                  [
                    _c("BaseCheckbox", {
                      attrs: {
                        value: _vm.selectedSelections.length > 0,
                        modelValue: true
                      },
                      on: {
                        change: function(checked) {
                          return checked
                            ? (_vm.selectedSelections = _vm.allSelections)
                            : (_vm.selectedSelections = [])
                        }
                      }
                    })
                  ],
                  1
                ),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "locked" }),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "expand" }),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "title" }, [
                  _vm._v("Name")
                ]),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "budget" }, [
                  _vm._v("Budget")
                ]),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "budget-spend" }, [
                  _vm._v("Spend")
                ]),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "currency" }, [
                  _vm._v("Currency")
                ]),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "users" }, [
                  _vm._v("Users")
                ]),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "status" }, [
                  _vm._v("Status")
                ]),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "presentation" }, [
                  _vm._v("Presentation")
                ]),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "action" }, [
                  _vm._v("Action")
                ])
              ]
            },
            proxy: true
          },
          {
            key: "body",
            fn: function() {
              return [
                _c(
                  "div",
                  { staticClass: "body" },
                  [
                    _vm.getSelectionsTree.length > 0
                      ? _vm._l(_vm.getSelectionsTree, function(selection) {
                          return _c("SelectionsTableRow", {
                            key: selection.id,
                            ref: "selection-row-" + selection.id,
                            refInFor: true,
                            attrs: {
                              selection: selection,
                              depth: 0,
                              path: [selection.id],
                              moveSelectionActive: _vm.moveSelectionActive,
                              file: _vm.currentFile,
                              selectionToEdit: _vm.selectionToEdit,
                              selectedSelections: _vm.selectedSelections
                            },
                            on: {
                              submitToEdit: _vm.clearToEdit,
                              cancelToEdit: function($event) {
                                _vm.clearUnsaved($event)
                                _vm.clearToEdit()
                              },
                              showSelectionUsersFlyin: function($event) {
                                return _vm.$emit(
                                  "showSelectionUsersFlyin",
                                  $event
                                )
                              },
                              showContext: _vm.showContextMenuSelection,
                              endMoveSelection: _vm.endMoveSelection,
                              showSettingsContext: _vm.showSettingsContext,
                              onClick: _vm.rowClick,
                              showSelectionCurrencyContext:
                                _vm.showSelectionCurrencyContext
                            },
                            model: {
                              value: _vm.selectedSelections,
                              callback: function($$v) {
                                _vm.selectedSelections = $$v
                              },
                              expression: "selectedSelections"
                            }
                          })
                        })
                      : [
                          _c(
                            "div",
                            { staticClass: "setup-wrapper" },
                            [
                              _vm.authUserWorkspaceRole == "Admin"
                                ? [
                                    _c(
                                      "button",
                                      {
                                        staticClass: "primary lg",
                                        on: {
                                          click: _vm.onShowCloneSetupContext
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-clone"
                                        }),
                                        _vm._v(" "),
                                        _c("span", [
                                          _vm._v(
                                            "Copy Setup From Existing File"
                                          )
                                        ])
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "button",
                                      {
                                        staticClass: "primary ghost lg",
                                        on: {
                                          click: function($event) {
                                            return _vm.onNewSelection({
                                              type: "Master"
                                            })
                                          }
                                        }
                                      },
                                      [
                                        _c("i", { staticClass: "fas fa-plus" }),
                                        _vm._v(" "),
                                        _c("span", [
                                          _vm._v(
                                            "Manually add new Master Selection"
                                          )
                                        ])
                                      ]
                                    )
                                  ]
                                : [
                                    _c("h3", [
                                      _vm._v(
                                        "You don't have access to any selections in this file"
                                      )
                                    ])
                                  ]
                            ],
                            2
                          )
                        ]
                  ],
                  2
                )
              ]
            },
            proxy: true
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
                              "Only admins can create new selections",
                            expression:
                              "authUserWorkspaceRole != 'Admin' && 'Only admins can create new selections'"
                          }
                        ],
                        attrs: {
                          buttonClass: "primary invisible",
                          disabled: _vm.authUserWorkspaceRole != "Admin"
                        },
                        on: {
                          click: function($event) {
                            return _vm.onNewSelection({ type: "Master" })
                          }
                        }
                      },
                      [
                        _c("i", { staticClass: "far fa-plus" }),
                        _c("span", [_vm._v("Add new: Master Selection")])
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
      _c(
        "BaseContextMenu",
        { ref: "contextMenuSelection", staticClass: "context-selection" },
        [
          !!_vm.contextSelection
            ? _c(
                "div",
                { staticClass: "item-group" },
                [
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: {
                        iconClass: "far fa-users",
                        disabled: !(
                          !_vm.contextSelection.is_presenting ||
                          (_vm.contextSelection.your_role == "Owner" &&
                            _vm.contextSelection.type == "Master")
                        ),
                        disabledTooltip:
                          "Selection is in presentation mode. To join the presentation login to the Kollekt mobile app",
                        hotkey: "KeyG"
                      },
                      on: {
                        click: function($event) {
                          return _vm.$router.push({
                            name: "selection",
                            params: {
                              fileId: _vm.contextSelection.file_id,
                              selectionId: _vm.contextSelection.id
                            }
                          })
                        }
                      }
                    },
                    [
                      _c("span", [
                        _c("u", [_vm._v("G")]),
                        _vm._v("o to selection ")
                      ])
                    ]
                  )
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          !!_vm.contextSelection
            ? _c(
                "div",
                { staticClass: "item-group" },
                [
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: {
                        disabled: _vm.contextSelection.selectionLinkSent,
                        iconClass: _vm.contextSelection.selectionLinkSent
                          ? "far fa-check"
                          : "far fa-paper-plane",
                        hotkey: "KeyL"
                      },
                      on: {
                        click: function($event) {
                          return _vm.onSendSelectionLink(_vm.contextSelection)
                        }
                      }
                    },
                    [
                      !_vm.contextSelection.selectionLinkSent
                        ? _c("span", [
                            _vm._v("Send selection "),
                            _c("u", [_vm._v("L")]),
                            _vm._v("ink")
                          ])
                        : _c("span", [_vm._v("Link sent")])
                    ]
                  )
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          !!_vm.contextSelection
            ? _c(
                "div",
                { staticClass: "item-group" },
                [
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: { iconClass: "far fa-pen", hotkey: "KeyR" },
                      on: {
                        click: function($event) {
                          _vm.selectionToEdit = {
                            selection: _vm.contextSelection,
                            field: "name"
                          }
                        }
                      }
                    },
                    [_c("u", [_vm._v("R")]), _vm._v("ename\n            ")]
                  ),
                  _vm._v(" "),
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: { iconClass: "far fa-user-cog", hotkey: "KeyM" },
                      on: {
                        click: function($event) {
                          return _vm.$emit(
                            "showSelectionUsersFlyin",
                            _vm.contextSelection
                          )
                        }
                      }
                    },
                    [
                      _c("u", [_vm._v("M")]),
                      _vm._v("embers and Access\n            ")
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: { iconClass: "far fa-plus", hotkey: "KeyC" },
                      scopedSlots: _vm._u(
                        [
                          {
                            key: "submenu",
                            fn: function() {
                              return [
                                _c(
                                  "div",
                                  { staticClass: "item-group" },
                                  [
                                    _c(
                                      "BaseContextMenuItem",
                                      {
                                        attrs: {
                                          iconClass: "far fa-poll",
                                          hotkey: "KeyN"
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.onNewSelection({
                                              parent: _vm.contextSelection,
                                              type: "Normal"
                                            })
                                          }
                                        }
                                      },
                                      [
                                        _c("span", [
                                          _c("u", [_vm._v("N")]),
                                          _vm._v("ormal")
                                        ])
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseContextMenuItem",
                                      {
                                        attrs: {
                                          iconClass: "far fa-crown",
                                          hotkey: "KeyM",
                                          disabled:
                                            _vm.contextSelection.type !=
                                            "Master",
                                          disabledTooltip:
                                            "Can only create Master sub-selections on another Master selection"
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.onNewSelection({
                                              parent: _vm.contextSelection,
                                              type: "Master"
                                            })
                                          }
                                        }
                                      },
                                      [
                                        _c("span", [
                                          _c("u", [_vm._v("M")]),
                                          _vm._v("aster")
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
                        ],
                        null,
                        false,
                        4256184497
                      )
                    },
                    [
                      [
                        _c("span", [
                          _c("u", [_vm._v("C")]),
                          _vm._v("reate sub-selection")
                        ])
                      ]
                    ],
                    2
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
                  attrs: { iconClass: "far fa-cog", hotkey: "KeyS" },
                  on: {
                    click: function($event) {
                      return _vm.showSettingsContext(
                        _vm.contextMouseEvent,
                        _vm.contextSelection
                      )
                    }
                  }
                },
                [_c("u", [_vm._v("S")]), _vm._v("ettings\n            ")]
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
                  attrs: { iconClass: "far fa-trash-alt", hotkey: "KeyD" },
                  on: {
                    click: function($event) {
                      return _vm.onDeleteSelection(
                        _vm.contextSelection,
                        _vm.contextSelectionParent
                      )
                    }
                  }
                },
                [
                  _c("u", [_vm._v("D")]),
                  _vm._v("elete selection\n            ")
                ]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "BaseContextMenu",
        {
          ref: "contextMenuSelectedSelections",
          staticClass: "context-selection",
          scopedSlots: _vm._u([
            {
              key: "header",
              fn: function() {
                return [
                  _c("span", [
                    _vm._v(
                      "Choose action for " +
                        _vm._s(_vm.selectedSelections.length) +
                        " selections"
                    )
                  ])
                ]
              },
              proxy: true
            }
          ])
        },
        [
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "item-group" },
            [
              _c(
                "BaseContextMenuItem",
                {
                  attrs: { iconClass: "far fa-times", hotkey: "KeyC" },
                  on: {
                    click: function($event) {
                      _vm.selectedSelections = []
                    }
                  }
                },
                [_c("span", [_c("u", [_vm._v("C")]), _vm._v("lear Selected")])]
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
                  attrs: { iconClass: "far fa-cog", hotkey: "KeyS" },
                  on: {
                    click: function($event) {
                      return _vm.showSettingsContext(
                        _vm.contextMouseEvent,
                        _vm.contextSelection
                      )
                    }
                  }
                },
                [_c("u", [_vm._v("S")]), _vm._v("ettings\n            ")]
              ),
              _vm._v(" "),
              _c(
                "BaseContextMenuItem",
                {
                  attrs: { iconClass: "far fa-lock", hotkey: "KeyL" },
                  on: {
                    click: function($event) {
                      return _vm.onToggleAllSelectionsLocked(
                        _vm.selectedSelections
                      )
                    }
                  }
                },
                [_c("span", [_c("u", [_vm._v("L")]), _vm._v("ock / Unlock")])]
              ),
              _vm._v(" "),
              _c(
                "BaseContextMenuItem",
                {
                  attrs: { iconClass: "far fa-eye", hotkey: "KeyH" },
                  on: {
                    click: function($event) {
                      return _vm.onToggleAllSelectionsVisibility(
                        _vm.selectedSelections
                      )
                    }
                  }
                },
                [_c("span", [_c("u", [_vm._v("H")]), _vm._v("ide / Unhide")])]
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
                  attrs: { iconClass: "far fa-trash-alt", hotkey: "KeyD" },
                  on: {
                    click: function($event) {
                      return _vm.onDeleteSelection(
                        _vm.contextSelection,
                        _vm.contextSelectionParent
                      )
                    }
                  }
                },
                [
                  _c("u", [_vm._v("D")]),
                  _vm._v("elete selections\n            ")
                ]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "BaseContextMenu",
        { ref: "contextMenuMove", staticClass: "context-move" },
        [
          _vm.contextSelectionComponent &&
          _vm.selectionToMove &&
          !_vm.contextSelectionComponent.path.includes(_vm.selectionToMove.id)
            ? _c(
                "div",
                { staticClass: "item-group" },
                [
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: { iconClass: "far fa-arrow-left", hotkey: "KeyM" },
                      on: {
                        click: function($event) {
                          return _vm.endMoveSelection(
                            _vm.contextSelection,
                            _vm.contextSelectionComponent
                          )
                        }
                      }
                    },
                    [_c("u", [_vm._v("M")]), _vm._v("ove here\n            ")]
                  )
                ],
                1
              )
            : _vm.contextSelectionComponent && _vm.selectionToMove
            ? _c(
                "div",
                { staticClass: "item-group" },
                [
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: {
                        iconClass: "far fa-exclamation-circle",
                        disabled: true
                      }
                    },
                    [_c("span", [_vm._v("Cannot place inside self")])]
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
                  attrs: { iconClass: "far fa-times", hotkey: "KeyC" },
                  on: { click: _vm.clearMoveSelection }
                },
                [_c("u", [_vm._v("C")]), _vm._v("ancel\n            ")]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuOptions",
        staticClass: "context-options",
        attrs: { columns: "4" },
        on: {
          hide: function($event) {
            _vm.settingsSelections = []
          }
        },
        scopedSlots: _vm._u(
          [
            _vm.contextSelection
              ? {
                  key: "header",
                  fn: function() {
                    return [
                      _c(
                        "span",
                        [
                          _vm._v(
                            "Settings: " +
                              _vm._s(_vm.contextSelection.name) +
                              "\n                "
                          ),
                          _vm.settingsSelections.length > 1
                            ? [
                                _vm._v(
                                  " + " +
                                    _vm._s(_vm.settingsSelections.length - 1) +
                                    " more"
                                )
                              ]
                            : _vm._e()
                        ],
                        2
                      )
                    ]
                  },
                  proxy: true
                }
              : null,
            _vm.settingsSelections.length > 0
              ? {
                  key: "default",
                  fn: function(slotProps) {
                    return [
                      _vm.loadingSelectionSettings
                        ? _c(
                            "div",
                            { staticClass: "loading-wrapper" },
                            [_c("BaseLoader")],
                            1
                          )
                        : _c("div", { staticClass: "columns" }, [
                            _c("div", { staticClass: "item-group" }, [
                              _c("div", { staticClass: "item-group" }, [
                                _c("strong", { staticClass: "header" }, [
                                  _vm._v("Feedback Actions")
                                ]),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast Up")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.parentLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .feedback.broadcast
                                                  .parent_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showParentLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .feedback.broadcast
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast Down")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.childLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .feedback.broadcast
                                                  .child_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showChildLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .feedback.broadcast
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast to Siblings")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseCheckboxInputField",
                                      {
                                        model: {
                                          value:
                                            _vm.contextSelection.settings
                                              .feedback.broadcast.sibling,
                                          callback: function($$v) {
                                            _vm.$set(
                                              _vm.contextSelection.settings
                                                .feedback.broadcast,
                                              "sibling",
                                              $$v
                                            )
                                          },
                                          expression:
                                            "contextSelection.settings.feedback.broadcast.sibling"
                                        }
                                      },
                                      [
                                        _c("span", [
                                          _vm._v("Broadcast to Siblings")
                                        ])
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "item-group" }, [
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen Up")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.parentLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .feedback.listen.parent_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showParentLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .feedback.listen
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen Down")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.childLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .feedback.listen.child_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showChildLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .feedback.listen
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen to Siblings")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseCheckboxInputField",
                                      {
                                        model: {
                                          value:
                                            _vm.contextSelection.settings
                                              .feedback.listen.sibling,
                                          callback: function($$v) {
                                            _vm.$set(
                                              _vm.contextSelection.settings
                                                .feedback.listen,
                                              "sibling",
                                              $$v
                                            )
                                          },
                                          expression:
                                            "contextSelection.settings.feedback.listen.sibling"
                                        }
                                      },
                                      [
                                        _c("span", [
                                          _vm._v("Listen to Siblings")
                                        ])
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "item-group" }, [
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Limit who can see feedback")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.displayLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .feedback_visible
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showDisplayLevelContext(
                                              $event,
                                              _vm.contextSelection.settings,
                                              "feedback_visible"
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [
                                        _vm._v(
                                          "Display feedback authors for\n                                "
                                        ),
                                        _c("i", {
                                          directives: [
                                            {
                                              name: "tooltip",
                                              rawName: "v-tooltip",
                                              value:
                                                "Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.",
                                              expression:
                                                "'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'"
                                            }
                                          ],
                                          staticClass: "far fa-info-circle"
                                        }),
                                        _vm._v(
                                          "\n                            :"
                                        )
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.displayAuthorOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .anonymize_feedback
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showDisplayAuthorContext(
                                              $event,
                                              _vm.contextSelection.settings,
                                              "anonymize_feedback"
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ])
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "item-group" }, [
                              _c("div", { staticClass: "item-group" }, [
                                _c("strong", { staticClass: "header" }, [
                                  _vm._v("Alignment Actions")
                                ]),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast Up")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.parentLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .action.broadcast.parent_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showParentLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .action.broadcast
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast Down")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.childLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .action.broadcast.child_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showChildLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .action.broadcast
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast to Siblings")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseCheckboxInputField",
                                      {
                                        model: {
                                          value:
                                            _vm.contextSelection.settings.action
                                              .broadcast.sibling,
                                          callback: function($$v) {
                                            _vm.$set(
                                              _vm.contextSelection.settings
                                                .action.broadcast,
                                              "sibling",
                                              $$v
                                            )
                                          },
                                          expression:
                                            "contextSelection.settings.action.broadcast.sibling"
                                        }
                                      },
                                      [
                                        _c("span", [
                                          _vm._v("Broadcast to Siblings")
                                        ])
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "item-group" }, [
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen Up")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.parentLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .action.listen.parent_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showParentLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .action.listen
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen Down")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.childLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .action.listen.child_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showChildLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .action.listen
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen to Siblings")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseCheckboxInputField",
                                      {
                                        model: {
                                          value:
                                            _vm.contextSelection.settings.action
                                              .listen.sibling,
                                          callback: function($$v) {
                                            _vm.$set(
                                              _vm.contextSelection.settings
                                                .action.listen,
                                              "sibling",
                                              $$v
                                            )
                                          },
                                          expression:
                                            "contextSelection.settings.action.listen.sibling"
                                        }
                                      },
                                      [
                                        _c("span", [
                                          _vm._v("Listen to Siblings")
                                        ])
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "item-group" }, [
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [
                                        _vm._v(
                                          "Limit who can see alignment actions"
                                        )
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.displayLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .action_visible
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showDisplayLevelContext(
                                              $event,
                                              _vm.contextSelection.settings,
                                              "action_visible"
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [
                                        _vm._v(
                                          "Display alignment authors for\n                                "
                                        ),
                                        _c("i", {
                                          directives: [
                                            {
                                              name: "tooltip",
                                              rawName: "v-tooltip",
                                              value:
                                                "Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.",
                                              expression:
                                                "'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'"
                                            }
                                          ],
                                          staticClass: "far fa-info-circle"
                                        }),
                                        _vm._v(
                                          "\n                            :"
                                        )
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.displayAuthorOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .anonymize_action
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showDisplayAuthorContext(
                                              $event,
                                              _vm.contextSelection.settings,
                                              "anonymize_action"
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ])
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "item-group" }, [
                              _c("div", { staticClass: "item-group" }, [
                                _c("strong", { staticClass: "header" }, [
                                  _vm._v("Comments")
                                ]),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast Up")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.parentLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .comment.broadcast
                                                  .parent_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showParentLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .comment.broadcast
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast Down")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.childLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .comment.broadcast.child_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showChildLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .comment.broadcast
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast to Siblings")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseCheckboxInputField",
                                      {
                                        model: {
                                          value:
                                            _vm.contextSelection.settings
                                              .comment.broadcast.sibling,
                                          callback: function($$v) {
                                            _vm.$set(
                                              _vm.contextSelection.settings
                                                .comment.broadcast,
                                              "sibling",
                                              $$v
                                            )
                                          },
                                          expression:
                                            "contextSelection.settings.comment.broadcast.sibling"
                                        }
                                      },
                                      [
                                        _c("span", [
                                          _vm._v("Broadcast to Siblings")
                                        ])
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "item-group" }, [
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen Up")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.parentLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .comment.listen.parent_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showParentLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .comment.listen
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen Down")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.childLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .comment.listen.child_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showChildLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .comment.listen
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen to Siblings")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseCheckboxInputField",
                                      {
                                        model: {
                                          value:
                                            _vm.contextSelection.settings
                                              .comment.listen.sibling,
                                          callback: function($$v) {
                                            _vm.$set(
                                              _vm.contextSelection.settings
                                                .comment.listen,
                                              "sibling",
                                              $$v
                                            )
                                          },
                                          expression:
                                            "contextSelection.settings.comment.listen.sibling"
                                        }
                                      },
                                      [
                                        _c("span", [
                                          _vm._v("Listen to Siblings")
                                        ])
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "item-group" }, [
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Limit who can see comments")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.displayLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .comment_visible
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showDisplayLevelContext(
                                              $event,
                                              _vm.contextSelection.settings,
                                              "comment_visible"
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [
                                        _vm._v(
                                          "Display comment authors for\n                                "
                                        ),
                                        _c("i", {
                                          directives: [
                                            {
                                              name: "tooltip",
                                              rawName: "v-tooltip",
                                              value:
                                                "Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.",
                                              expression:
                                                "'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'"
                                            }
                                          ],
                                          staticClass: "far fa-info-circle"
                                        }),
                                        _vm._v(
                                          "\n                            :"
                                        )
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.displayAuthorOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .anonymize_comment
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showDisplayAuthorContext(
                                              $event,
                                              _vm.contextSelection.settings,
                                              "anonymize_comment"
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ])
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "item-group" }, [
                              _c("div", { staticClass: "item-group" }, [
                                _c("strong", { staticClass: "header" }, [
                                  _vm._v("Requests")
                                ]),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast Up")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.parentLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .request.broadcast
                                                  .parent_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showParentLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .request.broadcast
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast Down")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.childLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .request.broadcast.child_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showChildLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .request.broadcast
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Broadcast to Siblings")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseCheckboxInputField",
                                      {
                                        model: {
                                          value:
                                            _vm.contextSelection.settings
                                              .request.broadcast.sibling,
                                          callback: function($$v) {
                                            _vm.$set(
                                              _vm.contextSelection.settings
                                                .request.broadcast,
                                              "sibling",
                                              $$v
                                            )
                                          },
                                          expression:
                                            "contextSelection.settings.request.broadcast.sibling"
                                        }
                                      },
                                      [
                                        _c("span", [
                                          _vm._v("Broadcast to Siblings")
                                        ])
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "item-group" }, [
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen Up")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.parentLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .request.listen.parent_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showParentLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .request.listen
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen Down")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.childLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .request.listen.child_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showChildLevelContext(
                                              $event,
                                              _vm.contextSelection.settings
                                                .request.listen
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Listen to Siblings")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseCheckboxInputField",
                                      {
                                        model: {
                                          value:
                                            _vm.contextSelection.settings
                                              .request.listen.sibling,
                                          callback: function($$v) {
                                            _vm.$set(
                                              _vm.contextSelection.settings
                                                .request.listen,
                                              "sibling",
                                              $$v
                                            )
                                          },
                                          expression:
                                            "contextSelection.settings.request.listen.sibling"
                                        }
                                      },
                                      [
                                        _c("span", [
                                          _vm._v("Listen to Siblings")
                                        ])
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "item-group" }, [
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Limit who can see requests")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.displayLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .request_visible
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showDisplayLevelContext(
                                              $event,
                                              _vm.contextSelection.settings,
                                              "request_visible"
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [
                                        _vm._v(
                                          "Display request authors for\n                                "
                                        ),
                                        _c("i", {
                                          directives: [
                                            {
                                              name: "tooltip",
                                              rawName: "v-tooltip",
                                              value:
                                                "Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.",
                                              expression:
                                                "'Please beware: Changing this setting does not fully anonymize the data. Admins can always see authors, and changing the settings affects past input.'"
                                            }
                                          ],
                                          staticClass: "far fa-info-circle"
                                        }),
                                        _vm._v(
                                          "\n                            :"
                                        )
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.displayAuthorOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .anonymize_request
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showDisplayAuthorContext(
                                              $event,
                                              _vm.contextSelection.settings,
                                              "anonymize_request"
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "item-wrapper" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "settings-label" },
                                      [_vm._v("Can make tickets")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "BaseInputField",
                                      {
                                        attrs: {
                                          disabled: "true",
                                          type: "select",
                                          value: _vm.ticketLevelOptions.find(
                                            function(x) {
                                              return (
                                                x.value ==
                                                _vm.contextSelection.settings
                                                  .ticket_level
                                              )
                                            }
                                          ).label
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.showTicketLevelContext(
                                              $event,
                                              _vm.contextSelection.settings,
                                              "ticket_level"
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fas fa-caret-down"
                                        })
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ])
                            ])
                          ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "item-group footer item-wrapper",
                          staticStyle: {
                            display: "flex",
                            "justify-content": "space-between",
                            width: "100%"
                          }
                        },
                        [
                          _c("div", [
                            _c(
                              "button",
                              {
                                staticClass: "ghost primary",
                                on: { click: _vm.onCloneSettings }
                              },
                              [
                                _c("i", { staticClass: "far fa-clone" }),
                                _c("span", [
                                  _vm._v(
                                    "Clone settings from another Selection"
                                  )
                                ])
                              ]
                            )
                          ]),
                          _vm._v(" "),
                          _c(
                            "div",
                            { staticStyle: { "text-align": "right" } },
                            [
                              _c(
                                "button",
                                {
                                  staticClass: "primary",
                                  on: {
                                    click: function($event) {
                                      _vm.onSaveSelectionSettings()
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
                            ]
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c("BaseContextMenu", {
                        ref: "contextParentLevel",
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "default",
                              fn: function(slotProps) {
                                return [
                                  _c("BaseSelectButtons", {
                                    attrs: {
                                      type: "radio",
                                      submitOnChange: true,
                                      options: _vm.parentLevelOptions,
                                      optionNameKey: "label",
                                      optionValueKey: "value"
                                    },
                                    on: { submit: slotProps.hide },
                                    model: {
                                      value:
                                        _vm.contextSelectionOption.parent_level,
                                      callback: function($$v) {
                                        _vm.$set(
                                          _vm.contextSelectionOption,
                                          "parent_level",
                                          $$v
                                        )
                                      },
                                      expression:
                                        "contextSelectionOption.parent_level"
                                    }
                                  })
                                ]
                              }
                            }
                          ],
                          null,
                          true
                        )
                      }),
                      _vm._v(" "),
                      _c("BaseContextMenu", {
                        ref: "contextChildLevel",
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "default",
                              fn: function(slotProps) {
                                return [
                                  _c("BaseSelectButtons", {
                                    attrs: {
                                      type: "radio",
                                      submitOnChange: true,
                                      options: _vm.childLevelOptions,
                                      optionNameKey: "label",
                                      optionValueKey: "value"
                                    },
                                    on: { submit: slotProps.hide },
                                    model: {
                                      value:
                                        _vm.contextSelectionOption.child_level,
                                      callback: function($$v) {
                                        _vm.$set(
                                          _vm.contextSelectionOption,
                                          "child_level",
                                          $$v
                                        )
                                      },
                                      expression:
                                        "contextSelectionOption.child_level"
                                    }
                                  })
                                ]
                              }
                            }
                          ],
                          null,
                          true
                        )
                      }),
                      _vm._v(" "),
                      _c("BaseContextMenu", {
                        ref: "contextDisplayLevel",
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "default",
                              fn: function(slotProps) {
                                return [
                                  _c("BaseSelectButtons", {
                                    attrs: {
                                      type: "radio",
                                      submitOnChange: true,
                                      options: _vm.displayLevelOptions,
                                      optionNameKey: "label",
                                      optionValueKey: "value"
                                    },
                                    on: { submit: slotProps.hide },
                                    model: {
                                      value:
                                        _vm.contextSelectionSettings[
                                          _vm.contextSelectionSettingsKey
                                        ],
                                      callback: function($$v) {
                                        _vm.$set(
                                          _vm.contextSelectionSettings,
                                          _vm.contextSelectionSettingsKey,
                                          $$v
                                        )
                                      },
                                      expression:
                                        "contextSelectionSettings[contextSelectionSettingsKey]"
                                    }
                                  })
                                ]
                              }
                            }
                          ],
                          null,
                          true
                        )
                      }),
                      _vm._v(" "),
                      _c("BaseContextMenu", {
                        ref: "contextAuthorLevel",
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "default",
                              fn: function(slotProps) {
                                return [
                                  _c("BaseSelectButtons", {
                                    attrs: {
                                      type: "radio",
                                      submitOnChange: true,
                                      options: _vm.displayAuthorOptions,
                                      optionNameKey: "label",
                                      optionValueKey: "value"
                                    },
                                    on: { submit: slotProps.hide },
                                    model: {
                                      value:
                                        _vm.contextSelectionSettings[
                                          _vm.contextSelectionSettingsKey
                                        ],
                                      callback: function($$v) {
                                        _vm.$set(
                                          _vm.contextSelectionSettings,
                                          _vm.contextSelectionSettingsKey,
                                          $$v
                                        )
                                      },
                                      expression:
                                        "contextSelectionSettings[contextSelectionSettingsKey]"
                                    }
                                  })
                                ]
                              }
                            }
                          ],
                          null,
                          true
                        )
                      }),
                      _vm._v(" "),
                      _c("BaseContextMenu", {
                        ref: "contextTicketLevel",
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "default",
                              fn: function(slotProps) {
                                return [
                                  _c("BaseSelectButtons", {
                                    attrs: {
                                      type: "radio",
                                      submitOnChange: true,
                                      options: _vm.ticketLevelOptions,
                                      optionNameKey: "label",
                                      optionValueKey: "value"
                                    },
                                    on: { submit: slotProps.hide },
                                    model: {
                                      value:
                                        _vm.contextSelectionSettings[
                                          _vm.contextSelectionSettingsKey
                                        ],
                                      callback: function($$v) {
                                        _vm.$set(
                                          _vm.contextSelectionSettings,
                                          _vm.contextSelectionSettingsKey,
                                          $$v
                                        )
                                      },
                                      expression:
                                        "contextSelectionSettings[contextSelectionSettingsKey]"
                                    }
                                  })
                                ]
                              }
                            }
                          ],
                          null,
                          true
                        )
                      }),
                      _vm._v(" "),
                      _c("BaseContextMenu", {
                        ref: "contextCloneSettings",
                        staticClass: "context-clone-settings",
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "header",
                              fn: function() {
                                return [
                                  _c("span", [
                                    _vm._v(
                                      "Select selections to copy settings from"
                                    )
                                  ])
                                ]
                              },
                              proxy: true
                            },
                            {
                              key: "default",
                              fn: function(innerSlotProps) {
                                return [
                                  _c(
                                    "div",
                                    { staticClass: "item-group" },
                                    [
                                      _c("BaseSelectButtons", {
                                        attrs: {
                                          type: "radio",
                                          search: "true",
                                          options: _vm.allSelections.filter(
                                            function(x) {
                                              return (
                                                x.id != _vm.contextSelection.id
                                              )
                                            }
                                          ),
                                          optionNameKey: "name",
                                          submitOnChange: true
                                        },
                                        model: {
                                          value:
                                            _vm.selectionToCloneSettingsFrom,
                                          callback: function($$v) {
                                            _vm.selectionToCloneSettingsFrom = $$v
                                          },
                                          expression:
                                            "selectionToCloneSettingsFrom"
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
                                              _vm.cloneSettings()
                                              innerSlotProps.hide()
                                            }
                                          }
                                        },
                                        [_c("span", [_vm._v("Clone")])]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "button",
                                        {
                                          staticClass: "invisible ghost-hover",
                                          staticStyle: { "margin-left": "8px" },
                                          on: {
                                            click: function($event) {
                                              return innerSlotProps.hide()
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
                          ],
                          null,
                          true
                        )
                      })
                    ]
                  }
                }
              : null
          ],
          null,
          true
        )
      }),
      _vm._v(" "),
      _c(
        "div",
        {
          ref: "moveSelectionIndicator",
          staticClass: "move-selection-indicator",
          class: { active: _vm.moveSelectionActive }
        },
        [_c("span", [_vm._v("Click selection to move to")])]
      ),
      _vm._v(" "),
      _c("BaseContextMenu", {
        ref: "contextMenuCloneSetup",
        staticClass: "context-move",
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [
                _c("span", [_vm._v("Select file to copy selections from")])
              ]
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
                        search: "true",
                        options: _vm.allFiles.filter(function(x) {
                          return x.type == "File"
                        }),
                        optionNameKey: "name",
                        submitOnChange: true
                      },
                      model: {
                        value: _vm.fileToClone,
                        callback: function($$v) {
                          _vm.fileToClone = $$v
                        },
                        expression: "fileToClone"
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
                            _vm.onClone(_vm.fileToClone)
                            slotProps.hide()
                          }
                        }
                      },
                      [_c("span", [_vm._v("Clone")])]
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "invisible ghost-hover",
                        staticStyle: { "margin-left": "8px" },
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
      _vm.contextSelection
        ? _c("BaseSelectButtonsContextMenu", {
            ref: "contextCurrency",
            attrs: {
              header: "Change Selection Currency",
              unsetOption: "Clear",
              unsetValue: null,
              type: "radio",
              options: _vm.availableCurrencies,
              search: true
            },
            on: {
              submit: function($event) {
                return _vm.updateSelection(_vm.contextSelection)
              }
            },
            model: {
              value: _vm.contextSelection.currency,
              callback: function($$v) {
                _vm.$set(_vm.contextSelection, "currency", $$v)
              },
              expression: "contextSelection.currency"
            }
          })
        : _vm._e(),
      _vm._v(" "),
      _c(
        "BaseDialog",
        {
          ref: "deleteSelectionDialog",
          attrs: {
            type: "confirm",
            confirmText:
              _vm.selectedSelections.length > 1
                ? "Yes, delete them"
                : "Yes, delete it",
            cancelText:
              _vm.selectedSelections.length > 1
                ? "No, keep them"
                : "No, keep it",
            confirmColor: "red"
          }
        },
        [
          _c("div", { staticClass: "icon-graphic" }, [
            _c("i", { staticClass: "far fa-poll primary lg" }),
            _vm._v(" "),
            _c("i", { staticClass: "far fa-arrow-right lg" }),
            _vm._v(" "),
            _c("i", { staticClass: "far fa-trash lg dark" })
          ]),
          _vm._v(" "),
          _c("h3", [
            _vm._v(
              "Really delete " +
                _vm._s(
                  _vm.selectedSelections.length > 1
                    ? _vm.selectedSelections.length
                    : "this"
                ) +
                " selection" +
                _vm._s(_vm.selectedSelections.length > 1 ? "s" : "") +
                "?"
            )
          ]),
          _vm._v(" "),
          _c("p", [
            _vm._v(
              "All input of the selection" +
                _vm._s(_vm.selectedSelections.length > 1 ? "s" : "") +
                " will be permanently deleted."
            )
          ]),
          _vm._v(" "),
          _c("p", [
            _c("strong", [_vm._v("Please beware:")]),
            _vm._v(" All sub-selections will be deleted as well.")
          ])
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=template&id=59757838&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=template&id=59757838&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "selections-table-row" },
    [
      _c(
        "tr",
        {
          staticClass: "selection",
          class: { "is-hidden": _vm.isHidden },
          on: { contextmenu: _vm.emitShowContext, click: _vm.onClick }
        },
        [
          _c(
            "td",
            { staticClass: "select" },
            [
              _c("BaseCheckbox", {
                ref: "selectBox",
                attrs: {
                  value: _vm.selection,
                  modelValue: _vm.localSelectedSelections
                },
                model: {
                  value: _vm.localSelectedSelections,
                  callback: function($$v) {
                    _vm.localSelectedSelections = $$v
                  },
                  expression: "localSelectedSelections"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c("td", { staticClass: "locked" }, [
            !_vm.selection.is_open
              ? _c("i", {
                  directives: [
                    {
                      name: "tooltip",
                      rawName: "v-tooltip",
                      value: "Locked: Selection is read-only",
                      expression: "'Locked: Selection is read-only'"
                    }
                  ],
                  staticClass: "far fa-lock"
                })
              : _vm._e()
          ]),
          _vm._v(" "),
          _c(
            "td",
            {
              staticClass: "expand",
              class: { active: _vm.childrenExpanded },
              style: _vm.indent,
              on: {
                click: function($event) {
                  $event.stopPropagation()
                  return _vm.toggleExpanded($event)
                }
              }
            },
            [
              _vm.selection.children.length > 0
                ? _c("span", { staticClass: "square invisible" }, [
                    _c("i", { staticClass: "fas fa-caret-down" })
                  ])
                : _vm._e()
            ]
          ),
          _vm._v(" "),
          _vm.selectionToEdit &&
          _vm.selectionToEdit.selection.id == _vm.selection.id &&
          _vm.selectionToEdit.field == "name"
            ? _c(
                "td",
                { staticClass: "title", style: _vm.selectionWidth },
                [
                  _vm.isMaster
                    ? _c(
                        "i",
                        {
                          staticClass: "fa-poll master",
                          class: _vm.selection.id ? "fas" : "far"
                        },
                        [_c("i", { staticClass: "fas fa-crown" })]
                      )
                    : _c("i", {
                        staticClass: "fa-poll light-2",
                        class: _vm.selection.id ? "fas" : "far"
                      }),
                  _vm._v(" "),
                  _c("BaseEditInputWrapper", {
                    attrs: {
                      activateOnMount: "true",
                      type: "text",
                      value: _vm.selectionToEdit.selection.name,
                      oldValue: _vm.selection.name
                    },
                    on: {
                      submit: function($event) {
                        _vm.$emit("submitToEdit")
                        _vm.onUpdateSelection(_vm.selection)
                      },
                      cancel: function($event) {
                        return _vm.$emit("cancelToEdit", {
                          selection: _vm.selection,
                          parent: _vm.parent
                        })
                      }
                    },
                    model: {
                      value: _vm.selectionToEdit.selection.name,
                      callback: function($$v) {
                        _vm.$set(_vm.selectionToEdit.selection, "name", $$v)
                      },
                      expression: "selectionToEdit.selection.name"
                    }
                  })
                ],
                1
              )
            : _c(
                "td",
                {
                  staticClass: "title",
                  class: {
                    clickable:
                      !_vm.selection.is_presenting ||
                      (_vm.selection.is_presenting &&
                        _vm.selection.presentation_inherit_from == 0 &&
                        _vm.selection.your_job == "Alignment")
                  },
                  style: _vm.selectionWidth,
                  on: {
                    click: function($event) {
                      ;(!_vm.selection.is_presenting ||
                        (_vm.selection.is_presenting &&
                          _vm.selection.presentation_inherit_from == 0 &&
                          _vm.selection.your_job == "Alignment")) &&
                        _vm.onGoToSelection()
                    }
                  }
                },
                [
                  _vm.isMaster
                    ? _c(
                        "i",
                        {
                          staticClass: "fa-poll master",
                          class: _vm.selection.id ? "fas" : "far"
                        },
                        [_c("i", { staticClass: "fas fa-crown" })]
                      )
                    : _c("i", {
                        staticClass: "fa-poll light-2",
                        class: _vm.selection.id ? "fas" : "far"
                      }),
                  _vm._v(" "),
                  _c("span", { attrs: { title: _vm.selection.name } }, [
                    _vm._v(_vm._s(_vm.selection.name))
                  ])
                ]
              ),
          _vm._v(" "),
          _c(
            "td",
            { staticClass: "budget" },
            [
              _c(
                "v-popover",
                {
                  ref: "budgetInputPopover",
                  attrs: { trigger: "click" },
                  on: { "apply-show": _vm.onShowBudgetInput }
                },
                [
                  _vm.userHasEditAccess
                    ? _c("button", { staticClass: "ghost editable sm" }, [
                        _c("span", [
                          _vm._v(
                            _vm._s(
                              _vm._f("thousandSeparated")(
                                _vm.selection.budget || "Set budget"
                              )
                            )
                          )
                        ])
                      ])
                    : _c("span", [
                        _vm._v(
                          _vm._s(
                            _vm._f("thousandSeparated")(
                              _vm.selection.budget || "Set budget"
                            )
                          )
                        )
                      ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "budget-input-wrapper",
                      attrs: { slot: "popover" },
                      slot: "popover"
                    },
                    [
                      _c("BaseInputField", {
                        ref: "budgetInput",
                        attrs: { inputClass: "small", selectOnFocus: true },
                        nativeOn: {
                          keyup: function($event) {
                            if (
                              !$event.type.indexOf("key") &&
                              _vm._k(
                                $event.keyCode,
                                "enter",
                                13,
                                $event.key,
                                "Enter"
                              )
                            ) {
                              return null
                            }
                            _vm.onUpdateBudget(_vm.selection)
                            _vm.$refs.budgetInputPopover.hide()
                          }
                        },
                        model: {
                          value: _vm.newBudget,
                          callback: function($$v) {
                            _vm.newBudget = _vm._n($$v)
                          },
                          expression: "newBudget"
                        }
                      }),
                      _vm._v(" "),
                      _c("span", { staticClass: "currency" }, [
                        _vm._v(_vm._s(_vm.selection.currency))
                      ])
                    ],
                    1
                  )
                ]
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "td",
            {
              staticClass: "budget-spend",
              class: { over: _vm.budgetSpendPercentage > 100 }
            },
            [
              _vm.selection.budget > 0
                ? _c(
                    "span",
                    {
                      directives: [
                        {
                          name: "tooltip",
                          rawName: "v-tooltip",
                          value:
                            _vm.separateThousands(
                              _vm.selection.budget_spend.toFixed(0)
                            ) +
                            " " +
                            _vm.selection.currency,
                          expression:
                            "`${separateThousands(selection.budget_spend.toFixed(0))} ${selection.currency}`"
                        }
                      ]
                    },
                    [
                      _vm._v(
                        "\n                " +
                          _vm._s(_vm.budgetSpendPercentage) +
                          "%\n            "
                      )
                    ]
                  )
                : _vm._e()
            ]
          ),
          _vm._v(" "),
          _c("td", { staticClass: "currency" }, [
            _vm.userHasEditAccess
              ? _c(
                  "button",
                  {
                    staticClass: "ghost editable sm",
                    on: {
                      click: function($event) {
                        return _vm.$emit("showSelectionCurrencyContext", {
                          selection: _vm.selection,
                          e: $event
                        })
                      }
                    }
                  },
                  [
                    _c("span", [
                      _vm._v(_vm._s(_vm.selection.currency || "Set currency"))
                    ])
                  ]
                )
              : _c("span", [
                  _vm._v(_vm._s(_vm.selection.currency || "No currency set"))
                ])
          ]),
          _vm._v(" "),
          _c("td", { staticClass: "users" }, [
            _vm.userHasEditAccess
              ? _c(
                  "button",
                  {
                    staticClass: "ghost editable sm",
                    on: {
                      click: function($event) {
                        return _vm.$emit(
                          "showSelectionUsersFlyin",
                          _vm.selection
                        )
                      }
                    }
                  },
                  [
                    _c("i", { staticClass: "far fa-user" }),
                    _c("span", [_vm._v(_vm._s(_vm.selection.user_count))])
                  ]
                )
              : _c("span", [_vm._v("-")])
          ]),
          _vm._v(" "),
          _c(
            "td",
            { staticClass: "status" },
            [
              _vm.userHasEditAccess
                ? [
                    _c(
                      "BaseButton",
                      {
                        attrs: {
                          buttonClass:
                            "editable sm " + (_vm.selection.is_open && "ghost"),
                          disabled: _vm.selection.is_presenting,
                          disabledTooltip:
                            "You cannot lock a selection in presentation mode"
                        },
                        on: {
                          click: function($event) {
                            return _vm.onToggleLocked(_vm.selection)
                          }
                        }
                      },
                      [
                        _c("span", [
                          _vm._v(
                            _vm._s(_vm.selection.is_open ? "Open" : "Locked")
                          )
                        ]),
                        _vm._v(" "),
                        _c("i", {
                          staticClass: "far",
                          class: _vm.selection.is_open
                            ? "fa-lock-open"
                            : "fa-lock"
                        })
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "BaseButton",
                      {
                        attrs: {
                          buttonClass:
                            "editable sm " +
                            (_vm.selection.is_visible && "ghost"),
                          disabled: _vm.selection.is_presenting,
                          disabledTooltip:
                            "You cannot hide a selection in presentation mode"
                        },
                        on: {
                          click: function($event) {
                            return _vm.onToggleHidden(_vm.selection)
                          }
                        }
                      },
                      [
                        _c("span", [
                          _vm._v(
                            _vm._s(
                              !_vm.selection.is_visible ? "Hidden" : "Visible"
                            )
                          )
                        ]),
                        _vm._v(" "),
                        _c("i", {
                          staticClass: "far",
                          class: !_vm.selection.is_visible
                            ? "fa-eye-slash"
                            : "fa-eye"
                        })
                      ]
                    )
                  ]
                : _c("span", [_vm._v("-")])
            ],
            2
          ),
          _vm._v(" "),
          _c(
            "td",
            { staticClass: "presentation" },
            [
              _vm.selection.presentation_inherit_from == 0 &&
              _vm.selection.your_job == "Alignment"
                ? _c("SelectionPresenterModeButton", {
                    attrs: { selection: _vm.selection, showLabel: false }
                  })
                : _vm.selection.is_presenting
                ? _c(
                    "div",
                    {
                      directives: [
                        {
                          name: "tooltip",
                          rawName: "v-tooltip",
                          value:
                            "Selection is currently in presentation mode. Join the presentation from the Kollekt mobile app.",
                          expression:
                            "'Selection is currently in presentation mode. Join the presentation from the Kollekt mobile app.'"
                        }
                      ],
                      staticClass: "pill primary sm"
                    },
                    [
                      _c("i", {
                        staticClass: "far fa-presentation",
                        staticStyle: {
                          "font-size": "12px",
                          margin: "0 0px 0 4px",
                          "font-weight": "400"
                        }
                      }),
                      _vm._v(" "),
                      _c("span", [_vm._v("In presentation")])
                    ]
                  )
                : _vm._e()
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "td",
            { staticClass: "action" },
            [
              _vm.userHasEditAccess
                ? _c(
                    "button",
                    {
                      staticClass: "invisible ghost-hover",
                      on: {
                        click: function($event) {
                          return _vm.$emit(
                            "showSettingsContext",
                            $event,
                            _vm.selection
                          )
                        }
                      }
                    },
                    [_c("i", { staticClass: "fas fa-cog" })]
                  )
                : _vm._e(),
              _vm._v(" "),
              _vm.userHasEditAccess
                ? _c(
                    "button",
                    {
                      staticClass: "invisible ghost-hover",
                      on: { click: _vm.emitShowContext }
                    },
                    [_c("i", { staticClass: "fas fa-ellipsis-h" })]
                  )
                : _c(
                    "BaseButton",
                    {
                      directives: [
                        {
                          name: "tooltip",
                          rawName: "v-tooltip",
                          value:
                            _vm.selection.is_presenting &&
                            _vm.selection.your_role != "Owner" &&
                            "Selection is currently in presentation mode. Join the presentation from the Kollekt mobile app.",
                          expression:
                            "selection.is_presenting && selection.your_role != 'Owner' && 'Selection is currently in presentation mode. Join the presentation from the Kollekt mobile app.'"
                        }
                      ],
                      attrs: {
                        buttonClass: "invisible ghost-hover primary",
                        disabled:
                          _vm.selection.is_presenting &&
                          _vm.selection.your_role != "Owner"
                      },
                      on: { click: _vm.onGoToSelection }
                    },
                    [_c("span", [_vm._v("Go to Selection")])]
                  )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _vm.childrenExpanded
        ? _vm._l(_vm.selection.children, function(selectionChild) {
            return _c("selectionsTableRow", {
              key: selectionChild.id,
              attrs: {
                parent: _vm.selection,
                selection: selectionChild,
                path: _vm.path.concat(_vm.selection.id),
                selectionToEdit: _vm.selectionToEdit,
                depth: _vm.selectionDepth,
                moveSelectionActive: _vm.moveSelectionActive,
                selectedSelections: _vm.selectedSelections
              },
              on: {
                submitToEdit: function($event) {
                  return _vm.$emit("submitToEdit")
                },
                cancelToEdit: function($event) {
                  return _vm.$emit("cancelToEdit", $event)
                },
                showContext: _vm.emitEmissionShowContext,
                emitOnClick: _vm.emitOnClick,
                showSelectionUsersFlyin: function($event) {
                  return _vm.$emit("showSelectionUsersFlyin", $event)
                },
                showSelectionCurrencyContext: function($event) {
                  return _vm.$emit("showSelectionCurrencyContext", $event)
                },
                showSettingsContext: function($event, selection) {
                  _vm.$emit("showSettingsContext", $event, selection)
                }
              },
              model: {
                value: _vm.localSelectedSelections,
                callback: function($$v) {
                  _vm.localSelectedSelections = $$v
                },
                expression: "localSelectedSelections"
              }
            })
          })
        : _vm._e()
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=template&id=7b8e56fd&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=template&id=7b8e56fd&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************/
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
  return _c("BaseFlyin", {
    ref: "fileSingleFlyin",
    attrs: {
      show: _vm.show,
      disableKeyHandler: _vm.SelectionUsersFlyinVisible
    },
    on: {
      close: function($event) {
        return _vm.$emit("close")
      }
    },
    scopedSlots: _vm._u(
      [
        _vm.file && _vm.show
          ? {
              key: "header",
              fn: function() {
                return [
                  _c("BaseFlyinHeader", {
                    attrs: {
                      next: _vm.nextFile,
                      prev: _vm.prevFile,
                      disableNavigation: _vm.SelectionUsersFlyinVisible
                    },
                    on: {
                      close: function($event) {
                        return _vm.$emit("close")
                      },
                      next: _vm.showNext,
                      prev: _vm.showPrev
                    },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "left",
                          fn: function() {
                            return [
                              _c("h3", [
                                _vm._v(
                                  "File Overview: " + _vm._s(_vm.file.name)
                                )
                              ])
                            ]
                          },
                          proxy: true
                        },
                        {
                          key: "right",
                          fn: function() {
                            return [
                              _c(
                                "div",
                                { staticClass: "item-group" },
                                [
                                  _c(
                                    "BaseButton",
                                    {
                                      attrs: {
                                        buttonClass: "ghost",
                                        disabled:
                                          _vm.authUserWorkspaceRole != "Admin",
                                        disabledTooltip:
                                          "Only admins can manage file editors"
                                      },
                                      on: { click: _vm.showEditorsFlyin }
                                    },
                                    [
                                      _c("i", {
                                        staticClass: "far fa-user-cog"
                                      }),
                                      _vm._v(" "),
                                      _c("span", [_vm._v("Manage editors")])
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "BaseButton",
                                    {
                                      attrs: {
                                        buttonClass: "ghost",
                                        disabled:
                                          _vm.authUserWorkspaceRole !=
                                            "Admin" && !_vm.file.editable,
                                        disabledTooltip:
                                          "Only admins and editors can edit files"
                                      },
                                      on: { click: _vm.goToEditSingle }
                                    },
                                    [_c("span", [_vm._v("Edit products")])]
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
                      false,
                      3981092023
                    )
                  })
                ]
              },
              proxy: true
            }
          : null,
        _vm.file && _vm.show
          ? {
              key: "default",
              fn: function() {
                return [
                  _c(
                    "div",
                    { staticClass: "file-single" },
                    [
                      _c("SelectionsTable", {
                        on: {
                          showSelectionUsersFlyin: _vm.showSelectionUsersFlyin
                        }
                      }),
                      _vm._v(" "),
                      _c("SelectionUsersFlyin", {
                        attrs: {
                          selection: _vm.currentSelection,
                          show: _vm.SelectionUsersFlyinVisible
                        },
                        on: {
                          close: function($event) {
                            _vm.SelectionUsersFlyinVisible = false
                          }
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.show
                    ? _c("FileEditorsFlyin", {
                        attrs: {
                          show: _vm.showFileEditorsFlyin,
                          file: _vm.file
                        },
                        on: {
                          close: function($event) {
                            _vm.showFileEditorsFlyin = false
                          }
                        }
                      })
                    : _vm._e()
                ]
              },
              proxy: true
            }
          : null
      ],
      null,
      true
    )
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=template&id=ee3a420c&":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=template&id=ee3a420c& ***!
  \********************************************************************************************************************************************************************************************************************/
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
    "BaseTableInnerRow",
    { staticClass: "file" },
    [
      _vm.fileToEdit && _vm.fileToEdit.id == _vm.file.id
        ? _c(
            "td",
            { staticClass: "title" },
            [
              !_vm.file.id
                ? _c("i", { staticClass: "far fa-file" })
                : _c("i", { staticClass: "fas fa-file" }),
              _vm._v(" "),
              _c("BaseInputField", {
                attrs: {
                  inputClass: "small",
                  focusOnMount: true,
                  selectOnFocus: true,
                  type: "text",
                  actionOnBlur: "Cancel"
                },
                on: { submit: _vm.onSubmitEdit, cancel: _vm.onCancelEdit },
                model: {
                  value: _vm.fileToEdit.name,
                  callback: function($$v) {
                    _vm.$set(_vm.fileToEdit, "name", $$v)
                  },
                  expression: "fileToEdit.name"
                }
              })
            ],
            1
          )
        : _c(
            "Draggable",
            {
              attrs: {
                forceFallback: true,
                fallbackClass: "sortable-drag",
                fallbackTolerance: 10,
                group: { name: "files", pull: "clone", put: false }
              },
              on: {
                start: function($event) {
                  return _vm.$emit("drag-start", _vm.file)
                },
                end: function($event) {
                  return _vm.$emit("drag-end")
                }
              }
            },
            [
              _c(
                "td",
                {
                  staticClass: "title clickable",
                  on: {
                    click: function($event) {
                      if (
                        $event.ctrlKey ||
                        $event.shiftKey ||
                        $event.altKey ||
                        $event.metaKey
                      ) {
                        return null
                      }
                      !_vm.dragActive && _vm.onShowSingleFile(_vm.file)
                    }
                  }
                },
                [
                  !_vm.file.id
                    ? _c("i", { staticClass: "far fa-file" })
                    : _c("i", { staticClass: "fas fa-file" }),
                  _vm._v(" "),
                  _c("span", [_vm._v(_vm._s(_vm.file.name))])
                ]
              )
            ]
          ),
      _vm._v(" "),
      _c("td", { staticClass: "action" }, [
        _c(
          "button",
          {
            staticClass: "invisible ghost-hover primary",
            on: {
              click: function($event) {
                return _vm.onShowSingleFile(_vm.file)
              }
            }
          },
          [_c("span", [_vm._v("View file")])]
        )
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=template&id=4986bbe4&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=template&id=4986bbe4&scoped=true& ***!
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
    { staticClass: "files-page" },
    [
      _c("Breadcrumbs"),
      _vm._v(" "),
      !_vm.currentFolder
        ? _c("h1", [_vm._v("Files")])
        : _c("h1", [_vm._v(_vm._s(_vm.currentFolder.name))]),
      _vm._v(" "),
      _c("FilesTable", {
        on: {
          setCurrentFolder: _vm.onSetCurrentFolder,
          showSingleFile: _vm.showSingleFile,
          showFileOwnersFlyin: _vm.showFileOwnersFlyin
        }
      }),
      _vm._v(" "),
      _c("FileFlyin", {
        attrs: { file: _vm.currentFile, show: _vm.getFileFlyinIsVisible },
        on: {
          close: function($event) {
            return _vm.SET_FILE_FLYIN_VISIBLE(false)
          },
          showFileOwnersFlyin: _vm.showFileOwnersFlyin,
          showFileApproversFlyin: _vm.showFileApproversFlyin
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=template&id=3ebb98c9&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=template&id=3ebb98c9&scoped=true& ***!
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
    { staticClass: "folders-table-wrapper" },
    [
      _c("BaseTable", {
        ref: "tableComp",
        staticClass: "folders-table",
        attrs: {
          stickyHeader: "true",
          contentStatus: _vm.readyStatus,
          loadingMsg: "loading folder content",
          errorMsg: "error loading folder content",
          errorCallback: function() {
            return _vm.initData()
          },
          items: _vm.files,
          searchResult: _vm.filesFilteredBySearch,
          searchKey: ["title", "name"],
          itemKey: "id",
          itemSize: 50,
          selected: _vm.selected,
          contextItem: _vm.contextMenuItem,
          contextMouseEvent: _vm.contextMouseEvent,
          useVirtualScroller: false
        },
        on: {
          "update:searchResult": function($event) {
            _vm.filesFilteredBySearch = $event
          },
          "update:search-result": function($event) {
            _vm.filesFilteredBySearch = $event
          },
          "update:selected": function($event) {
            _vm.selected = $event
          },
          "update:contextItem": function($event) {
            _vm.contextMenuItem = $event
          },
          "update:context-item": function($event) {
            _vm.contextMenuItem = $event
          },
          "update:contextMouseEvent": function($event) {
            _vm.contextMouseEvent = $event
          },
          "update:context-mouse-event": function($event) {
            _vm.contextMouseEvent = $event
          },
          "show-contextmenu": _vm.showContextMenu
        },
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [
                _c(
                  "BaseTableHeader",
                  {
                    staticClass: "title",
                    attrs: { sortKey: "name", currentSortKey: _vm.sortKey },
                    on: { sort: _vm.onSort }
                  },
                  [_vm._v("Name")]
                ),
                _vm._v(" "),
                _c("BaseTableHeader", { staticClass: "action" })
              ]
            },
            proxy: true
          },
          {
            key: "row",
            fn: function(rowProps) {
              return [
                rowProps.item.type == "Folder"
                  ? _c("FolderTableRow", {
                      attrs: {
                        folder: rowProps.item,
                        fileToEdit: _vm.fileToEdit,
                        dragActive: _vm.dragActive,
                        dragHoverId: _vm.dragHoverId
                      },
                      on: {
                        "update:fileToEdit": function($event) {
                          _vm.fileToEdit = $event
                        },
                        "update:file-to-edit": function($event) {
                          _vm.fileToEdit = $event
                        },
                        "drag-start": _vm.onDragStart,
                        "drag-end": _vm.onDragEnd,
                        mouseenter: function($event) {
                          return _vm.onDragenter(rowProps.item)
                        },
                        mouseleave: _vm.onDragLeave
                      }
                    })
                  : _c("FileTableRow", {
                      attrs: {
                        file: rowProps.item,
                        fileToEdit: _vm.fileToEdit
                      },
                      on: {
                        "update:fileToEdit": function($event) {
                          _vm.fileToEdit = $event
                        },
                        "update:file-to-edit": function($event) {
                          _vm.fileToEdit = $event
                        },
                        "show-single-file": _vm.showSingleFile
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
                              "Only admins can create new folders",
                            expression:
                              "authUserWorkspaceRole != 'Admin' && 'Only admins can create new folders'"
                          }
                        ],
                        attrs: {
                          disabled: _vm.authUserWorkspaceRole != "Admin",
                          buttonClass: "primary invisible"
                        },
                        on: { click: _vm.onNewFolder }
                      },
                      [
                        _c("i", { staticClass: "far fa-plus" }),
                        _c("span", [_vm._v("Add new: Folder")])
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
      _c("BaseModal", {
        ref: "moveItemModal",
        attrs: {
          header:
            "Move " +
            _vm.filesToMove.length +
            " item" +
            (_vm.filesToMove.length > 1 ? "s" : "") +
            " to..",
          classes: "move-item-modal",
          show: _vm.showMoveModal
        },
        on: {
          close: function($event) {
            _vm.showMoveModal = false
          }
        },
        scopedSlots: _vm._u([
          {
            key: "default",
            fn: function() {
              return [
                _vm.filesToMove != null
                  ? _c("div", { staticClass: "inner" }, [
                      _c("div", { staticStyle: { "margin-bottom": "12px" } }, [
                        _vm.destinationFolder.id != _vm.currentWorkspace.id
                          ? _c(
                              "button",
                              {
                                staticClass:
                                  "invisible ghost-hover true-square",
                                on: {
                                  click: function($event) {
                                    return _vm.setDestinationFolder(
                                      _vm.destinationFolder.parent_id
                                    )
                                  }
                                }
                              },
                              [_c("i", { staticClass: "fas fa-arrow-left" })]
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.destinationFolder.id != null
                          ? _c("span", [
                              _vm._v(_vm._s(_vm.destinationFolder.name))
                            ])
                          : _c("span", [
                              _c(
                                "span",
                                { staticClass: "square true-square" },
                                [_c("i", { staticClass: "far fa-building" })]
                              ),
                              _vm._v(" " + _vm._s(_vm.currentWorkspace.name))
                            ])
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "folders-wrapper" },
                        [
                          _vm._l(
                            _vm.destinationFolderContent.filter(function(x) {
                              return x.type == "Folder"
                            }),
                            function(thisFolder) {
                              return [
                                _c(
                                  "div",
                                  { key: thisFolder.id, staticClass: "folder" },
                                  [
                                    !_vm.filesToMove.find(function(x) {
                                      return x.id == thisFolder.id
                                    })
                                      ? _c(
                                          "span",
                                          {
                                            staticClass: "clickable",
                                            on: {
                                              click: function($event) {
                                                return _vm.setDestinationFolder(
                                                  thisFolder.id
                                                )
                                              }
                                            }
                                          },
                                          [
                                            _c("i", {
                                              staticClass:
                                                "fas fa-folder dark15"
                                            }),
                                            _vm._v(
                                              " " +
                                                _vm._s(thisFolder.name) +
                                                "\n                            "
                                            )
                                          ]
                                        )
                                      : _c(
                                          "span",
                                          {
                                            directives: [
                                              {
                                                name: "tooltip",
                                                rawName: "v-tooltip",
                                                value:
                                                  "Cannot place a folder inside itself",
                                                expression:
                                                  "'Cannot place a folder inside itself'"
                                              }
                                            ],
                                            staticClass: "disabled",
                                            staticStyle: { opacity: ".5" }
                                          },
                                          [
                                            _c("i", {
                                              staticClass:
                                                "fas fa-folder dark15"
                                            }),
                                            _vm._v(
                                              " " +
                                                _vm._s(thisFolder.name) +
                                                "\n                            "
                                            )
                                          ]
                                        )
                                  ]
                                )
                              ]
                            }
                          ),
                          _vm._v(" "),
                          _vm.destinationFolderContent.filter(function(x) {
                            return x.type == "Folder"
                          }).length <= 0
                            ? _c("p", [_vm._v("No folders..")])
                            : _vm._e()
                        ],
                        2
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "controls",
                          staticStyle: {
                            display: "flex",
                            "justify-content": "flex-end",
                            "margin-top": "12px"
                          }
                        },
                        [
                          _c(
                            "button",
                            {
                              staticClass: "invisible dark ghost-hover",
                              on: {
                                click: function($event) {
                                  _vm.showMoveModal = false
                                }
                              }
                            },
                            [_c("span", [_vm._v("Cancel")])]
                          ),
                          _vm._v(" "),
                          _c(
                            "button",
                            {
                              staticClass: "primary",
                              class: {
                                disabled:
                                  _vm.destinationFolder.id ==
                                    _vm.filesToMove.id ||
                                  _vm.destinationFolder.id ==
                                    _vm.filesToMove.parent_id
                              },
                              on: {
                                click: function($event) {
                                  return _vm.submitMoveItem()
                                }
                              }
                            },
                            [_c("span", [_vm._v("Move here")])]
                          )
                        ]
                      )
                    ])
                  : _vm._e()
              ]
            },
            proxy: true
          }
        ])
      }),
      _vm._v(" "),
      _c(
        "BaseContextMenu",
        { ref: "contextMenuFolder", staticClass: "context-folder" },
        [
          _c(
            "div",
            { staticClass: "item-group" },
            [
              _c(
                "BaseContextMenuItem",
                {
                  attrs: { iconClass: "far fa-folder-open", hotkey: "KeyO" },
                  on: {
                    click: function($event) {
                      return _vm.setCurrentFolder(_vm.contextMenuItem)
                    }
                  }
                },
                [_c("u", [_vm._v("O")]), _vm._v("pen folder\n            ")]
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
                    iconClass: "far fa-pen",
                    disabled: _vm.authUserWorkspaceRole != "Admin",
                    disabledTooltip: "Only admins can rename folders",
                    hotkey: "KeyR"
                  },
                  on: {
                    click: function($event) {
                      _vm.fileToEdit = _vm.contextMenuItem
                    }
                  }
                },
                [_c("span", [_c("u", [_vm._v("R")]), _vm._v("ename")])]
              ),
              _vm._v(" "),
              _c(
                "BaseContextMenuItem",
                {
                  attrs: {
                    iconClass: "far fa-long-arrow-alt-right",
                    disabled: _vm.authUserWorkspaceRole != "Admin",
                    disabledTooltip: "Only admins can move folders",
                    hotkey: "KeyM"
                  },
                  on: {
                    click: function($event) {
                      return _vm.onMoveFiles()
                    }
                  }
                },
                [_c("span", [_c("u", [_vm._v("M")]), _vm._v("ove to")])]
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
                    iconClass: "far fa-trash-alt",
                    disabled: _vm.authUserWorkspaceRole != "Admin",
                    disabledTooltip: "Only admins can delete folders",
                    hotkey: "KeyD"
                  },
                  on: {
                    click: function($event) {
                      return _vm.onDeleteFolder(_vm.contextMenuItem)
                    }
                  }
                },
                [_c("span", [_c("u", [_vm._v("D")]), _vm._v("elete folder")])]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "BaseContextMenu",
        { ref: "contextMenuFile", staticClass: "context-file" },
        [
          _vm.contextMenuItem
            ? _c(
                "div",
                { staticClass: "item-group" },
                [
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: { iconClass: "far fa-file", hotkey: "KeyV" },
                      on: {
                        click: function($event) {
                          return _vm.showSingleFile(_vm.contextMenuItem)
                        }
                      }
                    },
                    [_c("u", [_vm._v("V")]), _vm._v("iew file\n            ")]
                  ),
                  _vm._v(" "),
                  _c(
                    "BaseContextMenuItem",
                    {
                      attrs: {
                        iconClass: "far fa-file-edit",
                        disabled:
                          _vm.authUserWorkspaceRole != "Admin" &&
                          !_vm.contextMenuItem.editable,
                        disabledTooltip:
                          "Only admins and editors can edit files",
                        hotkey: "KeyE"
                      },
                      on: {
                        click: function($event) {
                          return _vm.onGoToEditFile(_vm.contextMenuItem.id)
                        }
                      }
                    },
                    [
                      _c("span", [
                        _vm._v("View / "),
                        _c("u", [_vm._v("e")]),
                        _vm._v("dit products")
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
                    iconClass: "far fa-pen",
                    disabled: _vm.authUserWorkspaceRole != "Admin",
                    disabledTooltip: "Only admins can rename files",
                    hotkey: "KeyR"
                  },
                  on: {
                    click: function($event) {
                      _vm.fileToEdit = _vm.contextMenuItem
                    }
                  }
                },
                [_c("span", [_c("u", [_vm._v("R")]), _vm._v("ename")])]
              ),
              _vm._v(" "),
              _c(
                "BaseContextMenuItem",
                {
                  attrs: {
                    iconClass: "far fa-long-arrow-alt-right",
                    disabled: _vm.authUserWorkspaceRole != "Admin",
                    disabledTooltip: "Only admins can move files",
                    hotkey: "KeyM"
                  },
                  on: {
                    click: function($event) {
                      return _vm.onMoveFiles()
                    }
                  }
                },
                [_c("span", [_c("u", [_vm._v("M")]), _vm._v("ove to")])]
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
                    iconClass: "far fa-trash-alt",
                    disabled: _vm.authUserWorkspaceRole != "Admin",
                    disabledTooltip: "Only admins can delete files",
                    hotkey: "KeyD"
                  },
                  on: {
                    click: function($event) {
                      return _vm.onDeleteFile(_vm.contextMenuItem)
                    }
                  }
                },
                [_c("span", [_c("u", [_vm._v("D")]), _vm._v("elete file")])]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "BaseContextMenu",
        { ref: "contextMenuMultipleItems", staticClass: "context-file" },
        [
          _c("template", { slot: "header" }, [
            _c("span", [
              _vm._v(
                "Choose action for " + _vm._s(_vm.selected.length) + " items"
              )
            ])
          ]),
          _vm._v(" "),
          _c("template", { slot: "default" }, [
            _c(
              "div",
              { staticClass: "item-group" },
              [
                _c(
                  "BaseContextMenuItem",
                  {
                    attrs: { iconClass: "far fa-times", hotkey: "KeyC" },
                    on: {
                      click: function($event) {
                        _vm.selected = []
                      }
                    }
                  },
                  [
                    _c("span", [
                      _c("u", [_vm._v("C")]),
                      _vm._v("lear selection")
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
                      iconClass: "far fa-long-arrow-alt-right",
                      disabled: _vm.authUserWorkspaceRole != "Admin",
                      disabledTooltip: "Only admins can move files",
                      hotkey: "KeyM"
                    },
                    on: {
                      click: function($event) {
                        return _vm.onMoveFiles()
                      }
                    }
                  },
                  [_c("span", [_c("u", [_vm._v("M")]), _vm._v("ove to")])]
                ),
                _vm._v(" "),
                _c(
                  "BaseContextMenuItem",
                  {
                    attrs: {
                      iconClass: "far fa-trash-alt",
                      disabled: _vm.authUserWorkspaceRole != "Admin",
                      disabledTooltip: "Only admins can delete file",
                      hotkey: "KeyD"
                    },
                    on: {
                      click: function($event) {
                        return _vm.onDeleteMultipleFiles(_vm.selected)
                      }
                    }
                  },
                  [_c("span", [_c("u", [_vm._v("D")]), _vm._v("elete items")])]
                )
              ],
              1
            )
          ])
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "BaseDialog",
        {
          ref: "deleteFileDialog",
          attrs: {
            type: "confirm",
            confirmText: "Yes, delete it",
            cancelText: "No, keep it",
            confirmColor: "red"
          }
        },
        [
          _c("div", { staticClass: "icon-graphic" }, [
            _c("i", { staticClass: "far fa-file primary lg" }),
            _vm._v(" "),
            _c("i", { staticClass: "far fa-arrow-right lg" }),
            _vm._v(" "),
            _c("i", { staticClass: "far fa-trash lg dark" })
          ]),
          _vm._v(" "),
          _c("h3", [_vm._v("Really delete this file?")]),
          _vm._v(" "),
          _c("p", [
            _vm._v(
              "All comments, requests and actions will be permanently deleted."
            )
          ])
        ]
      ),
      _vm._v(" "),
      _c(
        "BaseDialog",
        {
          ref: "deleteFolderDialog",
          attrs: {
            type: "confirm",
            confirmText: "Yes, delete it",
            cancelText: "No, keep it",
            confirmColor: "red"
          }
        },
        [
          _c("div", { staticClass: "icon-graphic" }, [
            _c("i", { staticClass: "far fa-file primary lg" }),
            _vm._v(" "),
            _c("i", { staticClass: "far fa-arrow-right lg" }),
            _vm._v(" "),
            _c("i", { staticClass: "far fa-trash lg dark" })
          ]),
          _vm._v(" "),
          _c("h3", [_vm._v("Really delete this folder?")]),
          _vm._v(" "),
          _c("p", [
            _vm._v(
              "The folder and all of its contents will be permanently deleted."
            )
          ])
        ]
      ),
      _vm._v(" "),
      _c(
        "BaseDialog",
        {
          ref: "deleteMultipleDialog",
          attrs: {
            type: "confirm",
            confirmText: "Yes, delete them",
            cancelText: "No, keep them",
            confirmColor: "red"
          }
        },
        [
          _c("div", { staticClass: "icon-graphic" }, [
            _c("i", { staticClass: "far fa-copy primary lg" }),
            _vm._v(" "),
            _c("i", { staticClass: "far fa-arrow-right lg" }),
            _vm._v(" "),
            _c("i", { staticClass: "far fa-trash lg dark" })
          ]),
          _vm._v(" "),
          _c("h3", [
            _vm._v(
              "Really delete " + _vm._s(_vm.selected.length) + " files/folders?"
            )
          ]),
          _vm._v(" "),
          _c("p", [
            _vm._v(
              "folders and files contained in your selection and all their comments, requests and actions will be permanently deleted."
            )
          ])
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=template&id=5787ac6c&":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=template&id=5787ac6c& ***!
  \**********************************************************************************************************************************************************************************************************************/
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
    "BaseTableInnerRow",
    { staticClass: "folder" },
    [
      _vm.fileToEdit && _vm.fileToEdit.id == _vm.folder.id
        ? _c(
            "td",
            { staticClass: "title" },
            [
              _vm.folder.id
                ? _c("i", { staticClass: "fas fa-folder" })
                : _c("i", { staticClass: "far fa-folder" }),
              _vm._v(" "),
              _c("BaseInputField", {
                attrs: {
                  inputClass: "small",
                  focusOnMount: true,
                  selectOnFocus: true,
                  type: "text",
                  actionOnBlur: !_vm.folder.id ? "Submit" : "Cancel"
                },
                on: { submit: _vm.onSubmitEdit, cancel: _vm.onCancelEdit },
                model: {
                  value: _vm.fileToEdit.name,
                  callback: function($$v) {
                    _vm.$set(_vm.fileToEdit, "name", $$v)
                  },
                  expression: "fileToEdit.name"
                }
              })
            ],
            1
          )
        : _c(
            "Draggable",
            {
              attrs: {
                forceFallback: true,
                fallbackClass: "sortable-drag",
                fallbackTolerance: 10,
                group: { name: "folders", pull: "clone", put: false }
              },
              on: {
                start: function($event) {
                  return _vm.$emit("drag-start", _vm.folder)
                },
                end: function($event) {
                  return _vm.$emit("drag-end")
                }
              }
            },
            [
              _c(
                "td",
                {
                  staticClass: "title clickable",
                  on: {
                    click: function($event) {
                      if (
                        $event.ctrlKey ||
                        $event.shiftKey ||
                        $event.altKey ||
                        $event.metaKey
                      ) {
                        return null
                      }
                      _vm.dragActive != true && _vm.setCurrentFolder(_vm.folder)
                    }
                  }
                },
                [
                  !_vm.folder.id
                    ? _c("i", { staticClass: "far fa-folder" })
                    : _c("i", {
                        staticClass: "fas",
                        class:
                          _vm.dragActive == true &&
                          _vm.dragHoverId == _vm.folder.id &&
                          _vm.filesToMove[0].id != _vm.folder.id
                            ? "fa-folder-open"
                            : "fa-folder"
                      }),
                  _vm._v(" "),
                  _c("span", [_vm._v(_vm._s(_vm.folder.name))])
                ]
              )
            ]
          ),
      _vm._v(" "),
      _c("td", { staticClass: "action" }, [
        _c(
          "button",
          {
            staticClass: "invisible ghost-hover primary",
            on: {
              click: function($event) {
                return _vm.setCurrentFolder(_vm.folder)
              }
            }
          },
          [_c("span", [_vm._v("Open folder")])]
        )
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/index.vue?vue&type=template&id=1be71430&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/FilesPage/index.vue?vue&type=template&id=1be71430&scoped=true& ***!
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
  return _c("PageLoader", [_c("FilesPage")], 1)
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./resources/js/components/FileApproversFlyin/FileApproversTable.vue":
/*!***************************************************************************!*\
  !*** ./resources/js/components/FileApproversFlyin/FileApproversTable.vue ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileApproversTable_vue_vue_type_template_id_419eac2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileApproversTable.vue?vue&type=template&id=419eac2c&scoped=true& */ "./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=template&id=419eac2c&scoped=true&");
/* harmony import */ var _FileApproversTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileApproversTable.vue?vue&type=script&lang=js& */ "./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FileApproversTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileApproversTable_vue_vue_type_template_id_419eac2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FileApproversTable_vue_vue_type_template_id_419eac2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "419eac2c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/FileApproversFlyin/FileApproversTable.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************!*\
  !*** ./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileApproversTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./FileApproversTable.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileApproversTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=template&id=419eac2c&scoped=true&":
/*!**********************************************************************************************************************!*\
  !*** ./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=template&id=419eac2c&scoped=true& ***!
  \**********************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileApproversTable_vue_vue_type_template_id_419eac2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./FileApproversTable.vue?vue&type=template&id=419eac2c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileApproversFlyin/FileApproversTable.vue?vue&type=template&id=419eac2c&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileApproversTable_vue_vue_type_template_id_419eac2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileApproversTable_vue_vue_type_template_id_419eac2c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/FileApproversFlyin/index.vue":
/*!**************************************************************!*\
  !*** ./resources/js/components/FileApproversFlyin/index.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_52d93798___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=52d93798& */ "./resources/js/components/FileApproversFlyin/index.vue?vue&type=template&id=52d93798&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/components/FileApproversFlyin/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_52d93798___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_52d93798___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/FileApproversFlyin/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/FileApproversFlyin/index.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/js/components/FileApproversFlyin/index.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileApproversFlyin/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/FileApproversFlyin/index.vue?vue&type=template&id=52d93798&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/components/FileApproversFlyin/index.vue?vue&type=template&id=52d93798& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_52d93798___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=52d93798& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileApproversFlyin/index.vue?vue&type=template&id=52d93798&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_52d93798___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_52d93798___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue":
/*!*********************************************************************!*\
  !*** ./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileOwnersTable_vue_vue_type_template_id_3ce634a4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileOwnersTable.vue?vue&type=template&id=3ce634a4&scoped=true& */ "./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=template&id=3ce634a4&scoped=true&");
/* harmony import */ var _FileOwnersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileOwnersTable.vue?vue&type=script&lang=js& */ "./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FileOwnersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileOwnersTable_vue_vue_type_template_id_3ce634a4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FileOwnersTable_vue_vue_type_template_id_3ce634a4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "3ce634a4",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/FileOwnersFlyin/FileOwnersTable.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileOwnersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./FileOwnersTable.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileOwnersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=template&id=3ce634a4&scoped=true&":
/*!****************************************************************************************************************!*\
  !*** ./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=template&id=3ce634a4&scoped=true& ***!
  \****************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileOwnersTable_vue_vue_type_template_id_3ce634a4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./FileOwnersTable.vue?vue&type=template&id=3ce634a4&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileOwnersFlyin/FileOwnersTable.vue?vue&type=template&id=3ce634a4&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileOwnersTable_vue_vue_type_template_id_3ce634a4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileOwnersTable_vue_vue_type_template_id_3ce634a4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/FileOwnersFlyin/index.vue":
/*!***********************************************************!*\
  !*** ./resources/js/components/FileOwnersFlyin/index.vue ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_25947da4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=25947da4& */ "./resources/js/components/FileOwnersFlyin/index.vue?vue&type=template&id=25947da4&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/components/FileOwnersFlyin/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_25947da4___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_25947da4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/FileOwnersFlyin/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/FileOwnersFlyin/index.vue?vue&type=script&lang=js&":
/*!************************************************************************************!*\
  !*** ./resources/js/components/FileOwnersFlyin/index.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileOwnersFlyin/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/FileOwnersFlyin/index.vue?vue&type=template&id=25947da4&":
/*!******************************************************************************************!*\
  !*** ./resources/js/components/FileOwnersFlyin/index.vue?vue&type=template&id=25947da4& ***!
  \******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_25947da4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=25947da4& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/FileOwnersFlyin/index.vue?vue&type=template&id=25947da4&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_25947da4___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_25947da4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue":
/*!*****************************************************************************!*\
  !*** ./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SelectionTeamsTable_vue_vue_type_template_id_caf51a14_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectionTeamsTable.vue?vue&type=template&id=caf51a14&scoped=true& */ "./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=template&id=caf51a14&scoped=true&");
/* harmony import */ var _SelectionTeamsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectionTeamsTable.vue?vue&type=script&lang=js& */ "./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SelectionTeamsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SelectionTeamsTable_vue_vue_type_template_id_caf51a14_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SelectionTeamsTable_vue_vue_type_template_id_caf51a14_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "caf51a14",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************!*\
  !*** ./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionTeamsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionTeamsTable.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionTeamsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=template&id=caf51a14&scoped=true&":
/*!************************************************************************************************************************!*\
  !*** ./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=template&id=caf51a14&scoped=true& ***!
  \************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionTeamsTable_vue_vue_type_template_id_caf51a14_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionTeamsTable.vue?vue&type=template&id=caf51a14&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionTeamsTable.vue?vue&type=template&id=caf51a14&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionTeamsTable_vue_vue_type_template_id_caf51a14_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionTeamsTable_vue_vue_type_template_id_caf51a14_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue":
/*!*****************************************************************************!*\
  !*** ./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SelectionUsersTable_vue_vue_type_template_id_e268aa38_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectionUsersTable.vue?vue&type=template&id=e268aa38&scoped=true& */ "./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=template&id=e268aa38&scoped=true&");
/* harmony import */ var _SelectionUsersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectionUsersTable.vue?vue&type=script&lang=js& */ "./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _SelectionUsersTable_vue_vue_type_style_index_0_id_e268aa38_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss& */ "./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SelectionUsersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SelectionUsersTable_vue_vue_type_template_id_e268aa38_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SelectionUsersTable_vue_vue_type_template_id_e268aa38_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "e268aa38",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************!*\
  !*** ./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionUsersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionUsersTable.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionUsersTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss&":
/*!***************************************************************************************************************************************!*\
  !*** ./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss& ***!
  \***************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionUsersTable_vue_vue_type_style_index_0_id_e268aa38_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=style&index=0&id=e268aa38&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionUsersTable_vue_vue_type_style_index_0_id_e268aa38_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionUsersTable_vue_vue_type_style_index_0_id_e268aa38_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionUsersTable_vue_vue_type_style_index_0_id_e268aa38_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionUsersTable_vue_vue_type_style_index_0_id_e268aa38_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionUsersTable_vue_vue_type_style_index_0_id_e268aa38_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=template&id=e268aa38&scoped=true&":
/*!************************************************************************************************************************!*\
  !*** ./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=template&id=e268aa38&scoped=true& ***!
  \************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionUsersTable_vue_vue_type_template_id_e268aa38_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionUsersTable.vue?vue&type=template&id=e268aa38&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/SelectionUsersTable.vue?vue&type=template&id=e268aa38&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionUsersTable_vue_vue_type_template_id_e268aa38_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionUsersTable_vue_vue_type_template_id_e268aa38_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/SelectionUsersFlyin/index.vue":
/*!***************************************************************!*\
  !*** ./resources/js/components/SelectionUsersFlyin/index.vue ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_059bfff8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=059bfff8& */ "./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=template&id=059bfff8&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_059bfff8___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_059bfff8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/SelectionUsersFlyin/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=script&lang=js&":
/*!****************************************************************************************!*\
  !*** ./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=template&id=059bfff8&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=template&id=059bfff8& ***!
  \**********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_059bfff8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=059bfff8& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SelectionUsersFlyin/index.vue?vue&type=template&id=059bfff8&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_059bfff8___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_059bfff8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue":
/*!*********************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileEditorsFlyin_vue_vue_type_template_id_29fcf4b3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileEditorsFlyin.vue?vue&type=template&id=29fcf4b3& */ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=template&id=29fcf4b3&");
/* harmony import */ var _FileEditorsFlyin_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileEditorsFlyin.vue?vue&type=script&lang=js& */ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FileEditorsFlyin_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileEditorsFlyin_vue_vue_type_template_id_29fcf4b3___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FileEditorsFlyin_vue_vue_type_template_id_29fcf4b3___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsFlyin_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileEditorsFlyin.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsFlyin_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=template&id=29fcf4b3&":
/*!****************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=template&id=29fcf4b3& ***!
  \****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsFlyin_vue_vue_type_template_id_29fcf4b3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileEditorsFlyin.vue?vue&type=template&id=29fcf4b3& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsFlyin.vue?vue&type=template&id=29fcf4b3&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsFlyin_vue_vue_type_template_id_29fcf4b3___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsFlyin_vue_vue_type_template_id_29fcf4b3___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue":
/*!*********************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileEditorsTable_vue_vue_type_template_id_12fe7ca9___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileEditorsTable.vue?vue&type=template&id=12fe7ca9& */ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=template&id=12fe7ca9&");
/* harmony import */ var _FileEditorsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileEditorsTable.vue?vue&type=script&lang=js& */ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FileEditorsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileEditorsTable_vue_vue_type_template_id_12fe7ca9___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FileEditorsTable_vue_vue_type_template_id_12fe7ca9___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileEditorsTable.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=template&id=12fe7ca9&":
/*!****************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=template&id=12fe7ca9& ***!
  \****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTable_vue_vue_type_template_id_12fe7ca9___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileEditorsTable.vue?vue&type=template&id=12fe7ca9& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTable.vue?vue&type=template&id=12fe7ca9&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTable_vue_vue_type_template_id_12fe7ca9___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTable_vue_vue_type_template_id_12fe7ca9___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue":
/*!************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileEditorsTableRow_vue_vue_type_template_id_7d3f90be_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileEditorsTableRow.vue?vue&type=template&id=7d3f90be&scoped=true& */ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=template&id=7d3f90be&scoped=true&");
/* harmony import */ var _FileEditorsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileEditorsTableRow.vue?vue&type=script&lang=js& */ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _FileEditorsTableRow_vue_vue_type_style_index_0_id_7d3f90be_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss& */ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FileEditorsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileEditorsTableRow_vue_vue_type_template_id_7d3f90be_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FileEditorsTableRow_vue_vue_type_template_id_7d3f90be_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "7d3f90be",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileEditorsTableRow.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss&":
/*!**********************************************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss& ***!
  \**********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTableRow_vue_vue_type_style_index_0_id_7d3f90be_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader!../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--7-2!../../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=style&index=0&id=7d3f90be&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTableRow_vue_vue_type_style_index_0_id_7d3f90be_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTableRow_vue_vue_type_style_index_0_id_7d3f90be_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTableRow_vue_vue_type_style_index_0_id_7d3f90be_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTableRow_vue_vue_type_style_index_0_id_7d3f90be_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTableRow_vue_vue_type_style_index_0_id_7d3f90be_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=template&id=7d3f90be&scoped=true&":
/*!*******************************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=template&id=7d3f90be&scoped=true& ***!
  \*******************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTableRow_vue_vue_type_template_id_7d3f90be_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./FileEditorsTableRow.vue?vue&type=template&id=7d3f90be&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/FileEditorsTableRow.vue?vue&type=template&id=7d3f90be&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTableRow_vue_vue_type_template_id_7d3f90be_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileEditorsTableRow_vue_vue_type_template_id_7d3f90be_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue":
/*!********************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SelectionsTable_vue_vue_type_template_id_4340491c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectionsTable.vue?vue&type=template&id=4340491c&scoped=true& */ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=template&id=4340491c&scoped=true&");
/* harmony import */ var _SelectionsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectionsTable.vue?vue&type=script&lang=js& */ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _SelectionsTable_vue_vue_type_style_index_0_id_4340491c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true& */ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SelectionsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SelectionsTable_vue_vue_type_template_id_4340491c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SelectionsTable_vue_vue_type_template_id_4340491c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "4340491c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionsTable.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true&":
/*!******************************************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTable_vue_vue_type_style_index_0_id_4340491c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader!../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--7-2!../../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=style&index=0&id=4340491c&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTable_vue_vue_type_style_index_0_id_4340491c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTable_vue_vue_type_style_index_0_id_4340491c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTable_vue_vue_type_style_index_0_id_4340491c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTable_vue_vue_type_style_index_0_id_4340491c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTable_vue_vue_type_style_index_0_id_4340491c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=template&id=4340491c&scoped=true&":
/*!***************************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=template&id=4340491c&scoped=true& ***!
  \***************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTable_vue_vue_type_template_id_4340491c_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionsTable.vue?vue&type=template&id=4340491c&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTable.vue?vue&type=template&id=4340491c&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTable_vue_vue_type_template_id_4340491c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTable_vue_vue_type_template_id_4340491c_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue":
/*!***********************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SelectionsTableRow_vue_vue_type_template_id_59757838_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectionsTableRow.vue?vue&type=template&id=59757838&scoped=true& */ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=template&id=59757838&scoped=true&");
/* harmony import */ var _SelectionsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SelectionsTableRow.vue?vue&type=script&lang=js& */ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _SelectionsTableRow_vue_vue_type_style_index_0_id_59757838_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true& */ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SelectionsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SelectionsTableRow_vue_vue_type_template_id_59757838_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SelectionsTableRow_vue_vue_type_template_id_59757838_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "59757838",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=script&lang=js&":
/*!************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionsTableRow.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTableRow_vue_vue_type_style_index_0_id_59757838_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader!../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--7-2!../../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=style&index=0&id=59757838&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTableRow_vue_vue_type_style_index_0_id_59757838_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTableRow_vue_vue_type_style_index_0_id_59757838_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTableRow_vue_vue_type_style_index_0_id_59757838_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTableRow_vue_vue_type_style_index_0_id_59757838_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTableRow_vue_vue_type_style_index_0_id_59757838_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=template&id=59757838&scoped=true&":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=template&id=59757838&scoped=true& ***!
  \******************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTableRow_vue_vue_type_template_id_59757838_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SelectionsTableRow.vue?vue&type=template&id=59757838&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/SelectionsTableRow.vue?vue&type=template&id=59757838&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTableRow_vue_vue_type_template_id_59757838_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SelectionsTableRow_vue_vue_type_template_id_59757838_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/index.vue":
/*!**********************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/index.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_7b8e56fd_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=7b8e56fd&scoped=true& */ "./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=template&id=7b8e56fd&scoped=true&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _index_vue_vue_type_style_index_0_id_7b8e56fd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true& */ "./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_7b8e56fd_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_7b8e56fd_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "7b8e56fd",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/FilesPage/FileFlyin/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true&":
/*!********************************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true& ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_7b8e56fd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader!../../../../../node_modules/css-loader!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--7-2!../../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=style&index=0&id=7b8e56fd&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_7b8e56fd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_7b8e56fd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_7b8e56fd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_7b8e56fd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_7b8e56fd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=template&id=7b8e56fd&scoped=true&":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=template&id=7b8e56fd&scoped=true& ***!
  \*****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_7b8e56fd_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=7b8e56fd&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileFlyin/index.vue?vue&type=template&id=7b8e56fd&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_7b8e56fd_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_7b8e56fd_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/FilesPage/FileTableRow.vue":
/*!*******************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileTableRow.vue ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FileTableRow_vue_vue_type_template_id_ee3a420c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileTableRow.vue?vue&type=template&id=ee3a420c& */ "./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=template&id=ee3a420c&");
/* harmony import */ var _FileTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileTableRow.vue?vue&type=script&lang=js& */ "./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FileTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FileTableRow_vue_vue_type_template_id_ee3a420c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FileTableRow_vue_vue_type_template_id_ee3a420c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/FilesPage/FileTableRow.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=script&lang=js&":
/*!********************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=script&lang=js& ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./FileTableRow.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=template&id=ee3a420c&":
/*!**************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=template&id=ee3a420c& ***!
  \**************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTableRow_vue_vue_type_template_id_ee3a420c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./FileTableRow.vue?vue&type=template&id=ee3a420c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FileTableRow.vue?vue&type=template&id=ee3a420c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTableRow_vue_vue_type_template_id_ee3a420c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FileTableRow_vue_vue_type_template_id_ee3a420c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/FilesPage/FilesPage.vue":
/*!****************************************************!*\
  !*** ./resources/js/pages/FilesPage/FilesPage.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FilesPage_vue_vue_type_template_id_4986bbe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FilesPage.vue?vue&type=template&id=4986bbe4&scoped=true& */ "./resources/js/pages/FilesPage/FilesPage.vue?vue&type=template&id=4986bbe4&scoped=true&");
/* harmony import */ var _FilesPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FilesPage.vue?vue&type=script&lang=js& */ "./resources/js/pages/FilesPage/FilesPage.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _FilesPage_vue_vue_type_style_index_0_id_4986bbe4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss& */ "./resources/js/pages/FilesPage/FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FilesPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FilesPage_vue_vue_type_template_id_4986bbe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FilesPage_vue_vue_type_template_id_4986bbe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "4986bbe4",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/FilesPage/FilesPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/FilesPage/FilesPage.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FilesPage.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./FilesPage.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss&":
/*!**************************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss& ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPage_vue_vue_type_style_index_0_id_4986bbe4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=style&index=0&id=4986bbe4&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPage_vue_vue_type_style_index_0_id_4986bbe4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPage_vue_vue_type_style_index_0_id_4986bbe4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPage_vue_vue_type_style_index_0_id_4986bbe4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPage_vue_vue_type_style_index_0_id_4986bbe4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPage_vue_vue_type_style_index_0_id_4986bbe4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FilesPage.vue?vue&type=template&id=4986bbe4&scoped=true&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FilesPage.vue?vue&type=template&id=4986bbe4&scoped=true& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPage_vue_vue_type_template_id_4986bbe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./FilesPage.vue?vue&type=template&id=4986bbe4&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesPage.vue?vue&type=template&id=4986bbe4&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPage_vue_vue_type_template_id_4986bbe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesPage_vue_vue_type_template_id_4986bbe4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/FilesPage/FilesTable.vue":
/*!*****************************************************!*\
  !*** ./resources/js/pages/FilesPage/FilesTable.vue ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FilesTable_vue_vue_type_template_id_3ebb98c9_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FilesTable.vue?vue&type=template&id=3ebb98c9&scoped=true& */ "./resources/js/pages/FilesPage/FilesTable.vue?vue&type=template&id=3ebb98c9&scoped=true&");
/* harmony import */ var _FilesTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FilesTable.vue?vue&type=script&lang=js& */ "./resources/js/pages/FilesPage/FilesTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _FilesTable_vue_vue_type_style_index_0_id_3ebb98c9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss& */ "./resources/js/pages/FilesPage/FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FilesTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FilesTable_vue_vue_type_template_id_3ebb98c9_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FilesTable_vue_vue_type_template_id_3ebb98c9_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "3ebb98c9",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/FilesPage/FilesTable.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/FilesPage/FilesTable.vue?vue&type=script&lang=js&":
/*!******************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FilesTable.vue?vue&type=script&lang=js& ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./FilesTable.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss&":
/*!***************************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss& ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesTable_vue_vue_type_style_index_0_id_3ebb98c9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=style&index=0&id=3ebb98c9&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesTable_vue_vue_type_style_index_0_id_3ebb98c9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesTable_vue_vue_type_style_index_0_id_3ebb98c9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesTable_vue_vue_type_style_index_0_id_3ebb98c9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesTable_vue_vue_type_style_index_0_id_3ebb98c9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesTable_vue_vue_type_style_index_0_id_3ebb98c9_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FilesTable.vue?vue&type=template&id=3ebb98c9&scoped=true&":
/*!************************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FilesTable.vue?vue&type=template&id=3ebb98c9&scoped=true& ***!
  \************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesTable_vue_vue_type_template_id_3ebb98c9_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./FilesTable.vue?vue&type=template&id=3ebb98c9&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FilesTable.vue?vue&type=template&id=3ebb98c9&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesTable_vue_vue_type_template_id_3ebb98c9_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FilesTable_vue_vue_type_template_id_3ebb98c9_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/FilesPage/FolderTableRow.vue":
/*!*********************************************************!*\
  !*** ./resources/js/pages/FilesPage/FolderTableRow.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FolderTableRow_vue_vue_type_template_id_5787ac6c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FolderTableRow.vue?vue&type=template&id=5787ac6c& */ "./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=template&id=5787ac6c&");
/* harmony import */ var _FolderTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FolderTableRow.vue?vue&type=script&lang=js& */ "./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FolderTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FolderTableRow_vue_vue_type_template_id_5787ac6c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _FolderTableRow_vue_vue_type_template_id_5787ac6c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/FilesPage/FolderTableRow.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./FolderTableRow.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=template&id=5787ac6c&":
/*!****************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=template&id=5787ac6c& ***!
  \****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTableRow_vue_vue_type_template_id_5787ac6c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./FolderTableRow.vue?vue&type=template&id=5787ac6c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/FolderTableRow.vue?vue&type=template&id=5787ac6c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTableRow_vue_vue_type_template_id_5787ac6c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FolderTableRow_vue_vue_type_template_id_5787ac6c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/FilesPage/index.vue":
/*!************************************************!*\
  !*** ./resources/js/pages/FilesPage/index.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_1be71430_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=1be71430&scoped=true& */ "./resources/js/pages/FilesPage/index.vue?vue&type=template&id=1be71430&scoped=true&");
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ "./resources/js/pages/FilesPage/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_1be71430_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_1be71430_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "1be71430",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/FilesPage/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/FilesPage/index.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/index.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/index.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/FilesPage/index.vue?vue&type=template&id=1be71430&scoped=true&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/pages/FilesPage/index.vue?vue&type=template&id=1be71430&scoped=true& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_1be71430_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=1be71430&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/FilesPage/index.vue?vue&type=template&id=1be71430&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_1be71430_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_1be71430_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
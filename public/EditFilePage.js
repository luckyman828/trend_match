;(window['webpackJsonp'] = window['webpackJsonp'] || []).push([
    ['EditFilePage'],
    {
        /***/ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=script&lang=js&':
            /*!**************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! @babel/runtime/regenerator */ './node_modules/@babel/runtime/regenerator/index.js'
                )
                /* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                    _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__
                )
                /* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! vuex */ './node_modules/vuex/dist/vuex.esm.js'
                )

                function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
                    try {
                        var info = gen[key](arg)
                        var value = info.value
                    } catch (error) {
                        reject(error)
                        return
                    }
                    if (info.done) {
                        resolve(value)
                    } else {
                        Promise.resolve(value).then(_next, _throw)
                    }
                }

                function _asyncToGenerator(fn) {
                    return function() {
                        var self = this,
                            args = arguments
                        return new Promise(function(resolve, reject) {
                            var gen = fn.apply(self, args)
                            function _next(value) {
                                asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
                            }
                            function _throw(err) {
                                asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
                            }
                            _next(undefined)
                        })
                    }
                }

                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object)
                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object)
                        if (enumerableOnly)
                            symbols = symbols.filter(function(sym) {
                                return Object.getOwnPropertyDescriptor(object, sym).enumerable
                            })
                        keys.push.apply(keys, symbols)
                    }
                    return keys
                }

                function _objectSpread(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {}
                        if (i % 2) {
                            ownKeys(Object(source), true).forEach(function(key) {
                                _defineProperty(target, key, source[key])
                            })
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
                        } else {
                            ownKeys(Object(source)).forEach(function(key) {
                                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
                            })
                        }
                    }
                    return target
                }

                function _defineProperty(obj, key, value) {
                    if (key in obj) {
                        Object.defineProperty(obj, key, {
                            value: value,
                            enumerable: true,
                            configurable: true,
                            writable: true,
                        })
                    } else {
                        obj[key] = value
                    }
                    return obj
                }

                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //

                /* harmony default export */ __webpack_exports__['default'] = {
                    name: 'bulkUploadComponent',
                    data: function data() {
                        return {
                            imagesToUpload: [],
                            displayLimit: 5,
                            uploadingCount: 0,
                            updatingCount: 0,
                            toalUpdateCount: 0,
                        }
                    },
                    computed: _objectSpread(
                        _objectSpread(
                            {},
                            Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapGetters'])('products', ['products'])
                        ),
                        Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapGetters'])('files', {
                            file: 'getCurrentFile',
                        })
                    ),
                    methods: _objectSpread(
                        _objectSpread(
                            {},
                            Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapActions'])('products', [
                                'updateProduct',
                                'uploadImage',
                            ])
                        ),
                        {},
                        {
                            onFilesChange: function onFilesChange(fileList) {
                                var _this = this

                                var _loop = function _loop(i) {
                                    var file = fileList[i]

                                    if (
                                        !_this.imagesToUpload.find(function(x) {
                                            return x.name == file.name
                                        })
                                    ) {
                                        _this.imagesToUpload.push(file)
                                    }
                                }

                                for (var i = 0; i < fileList.length; i++) {
                                    _loop(i)
                                }
                            },
                            onSubmit: function onSubmit() {
                                var _this2 = this

                                return _asyncToGenerator(
                                    /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                        function _callee3() {
                                            var productsToUpdate, imageUploadError
                                            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                function _callee3$(_context3) {
                                                    while (1) {
                                                        switch ((_context3.prev = _context3.next)) {
                                                            case 0:
                                                                // Use FileReader to get the blob data of the images to upload
                                                                productsToUpdate = []
                                                                imageUploadError = false
                                                                _context3.next = 4
                                                                return Promise.all(
                                                                    _this2.imagesToUpload.map(
                                                                        /*#__PURE__*/ (function() {
                                                                            var _ref = _asyncToGenerator(
                                                                                /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                                                                    function _callee(image) {
                                                                                        var productId,
                                                                                            underscoreIndex,
                                                                                            variantNameMatches,
                                                                                            variantName,
                                                                                            shouldBeFirst,
                                                                                            product,
                                                                                            basePicture,
                                                                                            pictureToUpload,
                                                                                            variantToUpdate,
                                                                                            existingVariant,
                                                                                            existingPicture
                                                                                        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                                                            function _callee$(
                                                                                                _context
                                                                                            ) {
                                                                                                while (1) {
                                                                                                    switch (
                                                                                                        (_context.prev =
                                                                                                            _context.next)
                                                                                                    ) {
                                                                                                        case 0:
                                                                                                            // Check that the image actually belongs to a variant of one of our products
                                                                                                            productId = image.name.slice(
                                                                                                                0,
                                                                                                                8
                                                                                                            )

                                                                                                            if (
                                                                                                                productId
                                                                                                            ) {
                                                                                                                _context.next = 3
                                                                                                                break
                                                                                                            }

                                                                                                            return _context.abrupt(
                                                                                                                'return'
                                                                                                            )

                                                                                                        case 3:
                                                                                                            // Find the variant name
                                                                                                            underscoreIndex = image.name.indexOf(
                                                                                                                '_'
                                                                                                            )
                                                                                                            variantNameMatches = image.name
                                                                                                                .slice(
                                                                                                                    underscoreIndex
                                                                                                                )
                                                                                                                .match(
                                                                                                                    /^_([^\.\-\_]*)/
                                                                                                                )
                                                                                                            variantName =
                                                                                                                variantNameMatches.length >
                                                                                                                1
                                                                                                                    ? variantNameMatches[1]
                                                                                                                    : null // Check if we should place the image first

                                                                                                            shouldBeFirst =
                                                                                                                image.name
                                                                                                                    .toLowerCase()
                                                                                                                    .search(
                                                                                                                        'front'
                                                                                                                    ) >=
                                                                                                                0 // console.log('product id', productId, ', variantName:', variantName, ', should be first', shouldBeFirst)
                                                                                                            // Find the product the image belongs to

                                                                                                            product = _this2.products.find(
                                                                                                                function(
                                                                                                                    x
                                                                                                                ) {
                                                                                                                    return (
                                                                                                                        x.datasource_id ==
                                                                                                                        productId
                                                                                                                    )
                                                                                                                }
                                                                                                            )

                                                                                                            if (
                                                                                                                product
                                                                                                            ) {
                                                                                                                _context.next = 10
                                                                                                                break
                                                                                                            }

                                                                                                            return _context.abrupt(
                                                                                                                'return'
                                                                                                            )

                                                                                                        case 10:
                                                                                                            _this2.uploadingCount++
                                                                                                            productsToUpdate.push(
                                                                                                                product
                                                                                                            )
                                                                                                            basePicture = {
                                                                                                                name:
                                                                                                                    image.name,
                                                                                                                url: null,
                                                                                                            }
                                                                                                            pictureToUpload = basePicture // Asume we are adding a new variant

                                                                                                            variantToUpdate = {
                                                                                                                id: _this2.$uuid.v4(),
                                                                                                                name: variantName,
                                                                                                                image: null,
                                                                                                                images: [],
                                                                                                                pictures: [
                                                                                                                    basePicture,
                                                                                                                ],
                                                                                                                sizes: [],
                                                                                                                thumbnail: null,
                                                                                                            } // Find the variant on our product
                                                                                                            // Check if there is a variant that contains the image variant name

                                                                                                            existingVariant = product.variants.find(
                                                                                                                function(
                                                                                                                    x
                                                                                                                ) {
                                                                                                                    return (
                                                                                                                        x.name ==
                                                                                                                        variantName
                                                                                                                    )
                                                                                                                }
                                                                                                            )

                                                                                                            if (
                                                                                                                !existingVariant
                                                                                                            ) {
                                                                                                                _context.next = 28
                                                                                                                break
                                                                                                            }

                                                                                                            variantToUpdate = existingVariant // Check for existing picture

                                                                                                            existingPicture = existingVariant.pictures.find(
                                                                                                                function(
                                                                                                                    x
                                                                                                                ) {
                                                                                                                    return (
                                                                                                                        x.name ==
                                                                                                                        image.name
                                                                                                                    )
                                                                                                                }
                                                                                                            )

                                                                                                            if (
                                                                                                                !existingPicture
                                                                                                            ) {
                                                                                                                _context.next = 25
                                                                                                                break
                                                                                                            }

                                                                                                            if (
                                                                                                                !(
                                                                                                                    existingPicture.name ==
                                                                                                                        image.name &&
                                                                                                                    !!existingPicture.url
                                                                                                                )
                                                                                                            ) {
                                                                                                                _context.next = 22
                                                                                                                break
                                                                                                            }

                                                                                                            return _context.abrupt(
                                                                                                                'return'
                                                                                                            )

                                                                                                        case 22:
                                                                                                            // don't reupload an existing image
                                                                                                            pictureToUpload = existingPicture
                                                                                                            _context.next = 26
                                                                                                            break

                                                                                                        case 25:
                                                                                                            if (
                                                                                                                shouldBeFirst
                                                                                                            ) {
                                                                                                                variantToUpdate.pictures.unshift(
                                                                                                                    basePicture
                                                                                                                )
                                                                                                            } else {
                                                                                                                variantToUpdate.pictures.push(
                                                                                                                    basePicture
                                                                                                                )
                                                                                                            }

                                                                                                        case 26:
                                                                                                            _context.next = 29
                                                                                                            break

                                                                                                        case 28:
                                                                                                            product.variants.push(
                                                                                                                variantToUpdate
                                                                                                            )

                                                                                                        case 29:
                                                                                                            _context.next = 31
                                                                                                            return _this2.uploadImage(
                                                                                                                {
                                                                                                                    file:
                                                                                                                        _this2.file,
                                                                                                                    product: product,
                                                                                                                    picture: pictureToUpload,
                                                                                                                    image: image,
                                                                                                                }
                                                                                                            )

                                                                                                        case 31:
                                                                                                            _this2.uploadingCount--

                                                                                                        case 32:
                                                                                                        case 'end':
                                                                                                            return _context.stop()
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            _callee
                                                                                        )
                                                                                    }
                                                                                )
                                                                            )

                                                                            return function(_x) {
                                                                                return _ref.apply(this, arguments)
                                                                            }
                                                                        })()
                                                                    )
                                                                )['catch'](function(err) {
                                                                    // console.log('error in bulk image upload', err)
                                                                    _this2.imageUploadError = true
                                                                })

                                                            case 4:
                                                                if (!imageUploadError) {
                                                                    _context3.next = 6
                                                                    break
                                                                }

                                                                return _context3.abrupt('return')

                                                            case 6:
                                                                // console.log('start updating products')
                                                                _this2.toalUpdateCount = productsToUpdate.length // Update all products --> This cannot be done earlier since we cannot be sure if we are in the process of uploading some of the images on the product

                                                                _context3.next = 9
                                                                return Promise.all(
                                                                    productsToUpdate.map(
                                                                        /*#__PURE__*/ (function() {
                                                                            var _ref2 = _asyncToGenerator(
                                                                                /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                                                                    function _callee2(product) {
                                                                                        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                                                            function _callee2$(
                                                                                                _context2
                                                                                            ) {
                                                                                                while (1) {
                                                                                                    switch (
                                                                                                        (_context2.prev =
                                                                                                            _context2.next)
                                                                                                    ) {
                                                                                                        case 0:
                                                                                                            _this2.updatingCount++
                                                                                                            _context2.next = 3
                                                                                                            return _this2.updateProduct(
                                                                                                                product
                                                                                                            )

                                                                                                        case 3:
                                                                                                            _this2.updatingCount--

                                                                                                        case 4:
                                                                                                        case 'end':
                                                                                                            return _context2.stop()
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            _callee2
                                                                                        )
                                                                                    }
                                                                                )
                                                                            )

                                                                            return function(_x2) {
                                                                                return _ref2.apply(this, arguments)
                                                                            }
                                                                        })()
                                                                    )
                                                                )
                                                                    ['catch'](function(err) {
                                                                        // console.log('error when updating products', err)
                                                                    })
                                                                    .then(function(response) {
                                                                        // Reset the component
                                                                        // console.log('Success!')
                                                                        _this2.imagesToUpload = []
                                                                    })

                                                            case 9:
                                                                _this2.updatingCount = 0
                                                                _this2.uploadingCount = 0

                                                            case 11:
                                                            case 'end':
                                                                return _context3.stop()
                                                        }
                                                    }
                                                },
                                                _callee3
                                            )
                                        }
                                    )
                                )()
                            },
                        }
                    ),
                }

                /***/
            },

        /***/ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=script&lang=js&':
            /*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                /* harmony default export */ __webpack_exports__['default'] = {
                    name: 'editFileHeader',
                    props: ['file'],
                    computed: {},
                }

                /***/
            },

        /***/ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=script&lang=js&':
            /*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! vuex */ './node_modules/vuex/dist/vuex.esm.js'
                )
                /* harmony import */ var _ProductsTable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! ./ProductsTable */ './resources/js/pages/EditFilePage/ProductsTable.vue'
                )
                /* harmony import */ var _EditFileHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    /*! ./EditFileHeader */ './resources/js/pages/EditFilePage/EditFileHeader.vue'
                )
                /* harmony import */ var _ProductFlyin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    /*! ./ProductFlyin */ './resources/js/pages/EditFilePage/ProductFlyin.vue'
                )
                /* harmony import */ var _BulkUploadComponent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
                    /*! ./BulkUploadComponent */ './resources/js/pages/EditFilePage/BulkUploadComponent.vue'
                )
                /* harmony import */ var _components_layout_ThePageHeader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
                    /*! ../../components/layout/ThePageHeader */ './resources/js/components/layout/ThePageHeader.vue'
                )
                /* harmony import */ var _mixins_sortArray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
                    /*! ../../mixins/sortArray */ './resources/js/mixins/sortArray.js'
                )
                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object)
                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object)
                        if (enumerableOnly)
                            symbols = symbols.filter(function(sym) {
                                return Object.getOwnPropertyDescriptor(object, sym).enumerable
                            })
                        keys.push.apply(keys, symbols)
                    }
                    return keys
                }

                function _objectSpread(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {}
                        if (i % 2) {
                            ownKeys(Object(source), true).forEach(function(key) {
                                _defineProperty(target, key, source[key])
                            })
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
                        } else {
                            ownKeys(Object(source)).forEach(function(key) {
                                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
                            })
                        }
                    }
                    return target
                }

                function _defineProperty(obj, key, value) {
                    if (key in obj) {
                        Object.defineProperty(obj, key, {
                            value: value,
                            enumerable: true,
                            configurable: true,
                            writable: true,
                        })
                    } else {
                        obj[key] = value
                    }
                    return obj
                }

                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //

                // Mixins

                /* harmony default export */ __webpack_exports__['default'] = {
                    name: 'editFilePage',
                    components: {
                        ProductsTable: _ProductsTable__WEBPACK_IMPORTED_MODULE_1__['default'],
                        ProductFlyin: _ProductFlyin__WEBPACK_IMPORTED_MODULE_3__['default'],
                        ThePageHeader: _components_layout_ThePageHeader__WEBPACK_IMPORTED_MODULE_5__['default'],
                        BulkUploadComponent: _BulkUploadComponent__WEBPACK_IMPORTED_MODULE_4__['default'],
                    },
                    mixins: [_mixins_sortArray__WEBPACK_IMPORTED_MODULE_6__['default']],
                    data: function data() {
                        return {
                            sortKey: 'sequence',
                            showBulkUpload: false,
                        }
                    },
                    computed: _objectSpread(
                        _objectSpread(
                            _objectSpread(
                                {},
                                Object(vuex__WEBPACK_IMPORTED_MODULE_0__['mapGetters'])('files', ['currentFile'])
                            ),
                            Object(vuex__WEBPACK_IMPORTED_MODULE_0__['mapGetters'])('products', [
                                'products',
                                'productsFiltered',
                                'singleVisible',
                            ])
                        ),
                        {},
                        {
                            file: function file() {
                                return this.currentFile
                            },
                            productsEligibleForVariantImageShift: function productsEligibleForVariantImageShift() {
                                return this.products.filter(function(x) {
                                    if (x.variants.length < 2) return false
                                    var noImageIndex = x.variants.findIndex(function(x) {
                                        return !x.image
                                    })
                                    return (
                                        noImageIndex >= 0 &&
                                        x.variants.slice(noImageIndex + 1).find(function(x) {
                                            return !!x.image
                                        })
                                    )
                                })
                            },
                        }
                    ),
                    methods: _objectSpread(
                        _objectSpread(
                            _objectSpread(
                                _objectSpread(
                                    {},
                                    Object(vuex__WEBPACK_IMPORTED_MODULE_0__['mapActions'])('products', [
                                        'updateProduct',
                                    ])
                                ),
                                Object(vuex__WEBPACK_IMPORTED_MODULE_0__['mapMutations'])('products', [
                                    'setSingleVisisble',
                                    'SET_LAST_SORT',
                                ])
                            ),
                            Object(vuex__WEBPACK_IMPORTED_MODULE_0__['mapMutations'])('alerts', ['SHOW_SNACKBAR'])
                        ),
                        {},
                        {
                            onSort: function onSort(method, key) {
                                this.sortKey = key
                                this.sortArray(this.products, method, key) // Save a reference to our last sort

                                this.SET_LAST_SORT({
                                    method: method,
                                    key: key,
                                })
                            },
                            setVariantWithImageFirst: function setVariantWithImageFirst() {
                                var _this = this

                                var productsToUpdateCount = this.productsEligibleForVariantImageShift.length // Loop through all products, move the variants with images first and save them

                                this.products.forEach(function(product) {
                                    if (product.variants.length > 1) {
                                        product.variants.sort(function(a, b) {
                                            if (!!a.image && !b.image) return -1
                                            if (!!b.image && !a.image) return 1
                                        })

                                        _this.updateProduct(product)
                                    }
                                })
                                this.SHOW_SNACKBAR({
                                    msg: ''
                                        .concat(productsToUpdateCount, ' Product')
                                        .concat(productsToUpdateCount > 1 ? 's' : '', ' updated'),
                                    iconClass: 'fa-check',
                                    type: 'success',
                                })
                            },
                        }
                    ),
                    created: function created() {
                        // Initially sort the products
                        this.onSort(true, this.sortKey)
                    },
                }

                /***/
            },

        /***/ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=script&lang=js&':
            /*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! @babel/runtime/regenerator */ './node_modules/@babel/runtime/regenerator/index.js'
                )
                /* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                    _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__
                )
                /* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! vuex */ './node_modules/vuex/dist/vuex.esm.js'
                )
                /* harmony import */ var vuedraggable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    /*! vuedraggable */ './node_modules/vuedraggable/dist/vuedraggable.common.js'
                )
                /* harmony import */ var vuedraggable__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
                    vuedraggable__WEBPACK_IMPORTED_MODULE_2__
                )
                /* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    /*! axios */ './node_modules/axios/index.js'
                )
                /* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(
                    axios__WEBPACK_IMPORTED_MODULE_3__
                )
                /* harmony import */ var _mixins_variantImage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
                    /*! ../../mixins/variantImage */ './resources/js/mixins/variantImage.js'
                )

                function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
                    try {
                        var info = gen[key](arg)
                        var value = info.value
                    } catch (error) {
                        reject(error)
                        return
                    }
                    if (info.done) {
                        resolve(value)
                    } else {
                        Promise.resolve(value).then(_next, _throw)
                    }
                }

                function _asyncToGenerator(fn) {
                    return function() {
                        var self = this,
                            args = arguments
                        return new Promise(function(resolve, reject) {
                            var gen = fn.apply(self, args)
                            function _next(value) {
                                asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
                            }
                            function _throw(err) {
                                asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
                            }
                            _next(undefined)
                        })
                    }
                }

                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object)
                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object)
                        if (enumerableOnly)
                            symbols = symbols.filter(function(sym) {
                                return Object.getOwnPropertyDescriptor(object, sym).enumerable
                            })
                        keys.push.apply(keys, symbols)
                    }
                    return keys
                }

                function _objectSpread(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {}
                        if (i % 2) {
                            ownKeys(Object(source), true).forEach(function(key) {
                                _defineProperty(target, key, source[key])
                            })
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
                        } else {
                            ownKeys(Object(source)).forEach(function(key) {
                                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
                            })
                        }
                    }
                    return target
                }

                function _defineProperty(obj, key, value) {
                    if (key in obj) {
                        Object.defineProperty(obj, key, {
                            value: value,
                            enumerable: true,
                            configurable: true,
                            writable: true,
                        })
                    } else {
                        obj[key] = value
                    }
                    return obj
                }

                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //

                /* harmony default export */ __webpack_exports__['default'] = {
                    name: 'editProductFlyin',
                    props: ['show'],
                    mixins: [_mixins_variantImage__WEBPACK_IMPORTED_MODULE_4__['default']],
                    components: {
                        Draggable: vuedraggable__WEBPACK_IMPORTED_MODULE_2___default.a,
                    },
                    data: function data() {
                        return {
                            productToEdit: null,
                            savedMarkup: null,
                            editingTitle: false,
                            updatingProduct: false,
                            dragActiveIndex: null,
                            dragCounter: 0,
                            URLActiveIndex: null,
                            gettingImagesFromURL: 0,
                            defaultPriceObject: {
                                currency: 'New currency',
                                mark_up: 0,
                                wholesale_price: 0,
                                recommended_retail_price: 0,
                            },
                            defaultAssortmentObject: {
                                name: 'New assortment',
                                box_size: null,
                                box_ean: null,
                            },
                            contextVariantIndex: null,
                            idError: null,
                            contextPrice: null,
                            draggingVariantPicture: false,
                            variantImageFromURLQueue: [],
                            currentVariant: null,
                        }
                    },
                    watch: {
                        currentProduct: {
                            deep: true,
                            handler: 'initProduct',
                        },
                    },
                    computed: _objectSpread(
                        _objectSpread(
                            _objectSpread(
                                _objectSpread(
                                    {},
                                    Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapGetters'])('products', [
                                        'currentProduct',
                                        'nextProduct',
                                        'prevProduct',
                                        'products',
                                        'availableProducts',
                                    ])
                                ),
                                Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapGetters'])('files', ['currentFile'])
                            ),
                            Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapGetters'])('persist', ['availableCurrencies'])
                        ),
                        {},
                        {
                            product: function product() {
                                return this.productToEdit
                            },
                            originalProduct: function originalProduct() {
                                return this.currentProduct
                            },
                            saveActive: function saveActive() {
                                return (
                                    !this.updatingProduct &&
                                    this.gettingImagesFromURL <= 0 &&
                                    this.hasChanges &&
                                    !!this.productToEdit.datasource_id
                                )
                            },
                            hasChanges: function hasChanges() {
                                var newProduct = this.productToEdit
                                var oldProduct = this.currentProduct
                                return JSON.stringify(newProduct) != JSON.stringify(oldProduct)
                            },
                            filesToDelete: function filesToDelete() {
                                var newProduct = this.productToEdit
                                var oldProduct = this.currentProduct
                                var filesToDelete = [] // Loop through the variants on the old product

                                oldProduct.variants.forEach(function(variant) {
                                    // First check if the current variant has a blob id
                                    if (variant.blob_id != null) {
                                        // See if we can find the blob_id on the new product.
                                        var exists = newProduct.variants.find(function(x) {
                                            return x.blob_id == variant.blob_id
                                        }) // If we cannot find the blob_ib on the new product, it must mean that the blob is no longer used.
                                        // We can therefore delete it

                                        if (!exists) {
                                            filesToDelete.push(variant.blob_id)
                                        }
                                    }
                                })
                                return filesToDelete
                            },
                        }
                    ),
                    methods: _objectSpread(
                        _objectSpread(
                            _objectSpread(
                                _objectSpread(
                                    _objectSpread(
                                        {},
                                        Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapActions'])('files', [
                                            'syncExternalImages',
                                        ])
                                    ),
                                    Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapActions'])('products', [
                                        'showNextProduct',
                                        'showPrevProduct',
                                        'updateProduct',
                                        'insertProducts',
                                        'uploadImage',
                                        'deleteImages',
                                        'deleteProducts',
                                        'initProducts',
                                    ])
                                ),
                                Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapMutations'])('products', [
                                    'setCurrentProduct',
                                ])
                            ),
                            Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapMutations'])('alerts', ['SHOW_SNACKBAR'])
                        ),
                        {},
                        {
                            showCurrencyContext: function showCurrencyContext(e, price) {
                                var _this = this

                                this.contextPrice = price
                                this.$nextTick(function() {
                                    _this.$refs.contextCurrency.show(e)
                                })
                            },
                            onDeleteProduct: function onDeleteProduct() {
                                var _this2 = this

                                return _asyncToGenerator(
                                    /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                        function _callee() {
                                            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                function _callee$(_context) {
                                                    while (1) {
                                                        switch ((_context.prev = _context.next)) {
                                                            case 0:
                                                                _context.next = 2
                                                                return _this2.$refs.confirmDeleteProduct.confirm()

                                                            case 2:
                                                                if (!_context.sent) {
                                                                    _context.next = 5
                                                                    break
                                                                }

                                                                _this2.deleteProducts({
                                                                    file: _this2.currentFile,
                                                                    products: [_this2.product],
                                                                })

                                                                _this2.onCloseSingle()

                                                            case 5:
                                                            case 'end':
                                                                return _context.stop()
                                                        }
                                                    }
                                                },
                                                _callee
                                            )
                                        }
                                    )
                                )()
                            },
                            validateProductId: function validateProductId(value) {
                                // Check if the value already exists on a product
                                var existingProduct = this.products.find(function(x) {
                                    return x.datasource_id == value
                                })

                                if (existingProduct && existingProduct.id != this.productToEdit.id) {
                                    this.idError = 'ID already taken'
                                } else {
                                    this.idError = null
                                }
                            },
                            initProduct: function initProduct() {
                                var _this3 = this

                                // Make a copy of the product, so we can check for changes compared to the original
                                var productClone = JSON.parse(JSON.stringify(this.currentProduct))
                                this.productToEdit = productClone
                                this.initProducts([this.productToEdit])
                                this.currentVariant = null // Check if the product has any currencies, else add a default currency
                                // if (this.productToEdit.prices.length < 1) {
                                //     this.productToEdit.prices.push(JSON.parse(JSON.stringify(this.defaultPriceObject)))
                                // }
                                // Create an empty variant if no variants are present

                                var variants = this.productToEdit.variants

                                if (variants.length <= 0) {
                                    this.onAddVariant()
                                }

                                variants.map(function(variant) {
                                    if (variant.pictures.length <= 0) {
                                        _this3.onAddImageToVariant(variant)
                                    }
                                })
                            },
                            showVariantContext: function showVariantContext(e, index) {
                                this.contextVariantIndex = index
                                this.$refs.contextVariant.show(e)
                            },
                            addCurrency: function addCurrency() {
                                this.productToEdit.prices.push(JSON.parse(JSON.stringify(this.defaultPriceObject)))
                            },
                            removeCurrency: function removeCurrency(index) {
                                this.productToEdit.prices.splice(index, 1)
                            },
                            addAssortment: function addAssortment() {
                                this.productToEdit.assortments.push(
                                    JSON.parse(JSON.stringify(this.defaultAssortmentObject))
                                )
                            },
                            removeAssortment: function removeAssortment(index) {
                                this.productToEdit.assortments.splice(index, 1)
                            },
                            addEAN: function addEAN() {
                                this.productToEdit.eans.push(null)
                            },
                            removeEAN: function removeEAN(index) {
                                this.productToEdit.eans.splice(index, 1)
                            },
                            onCloseSingle: function onCloseSingle() {
                                var _this4 = this

                                return _asyncToGenerator(
                                    /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                        function _callee2() {
                                            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                function _callee2$(_context2) {
                                                    while (1) {
                                                        switch ((_context2.prev = _context2.next)) {
                                                            case 0:
                                                                document.activeElement.blur()

                                                                if (_this4.product.id) {
                                                                    _context2.next = 8
                                                                    break
                                                                }

                                                                _context2.next = 4
                                                                return _this4.$refs.confirmDiscardDialog.confirm()

                                                            case 4:
                                                                if (!_context2.sent) {
                                                                    _context2.next = 6
                                                                    break
                                                                }

                                                                _this4.$emit('closeSingle')

                                                            case 6:
                                                                _context2.next = 9
                                                                break

                                                            case 8:
                                                                // Emit event to parent
                                                                _this4.$emit('closeSingle')

                                                            case 9:
                                                            case 'end':
                                                                return _context2.stop()
                                                        }
                                                    }
                                                },
                                                _callee2
                                            )
                                        }
                                    )
                                )()
                            },
                            onAddVariant: function onAddVariant() {
                                var newVariant = {
                                    id: this.$uuid.v4(),
                                    name: 'Unnamed',
                                    image: null,
                                    blob_id: null,
                                    sizes: [],
                                    images: [],
                                    pictures: [
                                        {
                                            url: null,
                                            name: 'New image',
                                        },
                                    ],
                                    imageIndex: 0,
                                    ean: null,
                                    ean_sizes: [],
                                }
                                Object.defineProperty(newVariant, 'currentImg', {
                                    get: function get() {
                                        return newVariant.pictures[newVariant.imageIndex]
                                    },
                                })
                                this.product.variants.push(newVariant)
                                this.currentVariant = newVariant
                            },
                            removeVariant: function removeVariant(index) {
                                // Remove the variant from the product
                                var variants = this.productToEdit.variants
                                variants.splice(index, 1)

                                if (variants.length <= 0) {
                                    // Add a blank variant if the last one is deleted
                                    this.onAddVariant()
                                }
                            },
                            onSubmitField: function onSubmitField() {
                                // Don't update the product if it hasn't been assigned a datasource id yet
                                if (!this.productToEdit.datasource_id) return
                                this.onUpdateProduct()
                            },
                            onUpdateProduct: function onUpdateProduct() {
                                var _this5 = this

                                return _asyncToGenerator(
                                    /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                        function _callee4() {
                                            var vm,
                                                productToEdit,
                                                productIsNew,
                                                insertError,
                                                productToUpload,
                                                variants,
                                                variantError,
                                                _loop,
                                                i

                                            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                function _callee4$(_context6) {
                                                    while (1) {
                                                        switch ((_context6.prev = _context6.next)) {
                                                            case 0:
                                                                // Prepare the file to fit the database schema
                                                                vm = _this5
                                                                _this5.updatingProduct = true
                                                                productToEdit = _this5.productToEdit
                                                                productIsNew = false // Check if the product has not yet been saved. If true, save it, since we cannot upload images to an unsaved product.

                                                                insertError = false

                                                                if (productToEdit.id) {
                                                                    _context6.next = 12
                                                                    break
                                                                }

                                                                productIsNew = true
                                                                productToUpload = JSON.parse(
                                                                    JSON.stringify(_this5.productToEdit)
                                                                )
                                                                productToUpload.variants = []
                                                                _context6.next = 11
                                                                return _this5
                                                                    .insertProducts({
                                                                        file: _this5.currentFile,
                                                                        products: [productToUpload],
                                                                        addToState: true,
                                                                    })
                                                                    ['catch'](function(err) {
                                                                        insertError = true
                                                                    })

                                                            case 11:
                                                                productToEdit.id = productToUpload.id

                                                            case 12:
                                                                if (!insertError) {
                                                                    _context6.next = 15
                                                                    break
                                                                }

                                                                _this5.updatingProduct = false
                                                                return _context6.abrupt('return')

                                                            case 15:
                                                                if (_this5.variantImageFromURLQueue.length > 1) {
                                                                    _this5.variantImageFromURLQueue.map(
                                                                        /*#__PURE__*/ (function() {
                                                                            var _ref = _asyncToGenerator(
                                                                                /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                                                                    function _callee3(queueItem) {
                                                                                        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                                                            function _callee3$(
                                                                                                _context3
                                                                                            ) {
                                                                                                while (1) {
                                                                                                    switch (
                                                                                                        (_context3.prev =
                                                                                                            _context3.next)
                                                                                                    ) {
                                                                                                        case 0:
                                                                                                            _context3.next = 2
                                                                                                            return _this5.setVariantImageURL(
                                                                                                                queueItem.variant,
                                                                                                                queueItem.imageURL,
                                                                                                                queueItem.picture
                                                                                                            )

                                                                                                        case 2:
                                                                                                        case 'end':
                                                                                                            return _context3.stop()
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            _callee3
                                                                                        )
                                                                                    }
                                                                                )
                                                                            )

                                                                            return function(_x) {
                                                                                return _ref.apply(this, arguments)
                                                                            }
                                                                        })()
                                                                    )
                                                                } // Check if we have any files (images) we need to upload

                                                                variants = productToEdit.variants
                                                                variantError = false
                                                                _loop = /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                                                    function _loop(i) {
                                                                        var variant, editVariant, _loop2, _i

                                                                        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                                            function _loop$(_context5) {
                                                                                while (1) {
                                                                                    switch (
                                                                                        (_context5.prev =
                                                                                            _context5.next)
                                                                                    ) {
                                                                                        case 0:
                                                                                            variant = variants[i]
                                                                                            editVariant =
                                                                                                _this5.productToEdit
                                                                                                    .variants[i]
                                                                                            _loop2 = /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                                                                                function _loop2(_i) {
                                                                                                    var picture
                                                                                                    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                                                                        function _loop2$(
                                                                                                            _context4
                                                                                                        ) {
                                                                                                            while (1) {
                                                                                                                switch (
                                                                                                                    (_context4.prev =
                                                                                                                        _context4.next)
                                                                                                                ) {
                                                                                                                    case 0:
                                                                                                                        picture =
                                                                                                                            variant
                                                                                                                                .pictures[
                                                                                                                                _i
                                                                                                                            ]

                                                                                                                        if (
                                                                                                                            !picture.imageToUpload
                                                                                                                        ) {
                                                                                                                            _context4.next = 7
                                                                                                                            break
                                                                                                                        }

                                                                                                                        // Set uploading to true
                                                                                                                        picture.imageToUpload.uploading = true
                                                                                                                        picture.imageToUpload.progress = 0
                                                                                                                        variant.imageIndex = _i // Use the edit variant instead of the copy to make sure we get the correct blob data and can update the UI while we upload

                                                                                                                        _context4.next = 7
                                                                                                                        return _this5
                                                                                                                            .uploadImage(
                                                                                                                                {
                                                                                                                                    file:
                                                                                                                                        _this5.currentFile,
                                                                                                                                    product: productToEdit,
                                                                                                                                    picture: picture,
                                                                                                                                    image:
                                                                                                                                        picture
                                                                                                                                            .imageToUpload
                                                                                                                                            .file,
                                                                                                                                },
                                                                                                                                {
                                                                                                                                    onUploadProgress: function onUploadProgress(
                                                                                                                                        progressEvent
                                                                                                                                    ) {
                                                                                                                                        return console.log(
                                                                                                                                            'progressevent',
                                                                                                                                            progressEvent
                                                                                                                                        )
                                                                                                                                    },
                                                                                                                                }
                                                                                                                            )
                                                                                                                            .then(
                                                                                                                                function(
                                                                                                                                    response
                                                                                                                                ) {
                                                                                                                                    // Remove the image to upload
                                                                                                                                    delete picture.imageToUpload
                                                                                                                                    variant.image =
                                                                                                                                        variant.pictures[0].url
                                                                                                                                }
                                                                                                                            )
                                                                                                                            [
                                                                                                                                'catch'
                                                                                                                            ](
                                                                                                                                function(
                                                                                                                                    err
                                                                                                                                ) {
                                                                                                                                    variantError = true
                                                                                                                                    picture.imageToUpload.uploading = false
                                                                                                                                }
                                                                                                                            )

                                                                                                                    case 7:
                                                                                                                    case 'end':
                                                                                                                        return _context4.stop()
                                                                                                                }
                                                                                                            }
                                                                                                        },
                                                                                                        _loop2
                                                                                                    )
                                                                                                }
                                                                                            )
                                                                                            _i = 0

                                                                                        case 4:
                                                                                            if (
                                                                                                !(
                                                                                                    _i <
                                                                                                    variant.pictures
                                                                                                        .length
                                                                                                )
                                                                                            ) {
                                                                                                _context5.next = 9
                                                                                                break
                                                                                            }

                                                                                            return _context5.delegateYield(
                                                                                                _loop2(_i),
                                                                                                't0',
                                                                                                6
                                                                                            )

                                                                                        case 6:
                                                                                            _i++
                                                                                            _context5.next = 4
                                                                                            break

                                                                                        case 9:
                                                                                        case 'end':
                                                                                            return _context5.stop()
                                                                                    }
                                                                                }
                                                                            },
                                                                            _loop
                                                                        )
                                                                    }
                                                                )
                                                                i = 0

                                                            case 20:
                                                                if (!(i < variants.length)) {
                                                                    _context6.next = 25
                                                                    break
                                                                }

                                                                return _context6.delegateYield(_loop(i), 't0', 22)

                                                            case 22:
                                                                i++
                                                                _context6.next = 20
                                                                break

                                                            case 25:
                                                                if (!variantError) {
                                                                    _context6.next = 29
                                                                    break
                                                                }

                                                                _this5.updatingProduct = false // Show alert

                                                                _this5.SHOW_SNACKBAR({
                                                                    msg:
                                                                        'Error when trying to upload image. Please try again',
                                                                    callback: function callback() {
                                                                        return _this5.onUpdateProduct()
                                                                    },
                                                                    callbackLabel: 'Retry',
                                                                    iconClass: 'fa-exclamation-triangle',
                                                                    type: 'warning',
                                                                    duration: 0,
                                                                })

                                                                return _context6.abrupt('return')

                                                            case 29:
                                                                _context6.next = 31
                                                                return _this5
                                                                    .updateProduct(productToEdit)
                                                                    .then(function(response) {
                                                                        if (productIsNew) {
                                                                            _this5.setCurrentProduct(productToEdit) // Resort the products to include the new product

                                                                            _this5.$emit('onSort')
                                                                        } else {
                                                                            _this5.initProduct()
                                                                        }
                                                                    })
                                                                    ['catch'](function(err) {})

                                                            case 31:
                                                                _this5.updatingProduct = false

                                                            case 32:
                                                            case 'end':
                                                                return _context6.stop()
                                                        }
                                                    }
                                                },
                                                _callee4
                                            )
                                        }
                                    )
                                )()
                            },
                            calculateMarkup: function calculateMarkup() {
                                var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                                    price = _ref2.price,
                                    whs = _ref2.whs,
                                    rrp = _ref2.rrp

                                var decimals = 2
                                var wholesale = whs || price.wholesale_price
                                var recommended = rrp || price.recommended_retail_price

                                if (wholesale > 0) {
                                    price.mark_up = Number(
                                        Math.round(recommended / wholesale + 'e' + decimals) + 'e-' + decimals
                                    )
                                } else price.mark_up = 0
                            },
                            resetMarkup: function resetMarkup(price, index) {
                                if (this.savedMarkup != null) price.mark_up = this.savedMarkup
                                else {
                                    price.mark_up = this.originalProduct.prices[index].mark_up
                                }
                            },
                            revertMarkup: function revertMarkup(price) {
                                this.calculateMarkup({
                                    price: price,
                                })
                            },
                            hotkeyHandler: function hotkeyHandler(event) {
                                var key = event.code // Only do these if the current target is not the comment box

                                if (
                                    event.target.type != 'textarea' &&
                                    event.target.tagName.toUpperCase() != 'INPUT' &&
                                    this.show
                                ) {
                                    if (key == 'KeyS' && this.saveActive) this.onUpdateProduct()
                                }
                            },
                            dragActive: function dragActive(e, index) {
                                // console.log('drag active', e, e.relatedTarget.closest('.drawer'))
                                // If we are dragging an image from the drawer, don't trigger dragging
                                if (this.draggingVariantPicture) return

                                if (
                                    e.target.classList.contains('.image-drawer') ||
                                    (e.relatedTarget && e.relatedTarget.closest('.drawer'))
                                ) {
                                    return
                                } // e.target.querySelector('.drop-area').classList.add('drag')

                                this.dragActiveIndex = index
                                this.dragCounter++
                            },
                            dragLeave: function dragLeave(e) {
                                if (this.draggingVariantPicture) return
                                this.dragCounter--

                                if (this.dragCounter == 0) {
                                    this.dragActiveIndex = null
                                } // e.target.querySelector('.drop-area').classList.remove('drag')
                            },
                            dragDrop: function dragDrop() {
                                if (this.draggingVariantPicture) return
                                this.dragActiveIndex = null
                                this.dragCounter = 0
                            },
                            filesChange: function filesChange(e, index, variant) {
                                var _this6 = this

                                return _asyncToGenerator(
                                    /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                        function _callee5() {
                                            var vm, file, fileReader
                                            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                function _callee5$(_context7) {
                                                    while (1) {
                                                        switch ((_context7.prev = _context7.next)) {
                                                            case 0:
                                                                vm = _this6
                                                                file = e.target.files[0] // Check that the file is an image

                                                                if (!(file && file['type'].split('/')[0] === 'image')) {
                                                                    _context7.next = 10
                                                                    break
                                                                }

                                                                _context7.next = 5
                                                                return _this6.getOrientation(file, function(
                                                                    imgRotation
                                                                ) {
                                                                    // save the image to upload to the variant picture with its rotation data,
                                                                    var picture = variant.currentImg
                                                                    vm.$set(picture, 'imageToUpload', {
                                                                        file: file,
                                                                        progress: 0,
                                                                        uploading: false,
                                                                    }) // variant.imageToUpload = {file: file, id: newUUID, rotation: imgRotation}
                                                                })

                                                            case 5:
                                                                // xxxxx GET ORIENTATION IS LEGACY CODE. IT HAS BEEN REPLACED BY COMPRESS JS xxxxxx
                                                                // Process the uploaded image
                                                                fileReader = new FileReader()
                                                                fileReader.readAsDataURL(file)

                                                                fileReader.onload = function(e) {
                                                                    // Show the new image on the variant
                                                                    var newImage = e.target.result
                                                                    variant.image = newImage
                                                                    variant.currentImg.url = newImage
                                                                }

                                                                _context7.next = 11
                                                                break

                                                            case 10:
                                                                // Throw error
                                                                console.log('invalid file extension')

                                                            case 11:
                                                            case 'end':
                                                                return _context7.stop()
                                                        }
                                                    }
                                                },
                                                _callee5
                                            )
                                        }
                                    )
                                )()
                            },
                            getOrientation: function getOrientation(file, callback) {
                                var reader = new FileReader()

                                reader.onload = function(event) {
                                    var view = new DataView(event.target.result)
                                    if (view.getUint16(0, false) != 0xffd8) return callback(-2)
                                    var length = view.byteLength,
                                        offset = 2

                                    while (offset < length) {
                                        var marker = view.getUint16(offset, false)
                                        offset += 2

                                        if (marker == 0xffe1) {
                                            if (view.getUint32((offset += 2), false) != 0x45786966) {
                                                return callback(-1)
                                            }

                                            var little = view.getUint16((offset += 6), false) == 0x4949
                                            offset += view.getUint32(offset + 4, little)
                                            var tags = view.getUint16(offset, little)
                                            offset += 2

                                            for (var i = 0; i < tags; i++) {
                                                if (view.getUint16(offset + i * 12, little) == 0x0112)
                                                    return callback(view.getUint16(offset + i * 12 + 8, little))
                                            }
                                        } else if ((marker & 0xff00) != 0xff00) break
                                        else offset += view.getUint16(offset, false)
                                    }

                                    return callback(-1)
                                }

                                reader.readAsArrayBuffer(file.slice(0, 64 * 1024))
                            },
                            editURL: function editURL(index) {
                                var _this7 = this

                                this.URLActiveIndex = index
                                this.$nextTick(function() {
                                    _this7.$refs['url-input-' + index][0].focus()
                                })
                            },
                            setVariantImageURL: function setVariantImageURL(variant, imageURL, picture) {
                                var _this8 = this

                                return _asyncToGenerator(
                                    /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                        function _callee6() {
                                            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                function _callee6$(_context8) {
                                                    while (1) {
                                                        switch ((_context8.prev = _context8.next)) {
                                                            case 0:
                                                                if (_this8.product.id) {
                                                                    _context8.next = 5
                                                                    break
                                                                }

                                                                _this8.variantImageFromURLQueue.push({
                                                                    picture: variant.currentImg,
                                                                    variant: variant,
                                                                    imageURL: imageURL,
                                                                })

                                                                variant.image = imageURL
                                                                variant.currentImg.url = imageURL
                                                                return _context8.abrupt('return')

                                                            case 5:
                                                                variant.image = imageURL

                                                                if (picture) {
                                                                    picture.url = imageURL
                                                                } else {
                                                                    variant.currentImg.url = imageURL
                                                                }

                                                                _context8.next = 9
                                                                return _this8.syncExternalImages({
                                                                    file: _this8.currentFile,
                                                                    products: [_this8.productToEdit],
                                                                })

                                                            case 9:
                                                            case 'end':
                                                                return _context8.stop()
                                                        }
                                                    }
                                                },
                                                _callee6
                                            )
                                        }
                                    )
                                )()
                            },
                            onAddImageToVariant: function onAddImageToVariant(variant) {
                                variant.pictures.push({
                                    url: null,
                                    name: 'New image',
                                })
                                variant.imageIndex = variant.pictures.length - 1
                            },
                            onVariantPictureDragStart: function onVariantPictureDragStart(e, variant) {
                                this.draggingVariantPicture = true
                            },
                            onVariantPictureDragEnd: function onVariantPictureDragEnd(e, variant) {
                                this.draggingVariantPicture = false // If the dragged picture was the currently active picture set the active picture index to the pictures new index
                                // I.e. keep the same picure as the active one even after dragging

                                if (e.oldIndex == variant.imageIndex) {
                                    variant.imageIndex = e.newIndex
                                    return
                                } // Keep the same position when the active picture gets "bumped"

                                if (e.newIndex >= variant.imageIndex && e.oldIndex < variant.imageIndex)
                                    variant.imageIndex--
                                if (e.newIndex <= variant.imageIndex && e.oldIndex > variant.imageIndex)
                                    variant.imageIndex++
                            },
                            removePicture: function removePicture(index) {
                                var variant = this.product.variants[index]

                                if (variant.imageIndex > 0 && variant.imageIndex == variant.pictures.length - 1) {
                                    variant.imageIndex--
                                }

                                variant.pictures.splice(variant.imageIndex, 1)

                                if (variant.pictures.length <= 0) {
                                    this.onAddImageToVariant(variant)
                                }
                            },
                            onAddAssortmentSize: function onAddAssortmentSize() {
                                var _this9 = this

                                this.product.assortment_sizes.push('unset')
                                this.$nextTick(function() {
                                    _this9.$refs.assortmentSizeInput[
                                        _this9.product.assortment_sizes.length - 1
                                    ].setActive()
                                })
                            },
                            onRemoveAssortmentSize: function onRemoveAssortmentSize(index) {
                                this.product.assortment_sizes.splice(index, 1)
                            },
                            onAddSize: function onAddSize() {
                                var _this10 = this

                                if (!this.currentVariant.ean_sizes) Vue.set(this.currentVariant, 'ean_sizes', [])
                                this.currentVariant.ean_sizes.push({
                                    size: 'New size',
                                    ean: null,
                                })
                                this.$nextTick(function() {
                                    _this10.$refs.variantSizeInput[
                                        _this10.currentVariant.ean_sizes.length - 1
                                    ].setActive()
                                })
                            },
                            onRemoveSize: function onRemoveSize(index) {
                                this.currentVariant.ean_sizes.splice(index, 1)
                            },
                            onAddDelivery: function onAddDelivery() {
                                this.product.delivery_dates.push(
                                    new Date().toLocaleDateString(
                                        {},
                                        {
                                            month: 'long',
                                            year: 'numeric',
                                        }
                                    )
                                )
                            },
                            onRemoveDelivery: function onRemoveDelivery(index) {
                                this.product.delivery_dates.splice(index, 1)
                            },
                        }
                    ),
                    created: function created() {
                        document.body.addEventListener('keydown', this.hotkeyHandler) // Save an initial reference to the product we are going to edit

                        if (this.currentProduct) {
                            this.productToEdit = JSON.parse(JSON.stringify(this.currentProduct))
                        }
                    },
                    destroyed: function destroyed() {
                        document.body.removeEventListener('keydown', this.hotkeyHandler)
                    },
                }

                /***/
            },

        /***/ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=script&lang=js&':
            /*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! @babel/runtime/regenerator */ './node_modules/@babel/runtime/regenerator/index.js'
                )
                /* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                    _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__
                )
                /* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! vuex */ './node_modules/vuex/dist/vuex.esm.js'
                )
                /* harmony import */ var _ProductsTableRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    /*! ./ProductsTableRow */ './resources/js/pages/EditFilePage/ProductsTableRow.vue'
                )
                /* harmony import */ var _mixins_sortArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    /*! ../../mixins/sortArray */ './resources/js/mixins/sortArray.js'
                )

                function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
                    try {
                        var info = gen[key](arg)
                        var value = info.value
                    } catch (error) {
                        reject(error)
                        return
                    }
                    if (info.done) {
                        resolve(value)
                    } else {
                        Promise.resolve(value).then(_next, _throw)
                    }
                }

                function _asyncToGenerator(fn) {
                    return function() {
                        var self = this,
                            args = arguments
                        return new Promise(function(resolve, reject) {
                            var gen = fn.apply(self, args)
                            function _next(value) {
                                asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
                            }
                            function _throw(err) {
                                asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
                            }
                            _next(undefined)
                        })
                    }
                }

                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object)
                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object)
                        if (enumerableOnly)
                            symbols = symbols.filter(function(sym) {
                                return Object.getOwnPropertyDescriptor(object, sym).enumerable
                            })
                        keys.push.apply(keys, symbols)
                    }
                    return keys
                }

                function _objectSpread(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {}
                        if (i % 2) {
                            ownKeys(Object(source), true).forEach(function(key) {
                                _defineProperty(target, key, source[key])
                            })
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
                        } else {
                            ownKeys(Object(source)).forEach(function(key) {
                                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
                            })
                        }
                    }
                    return target
                }

                function _defineProperty(obj, key, value) {
                    if (key in obj) {
                        Object.defineProperty(obj, key, {
                            value: value,
                            enumerable: true,
                            configurable: true,
                            writable: true,
                        })
                    } else {
                        obj[key] = value
                    }
                    return obj
                }

                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //

                /* harmony default export */ __webpack_exports__['default'] = {
                    name: 'editProductsTable',
                    props: [
                        // 'products',
                        'sortKey',
                        'file',
                    ],
                    components: {
                        ProductsTableRow: _ProductsTableRow__WEBPACK_IMPORTED_MODULE_2__['default'],
                    },
                    mixins: [_mixins_sortArray__WEBPACK_IMPORTED_MODULE_3__['default']],
                    data: function data() {
                        return {
                            selectedProducts: [],
                            // productsFilteredBySearch: this.products,
                            contextItem: null,
                            editOrderModeActive: false,
                            localProducts: [],
                            showFilters: false,
                        }
                    },
                    computed: _objectSpread(
                        _objectSpread(
                            _objectSpread(
                                _objectSpread(
                                    {},
                                    Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapGetters'])('products', [
                                        'productTotals',
                                        'availableCategories',
                                        'availableDeliveryDates',
                                        'availableBuyerGroups',
                                        'getProductsFilteredBySearch',
                                        'singleVisible',
                                    ])
                                ),
                                Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapGetters'])('products', {
                                    products: 'productsFiltered',
                                })
                            ),
                            Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapState'])('products', {
                                stateProducts: 'products',
                            })
                        ),
                        {},
                        {
                            productsFilteredBySearch: {
                                get: function get() {
                                    return this.$store.getters['products/getProductsFilteredBySearch']
                                },
                                set: function set(value) {
                                    this.SET_PRODUCTS_FILTERED_BY_SEARCH(value)
                                },
                            },
                            selectedCategories: {
                                get: function get() {
                                    return this.$store.getters['products/selectedCategories']
                                },
                                set: function set(value) {
                                    this.updateSelectedCategories(value)
                                },
                            },
                            selectedDeliveryDates: {
                                get: function get() {
                                    return this.$store.getters['products/selectedDeliveryDates']
                                },
                                set: function set(value) {
                                    this.updateSelectedDeliveryDates(value)
                                },
                            },
                            selectedBuyerGroups: {
                                get: function get() {
                                    return this.$store.getters['products/selectedBuyerGroups']
                                },
                                set: function set(value) {
                                    this.updateSelectedBuyerGroups(value)
                                },
                            },
                            activeFiltersCount: function activeFiltersCount() {
                                return (
                                    this.selectedBuyerGroups.length +
                                    this.selectedCategories.length +
                                    this.selectedDeliveryDates.length
                                )
                            },
                            noImagesOnly: {
                                get: function get() {
                                    return this.$store.getters['products/noImagesOnly']
                                },
                                set: function set(value) {
                                    this.SET_NO_IMAGES_ONLY(value)
                                },
                            },
                        }
                    ),
                    methods: _objectSpread(
                        _objectSpread(
                            _objectSpread(
                                {},
                                Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapActions'])('products', [
                                    'setCurrentProduct',
                                    'instantiateNewProduct',
                                    'deleteProducts',
                                    'updateManyProducts',
                                ])
                            ),
                            Object(vuex__WEBPACK_IMPORTED_MODULE_1__['mapMutations'])('products', [
                                'setSingleVisisble',
                                'updateSelectedCategories',
                                'SET_PRODUCTS',
                                'updateSelectedDeliveryDates',
                                'updateSelectedBuyerGroups',
                                'SET_PRODUCTS_FILTERED_BY_SEARCH',
                                'SET_AVAILABLE_PRODUCTS',
                                'SET_NO_IMAGES_ONLY',
                            ])
                        ),
                        {},
                        {
                            onViewSingle: function onViewSingle(product) {
                                this.setCurrentProduct(product)
                                this.SET_AVAILABLE_PRODUCTS(this.productsFilteredBySearch) // Save array of available products

                                this.setSingleVisisble(true)
                                document.activeElement.blur()
                            },
                            toggleShowFilters: function toggleShowFilters() {
                                this.showFilters = !this.showFilters
                            },
                            hideFilters: function hideFilters() {
                                this.showFilters = false
                            },
                            showContext: function showContext(mouseEvent) {
                                var contextMenu = this.$refs.contextMenu

                                if (this.selectedProducts.length > 1) {
                                    contextMenu = this.$refs.contextMenuSelected
                                }

                                contextMenu.show(mouseEvent)
                            },
                            onNewProduct: function onNewProduct() {
                                var _this = this

                                return _asyncToGenerator(
                                    /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                        function _callee() {
                                            var newProduct
                                            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                function _callee$(_context) {
                                                    while (1) {
                                                        switch ((_context.prev = _context.next)) {
                                                            case 0:
                                                                _context.next = 2
                                                                return _this.instantiateNewProduct()

                                                            case 2:
                                                                newProduct = _context.sent

                                                                _this.setCurrentProduct(newProduct)

                                                                _this.setSingleVisisble(true)

                                                            case 5:
                                                            case 'end':
                                                                return _context.stop()
                                                        }
                                                    }
                                                },
                                                _callee
                                            )
                                        }
                                    )
                                )()
                            },
                            onDeleteProducts: function onDeleteProducts(products) {
                                var _this2 = this

                                return _asyncToGenerator(
                                    /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(
                                        function _callee2() {
                                            return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(
                                                function _callee2$(_context2) {
                                                    while (1) {
                                                        switch ((_context2.prev = _context2.next)) {
                                                            case 0:
                                                                _context2.next = 2
                                                                return _this2.deleteProducts({
                                                                    file: _this2.file,
                                                                    products: products,
                                                                })

                                                            case 2:
                                                                _this2.selectedProducts = []

                                                            case 3:
                                                            case 'end':
                                                                return _context2.stop()
                                                        }
                                                    }
                                                },
                                                _callee2
                                            )
                                        }
                                    )
                                )()
                            },
                            onSort: function onSort(sortAsc, sortKey) {
                                this.$emit('onSort', sortAsc, sortKey)
                            },
                            onClearFilters: function onClearFilters() {
                                this.selectedCategories = []
                                this.selectedDeliveryDates = []
                                this.selectedBuyerGroups = []
                            },
                            onEnterOrderMode: function onEnterOrderMode(shouldBeActive) {
                                this.editOrderModeActive = shouldBeActive

                                if (shouldBeActive) {
                                    this.onClearFilters()
                                } else {
                                    this.onSort(true, 'sequence')
                                }
                            },
                            onSaveOrder: function onSaveOrder() {
                                var _this3 = this

                                var products = this.products
                                var productsReOrdered = this.editOrderModeActive ? this.localProducts : this.products
                                productsReOrdered.map(function(reOrdered, index) {
                                    // Find the corresponding product
                                    var product = _this3.products.find(function(x) {
                                        return x.id == reOrdered.id
                                    })

                                    product.sequence = index + 1
                                })
                                this.updateManyProducts({
                                    file: this.file,
                                    products: products,
                                }) // Resort

                                this.onSort(true, 'sequence')
                            },
                            hotkeyHandler: function hotkeyHandler(e) {
                                var key = e.code
                                if (
                                    e.target.type == 'textarea' ||
                                    e.target.tagName.toUpperCase() == 'INPUT' ||
                                    this.singleVisible
                                )
                                    return // Don't mess with user input

                                if (key == 'KeyS') {
                                    this.$refs.tableComp.focusSearch() // this.$refs.searchField.setFocus()

                                    e.preventDefault() // Avoid entering an "s" in the search field
                                }
                            },
                        }
                    ),
                    created: function created() {
                        document.addEventListener('keydown', this.hotkeyHandler)
                    },
                    destroyed: function destroyed() {
                        document.removeEventListener('keydown', this.hotkeyHandler)
                        this.onClearFilters()
                    },
                }

                /***/
            },

        /***/ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=script&lang=js&':
            /*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! vuex */ './node_modules/vuex/dist/vuex.esm.js'
                )
                /* harmony import */ var _mixins_variantImage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! ../../mixins/variantImage */ './resources/js/mixins/variantImage.js'
                )
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //
                //

                /* harmony default export */ __webpack_exports__['default'] = {
                    name: 'productsRow',
                    props: ['product', 'selectedProducts', 'editOrderModeActive'],
                    mixins: [_mixins_variantImage__WEBPACK_IMPORTED_MODULE_1__['default']],
                    filters: {
                        truncate: function truncate(text, length) {
                            var clamp = '...'
                            var node = document.createElement('div')
                            node.innerHTML = text
                            var content = node.textContent // return `<span>124</span>`

                            return content.length > length ? content.slice(0, length) + clamp : content
                        },
                    },
                    computed: {
                        localSelectedProducts: {
                            get: function get() {
                                return this.selectedProducts
                            },
                            set: function set(localSelectedProducts) {
                                this.$emit('input', localSelectedProducts)
                            },
                        },
                        titleTruncateSize: function titleTruncateSize() {
                            return window.innerWidth < 1260 ? 16 : 24
                        },
                    },
                    methods: {
                        productImg: function productImg(variant) {
                            if (!variant || (!variant.blob_id && !variant.image)) return '/images/placeholder.JPG'
                            if (variant.blob_id)
                                return 'https://trendmatchb2bdev.azureedge.net/trendmatch-b2b-dev/'.concat(
                                    variant.blob_id,
                                    '_thumbnail.jpg'
                                )
                            else return variant.image
                        },
                        onViewSingle: function onViewSingle() {
                            this.$emit('view-single-product', this.product)
                        },
                        variantNameTruncateLength: function variantNameTruncateLength(product) {
                            var amount = product.variants.length

                            if (amount > 4) {
                                return window.innerWidth > 1260 ? 12 : 6
                            } else if (amount > 2) {
                                return window.innerWidth > 1260 ? 20 : 15
                            }
                        },
                    },
                }

                /***/
            },

        /***/ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/index.vue?vue&type=script&lang=js&':
            /*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/index.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! vuex */ './node_modules/vuex/dist/vuex.esm.js'
                )
                /* harmony import */ var _EditFilePage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! ./EditFilePage */ './resources/js/pages/EditFilePage/EditFilePage.vue'
                )
                /* harmony import */ var _components_common_PageLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    /*! ../../components/common/PageLoader */ './resources/js/components/common/PageLoader.vue'
                )
                function ownKeys(object, enumerableOnly) {
                    var keys = Object.keys(object)
                    if (Object.getOwnPropertySymbols) {
                        var symbols = Object.getOwnPropertySymbols(object)
                        if (enumerableOnly)
                            symbols = symbols.filter(function(sym) {
                                return Object.getOwnPropertyDescriptor(object, sym).enumerable
                            })
                        keys.push.apply(keys, symbols)
                    }
                    return keys
                }

                function _objectSpread(target) {
                    for (var i = 1; i < arguments.length; i++) {
                        var source = arguments[i] != null ? arguments[i] : {}
                        if (i % 2) {
                            ownKeys(Object(source), true).forEach(function(key) {
                                _defineProperty(target, key, source[key])
                            })
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
                        } else {
                            ownKeys(Object(source)).forEach(function(key) {
                                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
                            })
                        }
                    }
                    return target
                }

                function _defineProperty(obj, key, value) {
                    if (key in obj) {
                        Object.defineProperty(obj, key, {
                            value: value,
                            enumerable: true,
                            configurable: true,
                            writable: true,
                        })
                    } else {
                        obj[key] = value
                    }
                    return obj
                }

                //
                //
                //
                //
                //
                //
                //
                //
                //

                /* harmony default export */ __webpack_exports__['default'] = {
                    name: 'editFileLoader',
                    components: {
                        PageLoader: _components_common_PageLoader__WEBPACK_IMPORTED_MODULE_2__['default'],
                        EditFilePage: _EditFilePage__WEBPACK_IMPORTED_MODULE_1__['default'],
                    },
                    data: function data() {
                        return {}
                    },
                    computed: _objectSpread(
                        _objectSpread(
                            _objectSpread(
                                {},
                                Object(vuex__WEBPACK_IMPORTED_MODULE_0__['mapGetters'])('products', ['productsStatus'])
                            ),
                            Object(vuex__WEBPACK_IMPORTED_MODULE_0__['mapGetters'])('files', [
                                'currentFile',
                                'filesStatus',
                            ])
                        ),
                        {},
                        {
                            loading: function loading() {
                                return this.productsStatus != 'success' || !this.currentFile
                            },
                            status: function status() {
                                if (this.productsStatus == 'error' || this.filesStatus == 'error') return 'error'
                                if (
                                    this.productsStatus == 'loading' ||
                                    this.filesStatus == 'loading' ||
                                    !this.currentFile
                                )
                                    return 'loading'
                                return 'success'
                            },
                        }
                    ),
                    methods: _objectSpread(
                        _objectSpread(
                            _objectSpread(
                                {},
                                Object(vuex__WEBPACK_IMPORTED_MODULE_0__['mapActions'])('files', ['fetchFile'])
                            ),
                            Object(vuex__WEBPACK_IMPORTED_MODULE_0__['mapActions'])('products', ['fetchProducts'])
                        ),
                        {},
                        {
                            fetchData: function fetchData() {
                                // Fetch the current file and the products
                                var fileId = this.$route.params.fileId
                                this.fetchFile(fileId)
                                this.fetchProducts({
                                    fileId: fileId,
                                })
                            },
                        }
                    ),
                    created: function created() {
                        this.fetchData()
                    },
                }

                /***/
            },

        /***/ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true&':
            /*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                exports = module.exports = __webpack_require__(
                    /*! ../../../../node_modules/css-loader/lib/css-base.js */ './node_modules/css-loader/lib/css-base.js'
                )(false)
                // imports

                // module
                exports.push([module.i, '.bulk-upload-component[data-v-0916258e] {\n  margin-bottom: 32px;\n}', ''])

                // exports

                /***/
            },

        /***/ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss&':
            /*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                exports = module.exports = __webpack_require__(
                    /*! ../../../../node_modules/css-loader/lib/css-base.js */ './node_modules/css-loader/lib/css-base.js'
                )(false)
                // imports

                // module
                exports.push([
                    module.i,
                    '.header[data-v-8a162718] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding-bottom: 16px;\n  margin-bottom: 16px;\n  border-bottom: solid 2px #dfdfdf;\n}\n.header > div[data-v-8a162718] {\n  display: flex;\n  align-items: center;\n}\n.header h1[data-v-8a162718] {\n  display: inline-block;\n  margin: 0;\n  margin-right: 12px;\n}\n.header .stat[data-v-8a162718] {\n  margin-left: 24px;\n}\n.header .title[data-v-8a162718] {\n  display: block;\n  text-align: left;\n  font-size: 12px;\n  font-weight: 700;\n  color: #a8a8a8;\n}',
                    '',
                ])

                // exports

                /***/
            },

        /***/ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss&':
            /*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                exports = module.exports = __webpack_require__(
                    /*! ../../../../node_modules/css-loader/lib/css-base.js */ './node_modules/css-loader/lib/css-base.js'
                )(false)
                // imports

                // module
                exports.push([
                    module.i,
                    '.quick-actions[data-v-2b3dc336] {\n  border-bottom: solid 1px #a7b2c2;\n  padding-bottom: 16px;\n  margin-bottom: 16px;\n}\n.quick-actions p[data-v-2b3dc336] {\n  font-size: 14px;\n  font-weight: 500;\n  margin-bottom: 8px;\n}\n.quick-actions .button[data-v-2b3dc336]:not(:last-child) {\n  margin-right: 12px;\n}',
                    '',
                ])

                // exports

                /***/
            },

        /***/ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss&':
            /*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                exports = module.exports = __webpack_require__(
                    /*! ../../../../node_modules/css-loader/lib/css-base.js */ './node_modules/css-loader/lib/css-base.js'
                )(false)
                // imports

                // module
                exports.push([
                    module.i,
                    '.product-title-wrapper[data-v-19e6ac0a] {\n  flex-direction: column;\n  justify-content: flex-start;\n}\n.product-title-wrapper .product-count[data-v-19e6ac0a] {\n  font-size: 12px;\n  line-height: 1;\n}\n.save-button[data-v-19e6ac0a] {\n  min-width: 72px;\n}\n.product-variants[data-v-19e6ac0a] {\n  margin-top: 12px;\n  white-space: nowrap;\n  overflow-x: auto;\n  margin-bottom: 18px;\n}\n.assortments .col-4[data-v-19e6ac0a] {\n  grid-template-columns: 1fr 100px 192px 32px;\n}\n.prices .col-5[data-v-19e6ac0a] {\n  grid-template-columns: 140px repeat(3, 1fr) 32px;\n}\n.form-section[data-v-19e6ac0a] {\n  padding: 16px 16px 32px;\n  border: 1px solid #cddde8;\n  box-shadow: 0 3px 4px 0 rgba(117, 134, 156, 0.1);\n  border-radius: 4px;\n  background: white;\n}\n.form-section[data-v-19e6ac0a]:not(:last-child) {\n  margin-bottom: 32px;\n}\n.product-variant[data-v-19e6ac0a] {\n  width: 182px;\n  display: inline-block;\n}\n.product-variant.is-current .drop-area[data-v-19e6ac0a] {\n  border: solid 2px #2a46ff;\n}\n.product-variant[data-v-19e6ac0a]:not(:last-child) {\n  margin-right: 12px;\n}\n.product-variant.has-img .drop-area[data-v-19e6ac0a] {\n  border: none;\n}\n.product-variant.has-img .img-wrapper[data-v-19e6ac0a] {\n  border: solid 2px #8dabc4;\n}\n.product-variant .progress-wrapper[data-v-19e6ac0a] {\n  position: absolute;\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  color: white;\n  background: rgba(28, 41, 59, 0.5);\n}\n.product-variant .progress-wrapper svg[data-v-19e6ac0a] {\n  width: 90%;\n}\n.product-variant .progress-wrapper svg rect[data-v-19e6ac0a] {\n  fill: white;\n}\n.product-variant .progress-wrapper svg rect.value[data-v-19e6ac0a] {\n  fill: #2a46ff;\n}\n.product-variant .img-wrapper[data-v-19e6ac0a] {\n  height: 242px;\n  width: 100%;\n  position: relative;\n  overflow: hidden;\n  display: inline-block;\n  border-radius: 4px;\n  overflow: hidden;\n}\n.product-variant .img-wrapper img[data-v-19e6ac0a] {\n  width: 100%;\n  height: 100%;\n  -o-object-fit: contain;\n     object-fit: contain;\n  -o-object-position: center;\n     object-position: center;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.product-variant .img-wrapper img.rotation-6[data-v-19e6ac0a] {\n  transform: rotate(90deg) translateY(-100%);\n  transform-origin: top left;\n  width: 242px;\n  height: 180px;\n}\n.product-variant .img-wrapper .drop-area[data-v-19e6ac0a] {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  cursor: auto;\n}\n.product-variant .img-wrapper .drop-area input[type=file][data-v-19e6ac0a] {\n  pointer-events: none;\n}\n.product-variant .img-wrapper .drop-area .enter-url[data-v-19e6ac0a] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  background: #f3f3f3;\n  padding: 10px;\n}\n.product-variant .img-wrapper .drop-area .enter-url .buttons-wrapper[data-v-19e6ac0a] {\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n}\n.product-variant .img-wrapper .drop-area .enter-url .buttons-wrapper > *[data-v-19e6ac0a] {\n  width: calc(50% - 4px);\n  margin-top: 8px;\n  min-width: 0;\n}\n.product-variant .img-wrapper .drop-area .drop-msg[data-v-19e6ac0a] {\n  z-index: 1;\n  position: absolute;\n  left: 0;\n  top: 0;\n  height: 100%;\n  width: 100%;\n  justify-content: center;\n  align-items: center;\n  display: none;\n  outline: 2px dashed #dfdfdf;\n  outline-offset: -10px;\n  background: white;\n  padding: 12px 12px;\n  background: #f3f3f3;\n}\n.product-variant .img-wrapper .drop-area.drag .drop-msg[data-v-19e6ac0a] {\n  display: flex;\n  pointer-events: none;\n}\n.product-variant .img-wrapper .drop-area.drag .controls[data-v-19e6ac0a] {\n  pointer-events: none;\n}\n.product-variant .img-wrapper .drop-area.drag input[type=file][data-v-19e6ac0a] {\n  z-index: 2;\n  pointer-events: all;\n}\n.product-variant .img-wrapper .drop-area .controls[data-v-19e6ac0a] {\n  display: flex;\n  flex-direction: column;\n}\n.product-variant .img-wrapper .drop-area .controls > *[data-v-19e6ac0a]:not(:last-child) {\n  margin-bottom: 8px;\n}\n.product-variant .img-wrapper .drop-area .controls .button[data-v-19e6ac0a] {\n  width: 124px;\n}\n.product-variant .img-wrapper > .controls[data-v-19e6ac0a] {\n  position: absolute;\n  z-index: 1;\n  left: 4px;\n  top: 4px;\n  opacity: 0;\n  transition: 0.3s;\n  border: solid 1px #cddde8;\n}\n.product-variant .img-wrapper:hover .controls[data-v-19e6ac0a] {\n  opacity: 1;\n}\n.product-variant .color-wrapper[data-v-19e6ac0a] {\n  overflow: hidden;\n  margin-right: 5px;\n}\n.product-variant .color-wrapper span[data-v-19e6ac0a] {\n  font-size: 10px;\n  font-weight: 500;\n  color: #a8a8a8;\n}\n.product-variant .color-wrapper .circle-img[data-v-19e6ac0a] {\n  width: 12px;\n  height: 12px;\n  border-radius: 6px;\n  border: solid 1px #f3f3f3;\n  position: relative;\n  overflow: hidden;\n  display: inline-block;\n}\n.product-variant .color-wrapper .circle-img img[data-v-19e6ac0a] {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  position: absolute;\n}\n.input-wrapper.composition[data-v-19e6ac0a] {\n  white-space: pre-line;\n}\n.last-update[data-v-19e6ac0a] {\n  display: flex;\n  flex-direction: column;\n  font-size: 11px;\n  font-weight: 500;\n  text-align: right;\n}\n.form-element[data-v-19e6ac0a]:not(:last-child) {\n  margin-bottom: 16px;\n}\n.image-drawer[data-v-19e6ac0a] {\n  position: absolute;\n  right: 4px;\n  top: 4px;\n  padding: 4px;\n  border: solid 1px #cddde8;\n  border-radius: 4px;\n  border-color: transparent;\n  z-index: 1;\n}\n.image-drawer[data-v-19e6ac0a]:hover, .image-drawer.hover[data-v-19e6ac0a] {\n  background: white;\n  border-color: #adc9db;\n  box-shadow: 0 3px 4px 0 rgba(117, 134, 156, 0.1);\n}\n.image-drawer:hover .drawer[data-v-19e6ac0a], .image-drawer.hover .drawer[data-v-19e6ac0a] {\n  display: block;\n}\n.image-drawer:hover .trigger[data-v-19e6ac0a], .image-drawer.hover .trigger[data-v-19e6ac0a] {\n  display: none;\n}\n.image-drawer .trigger[data-v-19e6ac0a] {\n  border: solid 1px #cddde8;\n  margin-right: -4px;\n  margin-top: -4px;\n  position: relative;\n}\n.image-drawer .trigger .count[data-v-19e6ac0a] {\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  height: 16px;\n  width: 16px;\n  font-size: 10px;\n}\n.image-drawer .drawer[data-v-19e6ac0a] {\n  display: none;\n  overflow-y: auto;\n  max-height: 200px;\n}\n.image-drawer .drawer[data-v-19e6ac0a] > :not(:last-child) {\n  margin-bottom: 4px;\n}\n.image-drawer[data-v-19e6ac0a] > :not(:last-child) {\n  margin-bottom: 4px;\n}\n.image-drawer .image-wrapper[data-v-19e6ac0a] {\n  width: 36px;\n  height: 36px;\n  border: solid 1px #cddde8;\n  border-radius: 4px;\n  position: relative;\n  cursor: pointer;\n}\n.image-drawer .image-wrapper img[data-v-19e6ac0a] {\n  width: 100%;\n  height: 100%;\n  -o-object-fit: cover;\n     object-fit: cover;\n  -o-object-position: center;\n     object-position: center;\n  position: absolute;\n}\n.image-drawer .image-wrapper.active[data-v-19e6ac0a] {\n  border: solid 2px #2a46ff;\n  cursor: default;\n}',
                    '',
                ])

                // exports

                /***/
            },

        /***/ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss&':
            /*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                exports = module.exports = __webpack_require__(
                    /*! ../../../../node_modules/css-loader/lib/css-base.js */ './node_modules/css-loader/lib/css-base.js'
                )(false)
                // imports

                // module
                exports.push([
                    module.i,
                    '.products-table-wrapper button[data-v-04fbba8e] {\n  position: relative;\n}\n.products-table-wrapper button .circle[data-v-04fbba8e] {\n  margin-top: -24px;\n  margin-right: -12px;\n  margin-left: 4px;\n  z-index: 1;\n}\n.products-table-wrapper[data-v-04fbba8e]  tr:not(.table-top-bar) > * {\n  flex: 0 1 auto;\n}\n.products-table-wrapper[data-v-04fbba8e]  tr th.title, .products-table-wrapper[data-v-04fbba8e]  tr td.title {\n  min-width: 220px;\n  max-width: 220px;\n  display: flex;\n  align-items: center;\n  margin-right: auto;\n}\n@media screen and (max-width: 1260px) {\n.products-table-wrapper[data-v-04fbba8e]  tr th.title, .products-table-wrapper[data-v-04fbba8e]  tr td.title {\n    min-width: 160px;\n    max-width: 160px;\n}\n}\n.products-table-wrapper[data-v-04fbba8e]  tr th.id, .products-table-wrapper[data-v-04fbba8e]  tr td.id {\n  min-width: 80px;\n  max-width: 80px;\n  margin-left: 16px;\n}\n.products-table-wrapper[data-v-04fbba8e]  tr th.image, .products-table-wrapper[data-v-04fbba8e]  tr td.image {\n  min-width: 100px;\n  max-width: 100px;\n  height: 100%;\n}\n.products-table-wrapper[data-v-04fbba8e]  tr th.delivery, .products-table-wrapper[data-v-04fbba8e]  tr td.delivery {\n  min-width: 80px;\n  max-width: 80px;\n  margin-right: auto;\n}\n.products-table-wrapper[data-v-04fbba8e]  tr th.wholesale-price, .products-table-wrapper[data-v-04fbba8e]  tr th.recommended-retail-price, .products-table-wrapper[data-v-04fbba8e]  tr td.wholesale-price, .products-table-wrapper[data-v-04fbba8e]  tr td.recommended-retail-price {\n  min-width: 64px;\n  max-width: 64px;\n}\n.products-table-wrapper[data-v-04fbba8e]  tr th.currency, .products-table-wrapper[data-v-04fbba8e]  tr td.currency {\n  min-width: 38px;\n  max-width: 38px;\n}\n.products-table-wrapper[data-v-04fbba8e]  tr th.mark-up, .products-table-wrapper[data-v-04fbba8e]  tr td.mark-up {\n  min-width: 36px;\n  max-width: 36px;\n}\n.products-table-wrapper[data-v-04fbba8e]  tr th.currency, .products-table-wrapper[data-v-04fbba8e]  tr td.currency {\n  margin-right: auto;\n}\n.products-table-wrapper[data-v-04fbba8e]  tr th.minimum, .products-table-wrapper[data-v-04fbba8e]  tr td.minimum {\n  min-width: 104px;\n  max-width: 104px;\n  margin-right: auto;\n}\n.products-table-wrapper[data-v-04fbba8e]  tr th.action, .products-table-wrapper[data-v-04fbba8e]  tr td.action {\n  min-width: 92px;\n  max-width: 92px;\n  flex: 0 1 auto;\n  margin-left: auto;\n}\n.products-table-wrapper[data-v-04fbba8e]  tr td:not(.image):not(.select):not(.action):not(.id):not(.context-button) {\n  padding-bottom: 24px;\n}\n.filter-counter[data-v-04fbba8e] {\n  margin-left: auto;\n}',
                    '',
                ])

                // exports

                /***/
            },

        /***/ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss&':
            /*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                exports = module.exports = __webpack_require__(
                    /*! ../../../../node_modules/css-loader/lib/css-base.js */ './node_modules/css-loader/lib/css-base.js'
                )(false)
                // imports

                // module
                exports.push([
                    module.i,
                    '.products-table-row .img-wrapper[data-v-6f7a1791] {\n  border: solid 1px #cddde8;\n  height: 100%;\n  width: 100%;\n}\n.products-table-row .img-wrapper img[data-v-6f7a1791] {\n  width: 100%;\n  height: 100%;\n  -o-object-fit: contain;\n     object-fit: contain;\n}\ntd.title[data-v-6f7a1791] {\n  position: relative;\n}\n.variant-list[data-v-6f7a1791] {\n  position: absolute;\n  left: 0;\n  bottom: -6px;\n}\n.variant-list-item[data-v-6f7a1791]:not(:first-child) {\n  margin-left: 4px;\n}\n.drag-handle[data-v-6f7a1791] {\n  cursor: -webkit-grab;\n  cursor: grab;\n}\n.drag-handle i[data-v-6f7a1791] {\n  font-weight: 400 !important;\n}',
                    '',
                ])

                // exports

                /***/
            },

        /***/ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true&':
            /*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                var content = __webpack_require__(
                    /*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true& */ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true&'
                )

                if (typeof content === 'string') content = [[module.i, content, '']]

                var transform
                var insertInto

                var options = { hmr: true }

                options.transform = transform
                options.insertInto = undefined

                var update = __webpack_require__(
                    /*! ../../../../node_modules/style-loader/lib/addStyles.js */ './node_modules/style-loader/lib/addStyles.js'
                )(content, options)

                if (content.locals) module.exports = content.locals

                if (false) {
                }

                /***/
            },

        /***/ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss&':
            /*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                var content = __webpack_require__(
                    /*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss& */ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss&'
                )

                if (typeof content === 'string') content = [[module.i, content, '']]

                var transform
                var insertInto

                var options = { hmr: true }

                options.transform = transform
                options.insertInto = undefined

                var update = __webpack_require__(
                    /*! ../../../../node_modules/style-loader/lib/addStyles.js */ './node_modules/style-loader/lib/addStyles.js'
                )(content, options)

                if (content.locals) module.exports = content.locals

                if (false) {
                }

                /***/
            },

        /***/ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss&':
            /*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                var content = __webpack_require__(
                    /*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss& */ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss&'
                )

                if (typeof content === 'string') content = [[module.i, content, '']]

                var transform
                var insertInto

                var options = { hmr: true }

                options.transform = transform
                options.insertInto = undefined

                var update = __webpack_require__(
                    /*! ../../../../node_modules/style-loader/lib/addStyles.js */ './node_modules/style-loader/lib/addStyles.js'
                )(content, options)

                if (content.locals) module.exports = content.locals

                if (false) {
                }

                /***/
            },

        /***/ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss&':
            /*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                var content = __webpack_require__(
                    /*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss& */ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss&'
                )

                if (typeof content === 'string') content = [[module.i, content, '']]

                var transform
                var insertInto

                var options = { hmr: true }

                options.transform = transform
                options.insertInto = undefined

                var update = __webpack_require__(
                    /*! ../../../../node_modules/style-loader/lib/addStyles.js */ './node_modules/style-loader/lib/addStyles.js'
                )(content, options)

                if (content.locals) module.exports = content.locals

                if (false) {
                }

                /***/
            },

        /***/ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss&':
            /*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                var content = __webpack_require__(
                    /*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss& */ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss&'
                )

                if (typeof content === 'string') content = [[module.i, content, '']]

                var transform
                var insertInto

                var options = { hmr: true }

                options.transform = transform
                options.insertInto = undefined

                var update = __webpack_require__(
                    /*! ../../../../node_modules/style-loader/lib/addStyles.js */ './node_modules/style-loader/lib/addStyles.js'
                )(content, options)

                if (content.locals) module.exports = content.locals

                if (false) {
                }

                /***/
            },

        /***/ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss&':
            /*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, exports, __webpack_require__) {
                var content = __webpack_require__(
                    /*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss& */ './node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss&'
                )

                if (typeof content === 'string') content = [[module.i, content, '']]

                var transform
                var insertInto

                var options = { hmr: true }

                options.transform = transform
                options.insertInto = undefined

                var update = __webpack_require__(
                    /*! ../../../../node_modules/style-loader/lib/addStyles.js */ './node_modules/style-loader/lib/addStyles.js'
                )(content, options)

                if (content.locals) module.exports = content.locals

                if (false) {
                }

                /***/
            },

        /***/ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=template&id=0916258e&scoped=true&':
            /*!******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=template&id=0916258e&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return render
                })
                /* harmony export (binding) */ __webpack_require__.d(
                    __webpack_exports__,
                    'staticRenderFns',
                    function() {
                        return staticRenderFns
                    }
                )
                var render = function() {
                    var _vm = this
                    var _h = _vm.$createElement
                    var _c = _vm._self._c || _h
                    return _c(
                        'div',
                        { staticClass: 'bulk-upload-component' },
                        [
                            _c('h3', [_vm._v('Bulk upload images')]),
                            _vm._v(' '),
                            _vm._m(0),
                            _vm._v(' '),
                            _c(
                                'BaseDroparea',
                                {
                                    attrs: { multiple: true, accept: 'image/*' },
                                    on: { input: _vm.onFilesChange },
                                },
                                [_c('p', [_c('span', [_vm._v('Drag images here or click to browse')])])]
                            ),
                            _vm._v(' '),
                            _c(
                                'div',
                                { staticClass: 'image-list' },
                                [
                                    _vm._l(_vm.imagesToUpload.slice(0, _vm.displayLimit), function(image, index) {
                                        return _c('p', { key: index }, [
                                            _vm._v('\n            ' + _vm._s(image.name) + '\n        '),
                                        ])
                                    }),
                                    _vm._v(' '),
                                    _vm.displayLimit < _vm.imagesToUpload.length
                                        ? _c('p', [
                                              _c('strong', [
                                                  _vm._v(
                                                      '+ ' +
                                                          _vm._s(_vm.imagesToUpload.length - _vm.displayLimit) +
                                                          ' more'
                                                  ),
                                              ]),
                                          ])
                                        : _vm._e(),
                                ],
                                2
                            ),
                            _vm._v(' '),
                            _c(
                                'button',
                                {
                                    staticClass: 'full-width xl primary',
                                    staticStyle: { 'margin-top': '12px' },
                                    attrs: {
                                        disabled: _vm.imagesToUpload.length <= 0 || _vm.uploadingCount > 0,
                                    },
                                    on: { click: _vm.onSubmit },
                                },
                                [
                                    _vm.uploadingCount <= 0
                                        ? _c('span', [
                                              _vm._v(
                                                  'Upload ' +
                                                      _vm._s(
                                                          _vm.imagesToUpload.length > 0 ? _vm.imagesToUpload.length : ''
                                                      ) +
                                                      ' image' +
                                                      _vm._s(_vm.imagesToUpload.length != 1 ? 's' : '')
                                              ),
                                          ])
                                        : _c('BaseLoader'),
                                ],
                                1
                            ),
                            _vm._v(' '),
                            _vm.uploadingCount > 0
                                ? _c('p', { staticStyle: { 'text-align': 'center' } }, [
                                      _c('span', [
                                          _vm._v('Uploading images: '),
                                          _c('strong', [_vm._v(_vm._s(_vm.uploadingCount))]),
                                          _vm._v(' of '),
                                          _c('strong', [_vm._v(_vm._s(_vm.imagesToUpload.length))]),
                                          _vm._v(' left.'),
                                      ]),
                                  ])
                                : _vm._e(),
                            _vm._v(' '),
                            _vm.updatingCount > 0
                                ? _c('p', { staticStyle: { 'text-align': 'center' } }, [
                                      _c('span', [
                                          _vm._v('Updating Products: '),
                                          _c('strong', [_vm._v(_vm._s(_vm.updatingCount))]),
                                          _vm._v(' of '),
                                          _c('strong', [_vm._v(_vm._s(_vm.toalUpdateCount))]),
                                          _vm._v(' left.'),
                                      ]),
                                  ])
                                : _vm._e(),
                        ],
                        1
                    )
                }
                var staticRenderFns = [
                    function() {
                        var _vm = this
                        var _h = _vm.$createElement
                        var _c = _vm._self._c || _h
                        return _c(
                            'div',
                            {
                                staticClass: 'guide-lines',
                                staticStyle: { 'max-width': '600px', 'margin-bottom': '20px' },
                            },
                            [
                                _c('p', [
                                    _c('strong', { staticClass: 'primary' }, [_vm._v('ATTENTION')]),
                                    _c('br'),
                                    _vm._v(' '),
                                    _c('span', [
                                        _vm._v('Images names must start with this pattern: '),
                                        _c('i', [
                                            _vm._v('"'),
                                            _c('strong', [_vm._v('{PRODUCT ID}')]),
                                            _vm._v('_'),
                                            _c('strong', [_vm._v('{VARIANT NAME}')]),
                                            _vm._v('"'),
                                        ]),
                                    ]),
                                ]),
                                _vm._v(' '),
                                _c('p', { staticStyle: { margin: '16px auto' } }, [
                                    _c('i', [
                                        _c('strong', [_vm._v('Example:')]),
                                        _vm._v(' "12345678_Green - Pack Shot-Back-002"'),
                                    ]),
                                ]),
                                _vm._v(' '),
                                _c('p', [
                                    _c('strong', [_vm._v('Explanation:')]),
                                    _vm._v(
                                        ' {Product ID} followed by an underscore(_), followed by the {variant name}, followed by nothing, a dash(-), or underscore(_)'
                                    ),
                                ]),
                                _vm._v(' '),
                                _c('p', [
                                    _vm._v('\n            If the image name contains the word "'),
                                    _c('i', [_vm._v('front')]),
                                    _vm._v('" the image will be placed first on the variant.\n        '),
                                ]),
                            ]
                        )
                    },
                ]
                render._withStripped = true

                /***/
            },

        /***/ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=template&id=8a162718&scoped=true&':
            /*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=template&id=8a162718&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return render
                })
                /* harmony export (binding) */ __webpack_require__.d(
                    __webpack_exports__,
                    'staticRenderFns',
                    function() {
                        return staticRenderFns
                    }
                )
                var render = function() {
                    var _vm = this
                    var _h = _vm.$createElement
                    var _c = _vm._self._c || _h
                    return _c('div', { staticClass: 'header' }, [
                        _c('div', [_c('div', [_vm._m(0), _vm._v(' '), _c('h1', [_vm._v(_vm._s(_vm.file.title))])])]),
                        _vm._v(' '),
                        _c('div', [
                            _c('div', { staticClass: 'stat' }, [
                                _c('span', { staticClass: 'title' }, [_vm._v('Start date')]),
                                _vm._v(' '),
                                _c('span', { staticClass: 'square light' }, [
                                    _vm._v(
                                        _vm._s(
                                            new Date(_vm.file.start_date).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })
                                        )
                                    ),
                                ]),
                            ]),
                            _vm._v(' '),
                            _c('div', { staticClass: 'stat' }, [
                                _c('span', { staticClass: 'title' }, [_vm._v('Deadline')]),
                                _vm._v(' '),
                                _c('span', { staticClass: 'square light' }, [
                                    _vm._v(
                                        _vm._s(
                                            new Date(_vm.file.start_date).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })
                                        )
                                    ),
                                ]),
                            ]),
                        ]),
                    ])
                }
                var staticRenderFns = [
                    function() {
                        var _vm = this
                        var _h = _vm.$createElement
                        var _c = _vm._self._c || _h
                        return _c('div', [_c('i', { staticClass: 'far fa-pen' }), _vm._v(' Editing:')])
                    },
                ]
                render._withStripped = true

                /***/
            },

        /***/ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=template&id=2b3dc336&scoped=true&':
            /*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=template&id=2b3dc336&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return render
                })
                /* harmony export (binding) */ __webpack_require__.d(
                    __webpack_exports__,
                    'staticRenderFns',
                    function() {
                        return staticRenderFns
                    }
                )
                var render = function() {
                    var _vm = this
                    var _h = _vm.$createElement
                    var _c = _vm._self._c || _h
                    return _c(
                        'div',
                        { staticClass: 'edit-file-component' },
                        [
                            _c('h1', [_vm._v('Editing: ' + _vm._s(_vm.file.name))]),
                            _vm._v(' '),
                            _c(
                                'button',
                                {
                                    staticClass: 'primary md',
                                    staticStyle: { 'margin-bottom': '20px' },
                                    on: {
                                        click: function($event) {
                                            _vm.showBulkUpload = !_vm.showBulkUpload
                                        },
                                    },
                                },
                                [
                                    !_vm.showBulkUpload
                                        ? [
                                              _c('i', { staticClass: 'far fa-upload' }),
                                              _vm._v(' '),
                                              _c('span', [_vm._v('Bulk upload images')]),
                                          ]
                                        : [
                                              _c('i', { staticClass: 'far fa-check' }),
                                              _vm._v(' '),
                                              _c('span', [_vm._v('Finish bulk uploading')]),
                                          ],
                                ],
                                2
                            ),
                            _vm._v(' '),
                            _vm.showBulkUpload ? _c('BulkUploadComponent') : _vm._e(),
                            _vm._v(' '),
                            _vm.productsEligibleForVariantImageShift.length > 0
                                ? _c('div', { staticClass: 'quick-actions' }, [
                                      _c('p', [_vm._v('Recommended actions')]),
                                      _vm._v(' '),
                                      _vm.productsEligibleForVariantImageShift.length > 0
                                          ? _c(
                                                'button',
                                                {
                                                    staticClass: 'ghost md dark',
                                                    staticStyle: { 'margin-right': '8px' },
                                                    on: { click: _vm.setVariantWithImageFirst },
                                                },
                                                [
                                                    _c('span', [
                                                        _vm._v(
                                                            'Update ' +
                                                                _vm._s(
                                                                    _vm.productsEligibleForVariantImageShift.length
                                                                ) +
                                                                ' products: Show variants with image first'
                                                        ),
                                                    ]),
                                                ]
                                            )
                                          : _vm._e(),
                                  ])
                                : _vm._e(),
                            _vm._v(' '),
                            _c('ProductsTable', {
                                attrs: {
                                    sortKey: _vm.sortKey,
                                    file: _vm.file,
                                    products: _vm.productsFiltered,
                                },
                                on: { onSort: _vm.onSort },
                            }),
                            _vm._v(' '),
                            _c('ProductFlyin', {
                                attrs: { show: _vm.singleVisible },
                                on: {
                                    closeSingle: function($event) {
                                        return _vm.setSingleVisisble(false)
                                    },
                                    onSort: _vm.onSort,
                                },
                            }),
                        ],
                        1
                    )
                }
                var staticRenderFns = []
                render._withStripped = true

                /***/
            },

        /***/ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=template&id=19e6ac0a&scoped=true&':
            /*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=template&id=19e6ac0a&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return render
                })
                /* harmony export (binding) */ __webpack_require__.d(
                    __webpack_exports__,
                    'staticRenderFns',
                    function() {
                        return staticRenderFns
                    }
                )
                var render = function() {
                    var _vm = this
                    var _h = _vm.$createElement
                    var _c = _vm._self._c || _h
                    return _c('BaseFlyin', {
                        staticClass: 'edit-product-single',
                        attrs: { show: _vm.show, columns: 2 },
                        on: { close: _vm.onCloseSingle },
                        scopedSlots: _vm._u(
                            [
                                {
                                    key: 'header',
                                    fn: function() {
                                        return [
                                            _vm.show
                                                ? _c('BaseFlyinHeader', {
                                                      attrs: { next: _vm.nextProduct, prev: _vm.prevProduct },
                                                      on: {
                                                          close: _vm.onCloseSingle,
                                                          next: _vm.showNextProduct,
                                                          prev: _vm.showPrevProduct,
                                                      },
                                                      scopedSlots: _vm._u(
                                                          [
                                                              {
                                                                  key: 'left',
                                                                  fn: function() {
                                                                      return [
                                                                          _c(
                                                                              'div',
                                                                              {
                                                                                  staticClass:
                                                                                      'item-group product-title-wrapper',
                                                                              },
                                                                              [
                                                                                  _c('h3', [
                                                                                      _vm._v(
                                                                                          _vm._s(
                                                                                              '#' +
                                                                                                  _vm.product
                                                                                                      .datasource_id +
                                                                                                  ': ' +
                                                                                                  _vm.product.title
                                                                                          )
                                                                                      ),
                                                                                  ]),
                                                                                  _vm._v(' '),
                                                                                  _c(
                                                                                      'span',
                                                                                      { staticClass: 'product-count' },
                                                                                      [
                                                                                          _vm._v(
                                                                                              'Product \n                        ' +
                                                                                                  _vm._s(
                                                                                                      _vm.availableProducts.findIndex(
                                                                                                          function(x) {
                                                                                                              return (
                                                                                                                  x.id ==
                                                                                                                  _vm
                                                                                                                      .product
                                                                                                                      .id
                                                                                                              )
                                                                                                          }
                                                                                                      ) + 1
                                                                                                  ) +
                                                                                                  ' \n                        of \n                        ' +
                                                                                                  _vm._s(
                                                                                                      _vm
                                                                                                          .availableProducts
                                                                                                          .length
                                                                                                  )
                                                                                          ),
                                                                                      ]
                                                                                  ),
                                                                              ]
                                                                          ),
                                                                      ]
                                                                  },
                                                                  proxy: true,
                                                              },
                                                              {
                                                                  key: 'right',
                                                                  fn: function() {
                                                                      return [
                                                                          _c('div', { staticClass: 'item-group' }, [
                                                                              _vm.product.created_at !=
                                                                              _vm.product.updated_at
                                                                                  ? _c(
                                                                                        'div',
                                                                                        { staticClass: 'last-update' },
                                                                                        [
                                                                                            _c('span', [
                                                                                                _vm._v('Changes saved'),
                                                                                            ]),
                                                                                            _vm._v(' '),
                                                                                            _c('span', [
                                                                                                _vm._v(
                                                                                                    _vm._s(
                                                                                                        _vm.product
                                                                                                            .updated_at
                                                                                                    )
                                                                                                ),
                                                                                            ]),
                                                                                        ]
                                                                                    )
                                                                                  : _vm._e(),
                                                                              _vm._v(' '),
                                                                              _c(
                                                                                  'button',
                                                                                  {
                                                                                      staticClass: 'ghost',
                                                                                      on: {
                                                                                          click: _vm.onDeleteProduct,
                                                                                      },
                                                                                  },
                                                                                  [
                                                                                      _c('i', {
                                                                                          staticClass:
                                                                                              'far fa-trash-alt',
                                                                                      }),
                                                                                      _vm._v(' '),
                                                                                      _c('span', [_vm._v('Delete')]),
                                                                                  ]
                                                                              ),
                                                                              _vm._v(' '),
                                                                              _c(
                                                                                  'div',
                                                                                  {
                                                                                      directives: [
                                                                                          {
                                                                                              name: 'tooltip',
                                                                                              rawName: 'v-tooltip',
                                                                                              value: {
                                                                                                  content:
                                                                                                      !_vm.productToEdit
                                                                                                          .datasource_id &&
                                                                                                      'Product must have an ID',
                                                                                              },
                                                                                              expression:
                                                                                                  "{content: !productToEdit.datasource_id && 'Product must have an ID'}",
                                                                                          },
                                                                                      ],
                                                                                      staticClass: 'hotkey-wrapper',
                                                                                  },
                                                                                  [
                                                                                      _c(
                                                                                          'button',
                                                                                          {
                                                                                              staticClass:
                                                                                                  'ghost save-button',
                                                                                              class: {
                                                                                                  disabled: !_vm.saveActive,
                                                                                              },
                                                                                              on: {
                                                                                                  click: function(
                                                                                                      $event
                                                                                                  ) {
                                                                                                      _vm.saveActive &&
                                                                                                          _vm.onUpdateProduct()
                                                                                                  },
                                                                                              },
                                                                                          },
                                                                                          [
                                                                                              _c('i', {
                                                                                                  staticClass:
                                                                                                      'far fa-save',
                                                                                              }),
                                                                                              _c('span', [
                                                                                                  _vm._v('Save'),
                                                                                              ]),
                                                                                          ]
                                                                                      ),
                                                                                      _vm._v(' '),
                                                                                      _c(
                                                                                          'span',
                                                                                          { staticClass: 'hotkey' },
                                                                                          [
                                                                                              _c(
                                                                                                  'span',
                                                                                                  {
                                                                                                      staticClass:
                                                                                                          'key',
                                                                                                  },
                                                                                                  [_vm._v('S')]
                                                                                              ),
                                                                                              _vm._v(' Save'),
                                                                                          ]
                                                                                      ),
                                                                                  ]
                                                                              ),
                                                                          ]),
                                                                      ]
                                                                  },
                                                                  proxy: true,
                                                              },
                                                          ],
                                                          null,
                                                          false,
                                                          176304005
                                                      ),
                                                  })
                                                : _vm._e(),
                                        ]
                                    },
                                    proxy: true,
                                },
                                _vm.show
                                    ? {
                                          key: 'default',
                                          fn: function() {
                                              return [
                                                  _c(
                                                      'BaseFlyinColumn',
                                                      [
                                                          _c('span', { staticStyle: { 'margin-right': '8px' } }, [
                                                              _vm._v(
                                                                  'Variants (' +
                                                                      _vm._s(_vm.product.variants.length) +
                                                                      ')'
                                                              ),
                                                          ]),
                                                          _vm._v(' '),
                                                          _c(
                                                              'button',
                                                              {
                                                                  staticClass: 'invisible ghost-hover',
                                                                  on: { click: _vm.onAddVariant },
                                                              },
                                                              [
                                                                  _c('i', { staticClass: 'far fa-plus' }),
                                                                  _c('span', [_vm._v('Add Variant')]),
                                                              ]
                                                          ),
                                                          _vm._v(' '),
                                                          _c(
                                                              'Draggable',
                                                              {
                                                                  staticClass: 'product-variants',
                                                                  model: {
                                                                      value: _vm.product.variants,
                                                                      callback: function($$v) {
                                                                          _vm.$set(_vm.product, 'variants', $$v)
                                                                      },
                                                                      expression: 'product.variants',
                                                                  },
                                                              },
                                                              _vm._l(_vm.product.variants, function(variant, index) {
                                                                  return _c(
                                                                      'div',
                                                                      {
                                                                          key: index,
                                                                          staticClass: 'product-variant',
                                                                          class: {
                                                                              'is-current':
                                                                                  _vm.currentVariant &&
                                                                                  _vm.currentVariant.id == variant.id,
                                                                          },
                                                                          on: {
                                                                              contextmenu: function($event) {
                                                                                  $event.preventDefault()
                                                                                  return _vm.showVariantContext(
                                                                                      $event,
                                                                                      index
                                                                                  )
                                                                              },
                                                                              click: function($event) {
                                                                                  _vm.currentVariant = variant
                                                                              },
                                                                          },
                                                                      },
                                                                      [
                                                                          _c(
                                                                              'div',
                                                                              {
                                                                                  staticClass: 'img-wrapper',
                                                                                  on: {
                                                                                      dragenter: function($event) {
                                                                                          return _vm.dragActive(
                                                                                              $event,
                                                                                              index
                                                                                          )
                                                                                      },
                                                                                      dragleave: _vm.dragLeave,
                                                                                      drop: _vm.dragDrop,
                                                                                  },
                                                                              },
                                                                              [
                                                                                  _c(
                                                                                      'div',
                                                                                      {
                                                                                          staticClass: 'drop-area',
                                                                                          class: {
                                                                                              drag:
                                                                                                  _vm.dragActiveIndex ==
                                                                                                  index,
                                                                                          },
                                                                                      },
                                                                                      [
                                                                                          _c('input', {
                                                                                              ref: 'fileInput-' + index,
                                                                                              refInFor: true,
                                                                                              attrs: {
                                                                                                  type: 'file',
                                                                                                  accept: 'image/*',
                                                                                              },
                                                                                              on: {
                                                                                                  change: function(
                                                                                                      $event
                                                                                                  ) {
                                                                                                      return _vm.filesChange(
                                                                                                          $event,
                                                                                                          index,
                                                                                                          variant
                                                                                                      )
                                                                                                  },
                                                                                              },
                                                                                          }),
                                                                                          _vm._v(' '),
                                                                                          variant.currentImg
                                                                                              .imageToUpload &&
                                                                                          variant.currentImg
                                                                                              .imageToUpload.uploading
                                                                                              ? _c(
                                                                                                    'div',
                                                                                                    {
                                                                                                        staticClass:
                                                                                                            'progress-wrapper',
                                                                                                    },
                                                                                                    [
                                                                                                        variant
                                                                                                            .currentImg
                                                                                                            .imageToUpload
                                                                                                            .progress >
                                                                                                        0
                                                                                                            ? _c(
                                                                                                                  'span',
                                                                                                                  [
                                                                                                                      _vm._v(
                                                                                                                          _vm._s(
                                                                                                                              variant
                                                                                                                                  .currentImg
                                                                                                                                  .imageToUpload
                                                                                                                                  .progress
                                                                                                                          ) +
                                                                                                                              '%'
                                                                                                                      ),
                                                                                                                  ]
                                                                                                              )
                                                                                                            : _c(
                                                                                                                  'span',
                                                                                                                  [
                                                                                                                      _vm._v(
                                                                                                                          'Preparing upload..'
                                                                                                                      ),
                                                                                                                  ]
                                                                                                              ),
                                                                                                        _vm._v(' '),
                                                                                                        _c(
                                                                                                            'svg',
                                                                                                            {
                                                                                                                attrs: {
                                                                                                                    height:
                                                                                                                        '4',
                                                                                                                },
                                                                                                            },
                                                                                                            [
                                                                                                                _c(
                                                                                                                    'rect',
                                                                                                                    {
                                                                                                                        staticClass:
                                                                                                                            'background',
                                                                                                                        attrs: {
                                                                                                                            width:
                                                                                                                                '100%',
                                                                                                                            height:
                                                                                                                                '4',
                                                                                                                        },
                                                                                                                    }
                                                                                                                ),
                                                                                                                _vm._v(
                                                                                                                    ' '
                                                                                                                ),
                                                                                                                variant
                                                                                                                    .currentImg
                                                                                                                    .imageToUpload
                                                                                                                    .progress >
                                                                                                                0
                                                                                                                    ? _c(
                                                                                                                          'rect',
                                                                                                                          {
                                                                                                                              staticClass:
                                                                                                                                  'value',
                                                                                                                              attrs: {
                                                                                                                                  width:
                                                                                                                                      variant
                                                                                                                                          .currentImg
                                                                                                                                          .imageToUpload
                                                                                                                                          .progress +
                                                                                                                                      '%',
                                                                                                                                  height:
                                                                                                                                      '4',
                                                                                                                              },
                                                                                                                          }
                                                                                                                      )
                                                                                                                    : _vm._e(),
                                                                                                            ]
                                                                                                        ),
                                                                                                    ]
                                                                                                )
                                                                                              : _vm._e(),
                                                                                          _vm._v(' '),
                                                                                          variant.currentImg.url != null
                                                                                              ? _c('img', {
                                                                                                    key:
                                                                                                        'image-' +
                                                                                                        (variant.id
                                                                                                            ? variant.id
                                                                                                            : index),
                                                                                                    class: [
                                                                                                        variant
                                                                                                            .currentImg
                                                                                                            .imageToUpload
                                                                                                            ? 'rotation-' +
                                                                                                              variant
                                                                                                                  .currentImg
                                                                                                                  .imageToUpload
                                                                                                                  .rotation
                                                                                                            : '',
                                                                                                    ],
                                                                                                    attrs: {
                                                                                                        src: _vm.variantImage(
                                                                                                            variant,
                                                                                                            {
                                                                                                                index:
                                                                                                                    variant.imageIndex,
                                                                                                            }
                                                                                                        ),
                                                                                                    },
                                                                                                })
                                                                                              : [
                                                                                                    _c(
                                                                                                        'div',
                                                                                                        {
                                                                                                            staticClass:
                                                                                                                'controls',
                                                                                                        },
                                                                                                        [
                                                                                                            _c(
                                                                                                                'span',
                                                                                                                {
                                                                                                                    staticClass:
                                                                                                                        'button light-2',
                                                                                                                    on: {
                                                                                                                        click: function(
                                                                                                                            $event
                                                                                                                        ) {
                                                                                                                            _vm.$refs[
                                                                                                                                'fileInput-' +
                                                                                                                                    index
                                                                                                                            ][0].click()
                                                                                                                        },
                                                                                                                    },
                                                                                                                },
                                                                                                                [
                                                                                                                    _vm._v(
                                                                                                                        'Choose from file'
                                                                                                                    ),
                                                                                                                ]
                                                                                                            ),
                                                                                                            _vm._v(' '),
                                                                                                            _c(
                                                                                                                'span',
                                                                                                                {
                                                                                                                    staticClass:
                                                                                                                        'button light-2',
                                                                                                                    on: {
                                                                                                                        click: function(
                                                                                                                            $event
                                                                                                                        ) {
                                                                                                                            return _vm.editURL(
                                                                                                                                index
                                                                                                                            )
                                                                                                                        },
                                                                                                                    },
                                                                                                                },
                                                                                                                [
                                                                                                                    _vm._v(
                                                                                                                        'Enter image URL'
                                                                                                                    ),
                                                                                                                ]
                                                                                                            ),
                                                                                                        ]
                                                                                                    ),
                                                                                                ],
                                                                                          _vm._v(' '),
                                                                                          _vm.URLActiveIndex == index
                                                                                              ? _c(
                                                                                                    'div',
                                                                                                    {
                                                                                                        staticClass:
                                                                                                            'enter-url',
                                                                                                    },
                                                                                                    [
                                                                                                        _c(
                                                                                                            'label',
                                                                                                            {
                                                                                                                attrs: {
                                                                                                                    for:
                                                                                                                        'url-input-' +
                                                                                                                        index,
                                                                                                                },
                                                                                                            },
                                                                                                            [
                                                                                                                _vm._v(
                                                                                                                    'Enter URL'
                                                                                                                ),
                                                                                                            ]
                                                                                                        ),
                                                                                                        _vm._v(' '),
                                                                                                        _c('input', {
                                                                                                            ref:
                                                                                                                'url-input-' +
                                                                                                                index,
                                                                                                            refInFor: true,
                                                                                                            staticClass:
                                                                                                                'input-wrapper',
                                                                                                            attrs: {
                                                                                                                id:
                                                                                                                    'url-input-' +
                                                                                                                    index,
                                                                                                                type:
                                                                                                                    'url',
                                                                                                            },
                                                                                                            on: {
                                                                                                                keyup: [
                                                                                                                    function(
                                                                                                                        $event
                                                                                                                    ) {
                                                                                                                        if (
                                                                                                                            !$event.type.indexOf(
                                                                                                                                'key'
                                                                                                                            ) &&
                                                                                                                            _vm._k(
                                                                                                                                $event.keyCode,
                                                                                                                                'enter',
                                                                                                                                13,
                                                                                                                                $event.key,
                                                                                                                                'Enter'
                                                                                                                            )
                                                                                                                        ) {
                                                                                                                            return null
                                                                                                                        }
                                                                                                                        _vm.setVariantImageURL(
                                                                                                                            variant,
                                                                                                                            _vm
                                                                                                                                .$refs[
                                                                                                                                'url-input-' +
                                                                                                                                    index
                                                                                                                            ][0]
                                                                                                                                .value
                                                                                                                        )
                                                                                                                        _vm.URLActiveIndex = null
                                                                                                                    },
                                                                                                                    function(
                                                                                                                        $event
                                                                                                                    ) {
                                                                                                                        if (
                                                                                                                            !$event.type.indexOf(
                                                                                                                                'key'
                                                                                                                            ) &&
                                                                                                                            _vm._k(
                                                                                                                                $event.keyCode,
                                                                                                                                'esc',
                                                                                                                                27,
                                                                                                                                $event.key,
                                                                                                                                [
                                                                                                                                    'Esc',
                                                                                                                                    'Escape',
                                                                                                                                ]
                                                                                                                            )
                                                                                                                        ) {
                                                                                                                            return null
                                                                                                                        }
                                                                                                                        _vm.URLActiveIndex = null
                                                                                                                    },
                                                                                                                ],
                                                                                                            },
                                                                                                        }),
                                                                                                        _vm._v(' '),
                                                                                                        _c(
                                                                                                            'div',
                                                                                                            {
                                                                                                                staticClass:
                                                                                                                    'buttons-wrapper',
                                                                                                            },
                                                                                                            [
                                                                                                                _c(
                                                                                                                    'span',
                                                                                                                    {
                                                                                                                        staticClass:
                                                                                                                            'button primary',
                                                                                                                        on: {
                                                                                                                            click: function(
                                                                                                                                $event
                                                                                                                            ) {
                                                                                                                                _vm.setVariantImageURL(
                                                                                                                                    variant,
                                                                                                                                    _vm
                                                                                                                                        .$refs[
                                                                                                                                        'url-input-' +
                                                                                                                                            index
                                                                                                                                    ][0]
                                                                                                                                        .value
                                                                                                                                )
                                                                                                                                _vm.URLActiveIndex = null
                                                                                                                            },
                                                                                                                        },
                                                                                                                    },
                                                                                                                    [
                                                                                                                        _vm._v(
                                                                                                                            'Save'
                                                                                                                        ),
                                                                                                                    ]
                                                                                                                ),
                                                                                                                _vm._v(
                                                                                                                    ' '
                                                                                                                ),
                                                                                                                _c(
                                                                                                                    'span',
                                                                                                                    {
                                                                                                                        staticClass:
                                                                                                                            'button ghost',
                                                                                                                        on: {
                                                                                                                            click: function(
                                                                                                                                $event
                                                                                                                            ) {
                                                                                                                                _vm.URLActiveIndex = null
                                                                                                                            },
                                                                                                                        },
                                                                                                                    },
                                                                                                                    [
                                                                                                                        _vm._v(
                                                                                                                            'Cancel'
                                                                                                                        ),
                                                                                                                    ]
                                                                                                                ),
                                                                                                            ]
                                                                                                        ),
                                                                                                    ]
                                                                                                )
                                                                                              : _vm._e(),
                                                                                          _vm._v(' '),
                                                                                          _c(
                                                                                              'div',
                                                                                              {
                                                                                                  staticClass:
                                                                                                      'drop-msg',
                                                                                              },
                                                                                              [
                                                                                                  _c('span', [
                                                                                                      _vm._v(
                                                                                                          'Drop image here'
                                                                                                      ),
                                                                                                  ]),
                                                                                              ]
                                                                                          ),
                                                                                      ],
                                                                                      2
                                                                                  ),
                                                                                  _vm._v(' '),
                                                                                  _c(
                                                                                      'div',
                                                                                      { staticClass: 'controls' },
                                                                                      [
                                                                                          _c(
                                                                                              'button',
                                                                                              {
                                                                                                  staticClass: 'white',
                                                                                                  on: {
                                                                                                      click: function(
                                                                                                          $event
                                                                                                      ) {
                                                                                                          return _vm.showVariantContext(
                                                                                                              $event,
                                                                                                              index
                                                                                                          )
                                                                                                      },
                                                                                                  },
                                                                                              },
                                                                                              [
                                                                                                  _c('i', {
                                                                                                      staticClass:
                                                                                                          'fas fa-ellipsis-h',
                                                                                                  }),
                                                                                              ]
                                                                                          ),
                                                                                      ]
                                                                                  ),
                                                                                  _vm._v(' '),
                                                                                  _c(
                                                                                      'div',
                                                                                      { staticClass: 'image-drawer' },
                                                                                      [
                                                                                          _c(
                                                                                              'div',
                                                                                              {
                                                                                                  staticClass:
                                                                                                      'square white trigger',
                                                                                              },
                                                                                              [
                                                                                                  _c('i', {
                                                                                                      staticClass:
                                                                                                          'far fa-images',
                                                                                                  }),
                                                                                                  _vm._v(' '),
                                                                                                  variant.pictures
                                                                                                      .length > 1
                                                                                                      ? _c(
                                                                                                            'div',
                                                                                                            {
                                                                                                                staticClass:
                                                                                                                    'count circle xxs dark',
                                                                                                            },
                                                                                                            [
                                                                                                                _c(
                                                                                                                    'span',
                                                                                                                    [
                                                                                                                        _vm._v(
                                                                                                                            _vm._s(
                                                                                                                                variant
                                                                                                                                    .pictures
                                                                                                                                    .length
                                                                                                                            )
                                                                                                                        ),
                                                                                                                    ]
                                                                                                                ),
                                                                                                            ]
                                                                                                        )
                                                                                                      : _vm._e(),
                                                                                              ]
                                                                                          ),
                                                                                          _vm._v(' '),
                                                                                          _c(
                                                                                              'Draggable',
                                                                                              {
                                                                                                  staticClass: 'drawer',
                                                                                                  on: {
                                                                                                      start:
                                                                                                          _vm.onVariantPictureDragStart,
                                                                                                      end: function(
                                                                                                          $event
                                                                                                      ) {
                                                                                                          return _vm.onVariantPictureDragEnd(
                                                                                                              $event,
                                                                                                              variant
                                                                                                          )
                                                                                                      },
                                                                                                  },
                                                                                                  model: {
                                                                                                      value:
                                                                                                          variant.pictures,
                                                                                                      callback: function(
                                                                                                          $$v
                                                                                                      ) {
                                                                                                          _vm.$set(
                                                                                                              variant,
                                                                                                              'pictures',
                                                                                                              $$v
                                                                                                          )
                                                                                                      },
                                                                                                      expression:
                                                                                                          'variant.pictures',
                                                                                                  },
                                                                                              },
                                                                                              [
                                                                                                  _vm._l(
                                                                                                      variant.pictures,
                                                                                                      function(
                                                                                                          image,
                                                                                                          index
                                                                                                      ) {
                                                                                                          return _c(
                                                                                                              'div',
                                                                                                              {
                                                                                                                  key: index,
                                                                                                                  staticClass:
                                                                                                                      'image-wrapper',
                                                                                                                  class: {
                                                                                                                      active:
                                                                                                                          variant.imageIndex ==
                                                                                                                          index,
                                                                                                                  },
                                                                                                              },
                                                                                                              [
                                                                                                                  _c(
                                                                                                                      'BaseVariantImage',
                                                                                                                      {
                                                                                                                          attrs: {
                                                                                                                              variant: variant,
                                                                                                                              size:
                                                                                                                                  'sm',
                                                                                                                              index: index,
                                                                                                                          },
                                                                                                                          nativeOn: {
                                                                                                                              click: function(
                                                                                                                                  $event
                                                                                                                              ) {
                                                                                                                                  variant.imageIndex = index
                                                                                                                              },
                                                                                                                          },
                                                                                                                      }
                                                                                                                  ),
                                                                                                              ],
                                                                                                              1
                                                                                                          )
                                                                                                      }
                                                                                                  ),
                                                                                                  _vm._v(' '),
                                                                                                  _c(
                                                                                                      'button',
                                                                                                      {
                                                                                                          staticClass:
                                                                                                              'md',
                                                                                                          on: {
                                                                                                              click: function(
                                                                                                                  $event
                                                                                                              ) {
                                                                                                                  return _vm.onAddImageToVariant(
                                                                                                                      variant
                                                                                                                  )
                                                                                                              },
                                                                                                          },
                                                                                                      },
                                                                                                      [
                                                                                                          _c('i', {
                                                                                                              staticClass:
                                                                                                                  'far fa-plus',
                                                                                                          }),
                                                                                                      ]
                                                                                                  ),
                                                                                              ],
                                                                                              2
                                                                                          ),
                                                                                      ],
                                                                                      1
                                                                                  ),
                                                                              ]
                                                                          ),
                                                                          _vm._v(' '),
                                                                          _c('BaseEditable', {
                                                                              ref: 'nameInput-' + index,
                                                                              refInFor: true,
                                                                              attrs: {
                                                                                  placeholder: 'Untitled variant',
                                                                                  type: 'text',
                                                                                  truncateLength: 15,
                                                                              },
                                                                              model: {
                                                                                  value: variant.name,
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(variant, 'name', $$v)
                                                                                  },
                                                                                  expression: 'variant.name',
                                                                              },
                                                                          }),
                                                                      ],
                                                                      1
                                                                  )
                                                              }),
                                                              0
                                                          ),
                                                          _vm._v(' '),
                                                          _c('div', { staticClass: 'form-section' }, [
                                                              _c('h3', [_vm._v('Details')]),
                                                              _vm._v(' '),
                                                              _c(
                                                                  'div',
                                                                  { staticClass: 'form-element' },
                                                                  [
                                                                      _c('label', { attrs: { for: 'product-name' } }, [
                                                                          _vm._v('Product name'),
                                                                      ]),
                                                                      _vm._v(' '),
                                                                      _c('BaseEditInputWrapper', {
                                                                          attrs: {
                                                                              id: 'product-name',
                                                                              type: 'text',
                                                                              value: _vm.product.title,
                                                                              oldValue: _vm.originalProduct.title,
                                                                              submitOnBlur: true,
                                                                          },
                                                                          on: { submit: _vm.onSubmitField },
                                                                          model: {
                                                                              value: _vm.product.title,
                                                                              callback: function($$v) {
                                                                                  _vm.$set(_vm.product, 'title', $$v)
                                                                              },
                                                                              expression: 'product.title',
                                                                          },
                                                                      }),
                                                                  ],
                                                                  1
                                                              ),
                                                              _vm._v(' '),
                                                              _c('div', { staticClass: 'col-2' }, [
                                                                  _c(
                                                                      'div',
                                                                      { staticClass: 'form-element' },
                                                                      [
                                                                          _c(
                                                                              'label',
                                                                              { attrs: { for: 'datasource-id' } },
                                                                              [_vm._v('Product ID')]
                                                                          ),
                                                                          _vm._v(' '),
                                                                          _c('BaseEditInputWrapper', {
                                                                              ref: 'idInput',
                                                                              attrs: {
                                                                                  id: 'datasource-id',
                                                                                  type: 'text',
                                                                                  maxlength: 9,
                                                                                  submitOnBlur: true,
                                                                                  pattern: /^\d+$/,
                                                                                  disabled: !!_vm.originalProduct
                                                                                      .datasource_id,
                                                                                  value: _vm.product.datasource_id,
                                                                                  oldValue:
                                                                                      _vm.originalProduct.datasource_id,
                                                                                  error: _vm.idError,
                                                                              },
                                                                              on: {
                                                                                  change: _vm.validateProductId,
                                                                                  submit: _vm.onSubmitField,
                                                                              },
                                                                              model: {
                                                                                  value: _vm.product.datasource_id,
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(
                                                                                          _vm.product,
                                                                                          'datasource_id',
                                                                                          $$v
                                                                                      )
                                                                                  },
                                                                                  expression: 'product.datasource_id',
                                                                              },
                                                                          }),
                                                                      ],
                                                                      1
                                                                  ),
                                                                  _vm._v(' '),
                                                                  _c(
                                                                      'div',
                                                                      { staticClass: 'form-element' },
                                                                      [
                                                                          _c('label', { attrs: { for: 'category' } }, [
                                                                              _vm._v('Brand'),
                                                                          ]),
                                                                          _vm._v(' '),
                                                                          _c('BaseEditInputWrapper', {
                                                                              attrs: {
                                                                                  id: 'brand',
                                                                                  type: 'text',
                                                                                  submitOnBlur: true,
                                                                                  value: _vm.product.brand,
                                                                                  oldValue: _vm.originalProduct.brand,
                                                                              },
                                                                              on: { submit: _vm.onSubmitField },
                                                                              model: {
                                                                                  value: _vm.product.brand,
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(
                                                                                          _vm.product,
                                                                                          'brand',
                                                                                          $$v
                                                                                      )
                                                                                  },
                                                                                  expression: 'product.brand',
                                                                              },
                                                                          }),
                                                                      ],
                                                                      1
                                                                  ),
                                                              ]),
                                                              _vm._v(' '),
                                                              _c('div', { staticClass: 'col-2' }, [
                                                                  _c(
                                                                      'div',
                                                                      { staticClass: 'form-element' },
                                                                      [
                                                                          _c('label', { attrs: { for: 'category' } }, [
                                                                              _vm._v('Category'),
                                                                          ]),
                                                                          _vm._v(' '),
                                                                          _c('BaseEditInputWrapper', {
                                                                              attrs: {
                                                                                  id: 'category',
                                                                                  type: 'text',
                                                                                  submitOnBlur: true,
                                                                                  value: _vm.product.category,
                                                                                  oldValue:
                                                                                      _vm.originalProduct.category,
                                                                              },
                                                                              on: { submit: _vm.onSubmitField },
                                                                              model: {
                                                                                  value: _vm.product.category,
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(
                                                                                          _vm.product,
                                                                                          'category',
                                                                                          $$v
                                                                                      )
                                                                                  },
                                                                                  expression: 'product.category',
                                                                              },
                                                                          }),
                                                                      ],
                                                                      1
                                                                  ),
                                                                  _vm._v(' '),
                                                                  _c(
                                                                      'div',
                                                                      { staticClass: 'form-element' },
                                                                      [
                                                                          _c(
                                                                              'label',
                                                                              { attrs: { for: 'buying-group' } },
                                                                              [_vm._v('Buyer Group')]
                                                                          ),
                                                                          _vm._v(' '),
                                                                          _c('BaseEditInputWrapper', {
                                                                              attrs: {
                                                                                  id: 'buying-group',
                                                                                  type: 'text',
                                                                                  submitOnBlur: true,
                                                                                  value: _vm.product.buying_group,
                                                                                  oldValue:
                                                                                      _vm.originalProduct.buying_group,
                                                                              },
                                                                              on: { submit: _vm.onSubmitField },
                                                                              model: {
                                                                                  value: _vm.product.buying_group,
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(
                                                                                          _vm.product,
                                                                                          'buying_group',
                                                                                          $$v
                                                                                      )
                                                                                  },
                                                                                  expression: 'product.buying_group',
                                                                              },
                                                                          }),
                                                                      ],
                                                                      1
                                                                  ),
                                                              ]),
                                                              _vm._v(' '),
                                                              _c(
                                                                  'div',
                                                                  { staticClass: 'form-element' },
                                                                  [
                                                                      _c('label', { attrs: { for: 'composition' } }, [
                                                                          _vm._v('Composition'),
                                                                      ]),
                                                                      _vm._v(' '),
                                                                      _c('BaseEditInputWrapper', {
                                                                          attrs: {
                                                                              id: 'composition',
                                                                              type: 'text',
                                                                              submitOnBlur: true,
                                                                              value: _vm.product.composition,
                                                                              oldValue: _vm.originalProduct.composition,
                                                                          },
                                                                          on: { submit: _vm.onSubmitField },
                                                                          model: {
                                                                              value: _vm.product.composition,
                                                                              callback: function($$v) {
                                                                                  _vm.$set(
                                                                                      _vm.product,
                                                                                      'composition',
                                                                                      $$v
                                                                                  )
                                                                              },
                                                                              expression: 'product.composition',
                                                                          },
                                                                      }),
                                                                  ],
                                                                  1
                                                              ),
                                                              _vm._v(' '),
                                                              _c(
                                                                  'div',
                                                                  { staticClass: 'form-element' },
                                                                  [
                                                                      _c('label', { attrs: { for: 'description' } }, [
                                                                          _vm._v('Description'),
                                                                      ]),
                                                                      _vm._v(' '),
                                                                      _c('BaseEditableTextarea', {
                                                                          attrs: {
                                                                              id: 'description',
                                                                              oldValue:
                                                                                  _vm.originalProduct.sale_description,
                                                                          },
                                                                          on: { submit: _vm.onSubmitField },
                                                                          model: {
                                                                              value: _vm.product.sale_description,
                                                                              callback: function($$v) {
                                                                                  _vm.$set(
                                                                                      _vm.product,
                                                                                      'sale_description',
                                                                                      $$v
                                                                                  )
                                                                              },
                                                                              expression: 'product.sale_description',
                                                                          },
                                                                      }),
                                                                  ],
                                                                  1
                                                              ),
                                                          ]),
                                                      ],
                                                      1
                                                  ),
                                                  _vm._v(' '),
                                                  _c('BaseFlyinColumn', [
                                                      _c(
                                                          'div',
                                                          { staticClass: 'deliveries form-section' },
                                                          [
                                                              _c('h3', [_vm._v('Delivery')]),
                                                              _vm._v(' '),
                                                              _vm._l(_vm.product.delivery_dates, function(
                                                                  delivery,
                                                                  index
                                                              ) {
                                                                  return _c(
                                                                      'div',
                                                                      {
                                                                          key: 'delivery-' + index,
                                                                          staticClass: 'col-2 form-element',
                                                                      },
                                                                      [
                                                                          _c('BaseDatePicker', {
                                                                              attrs: {
                                                                                  type: 'month',
                                                                                  formatIn: 'YYYY-MM-DD',
                                                                                  formatOut: 'MMMM YYYY',
                                                                              },
                                                                              on: { submit: _vm.onSubmitField },
                                                                              model: {
                                                                                  value:
                                                                                      _vm.product.delivery_dates[index],
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(
                                                                                          _vm.product.delivery_dates,
                                                                                          index,
                                                                                          $$v
                                                                                      )
                                                                                  },
                                                                                  expression:
                                                                                      'product.delivery_dates[index]',
                                                                              },
                                                                          }),
                                                                          _vm._v(' '),
                                                                          _c(
                                                                              'div',
                                                                              {
                                                                                  staticStyle: {
                                                                                      display: 'flex',
                                                                                      'align-items': 'center',
                                                                                      height: '40px',
                                                                                  },
                                                                              },
                                                                              [
                                                                                  _c(
                                                                                      'button',
                                                                                      {
                                                                                          staticClass:
                                                                                              'invisible ghost-hover',
                                                                                          on: {
                                                                                              click: function($event) {
                                                                                                  return _vm.onRemoveDelivery(
                                                                                                      index
                                                                                                  )
                                                                                              },
                                                                                          },
                                                                                      },
                                                                                      [
                                                                                          _c('i', {
                                                                                              staticClass:
                                                                                                  'far fa-trash-alt',
                                                                                          }),
                                                                                      ]
                                                                                  ),
                                                                              ]
                                                                          ),
                                                                      ],
                                                                      1
                                                                  )
                                                              }),
                                                              _vm._v(' '),
                                                              _c('div', { staticClass: 'form-element' }, [
                                                                  _c(
                                                                      'button',
                                                                      {
                                                                          staticClass: 'ghost',
                                                                          on: { click: _vm.onAddDelivery },
                                                                      },
                                                                      [
                                                                          _c('i', { staticClass: 'far fa-plus' }),
                                                                          _c('span', [_vm._v('Add Delivery')]),
                                                                      ]
                                                                  ),
                                                              ]),
                                                          ],
                                                          2
                                                      ),
                                                      _vm._v(' '),
                                                      _c('div', { staticClass: 'minimum form-section' }, [
                                                          _c('h3', [_vm._v('Minimum')]),
                                                          _vm._v(' '),
                                                          _c('div', { staticClass: 'col-2 delivery form-element' }, [
                                                              _c(
                                                                  'div',
                                                                  [
                                                                      _c('label', { attrs: { for: 'min-order' } }, [
                                                                          _vm._v('Order minimum (pcs)'),
                                                                      ]),
                                                                      _vm._v(' '),
                                                                      _c('BaseEditInputWrapper', {
                                                                          attrs: {
                                                                              id: 'min-order',
                                                                              type: 'number',
                                                                              submitOnBlur: true,
                                                                              oldValue: _vm.originalProduct.min_order,
                                                                          },
                                                                          on: { submit: _vm.onSubmitField },
                                                                          model: {
                                                                              value: _vm.product.min_order,
                                                                              callback: function($$v) {
                                                                                  _vm.$set(
                                                                                      _vm.product,
                                                                                      'min_order',
                                                                                      _vm._n($$v)
                                                                                  )
                                                                              },
                                                                              expression: 'product.min_order',
                                                                          },
                                                                      }),
                                                                  ],
                                                                  1
                                                              ),
                                                              _vm._v(' '),
                                                              _c(
                                                                  'div',
                                                                  [
                                                                      _c('label', { attrs: { for: 'min-order' } }, [
                                                                          _vm._v('Variant minimum (pcs)'),
                                                                      ]),
                                                                      _vm._v(' '),
                                                                      _c('BaseEditInputWrapper', {
                                                                          attrs: {
                                                                              id: 'min-order',
                                                                              type: 'number',
                                                                              submitOnBlur: true,
                                                                              oldValue:
                                                                                  _vm.originalProduct.min_variant_order,
                                                                          },
                                                                          on: { submit: _vm.onSubmitField },
                                                                          model: {
                                                                              value: _vm.product.min_variant_order,
                                                                              callback: function($$v) {
                                                                                  _vm.$set(
                                                                                      _vm.product,
                                                                                      'min_variant_order',
                                                                                      _vm._n($$v)
                                                                                  )
                                                                              },
                                                                              expression: 'product.min_variant_order',
                                                                          },
                                                                      }),
                                                                  ],
                                                                  1
                                                              ),
                                                          ]),
                                                      ]),
                                                      _vm._v(' '),
                                                      _c(
                                                          'div',
                                                          { staticClass: 'prices form-section' },
                                                          [
                                                              _c('h3', [_vm._v('Prices')]),
                                                              _vm._v(' '),
                                                              _c('div', { staticClass: 'col-5 form-element' }, [
                                                                  _c('label', [_vm._v('Currency name')]),
                                                                  _vm._v(' '),
                                                                  _c(
                                                                      'label',
                                                                      [
                                                                          _vm._v('WHS '),
                                                                          _c('BaseTooltipButton', {
                                                                              attrs: { msg: 'Wholesale Price' },
                                                                          }),
                                                                      ],
                                                                      1
                                                                  ),
                                                                  _vm._v(' '),
                                                                  _c(
                                                                      'label',
                                                                      [
                                                                          _vm._v('RRP '),
                                                                          _c('BaseTooltipButton', {
                                                                              attrs: {
                                                                                  msg: 'Recommended Retail Price',
                                                                              },
                                                                          }),
                                                                      ],
                                                                      1
                                                                  ),
                                                                  _vm._v(' '),
                                                                  _c('label', [_vm._v('Mark up')]),
                                                              ]),
                                                              _vm._v(' '),
                                                              _vm._l(_vm.product.prices, function(price, index) {
                                                                  return _c(
                                                                      'div',
                                                                      { key: index, staticClass: 'col-5 form-element' },
                                                                      [
                                                                          _c(
                                                                              'BaseInputField',
                                                                              {
                                                                                  attrs: {
                                                                                      disabled: 'true',
                                                                                      value: price.currency,
                                                                                      type: 'select',
                                                                                  },
                                                                                  on: {
                                                                                      click: function($event) {
                                                                                          return _vm.showCurrencyContext(
                                                                                              $event,
                                                                                              price
                                                                                          )
                                                                                      },
                                                                                  },
                                                                              },
                                                                              [
                                                                                  _c('i', {
                                                                                      staticClass: 'fas fa-caret-down',
                                                                                  }),
                                                                              ]
                                                                          ),
                                                                          _vm._v(' '),
                                                                          _c('BaseEditInputWrapper', {
                                                                              attrs: {
                                                                                  id: 'wholesale',
                                                                                  type: 'number',
                                                                                  submitOnBlur: true,
                                                                                  oldValue: _vm.originalProduct.prices[
                                                                                      index
                                                                                  ]
                                                                                      ? _vm.originalProduct.prices[
                                                                                            index
                                                                                        ].wholesale_price
                                                                                      : null,
                                                                              },
                                                                              on: {
                                                                                  submit: function($event) {
                                                                                      _vm.calculateMarkup({
                                                                                          price: price,
                                                                                          whs: $event,
                                                                                      })
                                                                                      _vm.onSubmitField()
                                                                                  },
                                                                                  activate: function($event) {
                                                                                      _vm.savedMarkup = price.mark_up
                                                                                  },
                                                                                  change: function($event) {
                                                                                      return _vm.calculateMarkup({
                                                                                          price: price,
                                                                                          whs: $event,
                                                                                      })
                                                                                  },
                                                                                  cancel: function($event) {
                                                                                      return _vm.resetMarkup(
                                                                                          price,
                                                                                          index
                                                                                      )
                                                                                  },
                                                                                  revert: function($event) {
                                                                                      return _vm.revertMarkup(price)
                                                                                  },
                                                                              },
                                                                              model: {
                                                                                  value: price.wholesale_price,
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(
                                                                                          price,
                                                                                          'wholesale_price',
                                                                                          _vm._n($$v)
                                                                                      )
                                                                                  },
                                                                                  expression: 'price.wholesale_price',
                                                                              },
                                                                          }),
                                                                          _vm._v(' '),
                                                                          _c('BaseEditInputWrapper', {
                                                                              attrs: {
                                                                                  id: 'recommended-retail',
                                                                                  type: 'number',
                                                                                  submitOnBlur: true,
                                                                                  oldValue: _vm.originalProduct.prices[
                                                                                      index
                                                                                  ]
                                                                                      ? _vm.originalProduct.prices[
                                                                                            index
                                                                                        ].recommended_retail_price
                                                                                      : null,
                                                                              },
                                                                              on: {
                                                                                  submit: function($event) {
                                                                                      _vm.calculateMarkup({
                                                                                          price: price,
                                                                                          rrp: $event,
                                                                                      })
                                                                                      _vm.onSubmitField()
                                                                                  },
                                                                                  activate: function($event) {
                                                                                      _vm.savedMarkup = price.mark_up
                                                                                  },
                                                                                  change: function($event) {
                                                                                      return _vm.calculateMarkup({
                                                                                          price: price,
                                                                                          rrp: $event,
                                                                                      })
                                                                                  },
                                                                                  cancel: function($event) {
                                                                                      return _vm.resetMarkup(
                                                                                          price,
                                                                                          index
                                                                                      )
                                                                                  },
                                                                                  revert: function($event) {
                                                                                      return _vm.revertMarkup(price)
                                                                                  },
                                                                              },
                                                                              model: {
                                                                                  value: price.recommended_retail_price,
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(
                                                                                          price,
                                                                                          'recommended_retail_price',
                                                                                          _vm._n($$v)
                                                                                      )
                                                                                  },
                                                                                  expression:
                                                                                      'price.recommended_retail_price',
                                                                              },
                                                                          }),
                                                                          _vm._v(' '),
                                                                          _c('BaseEditInputWrapper', {
                                                                              attrs: {
                                                                                  id: 'markup',
                                                                                  type: 'number',
                                                                                  submitOnBlur: true,
                                                                                  oldValue: _vm.originalProduct.prices[
                                                                                      index
                                                                                  ]
                                                                                      ? _vm.originalProduct.prices[
                                                                                            index
                                                                                        ].mark_up
                                                                                      : null,
                                                                              },
                                                                              model: {
                                                                                  value: price.mark_up,
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(
                                                                                          price,
                                                                                          'mark_up',
                                                                                          _vm._n($$v)
                                                                                      )
                                                                                  },
                                                                                  expression: 'price.mark_up',
                                                                              },
                                                                          }),
                                                                          _vm._v(' '),
                                                                          _c(
                                                                              'div',
                                                                              {
                                                                                  staticStyle: {
                                                                                      display: 'flex',
                                                                                      'align-items': 'center',
                                                                                      height: '40px',
                                                                                  },
                                                                              },
                                                                              [
                                                                                  _c(
                                                                                      'button',
                                                                                      {
                                                                                          staticClass:
                                                                                              'invisible ghost-hover',
                                                                                          on: {
                                                                                              click: function($event) {
                                                                                                  return _vm.removeCurrency(
                                                                                                      index
                                                                                                  )
                                                                                              },
                                                                                          },
                                                                                      },
                                                                                      [
                                                                                          _c('i', {
                                                                                              staticClass:
                                                                                                  'far fa-trash-alt',
                                                                                          }),
                                                                                      ]
                                                                                  ),
                                                                              ]
                                                                          ),
                                                                      ],
                                                                      1
                                                                  )
                                                              }),
                                                              _vm._v(' '),
                                                              _c('div', { staticClass: 'form-element' }, [
                                                                  _c(
                                                                      'button',
                                                                      {
                                                                          staticClass: 'ghost',
                                                                          on: { click: _vm.addCurrency },
                                                                      },
                                                                      [
                                                                          _c('i', { staticClass: 'far fa-plus' }),
                                                                          _c('span', [_vm._v('Add currency')]),
                                                                      ]
                                                                  ),
                                                              ]),
                                                          ],
                                                          2
                                                      ),
                                                      _vm._v(' '),
                                                      _c(
                                                          'div',
                                                          { staticClass: 'assortments form-section' },
                                                          [
                                                              _c('h3', [_vm._v('Assortments')]),
                                                              _vm._v(' '),
                                                              _c('div', { staticClass: 'col-4 form-element' }, [
                                                                  _c('label', [_vm._v('Assortment name')]),
                                                                  _vm._v(' '),
                                                                  _c('label', [_vm._v('Box size')]),
                                                                  _vm._v(' '),
                                                                  _c('label', [_vm._v('EAN')]),
                                                              ]),
                                                              _vm._v(' '),
                                                              _vm._l(_vm.product.assortments, function(
                                                                  assortment,
                                                                  index
                                                              ) {
                                                                  return _c(
                                                                      'div',
                                                                      { key: index, staticClass: 'col-4 form-element' },
                                                                      [
                                                                          _c('BaseEditInputWrapper', {
                                                                              attrs: {
                                                                                  submitOnBlur: true,
                                                                                  oldValue: _vm.originalProduct
                                                                                      .assortments[index]
                                                                                      ? _vm.originalProduct.assortments[
                                                                                            index
                                                                                        ].name
                                                                                      : null,
                                                                              },
                                                                              on: { submit: _vm.onSubmitField },
                                                                              model: {
                                                                                  value: assortment.name,
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(assortment, 'name', $$v)
                                                                                  },
                                                                                  expression: 'assortment.name',
                                                                              },
                                                                          }),
                                                                          _vm._v(' '),
                                                                          _c('BaseEditInputWrapper', {
                                                                              attrs: {
                                                                                  type: 'number',
                                                                                  submitOnBlur: true,
                                                                                  oldValue: _vm.originalProduct
                                                                                      .assortments[index]
                                                                                      ? _vm.originalProduct.assortments[
                                                                                            index
                                                                                        ].box_size
                                                                                      : null,
                                                                              },
                                                                              on: { submit: _vm.onSubmitField },
                                                                              model: {
                                                                                  value: assortment.box_size,
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(
                                                                                          assortment,
                                                                                          'box_size',
                                                                                          _vm._n($$v)
                                                                                      )
                                                                                  },
                                                                                  expression: 'assortment.box_size',
                                                                              },
                                                                          }),
                                                                          _vm._v(' '),
                                                                          _c('BaseEditInputWrapper', {
                                                                              attrs: {
                                                                                  type: 'number',
                                                                                  submitOnBlur: true,
                                                                                  oldValue: _vm.originalProduct
                                                                                      .assortments[index]
                                                                                      ? _vm.originalProduct.assortments[
                                                                                            index
                                                                                        ].box_ean
                                                                                      : null,
                                                                              },
                                                                              on: { submit: _vm.onSubmitField },
                                                                              model: {
                                                                                  value: assortment.box_ean,
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(
                                                                                          assortment,
                                                                                          'box_ean',
                                                                                          _vm._n($$v)
                                                                                      )
                                                                                  },
                                                                                  expression: 'assortment.box_ean',
                                                                              },
                                                                          }),
                                                                          _vm._v(' '),
                                                                          _c(
                                                                              'div',
                                                                              {
                                                                                  staticStyle: {
                                                                                      display: 'flex',
                                                                                      'align-items': 'center',
                                                                                      height: '40px',
                                                                                  },
                                                                              },
                                                                              [
                                                                                  _c(
                                                                                      'button',
                                                                                      {
                                                                                          staticClass:
                                                                                              'invisible ghost-hover',
                                                                                          on: {
                                                                                              click: function($event) {
                                                                                                  return _vm.removeAssortment(
                                                                                                      index
                                                                                                  )
                                                                                              },
                                                                                          },
                                                                                      },
                                                                                      [
                                                                                          _c('i', {
                                                                                              staticClass:
                                                                                                  'far fa-trash-alt',
                                                                                          }),
                                                                                      ]
                                                                                  ),
                                                                              ]
                                                                          ),
                                                                      ],
                                                                      1
                                                                  )
                                                              }),
                                                              _vm._v(' '),
                                                              _c('div', { staticClass: 'form-element' }, [
                                                                  _c(
                                                                      'button',
                                                                      {
                                                                          staticClass: 'ghost',
                                                                          on: { click: _vm.addAssortment },
                                                                      },
                                                                      [
                                                                          _c('i', { staticClass: 'far fa-plus' }),
                                                                          _c('span', [_vm._v('Add assortment')]),
                                                                      ]
                                                                  ),
                                                              ]),
                                                          ],
                                                          2
                                                      ),
                                                      _vm._v(' '),
                                                      _c(
                                                          'div',
                                                          { staticClass: 'assortment-sizes form-section' },
                                                          [
                                                              _c('h3', [_vm._v('Available Assortment Sizes')]),
                                                              _vm._v(' '),
                                                              _c(
                                                                  'Draggable',
                                                                  {
                                                                      staticClass: 'form-element',
                                                                      attrs: { handle: '.drag-handle' },
                                                                  },
                                                                  _vm._l(_vm.product.assortment_sizes, function(
                                                                      assortment,
                                                                      index
                                                                  ) {
                                                                      return _c(
                                                                          'div',
                                                                          {
                                                                              key: index,
                                                                              staticClass: 'col-2 form-element',
                                                                          },
                                                                          [
                                                                              _c('BaseEditInputWrapper', {
                                                                                  ref: 'assortmentSizeInput',
                                                                                  refInFor: true,
                                                                                  attrs: {
                                                                                      type: 'text',
                                                                                      submitOnBlur: true,
                                                                                      oldValue:
                                                                                          _vm.product.assortment_sizes[
                                                                                              index
                                                                                          ],
                                                                                  },
                                                                                  on: { submit: _vm.onSubmitField },
                                                                                  model: {
                                                                                      value:
                                                                                          _vm.product.assortment_sizes[
                                                                                              index
                                                                                          ],
                                                                                      callback: function($$v) {
                                                                                          _vm.$set(
                                                                                              _vm.product
                                                                                                  .assortment_sizes,
                                                                                              index,
                                                                                              $$v
                                                                                          )
                                                                                      },
                                                                                      expression:
                                                                                          'product.assortment_sizes[index]',
                                                                                  },
                                                                              }),
                                                                              _vm._v(' '),
                                                                              _c(
                                                                                  'div',
                                                                                  {
                                                                                      staticStyle: {
                                                                                          display: 'flex',
                                                                                          'align-items': 'center',
                                                                                          height: '40px',
                                                                                      },
                                                                                  },
                                                                                  [
                                                                                      _c(
                                                                                          'div',
                                                                                          {
                                                                                              staticClass:
                                                                                                  'drag-handle square ghost primary',
                                                                                              staticStyle: {
                                                                                                  'margin-left': '8px',
                                                                                              },
                                                                                          },
                                                                                          [
                                                                                              _c('i', {
                                                                                                  staticClass:
                                                                                                      'far fa-arrows-alt-v',
                                                                                              }),
                                                                                          ]
                                                                                      ),
                                                                                      _vm._v(' '),
                                                                                      _c(
                                                                                          'button',
                                                                                          {
                                                                                              staticClass:
                                                                                                  'invisible ghost-hover',
                                                                                              on: {
                                                                                                  click: function(
                                                                                                      $event
                                                                                                  ) {
                                                                                                      return _vm.onRemoveAssortmentSize(
                                                                                                          index
                                                                                                      )
                                                                                                  },
                                                                                              },
                                                                                          },
                                                                                          [
                                                                                              _c('i', {
                                                                                                  staticClass:
                                                                                                      'far fa-trash-alt',
                                                                                              }),
                                                                                          ]
                                                                                      ),
                                                                                  ]
                                                                              ),
                                                                          ],
                                                                          1
                                                                      )
                                                                  }),
                                                                  0
                                                              ),
                                                              _vm._v(' '),
                                                              _c('div', { staticClass: 'form-element' }, [
                                                                  _c(
                                                                      'button',
                                                                      {
                                                                          staticClass: 'ghost',
                                                                          on: { click: _vm.onAddAssortmentSize },
                                                                      },
                                                                      [
                                                                          _c('i', { staticClass: 'far fa-plus' }),
                                                                          _c('span', [_vm._v('Add Size')]),
                                                                      ]
                                                                  ),
                                                              ]),
                                                          ],
                                                          1
                                                      ),
                                                      _vm._v(' '),
                                                      _c('div', { staticClass: 'EANs form-section' }, [
                                                          _c('h3', [_vm._v('Variant Sizes')]),
                                                          _vm._v(' '),
                                                          !_vm.currentVariant
                                                              ? _c('div', [
                                                                    _c('p', [
                                                                        _vm._v("Click a variant to manage it's sizes"),
                                                                    ]),
                                                                ])
                                                              : _c(
                                                                    'div',
                                                                    [
                                                                        _c(
                                                                            'div',
                                                                            { staticClass: 'col-3 form-element' },
                                                                            [
                                                                                _c('label', [_vm._v('Size name')]),
                                                                                _vm._v(' '),
                                                                                _c('label', [_vm._v('Size EAN')]),
                                                                            ]
                                                                        ),
                                                                        _vm._v(' '),
                                                                        _vm._l(_vm.currentVariant.ean_sizes, function(
                                                                            size,
                                                                            index
                                                                        ) {
                                                                            return _c(
                                                                                'div',
                                                                                {
                                                                                    key: index,
                                                                                    staticClass: 'col-3 form-element',
                                                                                },
                                                                                [
                                                                                    _c('BaseEditInputWrapper', {
                                                                                        ref: 'variantSizeInput',
                                                                                        refInFor: true,
                                                                                        attrs: {
                                                                                            submitOnBlur: true,
                                                                                            oldValue: size.size,
                                                                                        },
                                                                                        on: {
                                                                                            submit: _vm.onSubmitField,
                                                                                        },
                                                                                        model: {
                                                                                            value: size.size,
                                                                                            callback: function($$v) {
                                                                                                _vm.$set(
                                                                                                    size,
                                                                                                    'size',
                                                                                                    $$v
                                                                                                )
                                                                                            },
                                                                                            expression: 'size.size',
                                                                                        },
                                                                                    }),
                                                                                    _vm._v(' '),
                                                                                    _c('BaseEditInputWrapper', {
                                                                                        attrs: {
                                                                                            type: 'text',
                                                                                            pattern: /^\d+$/,
                                                                                            maxlength: 13,
                                                                                            submitOnBlur: true,
                                                                                            oldValue: size.ean,
                                                                                        },
                                                                                        on: {
                                                                                            submit: _vm.onSubmitField,
                                                                                        },
                                                                                        model: {
                                                                                            value: size.ean,
                                                                                            callback: function($$v) {
                                                                                                _vm.$set(
                                                                                                    size,
                                                                                                    'ean',
                                                                                                    $$v
                                                                                                )
                                                                                            },
                                                                                            expression: 'size.ean',
                                                                                        },
                                                                                    }),
                                                                                    _vm._v(' '),
                                                                                    _c(
                                                                                        'div',
                                                                                        {
                                                                                            staticStyle: {
                                                                                                display: 'flex',
                                                                                                'align-items': 'center',
                                                                                                height: '40px',
                                                                                            },
                                                                                        },
                                                                                        [
                                                                                            _c(
                                                                                                'button',
                                                                                                {
                                                                                                    staticClass:
                                                                                                        'invisible ghost-hover',
                                                                                                    on: {
                                                                                                        click: function(
                                                                                                            $event
                                                                                                        ) {
                                                                                                            return _vm.onRemoveSize(
                                                                                                                index
                                                                                                            )
                                                                                                        },
                                                                                                    },
                                                                                                },
                                                                                                [
                                                                                                    _c('i', {
                                                                                                        staticClass:
                                                                                                            'far fa-trash-alt',
                                                                                                    }),
                                                                                                ]
                                                                                            ),
                                                                                        ]
                                                                                    ),
                                                                                ],
                                                                                1
                                                                            )
                                                                        }),
                                                                        _vm._v(' '),
                                                                        _c('div', { staticClass: 'form-element' }, [
                                                                            _c(
                                                                                'button',
                                                                                {
                                                                                    staticClass: 'ghost',
                                                                                    on: { click: _vm.onAddSize },
                                                                                },
                                                                                [
                                                                                    _c('i', {
                                                                                        staticClass: 'far fa-plus',
                                                                                    }),
                                                                                    _c('span', [_vm._v('Add size')]),
                                                                                ]
                                                                            ),
                                                                        ]),
                                                                    ],
                                                                    2
                                                                ),
                                                      ]),
                                                      _vm._v(' '),
                                                      _c(
                                                          'div',
                                                          { staticClass: 'EANs form-section' },
                                                          [
                                                              _c('h3', [
                                                                  _vm._v('EANs '),
                                                                  _c('i', {
                                                                      directives: [
                                                                          {
                                                                              name: 'tooltip',
                                                                              rawName: 'v-tooltip',
                                                                              value:
                                                                                  'EANs added here can be scanned with the Kollekt mobile App to find this product',
                                                                              expression:
                                                                                  "'EANs added here can be scanned with the Kollekt mobile App to find this product'",
                                                                          },
                                                                      ],
                                                                      staticClass: 'far fa-info-circle',
                                                                  }),
                                                              ]),
                                                              _vm._v(' '),
                                                              _vm._l(_vm.product.eans, function(ean, index) {
                                                                  return _c(
                                                                      'div',
                                                                      { key: index, staticClass: 'col-2 form-element' },
                                                                      [
                                                                          _c('BaseEditInputWrapper', {
                                                                              attrs: {
                                                                                  type: 'text',
                                                                                  pattern: /^\d+$/,
                                                                                  maxlength: 13,
                                                                                  submitOnBlur: true,
                                                                                  oldValue:
                                                                                      _vm.originalProduct.eans[index],
                                                                                  value: ean,
                                                                              },
                                                                              on: { submit: _vm.onSubmitField },
                                                                              model: {
                                                                                  value: _vm.product.eans[index],
                                                                                  callback: function($$v) {
                                                                                      _vm.$set(
                                                                                          _vm.product.eans,
                                                                                          index,
                                                                                          $$v
                                                                                      )
                                                                                  },
                                                                                  expression: 'product.eans[index]',
                                                                              },
                                                                          }),
                                                                          _vm._v(' '),
                                                                          _c(
                                                                              'div',
                                                                              {
                                                                                  staticStyle: {
                                                                                      display: 'flex',
                                                                                      'align-items': 'center',
                                                                                      height: '40px',
                                                                                  },
                                                                              },
                                                                              [
                                                                                  _c(
                                                                                      'button',
                                                                                      {
                                                                                          staticClass:
                                                                                              'invisible ghost-hover',
                                                                                          on: {
                                                                                              click: function($event) {
                                                                                                  return _vm.removeEAN(
                                                                                                      index
                                                                                                  )
                                                                                              },
                                                                                          },
                                                                                      },
                                                                                      [
                                                                                          _c('i', {
                                                                                              staticClass:
                                                                                                  'far fa-trash-alt',
                                                                                          }),
                                                                                      ]
                                                                                  ),
                                                                              ]
                                                                          ),
                                                                      ],
                                                                      1
                                                                  )
                                                              }),
                                                              _vm._v(' '),
                                                              _c('div', { staticClass: 'form-element' }, [
                                                                  _c(
                                                                      'button',
                                                                      {
                                                                          staticClass: 'ghost',
                                                                          on: { click: _vm.addEAN },
                                                                      },
                                                                      [
                                                                          _c('i', { staticClass: 'far fa-plus' }),
                                                                          _c('span', [_vm._v('Add EAN')]),
                                                                      ]
                                                                  ),
                                                              ]),
                                                          ],
                                                          2
                                                      ),
                                                  ]),
                                                  _vm._v(' '),
                                                  _c('BaseContextMenu', {
                                                      ref: 'contextVariant',
                                                      staticClass: 'context-variant',
                                                      scopedSlots: _vm._u(
                                                          [
                                                              {
                                                                  key: 'default',
                                                                  fn: function() {
                                                                      return [
                                                                          _c(
                                                                              'div',
                                                                              { staticClass: 'item-group' },
                                                                              [
                                                                                  _c(
                                                                                      'BaseContextMenuItem',
                                                                                      {
                                                                                          attrs: {
                                                                                              iconClass: 'far fa-plus',
                                                                                              hotkey: 'KeyA',
                                                                                          },
                                                                                          on: {
                                                                                              click: _vm.onAddVariant,
                                                                                          },
                                                                                      },
                                                                                      [
                                                                                          _c('u', [_vm._v('A')]),
                                                                                          _vm._v(
                                                                                              'dd variant\n                    '
                                                                                          ),
                                                                                      ]
                                                                                  ),
                                                                              ],
                                                                              1
                                                                          ),
                                                                          _vm._v(' '),
                                                                          _c(
                                                                              'div',
                                                                              { staticClass: 'item-group' },
                                                                              [
                                                                                  _c(
                                                                                      'BaseContextMenuItem',
                                                                                      {
                                                                                          attrs: {
                                                                                              iconClass: 'far fa-file',
                                                                                              hotkey: 'KeyC',
                                                                                          },
                                                                                          on: {
                                                                                              click: function($event) {
                                                                                                  _vm.$refs[
                                                                                                      'fileInput-' +
                                                                                                          _vm.contextVariantIndex
                                                                                                  ][0].click()
                                                                                              },
                                                                                          },
                                                                                      },
                                                                                      [
                                                                                          _c('u', [_vm._v('C')]),
                                                                                          _vm._v(
                                                                                              'hoose image from file\n                    '
                                                                                          ),
                                                                                      ]
                                                                                  ),
                                                                                  _vm._v(' '),
                                                                                  _c(
                                                                                      'BaseContextMenuItem',
                                                                                      {
                                                                                          attrs: {
                                                                                              iconClass: 'far fa-link',
                                                                                              hotkey: 'KeyU',
                                                                                          },
                                                                                          on: {
                                                                                              click: function($event) {
                                                                                                  return _vm.editURL(
                                                                                                      _vm.contextVariantIndex
                                                                                                  )
                                                                                              },
                                                                                          },
                                                                                      },
                                                                                      [
                                                                                          _c('span', [
                                                                                              _vm._v('Enter image '),
                                                                                              _c('u', [_vm._v('U')]),
                                                                                              _vm._v('RL'),
                                                                                          ]),
                                                                                      ]
                                                                                  ),
                                                                              ],
                                                                              1
                                                                          ),
                                                                          _vm._v(' '),
                                                                          _c(
                                                                              'div',
                                                                              { staticClass: 'item-group' },
                                                                              [
                                                                                  _c(
                                                                                      'BaseContextMenuItem',
                                                                                      {
                                                                                          attrs: {
                                                                                              iconClass: 'far fa-pen',
                                                                                              hotkey: 'KeyR',
                                                                                          },
                                                                                          on: {
                                                                                              click: function($event) {
                                                                                                  _vm.$refs[
                                                                                                      'nameInput-' +
                                                                                                          _vm.contextVariantIndex
                                                                                                  ][0].$el.click()
                                                                                              },
                                                                                          },
                                                                                      },
                                                                                      [
                                                                                          _c('u', [_vm._v('R')]),
                                                                                          _vm._v(
                                                                                              'ename\n                    '
                                                                                          ),
                                                                                      ]
                                                                                  ),
                                                                              ],
                                                                              1
                                                                          ),
                                                                          _vm._v(' '),
                                                                          _c(
                                                                              'div',
                                                                              { staticClass: 'item-group' },
                                                                              [
                                                                                  _c(
                                                                                      'BaseContextMenuItem',
                                                                                      {
                                                                                          attrs: {
                                                                                              iconClass:
                                                                                                  'far fa-trash-alt',
                                                                                              hotkey: 'KeyD',
                                                                                          },
                                                                                          on: {
                                                                                              click: function($event) {
                                                                                                  return _vm.removeVariant(
                                                                                                      _vm.contextVariantIndex
                                                                                                  )
                                                                                              },
                                                                                          },
                                                                                      },
                                                                                      [
                                                                                          _c('u', [_vm._v('D')]),
                                                                                          _vm._v(
                                                                                              'elete variant \n                    '
                                                                                          ),
                                                                                      ]
                                                                                  ),
                                                                                  _vm._v(' '),
                                                                                  _c(
                                                                                      'BaseContextMenuItem',
                                                                                      {
                                                                                          attrs: {
                                                                                              iconClass:
                                                                                                  'far fa-trash-alt',
                                                                                              hotkey: 'KeyP',
                                                                                          },
                                                                                          on: {
                                                                                              click: function($event) {
                                                                                                  return _vm.removePicture(
                                                                                                      _vm.contextVariantIndex
                                                                                                  )
                                                                                              },
                                                                                          },
                                                                                      },
                                                                                      [
                                                                                          _c('span', [
                                                                                              _vm._v('Delete '),
                                                                                              _c('u', [_vm._v('p')]),
                                                                                              _vm._v('icture'),
                                                                                          ]),
                                                                                      ]
                                                                                  ),
                                                                              ],
                                                                              1
                                                                          ),
                                                                      ]
                                                                  },
                                                                  proxy: true,
                                                              },
                                                          ],
                                                          null,
                                                          false,
                                                          11331386
                                                      ),
                                                  }),
                                                  _vm._v(' '),
                                                  _c(
                                                      'BaseDialog',
                                                      {
                                                          ref: 'confirmDeleteProduct',
                                                          attrs: { type: 'confirm', confirmColor: 'red' },
                                                      },
                                                      [
                                                          _c('div', { staticClass: 'icon-graphic' }, [
                                                              _c('i', { staticClass: 'lg primary far fa-file' }),
                                                              _vm._v(' '),
                                                              _c('i', { staticClass: 'lg far fa-arrow-right' }),
                                                              _vm._v(' '),
                                                              _c('i', { staticClass: 'lg dark far fa-trash' }),
                                                          ]),
                                                          _vm._v(' '),
                                                          _c('h3', [
                                                              _vm._v('Are you sure you want to delete this product?'),
                                                          ]),
                                                      ]
                                                  ),
                                                  _vm._v(' '),
                                                  _vm.contextPrice
                                                      ? _c('BaseSelectButtonsContextMenu', {
                                                            ref: 'contextCurrency',
                                                            attrs: {
                                                                header: 'Choose Currency',
                                                                submitOnChange: true,
                                                                unsetOption: 'Clear',
                                                                unsetValue: null,
                                                                type: 'radio',
                                                                options: _vm.availableCurrencies,
                                                                search: true,
                                                            },
                                                            model: {
                                                                value: _vm.contextPrice.currency,
                                                                callback: function($$v) {
                                                                    _vm.$set(_vm.contextPrice, 'currency', $$v)
                                                                },
                                                                expression: 'contextPrice.currency',
                                                            },
                                                        })
                                                      : _vm._e(),
                                                  _vm._v(' '),
                                                  _c(
                                                      'BaseDialog',
                                                      {
                                                          ref: 'confirmDiscardDialog',
                                                          attrs: {
                                                              type: 'confirm',
                                                              confirmColor: 'red',
                                                              confirmText: 'Yes, discard product',
                                                              cancelText: 'No, wait',
                                                          },
                                                      },
                                                      [
                                                          _c('div', { staticClass: 'icon-graphic' }, [
                                                              _c('i', { staticClass: 'lg primary far fa-box' }),
                                                              _vm._v(' '),
                                                              _c('i', { staticClass: 'lg far fa-arrow-right' }),
                                                              _vm._v(' '),
                                                              _c('i', { staticClass: 'lg dark far fa-trash' }),
                                                          ]),
                                                          _vm._v(' '),
                                                          _c('h3', [_vm._v('Really discard this product?')]),
                                                          _vm._v(' '),
                                                          _c('p', [
                                                              _vm._v('The product has no ID and will be discarded'),
                                                          ]),
                                                      ]
                                                  ),
                                              ]
                                          },
                                          proxy: true,
                                      }
                                    : null,
                            ],
                            null,
                            true
                        ),
                    })
                }
                var staticRenderFns = []
                render._withStripped = true

                /***/
            },

        /***/ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=template&id=04fbba8e&scoped=true&':
            /*!************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=template&id=04fbba8e&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return render
                })
                /* harmony export (binding) */ __webpack_require__.d(
                    __webpack_exports__,
                    'staticRenderFns',
                    function() {
                        return staticRenderFns
                    }
                )
                var render = function() {
                    var _vm = this
                    var _h = _vm.$createElement
                    var _c = _vm._self._c || _h
                    return _c(
                        'div',
                        { staticClass: 'products-table-wrapper' },
                        [
                            _c('BaseTable', {
                                ref: 'tableComp',
                                attrs: {
                                    stickyHeader: true,
                                    contentStatus: 'success',
                                    items: _vm.products,
                                    itemsTotalCount: _vm.stateProducts.length,
                                    itemKey: 'datasource_id',
                                    itemSize: 139,
                                    selected: _vm.selectedProducts,
                                    contextItem: _vm.contextItem,
                                    searchKey: ['datasource_id', 'title', 'category', 'eans'],
                                    searchResult: _vm.productsFilteredBySearch,
                                    isDraggable: _vm.editOrderModeActive,
                                    itemsReOrdered: _vm.localProducts,
                                    hideContextButton: _vm.editOrderModeActive,
                                },
                                on: {
                                    'update:selected': function($event) {
                                        _vm.selectedProducts = $event
                                    },
                                    'update:contextItem': function($event) {
                                        _vm.contextItem = $event
                                    },
                                    'update:context-item': function($event) {
                                        _vm.contextItem = $event
                                    },
                                    'update:searchResult': function($event) {
                                        _vm.productsFilteredBySearch = $event
                                    },
                                    'update:search-result': function($event) {
                                        _vm.productsFilteredBySearch = $event
                                    },
                                    'update:itemsReOrdered': function($event) {
                                        _vm.localProducts = $event
                                    },
                                    'update:items-re-ordered': function($event) {
                                        _vm.localProducts = $event
                                    },
                                    'change-order': true,
                                    'show-contextmenu': _vm.showContext,
                                    'search-enter': function($event) {
                                        return _vm.onViewSingle(_vm.productsFilteredBySearch[0])
                                    },
                                },
                                scopedSlots: _vm._u([
                                    {
                                        key: 'topBarLeft',
                                        fn: function() {
                                            return [
                                                _c(
                                                    'v-popover',
                                                    {
                                                        attrs: {
                                                            trigger: 'manual',
                                                            open: _vm.showFilters,
                                                            autoHide: false,
                                                        },
                                                    },
                                                    [
                                                        _c(
                                                            'button',
                                                            {
                                                                staticClass: 'ghost',
                                                                on: { click: _vm.toggleShowFilters },
                                                            },
                                                            [
                                                                _c('i', { staticClass: 'far fa-filter' }),
                                                                _vm._v(' '),
                                                                _c('span', [_vm._v('Filters')]),
                                                                _vm._v(' '),
                                                                _vm.activeFiltersCount > 0
                                                                    ? _c('div', { staticClass: 'circle primary xs' }, [
                                                                          _vm._v(
                                                                              '\n                    ' +
                                                                                  _vm._s(_vm.activeFiltersCount) +
                                                                                  '\n                '
                                                                          ),
                                                                      ])
                                                                    : _vm._e(),
                                                            ]
                                                        ),
                                                        _vm._v(' '),
                                                        _c(
                                                            'BaseContextMenu',
                                                            {
                                                                directives: [
                                                                    {
                                                                        name: 'click-outside',
                                                                        rawName: 'v-click-outside',
                                                                        value: _vm.hideFilters,
                                                                        expression: 'hideFilters',
                                                                    },
                                                                ],
                                                                attrs: { slot: 'popover', inline: true },
                                                                slot: 'popover',
                                                            },
                                                            [
                                                                _c(
                                                                    'div',
                                                                    { staticClass: 'item-group' },
                                                                    [
                                                                        _c(
                                                                            'v-popover',
                                                                            {
                                                                                attrs: {
                                                                                    trigger: 'click',
                                                                                    disabled:
                                                                                        _vm.availableCategories
                                                                                            .length <= 0,
                                                                                    placement: 'right',
                                                                                },
                                                                            },
                                                                            [
                                                                                _c(
                                                                                    'BaseContextMenuItem',
                                                                                    {
                                                                                        attrs: {
                                                                                            iconClass: 'far fa-filter',
                                                                                            disabled:
                                                                                                _vm.availableCategories
                                                                                                    .length <= 0,
                                                                                            disabledTooltip:
                                                                                                'No categories available',
                                                                                        },
                                                                                    },
                                                                                    [
                                                                                        _c('span', [
                                                                                            _vm._v('Category'),
                                                                                        ]),
                                                                                        _vm._v(' '),
                                                                                        _vm.selectedCategories.length >
                                                                                        0
                                                                                            ? _c(
                                                                                                  'span',
                                                                                                  {
                                                                                                      staticClass:
                                                                                                          'filter-counter circle primary xs',
                                                                                                  },
                                                                                                  [
                                                                                                      _c('span', [
                                                                                                          _vm._v(
                                                                                                              _vm._s(
                                                                                                                  _vm
                                                                                                                      .selectedCategories
                                                                                                                      .length
                                                                                                              )
                                                                                                          ),
                                                                                                      ]),
                                                                                                  ]
                                                                                              )
                                                                                            : _vm._e(),
                                                                                    ]
                                                                                ),
                                                                                _vm._v(' '),
                                                                                _c(
                                                                                    'template',
                                                                                    { slot: 'popover' },
                                                                                    [
                                                                                        _c('BaseSelectButtons', {
                                                                                            staticStyle: {
                                                                                                width: '200px',
                                                                                                'padding-top': '8px',
                                                                                            },
                                                                                            attrs: {
                                                                                                submitOnChange: 'true',
                                                                                                options:
                                                                                                    _vm.availableCategories,
                                                                                            },
                                                                                            model: {
                                                                                                value:
                                                                                                    _vm.selectedCategories,
                                                                                                callback: function(
                                                                                                    $$v
                                                                                                ) {
                                                                                                    _vm.selectedCategories = $$v
                                                                                                },
                                                                                                expression:
                                                                                                    'selectedCategories',
                                                                                            },
                                                                                        }),
                                                                                    ],
                                                                                    1
                                                                                ),
                                                                            ],
                                                                            2
                                                                        ),
                                                                    ],
                                                                    1
                                                                ),
                                                                _vm._v(' '),
                                                                _c(
                                                                    'div',
                                                                    { staticClass: 'item-group' },
                                                                    [
                                                                        _c(
                                                                            'v-popover',
                                                                            {
                                                                                attrs: {
                                                                                    trigger: 'click',
                                                                                    disabled:
                                                                                        _vm.availableDeliveryDates
                                                                                            .length <= 0,
                                                                                    placement: 'right',
                                                                                },
                                                                            },
                                                                            [
                                                                                _c(
                                                                                    'BaseContextMenuItem',
                                                                                    {
                                                                                        attrs: {
                                                                                            iconClass:
                                                                                                'far fa-calendar-week',
                                                                                            disabled:
                                                                                                _vm
                                                                                                    .availableDeliveryDates
                                                                                                    .length <= 0,
                                                                                            disabledTooltip:
                                                                                                'No delivery dates available',
                                                                                        },
                                                                                    },
                                                                                    [
                                                                                        _c('span', [
                                                                                            _vm._v('Delivery'),
                                                                                        ]),
                                                                                        _vm._v(' '),
                                                                                        _vm.selectedDeliveryDates
                                                                                            .length > 0
                                                                                            ? _c(
                                                                                                  'span',
                                                                                                  {
                                                                                                      staticClass:
                                                                                                          'filter-counter circle primary xs',
                                                                                                  },
                                                                                                  [
                                                                                                      _c('span', [
                                                                                                          _vm._v(
                                                                                                              _vm._s(
                                                                                                                  _vm
                                                                                                                      .selectedDeliveryDates
                                                                                                                      .length
                                                                                                              )
                                                                                                          ),
                                                                                                      ]),
                                                                                                  ]
                                                                                              )
                                                                                            : _vm._e(),
                                                                                    ]
                                                                                ),
                                                                                _vm._v(' '),
                                                                                _c(
                                                                                    'template',
                                                                                    { slot: 'popover' },
                                                                                    [
                                                                                        _c('BaseSelectButtons', {
                                                                                            attrs: {
                                                                                                submitOnChange: 'true',
                                                                                                displayFunction:
                                                                                                    _vm.prettifyDate,
                                                                                                options:
                                                                                                    _vm.availableDeliveryDates,
                                                                                            },
                                                                                            model: {
                                                                                                value:
                                                                                                    _vm.selectedDeliveryDates,
                                                                                                callback: function(
                                                                                                    $$v
                                                                                                ) {
                                                                                                    _vm.selectedDeliveryDates = $$v
                                                                                                },
                                                                                                expression:
                                                                                                    'selectedDeliveryDates',
                                                                                            },
                                                                                        }),
                                                                                    ],
                                                                                    1
                                                                                ),
                                                                            ],
                                                                            2
                                                                        ),
                                                                    ],
                                                                    1
                                                                ),
                                                                _vm._v(' '),
                                                                _c(
                                                                    'div',
                                                                    { staticClass: 'item-group' },
                                                                    [
                                                                        _c(
                                                                            'v-popover',
                                                                            {
                                                                                attrs: {
                                                                                    trigger: 'click',
                                                                                    disabled:
                                                                                        _vm.availableBuyerGroups
                                                                                            .length <= 0,
                                                                                    placement: 'right',
                                                                                },
                                                                            },
                                                                            [
                                                                                _c(
                                                                                    'BaseContextMenuItem',
                                                                                    {
                                                                                        attrs: {
                                                                                            iconClass: 'far fa-box',
                                                                                            disabled:
                                                                                                _vm.availableBuyerGroups
                                                                                                    .length <= 0,
                                                                                            disabledTooltip:
                                                                                                'No buyer groups available',
                                                                                        },
                                                                                    },
                                                                                    [
                                                                                        _c('span', [
                                                                                            _vm._v('Buyer group'),
                                                                                        ]),
                                                                                        _vm._v(' '),
                                                                                        _vm.selectedBuyerGroups.length >
                                                                                        0
                                                                                            ? _c(
                                                                                                  'span',
                                                                                                  {
                                                                                                      staticClass:
                                                                                                          'filter-counter circle primary xs',
                                                                                                  },
                                                                                                  [
                                                                                                      _c('span', [
                                                                                                          _vm._v(
                                                                                                              _vm._s(
                                                                                                                  _vm
                                                                                                                      .selectedBuyerGroups
                                                                                                                      .length
                                                                                                              )
                                                                                                          ),
                                                                                                      ]),
                                                                                                  ]
                                                                                              )
                                                                                            : _vm._e(),
                                                                                    ]
                                                                                ),
                                                                                _vm._v(' '),
                                                                                _c(
                                                                                    'template',
                                                                                    { slot: 'popover' },
                                                                                    [
                                                                                        _c('BaseSelectButtons', {
                                                                                            attrs: {
                                                                                                submitOnChange: 'true',
                                                                                                options:
                                                                                                    _vm.availableBuyerGroups,
                                                                                            },
                                                                                            model: {
                                                                                                value:
                                                                                                    _vm.selectedBuyerGroups,
                                                                                                callback: function(
                                                                                                    $$v
                                                                                                ) {
                                                                                                    _vm.selectedBuyerGroups = $$v
                                                                                                },
                                                                                                expression:
                                                                                                    'selectedBuyerGroups',
                                                                                            },
                                                                                        }),
                                                                                    ],
                                                                                    1
                                                                                ),
                                                                            ],
                                                                            2
                                                                        ),
                                                                    ],
                                                                    1
                                                                ),
                                                                _vm._v(' '),
                                                                _vm.activeFiltersCount > 0
                                                                    ? _c(
                                                                          'div',
                                                                          { staticClass: 'item-group' },
                                                                          [
                                                                              _c(
                                                                                  'BaseContextMenuItem',
                                                                                  {
                                                                                      attrs: {
                                                                                          iconClass: 'far fa-times',
                                                                                          color: 'danger',
                                                                                      },
                                                                                      on: {
                                                                                          click: function($event) {
                                                                                              _vm.onClearFilters()
                                                                                              _vm.showFilters = false
                                                                                          },
                                                                                      },
                                                                                  },
                                                                                  [
                                                                                      _c('span', [
                                                                                          _vm._v('Clear filters'),
                                                                                      ]),
                                                                                  ]
                                                                              ),
                                                                          ],
                                                                          1
                                                                      )
                                                                    : _vm._e(),
                                                            ]
                                                        ),
                                                    ],
                                                    1
                                                ),
                                                _vm._v(' '),
                                                _c(
                                                    'BaseCheckboxInputField',
                                                    {
                                                        staticClass: 'small',
                                                        model: {
                                                            value: _vm.noImagesOnly,
                                                            callback: function($$v) {
                                                                _vm.noImagesOnly = $$v
                                                            },
                                                            expression: 'noImagesOnly',
                                                        },
                                                    },
                                                    [_c('span', [_vm._v('No images only')])]
                                                ),
                                                _vm._v(' '),
                                                _vm.activeFiltersCount > 0
                                                    ? _c(
                                                          'button',
                                                          {
                                                              staticClass: 'invisible primary',
                                                              on: { click: _vm.onClearFilters },
                                                          },
                                                          [_c('span', [_vm._v('Clear filter')])]
                                                      )
                                                    : _vm._e(),
                                            ]
                                        },
                                        proxy: true,
                                    },
                                    {
                                        key: 'topBarRight',
                                        fn: function() {
                                            return [
                                                !_vm.editOrderModeActive
                                                    ? [
                                                          _c(
                                                              'BaseButton',
                                                              {
                                                                  attrs: { buttonClass: 'primary' },
                                                                  on: { click: _vm.onSaveOrder },
                                                              },
                                                              [_c('span', [_vm._v('Save current product order')])]
                                                          ),
                                                          _vm._v(' '),
                                                          _c(
                                                              'BaseButton',
                                                              {
                                                                  attrs: { buttonClass: 'primary ghost' },
                                                                  on: {
                                                                      click: function($event) {
                                                                          return _vm.onEnterOrderMode(true)
                                                                      },
                                                                  },
                                                              },
                                                              [_c('span', [_vm._v('Manually edit product order')])]
                                                          ),
                                                      ]
                                                    : [
                                                          _c(
                                                              'BaseButton',
                                                              {
                                                                  attrs: { buttonClass: 'ghost primary' },
                                                                  on: {
                                                                      click: function($event) {
                                                                          return _vm.onEnterOrderMode(false)
                                                                      },
                                                                  },
                                                              },
                                                              [_c('span', [_vm._v('Cancel changes')])]
                                                          ),
                                                          _vm._v(' '),
                                                          _c(
                                                              'BaseButton',
                                                              {
                                                                  attrs: { buttonClass: 'primary' },
                                                                  on: {
                                                                      click: function($event) {
                                                                          _vm.onSaveOrder()
                                                                          _vm.onEnterOrderMode(false)
                                                                      },
                                                                  },
                                                              },
                                                              [_c('span', [_vm._v('Done editing order')])]
                                                          ),
                                                          _vm._v(' '),
                                                          _c('p', [_vm._v('Editing may be slow in big files')]),
                                                      ],
                                            ]
                                        },
                                        proxy: true,
                                    },
                                    {
                                        key: 'header',
                                        fn: function() {
                                            return [
                                                _c('BaseTableHeader', { staticClass: 'image' }),
                                                _vm._v(' '),
                                                _c(
                                                    'BaseTableHeader',
                                                    {
                                                        staticClass: 'id',
                                                        attrs: {
                                                            sortKey: 'datasource_id',
                                                            currentSortKey: _vm.sortKey,
                                                            defaultTo: 'sequence',
                                                        },
                                                        on: { sort: _vm.onSort },
                                                    },
                                                    [_vm._v('ID')]
                                                ),
                                                _vm._v(' '),
                                                _c(
                                                    'BaseTableHeader',
                                                    {
                                                        attrs: {
                                                            sortKey: 'title',
                                                            currentSortKey: _vm.sortKey,
                                                            defaultTo: 'sequence',
                                                        },
                                                        on: { sort: _vm.onSort },
                                                    },
                                                    [_vm._v('Product Name')]
                                                ),
                                                _vm._v(' '),
                                                _c(
                                                    'BaseTableHeader',
                                                    {
                                                        staticClass: 'delivery',
                                                        attrs: {
                                                            sortKey: 'delivery_date',
                                                            currentSortKey: _vm.sortKey,
                                                            defaultTo: 'sequence',
                                                        },
                                                        on: { sort: _vm.onSort },
                                                    },
                                                    [_vm._v('Delivery')]
                                                ),
                                                _vm._v(' '),
                                                _c(
                                                    'BaseTableHeader',
                                                    {
                                                        staticClass: 'wholesale-price',
                                                        attrs: {
                                                            sortKey: 'wholesale_price',
                                                            currentSortKey: _vm.sortKey,
                                                            defaultTo: 'sequence',
                                                            descDefault: true,
                                                        },
                                                        on: { sort: _vm.onSort },
                                                    },
                                                    [_vm._v('WHS')]
                                                ),
                                                _vm._v(' '),
                                                _c(
                                                    'BaseTableHeader',
                                                    {
                                                        staticClass: 'recommended-retail-price',
                                                        attrs: {
                                                            sortKey: 'recommended_retail_price',
                                                            currentSortKey: _vm.sortKey,
                                                            defaultTo: 'sequence',
                                                            descDefault: true,
                                                        },
                                                        on: { sort: _vm.onSort },
                                                    },
                                                    [_vm._v('RRP')]
                                                ),
                                                _vm._v(' '),
                                                _c(
                                                    'BaseTableHeader',
                                                    {
                                                        staticClass: 'mark-up',
                                                        attrs: {
                                                            sortKey: 'mark_up',
                                                            currentSortKey: _vm.sortKey,
                                                            defaultTo: 'sequence',
                                                            descDefault: true,
                                                        },
                                                        on: { sort: _vm.onSort },
                                                    },
                                                    [_vm._v('MU')]
                                                ),
                                                _vm._v(' '),
                                                _c('BaseTableHeader', {
                                                    staticClass: 'currency hide-screen-xs',
                                                }),
                                                _vm._v(' '),
                                                _c(
                                                    'BaseTableHeader',
                                                    {
                                                        staticClass: 'minimum',
                                                        attrs: {
                                                            sortKey: ['min_order', 'min_variant_order'],
                                                            currentSortKey: _vm.sortKey,
                                                            defaultTo: 'sequence',
                                                            descDefault: true,
                                                        },
                                                        on: { sort: _vm.onSort },
                                                    },
                                                    [_vm._v('Min. Variant/Order')]
                                                ),
                                                _vm._v(' '),
                                                _c('BaseTableHeader', { staticClass: 'action' }),
                                            ]
                                        },
                                        proxy: true,
                                    },
                                    {
                                        key: 'row',
                                        fn: function(rowProps) {
                                            return [
                                                _c('ProductsTableRow', {
                                                    attrs: {
                                                        product: rowProps.item,
                                                        index: rowProps.index,
                                                        editOrderModeActive: _vm.editOrderModeActive,
                                                    },
                                                    on: { 'view-single-product': _vm.onViewSingle },
                                                }),
                                            ]
                                        },
                                    },
                                ]),
                            }),
                            _vm._v(' '),
                            _c('BaseContextMenu', { ref: 'contextMenu' }, [
                                _vm.selectedProducts.length > 0
                                    ? _c(
                                          'div',
                                          { staticClass: 'item-group' },
                                          [
                                              _c(
                                                  'BaseContextMenuItem',
                                                  {
                                                      attrs: { iconClass: 'far fa-times', hokey: 'KeyC' },
                                                      on: {
                                                          click: function($event) {
                                                              _vm.selectedProducts = []
                                                          },
                                                      },
                                                  },
                                                  [_c('span', [_c('u', [_vm._v('C')]), _vm._v('lear Selection')])]
                                              ),
                                          ],
                                          1
                                      )
                                    : _vm._e(),
                                _vm._v(' '),
                                _c(
                                    'div',
                                    { staticClass: 'item-group' },
                                    [
                                        _c(
                                            'BaseContextMenuItem',
                                            {
                                                attrs: { iconClass: 'far fa-pen', hotkey: 'KeyV' },
                                                on: {
                                                    click: function($event) {
                                                        return _vm.onViewSingle(_vm.contextItem)
                                                    },
                                                },
                                            },
                                            [_c('span', [_c('u', [_vm._v('V')]), _vm._v('iew / Edit')])]
                                        ),
                                    ],
                                    1
                                ),
                                _vm._v(' '),
                                _c(
                                    'div',
                                    { staticClass: 'item-group' },
                                    [
                                        _c(
                                            'BaseContextMenuItem',
                                            {
                                                attrs: { iconClass: 'far fa-plus', hotkey: 'KeyA' },
                                                on: {
                                                    click: function($event) {
                                                        return _vm.onNewProduct()
                                                    },
                                                },
                                            },
                                            [_c('span', [_c('u', [_vm._v('A')]), _vm._v('dd New Product')])]
                                        ),
                                    ],
                                    1
                                ),
                                _vm._v(' '),
                                _c(
                                    'div',
                                    { staticClass: 'item-group' },
                                    [
                                        _c(
                                            'BaseContextMenuItem',
                                            {
                                                attrs: { iconClass: 'far fa-trash-alt', hotkey: 'KeyD' },
                                                on: {
                                                    click: function($event) {
                                                        return _vm.onDeleteProducts([_vm.contextItem])
                                                    },
                                                },
                                            },
                                            [_c('span', [_c('u', [_vm._v('D')]), _vm._v('elete Product')])]
                                        ),
                                    ],
                                    1
                                ),
                            ]),
                            _vm._v(' '),
                            _c(
                                'BaseContextMenu',
                                {
                                    ref: 'contextMenuSelected',
                                    scopedSlots: _vm._u([
                                        {
                                            key: 'header',
                                            fn: function() {
                                                return [
                                                    _c('span', [
                                                        _vm._v(
                                                            'Choose action for ' +
                                                                _vm._s(_vm.selectedProducts.length) +
                                                                ' products'
                                                        ),
                                                    ]),
                                                ]
                                            },
                                            proxy: true,
                                        },
                                    ]),
                                },
                                [
                                    _vm._v(' '),
                                    _c(
                                        'div',
                                        { staticClass: 'item-group' },
                                        [
                                            _c(
                                                'BaseContextMenuItem',
                                                {
                                                    attrs: { iconClass: 'far fa-times', hotkey: 'KeyC' },
                                                    on: {
                                                        click: function($event) {
                                                            _vm.selectedProducts = []
                                                        },
                                                    },
                                                },
                                                [_c('span', [_c('u', [_vm._v('C')]), _vm._v('lear Selection')])]
                                            ),
                                        ],
                                        1
                                    ),
                                    _vm._v(' '),
                                    _c(
                                        'div',
                                        { staticClass: 'item-group' },
                                        [
                                            _c(
                                                'BaseContextMenuItem',
                                                {
                                                    attrs: { iconClass: 'far fa-trash-alt', hotkey: 'KeyD' },
                                                    on: {
                                                        click: function($event) {
                                                            return _vm.onDeleteProducts(_vm.selectedProducts)
                                                        },
                                                    },
                                                },
                                                [_c('span', [_c('u', [_vm._v('D')]), _vm._v('elete Products')])]
                                            ),
                                        ],
                                        1
                                    ),
                                ]
                            ),
                        ],
                        1
                    )
                }
                var staticRenderFns = []
                render._withStripped = true

                /***/
            },

        /***/ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=template&id=6f7a1791&scoped=true&':
            /*!***************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=template&id=6f7a1791&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return render
                })
                /* harmony export (binding) */ __webpack_require__.d(
                    __webpack_exports__,
                    'staticRenderFns',
                    function() {
                        return staticRenderFns
                    }
                )
                var render = function() {
                    var _vm = this
                    var _h = _vm.$createElement
                    var _c = _vm._self._c || _h
                    return _c('BaseTableInnerRow', { staticClass: 'products-table-row' }, [
                        _c('td', { staticClass: 'image clickable', on: { click: _vm.onViewSingle } }, [
                            _c(
                                'div',
                                { staticClass: 'img-wrapper' },
                                [
                                    _vm.product.variants[0] != null
                                        ? _c('BaseVariantImage', {
                                              key: _vm.product.id,
                                              attrs: { variant: _vm.product.variants[0], size: 'sm' },
                                          })
                                        : _vm._e(),
                                ],
                                1
                            ),
                        ]),
                        _vm._v(' '),
                        _c('td', { staticClass: 'id clickable', on: { click: _vm.onViewSingle } }, [
                            _c('span', [_vm._v(_vm._s(_vm.product.datasource_id))]),
                        ]),
                        _vm._v(' '),
                        _c('td', { staticClass: 'title' }, [
                            _c('span', { staticClass: 'clickable', on: { click: _vm.onViewSingle } }, [
                                _c(
                                    'span',
                                    {
                                        directives: [
                                            {
                                                name: 'tooltip',
                                                rawName: 'v-tooltip',
                                                value:
                                                    !!_vm.product.title &&
                                                    _vm.product.title.length > _vm.titleTruncateSize &&
                                                    _vm.product.title,
                                                expression:
                                                    '!!product.title && product.title.length > titleTruncateSize && product.title',
                                            },
                                        ],
                                    },
                                    [_vm._v(_vm._s(_vm._f('truncate')(_vm.product.title, _vm.titleTruncateSize)))]
                                ),
                                _vm._v(' '),
                                _c(
                                    'div',
                                    { staticClass: 'variant-list' },
                                    [
                                        _vm._l(_vm.product.variants.slice(0, 5), function(variant, index) {
                                            return _c(
                                                'div',
                                                {
                                                    key: index,
                                                    staticClass: 'variant-list-item pill ghost xs',
                                                },
                                                [
                                                    _c('span', [
                                                        _vm._v(
                                                            _vm._s(
                                                                _vm._f('truncate')(
                                                                    variant.name || 'Unnamed',
                                                                    _vm.variantNameTruncateLength(_vm.product)
                                                                )
                                                            )
                                                        ),
                                                    ]),
                                                ]
                                            )
                                        }),
                                        _vm._v(' '),
                                        _vm.product.variants.length > 5
                                            ? _c('div', { staticClass: 'variant-list-item pill ghost xs' }, [
                                                  _c('span', [
                                                      _vm._v('+ ' + _vm._s(_vm.product.variants.length - 5) + ' more'),
                                                  ]),
                                              ])
                                            : _vm._e(),
                                    ],
                                    2
                                ),
                            ]),
                        ]),
                        _vm._v(' '),
                        _c(
                            'td',
                            {
                                directives: [
                                    {
                                        name: 'tooltip',
                                        rawName: 'v-tooltip',
                                        value: {
                                            content:
                                                _vm.product.delivery_dates.length > 1 &&
                                                _vm.product.delivery_dates
                                                    .map(function(x) {
                                                        return _vm.prettifyDate(x, 'short')
                                                    })
                                                    .join(', '),
                                            trigger: 'hover',
                                        },
                                        expression:
                                            "{\n            content: product.delivery_dates.length > 1 && product.delivery_dates.map(x => prettifyDate(x, 'short')).join(', '),\n            trigger: 'hover'\n        }",
                                    },
                                ],
                                staticClass: 'delivery',
                                style: _vm.product.delivery_dates.length > 1 && 'cursor: pointer;',
                                on: { click: _vm.onViewSingle },
                            },
                            [
                                _vm.product.delivery_dates[0]
                                    ? _c('span', [
                                          _vm._v(
                                              '\n            ' +
                                                  _vm._s(_vm.prettifyDate(_vm.product.delivery_dates[0], 'short')) +
                                                  '\n            '
                                          ),
                                          _vm.product.delivery_dates.length > 1
                                              ? _c('span', { staticClass: 'square ghost xs' }, [
                                                    _c('span', [
                                                        _vm._v('+' + _vm._s(+_vm.product.delivery_dates.length - 1)),
                                                    ]),
                                                ])
                                              : _vm._e(),
                                      ])
                                    : _vm._e(),
                            ]
                        ),
                        _vm._v(' '),
                        _c('td', { staticClass: 'wholesale-price hide-screen-xs' }, [
                            _c('span', [_vm._v(_vm._s(_vm.product.yourPrice.wholesale_price))]),
                        ]),
                        _vm._v(' '),
                        _c('td', { staticClass: 'recommended-retail-price hide-screen-xs' }, [
                            _c('span', [_vm._v(_vm._s(_vm.product.yourPrice.recommended_retail_price))]),
                        ]),
                        _vm._v(' '),
                        _c('td', { staticClass: 'mark-up hide-screen-xs' }, [
                            _c('span', [_vm._v(_vm._s(_vm.product.yourPrice.mark_up))]),
                        ]),
                        _vm._v(' '),
                        _c('td', { staticClass: 'currency hide-screen-xs' }, [
                            _c('span', [_vm._v(_vm._s(_vm.product.yourPrice.currency))]),
                        ]),
                        _vm._v(' '),
                        _c('td', { staticClass: 'minimum' }, [
                            _c('div', { staticClass: 'square ghost xs' }, [
                                _c(
                                    'span',
                                    [
                                        _vm.product.min_variant_order
                                            ? [_c('span', [_vm._v(_vm._s(_vm.product.min_variant_order) + '/')])]
                                            : _vm._e(),
                                        _vm._v(' '),
                                        _c('span', [_vm._v(_vm._s(_vm.product.min_order))]),
                                    ],
                                    2
                                ),
                                _vm._v(' '),
                                _c('i', { staticClass: 'far fa-box' }),
                            ]),
                        ]),
                        _vm._v(' '),
                        _c('td', { staticClass: 'action' }, [
                            !_vm.editOrderModeActive
                                ? _c(
                                      'button',
                                      {
                                          staticClass: 'invisible ghost-hover primary',
                                          on: { click: _vm.onViewSingle },
                                      },
                                      [_c('span', [_vm._v('View / Edit')])]
                                  )
                                : _c('div', { staticClass: 'square primary drag-handle' }, [
                                      _c('i', { staticClass: 'far fa-arrows-alt-v' }),
                                  ]),
                        ]),
                    ])
                }
                var staticRenderFns = []
                render._withStripped = true

                /***/
            },

        /***/ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/index.vue?vue&type=template&id=6ea475e1&scoped=true&':
            /*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/EditFilePage/index.vue?vue&type=template&id=6ea475e1&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return render
                })
                /* harmony export (binding) */ __webpack_require__.d(
                    __webpack_exports__,
                    'staticRenderFns',
                    function() {
                        return staticRenderFns
                    }
                )
                var render = function() {
                    var _vm = this
                    var _h = _vm.$createElement
                    var _c = _vm._self._c || _h
                    return _c(
                        'PageLoader',
                        {
                            attrs: {
                                status: _vm.status,
                                loadingMsg: 'loading file',
                                errorMsg: 'error loading file',
                                errorCallback: function() {
                                    return _vm.fetchData()
                                },
                            },
                        },
                        [_c('EditFilePage')],
                        1
                    )
                }
                var staticRenderFns = []
                render._withStripped = true

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/BulkUploadComponent.vue':
            /*!*****************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/BulkUploadComponent.vue ***!
  \*****************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _BulkUploadComponent_vue_vue_type_template_id_0916258e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! ./BulkUploadComponent.vue?vue&type=template&id=0916258e&scoped=true& */ './resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=template&id=0916258e&scoped=true&'
                )
                /* harmony import */ var _BulkUploadComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! ./BulkUploadComponent.vue?vue&type=script&lang=js& */ './resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony import */ var _BulkUploadComponent_vue_vue_type_style_index_0_id_0916258e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    /*! ./BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true& */ './resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true&'
                )
                /* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    /*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ './node_modules/vue-loader/lib/runtime/componentNormalizer.js'
                )

                /* normalize component */

                var component = Object(
                    _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__['default']
                )(
                    _BulkUploadComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__['default'],
                    _BulkUploadComponent_vue_vue_type_template_id_0916258e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'render'
                    ],
                    _BulkUploadComponent_vue_vue_type_template_id_0916258e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ],
                    false,
                    null,
                    '0916258e',
                    null
                )

                /* hot reload */
                if (false) {
                    var api
                }
                component.options.__file = 'resources/js/pages/EditFilePage/BulkUploadComponent.vue'
                /* harmony default export */ __webpack_exports__['default'] = component.exports

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=script&lang=js&':
            /*!******************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUploadComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./BulkUploadComponent.vue?vue&type=script&lang=js& */ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUploadComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[
                        'default'
                    ]

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true&':
            /*!***************************************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true& ***!
  \***************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUploadComponent_vue_vue_type_style_index_0_id_0916258e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true& */ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=style&index=0&id=0916258e&lang=scss&scoped=true&'
                )
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUploadComponent_vue_vue_type_style_index_0_id_0916258e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUploadComponent_vue_vue_type_style_index_0_id_0916258e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__
                )
                /* harmony reexport (unknown) */ for (var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUploadComponent_vue_vue_type_style_index_0_id_0916258e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__)
                    if (['default'].indexOf(__WEBPACK_IMPORT_KEY__) < 0)
                        (function(key) {
                            __webpack_require__.d(__webpack_exports__, key, function() {
                                return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUploadComponent_vue_vue_type_style_index_0_id_0916258e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                                    key
                                ]
                            })
                        })(__WEBPACK_IMPORT_KEY__)
                /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUploadComponent_vue_vue_type_style_index_0_id_0916258e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=template&id=0916258e&scoped=true&':
            /*!************************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=template&id=0916258e&scoped=true& ***!
  \************************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUploadComponent_vue_vue_type_template_id_0916258e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./BulkUploadComponent.vue?vue&type=template&id=0916258e&scoped=true& */ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/BulkUploadComponent.vue?vue&type=template&id=0916258e&scoped=true&'
                )
                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUploadComponent_vue_vue_type_template_id_0916258e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'render'
                    ]
                })

                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'staticRenderFns', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUploadComponent_vue_vue_type_template_id_0916258e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ]
                })

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/EditFileHeader.vue':
            /*!************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/EditFileHeader.vue ***!
  \************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _EditFileHeader_vue_vue_type_template_id_8a162718_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! ./EditFileHeader.vue?vue&type=template&id=8a162718&scoped=true& */ './resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=template&id=8a162718&scoped=true&'
                )
                /* harmony import */ var _EditFileHeader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! ./EditFileHeader.vue?vue&type=script&lang=js& */ './resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony import */ var _EditFileHeader_vue_vue_type_style_index_0_id_8a162718_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    /*! ./EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss& */ './resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss&'
                )
                /* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    /*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ './node_modules/vue-loader/lib/runtime/componentNormalizer.js'
                )

                /* normalize component */

                var component = Object(
                    _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__['default']
                )(
                    _EditFileHeader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__['default'],
                    _EditFileHeader_vue_vue_type_template_id_8a162718_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'render'
                    ],
                    _EditFileHeader_vue_vue_type_template_id_8a162718_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ],
                    false,
                    null,
                    '8a162718',
                    null
                )

                /* hot reload */
                if (false) {
                    var api
                }
                component.options.__file = 'resources/js/pages/EditFilePage/EditFileHeader.vue'
                /* harmony default export */ __webpack_exports__['default'] = component.exports

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=script&lang=js&':
            /*!*************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFileHeader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./EditFileHeader.vue?vue&type=script&lang=js& */ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFileHeader_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[
                        'default'
                    ]

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss&':
            /*!**********************************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss& ***!
  \**********************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFileHeader_vue_vue_type_style_index_0_id_8a162718_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss& */ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=style&index=0&id=8a162718&scoped=true&lang=scss&'
                )
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFileHeader_vue_vue_type_style_index_0_id_8a162718_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFileHeader_vue_vue_type_style_index_0_id_8a162718_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__
                )
                /* harmony reexport (unknown) */ for (var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFileHeader_vue_vue_type_style_index_0_id_8a162718_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__)
                    if (['default'].indexOf(__WEBPACK_IMPORT_KEY__) < 0)
                        (function(key) {
                            __webpack_require__.d(__webpack_exports__, key, function() {
                                return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFileHeader_vue_vue_type_style_index_0_id_8a162718_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[
                                    key
                                ]
                            })
                        })(__WEBPACK_IMPORT_KEY__)
                /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFileHeader_vue_vue_type_style_index_0_id_8a162718_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=template&id=8a162718&scoped=true&':
            /*!*******************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=template&id=8a162718&scoped=true& ***!
  \*******************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFileHeader_vue_vue_type_template_id_8a162718_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./EditFileHeader.vue?vue&type=template&id=8a162718&scoped=true& */ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFileHeader.vue?vue&type=template&id=8a162718&scoped=true&'
                )
                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFileHeader_vue_vue_type_template_id_8a162718_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'render'
                    ]
                })

                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'staticRenderFns', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFileHeader_vue_vue_type_template_id_8a162718_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ]
                })

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/EditFilePage.vue':
            /*!**********************************************************!*\
  !*** ./resources/js/pages/EditFilePage/EditFilePage.vue ***!
  \**********************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _EditFilePage_vue_vue_type_template_id_2b3dc336_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! ./EditFilePage.vue?vue&type=template&id=2b3dc336&scoped=true& */ './resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=template&id=2b3dc336&scoped=true&'
                )
                /* harmony import */ var _EditFilePage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! ./EditFilePage.vue?vue&type=script&lang=js& */ './resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony import */ var _EditFilePage_vue_vue_type_style_index_0_id_2b3dc336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    /*! ./EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss& */ './resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss&'
                )
                /* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    /*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ './node_modules/vue-loader/lib/runtime/componentNormalizer.js'
                )

                /* normalize component */

                var component = Object(
                    _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__['default']
                )(
                    _EditFilePage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__['default'],
                    _EditFilePage_vue_vue_type_template_id_2b3dc336_scoped_true___WEBPACK_IMPORTED_MODULE_0__['render'],
                    _EditFilePage_vue_vue_type_template_id_2b3dc336_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ],
                    false,
                    null,
                    '2b3dc336',
                    null
                )

                /* hot reload */
                if (false) {
                    var api
                }
                component.options.__file = 'resources/js/pages/EditFilePage/EditFilePage.vue'
                /* harmony default export */ __webpack_exports__['default'] = component.exports

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=script&lang=js&':
            /*!***********************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFilePage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./EditFilePage.vue?vue&type=script&lang=js& */ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFilePage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[
                        'default'
                    ]

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss&':
            /*!********************************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss& ***!
  \********************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFilePage_vue_vue_type_style_index_0_id_2b3dc336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss& */ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=style&index=0&id=2b3dc336&scoped=true&lang=scss&'
                )
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFilePage_vue_vue_type_style_index_0_id_2b3dc336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFilePage_vue_vue_type_style_index_0_id_2b3dc336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__
                )
                /* harmony reexport (unknown) */ for (var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFilePage_vue_vue_type_style_index_0_id_2b3dc336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__)
                    if (['default'].indexOf(__WEBPACK_IMPORT_KEY__) < 0)
                        (function(key) {
                            __webpack_require__.d(__webpack_exports__, key, function() {
                                return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFilePage_vue_vue_type_style_index_0_id_2b3dc336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[
                                    key
                                ]
                            })
                        })(__WEBPACK_IMPORT_KEY__)
                /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFilePage_vue_vue_type_style_index_0_id_2b3dc336_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=template&id=2b3dc336&scoped=true&':
            /*!*****************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=template&id=2b3dc336&scoped=true& ***!
  \*****************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFilePage_vue_vue_type_template_id_2b3dc336_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./EditFilePage.vue?vue&type=template&id=2b3dc336&scoped=true& */ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/EditFilePage.vue?vue&type=template&id=2b3dc336&scoped=true&'
                )
                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFilePage_vue_vue_type_template_id_2b3dc336_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'render'
                    ]
                })

                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'staticRenderFns', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditFilePage_vue_vue_type_template_id_2b3dc336_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ]
                })

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductFlyin.vue':
            /*!**********************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductFlyin.vue ***!
  \**********************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _ProductFlyin_vue_vue_type_template_id_19e6ac0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! ./ProductFlyin.vue?vue&type=template&id=19e6ac0a&scoped=true& */ './resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=template&id=19e6ac0a&scoped=true&'
                )
                /* harmony import */ var _ProductFlyin_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! ./ProductFlyin.vue?vue&type=script&lang=js& */ './resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony import */ var _ProductFlyin_vue_vue_type_style_index_0_id_19e6ac0a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    /*! ./ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss& */ './resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss&'
                )
                /* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    /*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ './node_modules/vue-loader/lib/runtime/componentNormalizer.js'
                )

                /* normalize component */

                var component = Object(
                    _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__['default']
                )(
                    _ProductFlyin_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__['default'],
                    _ProductFlyin_vue_vue_type_template_id_19e6ac0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__['render'],
                    _ProductFlyin_vue_vue_type_template_id_19e6ac0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ],
                    false,
                    null,
                    '19e6ac0a',
                    null
                )

                /* hot reload */
                if (false) {
                    var api
                }
                component.options.__file = 'resources/js/pages/EditFilePage/ProductFlyin.vue'
                /* harmony default export */ __webpack_exports__['default'] = component.exports

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=script&lang=js&':
            /*!***********************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductFlyin_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductFlyin.vue?vue&type=script&lang=js& */ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductFlyin_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[
                        'default'
                    ]

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss&':
            /*!********************************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss& ***!
  \********************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductFlyin_vue_vue_type_style_index_0_id_19e6ac0a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss& */ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=style&index=0&id=19e6ac0a&scoped=true&lang=scss&'
                )
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductFlyin_vue_vue_type_style_index_0_id_19e6ac0a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductFlyin_vue_vue_type_style_index_0_id_19e6ac0a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__
                )
                /* harmony reexport (unknown) */ for (var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductFlyin_vue_vue_type_style_index_0_id_19e6ac0a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__)
                    if (['default'].indexOf(__WEBPACK_IMPORT_KEY__) < 0)
                        (function(key) {
                            __webpack_require__.d(__webpack_exports__, key, function() {
                                return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductFlyin_vue_vue_type_style_index_0_id_19e6ac0a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[
                                    key
                                ]
                            })
                        })(__WEBPACK_IMPORT_KEY__)
                /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductFlyin_vue_vue_type_style_index_0_id_19e6ac0a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=template&id=19e6ac0a&scoped=true&':
            /*!*****************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=template&id=19e6ac0a&scoped=true& ***!
  \*****************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductFlyin_vue_vue_type_template_id_19e6ac0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductFlyin.vue?vue&type=template&id=19e6ac0a&scoped=true& */ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductFlyin.vue?vue&type=template&id=19e6ac0a&scoped=true&'
                )
                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductFlyin_vue_vue_type_template_id_19e6ac0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'render'
                    ]
                })

                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'staticRenderFns', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductFlyin_vue_vue_type_template_id_19e6ac0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ]
                })

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductsTable.vue':
            /*!***********************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductsTable.vue ***!
  \***********************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _ProductsTable_vue_vue_type_template_id_04fbba8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! ./ProductsTable.vue?vue&type=template&id=04fbba8e&scoped=true& */ './resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=template&id=04fbba8e&scoped=true&'
                )
                /* harmony import */ var _ProductsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! ./ProductsTable.vue?vue&type=script&lang=js& */ './resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony import */ var _ProductsTable_vue_vue_type_style_index_0_id_04fbba8e_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    /*! ./ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss& */ './resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss&'
                )
                /* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    /*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ './node_modules/vue-loader/lib/runtime/componentNormalizer.js'
                )

                /* normalize component */

                var component = Object(
                    _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__['default']
                )(
                    _ProductsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__['default'],
                    _ProductsTable_vue_vue_type_template_id_04fbba8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'render'
                    ],
                    _ProductsTable_vue_vue_type_template_id_04fbba8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ],
                    false,
                    null,
                    '04fbba8e',
                    null
                )

                /* hot reload */
                if (false) {
                    var api
                }
                component.options.__file = 'resources/js/pages/EditFilePage/ProductsTable.vue'
                /* harmony default export */ __webpack_exports__['default'] = component.exports

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=script&lang=js&':
            /*!************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductsTable.vue?vue&type=script&lang=js& */ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTable_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[
                        'default'
                    ]

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss&':
            /*!*********************************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss& ***!
  \*********************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTable_vue_vue_type_style_index_0_id_04fbba8e_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss& */ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=style&index=0&id=04fbba8e&scoped=true&lang=scss&'
                )
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTable_vue_vue_type_style_index_0_id_04fbba8e_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTable_vue_vue_type_style_index_0_id_04fbba8e_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__
                )
                /* harmony reexport (unknown) */ for (var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTable_vue_vue_type_style_index_0_id_04fbba8e_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__)
                    if (['default'].indexOf(__WEBPACK_IMPORT_KEY__) < 0)
                        (function(key) {
                            __webpack_require__.d(__webpack_exports__, key, function() {
                                return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTable_vue_vue_type_style_index_0_id_04fbba8e_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[
                                    key
                                ]
                            })
                        })(__WEBPACK_IMPORT_KEY__)
                /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTable_vue_vue_type_style_index_0_id_04fbba8e_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=template&id=04fbba8e&scoped=true&':
            /*!******************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=template&id=04fbba8e&scoped=true& ***!
  \******************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTable_vue_vue_type_template_id_04fbba8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductsTable.vue?vue&type=template&id=04fbba8e&scoped=true& */ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTable.vue?vue&type=template&id=04fbba8e&scoped=true&'
                )
                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTable_vue_vue_type_template_id_04fbba8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'render'
                    ]
                })

                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'staticRenderFns', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTable_vue_vue_type_template_id_04fbba8e_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ]
                })

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductsTableRow.vue':
            /*!**************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductsTableRow.vue ***!
  \**************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _ProductsTableRow_vue_vue_type_template_id_6f7a1791_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! ./ProductsTableRow.vue?vue&type=template&id=6f7a1791&scoped=true& */ './resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=template&id=6f7a1791&scoped=true&'
                )
                /* harmony import */ var _ProductsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! ./ProductsTableRow.vue?vue&type=script&lang=js& */ './resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony import */ var _ProductsTableRow_vue_vue_type_style_index_0_id_6f7a1791_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    /*! ./ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss& */ './resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss&'
                )
                /* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    /*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ './node_modules/vue-loader/lib/runtime/componentNormalizer.js'
                )

                /* normalize component */

                var component = Object(
                    _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__['default']
                )(
                    _ProductsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__['default'],
                    _ProductsTableRow_vue_vue_type_template_id_6f7a1791_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'render'
                    ],
                    _ProductsTableRow_vue_vue_type_template_id_6f7a1791_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ],
                    false,
                    null,
                    '6f7a1791',
                    null
                )

                /* hot reload */
                if (false) {
                    var api
                }
                component.options.__file = 'resources/js/pages/EditFilePage/ProductsTableRow.vue'
                /* harmony default export */ __webpack_exports__['default'] = component.exports

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=script&lang=js&':
            /*!***************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductsTableRow.vue?vue&type=script&lang=js& */ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTableRow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[
                        'default'
                    ]

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss&':
            /*!************************************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss& ***!
  \************************************************************************************************************************/
            /*! no static exports found */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTableRow_vue_vue_type_style_index_0_id_6f7a1791_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--7-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--7-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss& */ './node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=style&index=0&id=6f7a1791&scoped=true&lang=scss&'
                )
                /* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTableRow_vue_vue_type_style_index_0_id_6f7a1791_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTableRow_vue_vue_type_style_index_0_id_6f7a1791_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__
                )
                /* harmony reexport (unknown) */ for (var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTableRow_vue_vue_type_style_index_0_id_6f7a1791_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__)
                    if (['default'].indexOf(__WEBPACK_IMPORT_KEY__) < 0)
                        (function(key) {
                            __webpack_require__.d(__webpack_exports__, key, function() {
                                return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTableRow_vue_vue_type_style_index_0_id_6f7a1791_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[
                                    key
                                ]
                            })
                        })(__WEBPACK_IMPORT_KEY__)
                /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_dist_cjs_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTableRow_vue_vue_type_style_index_0_id_6f7a1791_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=template&id=6f7a1791&scoped=true&':
            /*!*********************************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=template&id=6f7a1791&scoped=true& ***!
  \*********************************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTableRow_vue_vue_type_template_id_6f7a1791_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductsTableRow.vue?vue&type=template&id=6f7a1791&scoped=true& */ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/ProductsTableRow.vue?vue&type=template&id=6f7a1791&scoped=true&'
                )
                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTableRow_vue_vue_type_template_id_6f7a1791_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'render'
                    ]
                })

                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'staticRenderFns', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductsTableRow_vue_vue_type_template_id_6f7a1791_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ]
                })

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/index.vue':
            /*!***************************************************!*\
  !*** ./resources/js/pages/EditFilePage/index.vue ***!
  \***************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _index_vue_vue_type_template_id_6ea475e1_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! ./index.vue?vue&type=template&id=6ea475e1&scoped=true& */ './resources/js/pages/EditFilePage/index.vue?vue&type=template&id=6ea475e1&scoped=true&'
                )
                /* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    /*! ./index.vue?vue&type=script&lang=js& */ './resources/js/pages/EditFilePage/index.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    /*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ './node_modules/vue-loader/lib/runtime/componentNormalizer.js'
                )

                /* normalize component */

                var component = Object(
                    _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__['default']
                )(
                    _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__['default'],
                    _index_vue_vue_type_template_id_6ea475e1_scoped_true___WEBPACK_IMPORTED_MODULE_0__['render'],
                    _index_vue_vue_type_template_id_6ea475e1_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ],
                    false,
                    null,
                    '6ea475e1',
                    null
                )

                /* hot reload */
                if (false) {
                    var api
                }
                component.options.__file = 'resources/js/pages/EditFilePage/index.vue'
                /* harmony default export */ __webpack_exports__['default'] = component.exports

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/index.vue?vue&type=script&lang=js&':
            /*!****************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/index.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
            /*! exports provided: default */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=script&lang=js& */ './node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/index.vue?vue&type=script&lang=js&'
                )
                /* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__['default'] =
                    _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[
                        'default'
                    ]

                /***/
            },

        /***/ './resources/js/pages/EditFilePage/index.vue?vue&type=template&id=6ea475e1&scoped=true&':
            /*!**********************************************************************************************!*\
  !*** ./resources/js/pages/EditFilePage/index.vue?vue&type=template&id=6ea475e1&scoped=true& ***!
  \**********************************************************************************************/
            /*! exports provided: render, staticRenderFns */
            /***/ function(module, __webpack_exports__, __webpack_require__) {
                'use strict'
                __webpack_require__.r(__webpack_exports__)
                /* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_6ea475e1_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    /*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./index.vue?vue&type=template&id=6ea475e1&scoped=true& */ './node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/EditFilePage/index.vue?vue&type=template&id=6ea475e1&scoped=true&'
                )
                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'render', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_6ea475e1_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'render'
                    ]
                })

                /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, 'staticRenderFns', function() {
                    return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_template_id_6ea475e1_scoped_true___WEBPACK_IMPORTED_MODULE_0__[
                        'staticRenderFns'
                    ]
                })

                /***/
            },
    },
])

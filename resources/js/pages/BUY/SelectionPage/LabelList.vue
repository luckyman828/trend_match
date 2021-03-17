<template>
    <div class="label-list flex-list" v-dragscroll>
        <button
            class="list-item pill xs"
            :class="[{ 'primary-hover': hasWriteAccess }]"
            v-for="(label, index) in labelsSorted"
            :key="label"
            @click="hasWriteAccess && onRemoveLabel(index)"
        >
            <span>{{ getLabelIndex(label) + 1 }} - {{ label }}</span>
            <i v-if="hasWriteAccess" class="hover-only fas fa-times-circle"></i>
        </button>
        <v-popover ref="popover" trigger="click" v-if="hasWriteAccess" @update:open="onShowPopover">
            <button class="primary ghost pill xs add-button">
                <i class="far fa-plus"></i>
                <span>Add Label</span>
            </button>
            <BaseContextMenu :inline="true" slot="popover" tabindex="0" ref="contextMenu">
                <div class="item-group">
                    <BaseSelectButtons
                        :options="availableLabels"
                        v-model="labelArray"
                        type="select"
                        :submitOnChange="true"
                        ref="selectButtons"
                        :focusOptionIndex="popoverOptionIndex"
                    >
                        <template v-slot:before="slotProps">
                            <span>{{ getLabelIndex(slotProps.option) + 1 }} - </span>
                        </template>
                    </BaseSelectButtons>
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button class="primary full-width" v-close-popover>
                            <span>Done</span>
                        </button>
                    </div>
                </div>
            </BaseContextMenu>
        </v-popover>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'labelList',
    props: ['product', 'variant'],
    data: function() {
        return {
            isOpen: false,
            popoverOptionIndex: -1,
        }
    },
    computed: {
        ...mapGetters('workspaces', {
            availableLabels: 'getAvailableProductLabels',
            workspaceRole: 'authUserWorkspaceRole',
        }),
        ...mapGetters('selections', {
            selectionRole: 'getCurrentSelectionMode',
        }),
        ...mapGetters('files', {
            file: 'getCurrentFile',
        }),
        isVariant() {
            return !!this.variant
        },
        labelsSorted() {
            const labels = this.labelArray
            const sortingArr = this.availableLabels
            // Sort by available labels
            labels.slice().sort((a, b) => {
                return sortingArr.indexOf(a) - sortingArr.indexOf(b)
            })
            return labels
        },
        availableLabelsFiltered() {
            return this.availableLabels
        },
        hasWriteAccess() {
            return this.workspaceRole == 'Admin' || this.file.editable
        },
        labelArray: {
            get() {
                return this.isVariant ? this.variant.labels : this.product.labels
            },
            set(newVal) {
                return this.isVariant ? (this.variant.labels = newVal) : (this.product.labels = newVal)
            },
        },
    },
    methods: {
        ...mapActions('products', ['updateProduct']),
        onAddLabel(newLabel) {
            this.labelArray.push(newLabel)
            this.onUpdateProduct()
        },
        onRemoveLabel(index) {
            this.labelArray.splice(index, 1)
            this.onUpdateProduct()
        },
        getLabelIndex(label) {
            return this.availableLabels.indexOf(label)
        },
        async onUpdateProduct() {
            const product = Object.assign({}, this.product)
            delete product.selectionInputList
            await this.updateProduct(product)
        },
        onShowPopover(isOpen) {
            if (this.isOpen) this.onUpdateProduct()
            this.isOpen = isOpen

            // If now visible
            if (isOpen) {
                this.popoverOptionIndex = -1
                document.addEventListener('keydown', this.keydownHandler)
            } else {
                document.removeEventListener('keydown', this.keydownHandler)
            }
        },
        keydownHandler(e) {
            const key = e.key
            if (key == 'ArrowUp' || key == 'ArrowDown') {
                e.preventDefault()
                e.stopPropagation()
                if (key == 'ArrowUp' && this.popoverOptionIndex > 0) this.popoverOptionIndex--
                if (key == 'ArrowDown' && this.popoverOptionIndex < this.availableLabels.length - 1)
                    this.popoverOptionIndex++
            }
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.label-list {
    max-width: calc(100vw - 460px);
    overflow-x: auto;
    cursor: default;
    .list-item {
        padding-right: 4px;
        flex-shrink: 0;
        .hover-only {
            opacity: 0;
        }
        &:hover {
            padding-right: 0;
            .hover-only {
                opacity: 1;
                color: white !important;
            }
        }
    }
    .add-button {
        opacity: 0;
        &:hover {
            i {
                color: white !important;
            }
        }
        tr:hover & {
            opacity: 1;
        }
    }
    .list-item,
    .add-button {
        > span {
            font-weight: 400;
        }
    }
}
</style>

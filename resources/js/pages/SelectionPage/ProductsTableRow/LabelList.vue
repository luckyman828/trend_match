<template>
    <div class="label-list flex-list">
        <button
            class="list-item pill dark xs"
            :class="{ 'primary-hover': hasWriteAccess }"
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
            <BaseContextMenu :inline="true" slot="popover">
                <div class="item-group">
                    <BaseSelectButtons
                        :options="availableLabels"
                        v-model="product.labels"
                        type="select"
                        :submitOnChange="true"
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
    props: ['product'],
    data: function() {
        return {
            isOpen: false,
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

        labelsSorted() {
            const labels = this.product.labels
            const sortingArr = this.availableLabels
            // Sort by available labels
            labels.slice().sort((a, b) => {
                return sortingArr.indexOf(a) - sortingArr.indexOf(b)
            })
            return labels
        },
        availableLabelsFiltered() {
            // const labels = this.availableLabels.slice().filter(x => {
            //     const alreadyAdded = this.product.labels.includes(x)
            //     return !alreadyAdded
            // })
            return this.availableLabels
        },
        hasWriteAccess() {
            return this.workspaceRole == 'Admin' || this.file.editable
        },
    },
    methods: {
        ...mapActions('products', ['updateProduct']),
        onAddLabel(newLabel) {
            this.product.labels.push(newLabel)
            this.onUpdateProduct()
        },
        onRemoveLabel(index) {
            this.product.labels.splice(index, 1)
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
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.label-list {
    position: absolute;
    left: 0;
    top: -36px;
    max-width: calc(100vw - 460px);
    cursor: default;
    .list-item {
        padding-right: 4px;
        .hover-only {
            display: none;
        }
        &:hover {
            padding-right: 0;
            .hover-only {
                display: block;
                color: white !important;
            }
        }
    }
    .add-button {
        display: none;
        &:hover {
            i {
                color: white !important;
            }
        }
        tr:hover & {
            display: inline-flex;
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

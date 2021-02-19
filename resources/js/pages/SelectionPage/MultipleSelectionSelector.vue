<template>
    <div class="selection-selector">
        <v-popover trigger="click">
            <button class="white">
                <!-- <i class="fas primary" :class="currentSelections.length > 1 ? 'fa-users-class' : 'fa-user'"></i> -->
                <i class="fas primary fa-users-class"></i>
                <span
                    >{{ currentSelections[0].name }}
                    {{ `${currentSelections.length > 1 ? '+ ' + Math.abs(currentSelections.length - 1) : ''}` }}</span
                >
                <i class="fas fa-caret-down"></i>
            </button>
            <template slot="popover">
                <BaseSelectButton
                    v-for="theSelection in availableSelections"
                    :key="theSelection.id"
                    :modelValue="theSelection"
                    v-model="selectedSelections"
                    :disabled="
                        selectedSelections.length > 0 &&
                            selectedSelections[0].product_set_identifier != theSelection.product_set_identifier
                    "
                    disabledTooltip="Selection belongs to different chapter."
                >
                    <div class="pill xs" v-if="theSelection.parent_chapter">
                        <i class="fas fa-project-diagram"></i><span>{{ theSelection.parent_chapter.name }}</span>
                    </div>
                    <i
                        v-if="theSelection.type == 'Master'"
                        class="far fa-crown"
                        style="margin-right: 4px;"
                        v-tooltip="'<strong>Master</strong> selection'"
                    ></i>
                    <i
                        v-if="!theSelection.is_visible"
                        class="far fa-eye-slash"
                        style="margin-right: 4px;"
                        v-tooltip="
                            'Selection is <strong>Hidden</strong>. You can still make new input, even though the selection is hidden'
                        "
                    ></i>
                    <i
                        v-if="!theSelection.is_open"
                        class="far fa-lock"
                        style="margin-right: 4px;"
                        v-tooltip="
                            'Selection is <strong>Locked</strong>. You can view input from a locked selection, but not make any new'
                        "
                    ></i>
                    <span>{{ theSelection.name }}</span>
                </BaseSelectButton>
                <div class="item-group actions">
                    <BaseButton
                        buttonClass="primary"
                        v-close-popover="selectedSelections.length >= 1"
                        :disabled="selectedSelections.length < 1"
                        v-tooltip="selectedSelections.length < 1 && 'At least 1 selection must be selected'"
                        @click="onSetCurrentSelections"
                    >
                        <span>Apply</span>
                    </BaseButton>
                    <button class="invisible ghost-hover" v-close-popover><span>Cancel</span></button>
                </div>
            </template>
        </v-popover>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
    name: 'multipleSelectionSelector',
    data: function() {
        return {
            selectedSelections: [],
        }
    },
    computed: {
        ...mapGetters('products', ['products']),
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', [
            'getCurrentSelections',
            'getSelectionsAvailableForAlignment',
            'currentSelectionMode',
        ]),
        currentSelections() {
            return this.getCurrentSelections
        },
        availableSelections() {
            return this.getSelectionsAvailableForAlignment
        },
    },
    watch: {
        currentSelections(newSelections) {
            // Find the corresponding selection in our available selections
            this.syncSelectedSelections()
        },
    },
    methods: {
        ...mapActions('selectionProducts', ['fetchSelectionProducts']),
        ...mapActions('selections', ['fetchSelectionSettings']),
        ...mapMutations('products', ['SORT_PRODUCTS']),
        ...mapMutations('productFilters', ['SET_PRODUCT_ACTION_FILTER']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS']),
        async onSetCurrentSelections() {
            const selections = this.selectedSelections
            await Promise.all(
                selections.map(async selection => {
                    // Fetch selection input if not fetched
                    if (!this.products[0].selectionInputList.find(x => x.selection_id == selection.id)) {
                        await this.fetchSelectionProducts(selection)
                    }
                    // Fetch selection settings if not fetched
                    if (!selection.settings) {
                        await this.fetchSelectionSettings(selection)
                    }
                })
            )
            this.SET_CURRENT_SELECTIONS(selections)
            // Set the current tab to `Overview` if we are entering multi-selection mode
            if (selections.length > 1) {
                this.SET_PRODUCT_ACTION_FILTER('overview')
            }
        },
        syncSelectedSelections() {
            this.currentSelections.forEach(selection => {
                const selectionToPush = this.availableSelections.find(x => x.id == selection.id)
                if (selectionToPush) {
                    const notInArray = !this.selectedSelections.find(x => x.id == selectionToPush.id)
                    if (notInArray) this.selectedSelections.push(selectionToPush)
                }
            })
        },
    },
    created() {
        // Find the corresponding selection in our available selections
        this.syncSelectedSelections()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

button {
    border: $borderEl;
}
</style>

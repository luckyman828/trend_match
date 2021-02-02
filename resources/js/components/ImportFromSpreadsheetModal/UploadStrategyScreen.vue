<template>
    <form @submit.prevent class="select-fields">
        <template v-if="uploadStrategy">
            <div class="form-section">
                <h3>Update or Add?</h3>
                <div class="form-element">
                    <BaseRadioInputField v-model="uploadStrategy.createNewProductSet" :value="false">
                        <span>Update existing products</span>
                    </BaseRadioInputField>
                </div>
                <div class="form-element">
                    <BaseRadioInputField v-model="uploadStrategy.createNewProductSet" :value="true">
                        <span>Add new products</span>
                    </BaseRadioInputField>
                </div>
            </div>

            <template v-if="!uploadStrategy.createNewProductSet">
                <div class="form-section">
                    <h3>Data replacement strategy</h3>
                    <div class="form-element">
                        <BaseRadioInputField v-model="uploadStrategy.dataReplacementStrategy" value="smart">
                            <span><strong>Smart:</strong> Add and replace data</span>
                            <i
                                class="far fa-info-circle tooltip-icon md"
                                v-tooltip="
                                    `Add new data and Replace existing values if new data is available\nData not present in the new files will remain untouched.`
                                "
                            ></i>
                        </BaseRadioInputField>
                    </div>
                    <div class="form-element">
                        <BaseRadioInputField v-model="uploadStrategy.dataReplacementStrategy" value="add">
                            <span><strong>Add:</strong> Only add data</span>
                            <i
                                class="far fa-info-circle tooltip-icon md"
                                v-tooltip="`Don't change anything in the existing data. Only add new values`"
                            ></i>
                        </BaseRadioInputField>
                    </div>
                    <div class="form-element">
                        <BaseRadioInputField v-model="uploadStrategy.dataReplacementStrategy" value="replace">
                            <span><strong>Replace:</strong> Overwrite all data</span>
                            <i
                                class="far fa-info-circle tooltip-icon md"
                                v-tooltip="
                                    'The data in the new files will overwrite all existing data.\nData not in the new files will be removed.'
                                "
                            ></i>
                        </BaseRadioInputField>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Variants</h3>
                    <label>Create new Variants</label>
                    <div class="col-2 form-element">
                        <BaseRadioInputField v-model="uploadStrategy.createNewVariants" :value="true">
                            <span>Create new Variants</span>
                        </BaseRadioInputField>
                        <BaseRadioInputField v-model="uploadStrategy.createNewVariants" :value="false">
                            <span>Don't create new Variants</span>
                        </BaseRadioInputField>
                    </div>
                    <label>Update existing Variant</label>
                    <div class="col-2 form-element">
                        <BaseRadioInputField v-model="uploadStrategy.updateExistingVariants" :value="true">
                            <span>Update existing Variants</span>
                        </BaseRadioInputField>
                        <BaseRadioInputField v-model="uploadStrategy.updateExistingVariants" :value="false">
                            <span>Don't update existing Variants</span>
                        </BaseRadioInputField>
                    </div>
                </div>

                <div class="form-section">
                    <h3>
                        Product clean-up strategy
                        <i
                            class="far fa-info-circle"
                            v-tooltip="
                                `Choose what happens with existing products that are not present in the new files`
                            "
                        ></i>
                    </h3>
                    <div class="col-2">
                        <BaseRadioInputField v-model="uploadStrategy.removeExtraProducts" :value="false">
                            <span>Keep extra products</span>
                        </BaseRadioInputField>
                        <BaseRadioInputField v-model="uploadStrategy.removeExtraProducts" :value="true">
                            <span>Remove extra products</span>
                        </BaseRadioInputField>
                    </div>
                </div>

                <div class="form-section">
                    <h3>
                        Missing products strategy
                        <i
                            class="far fa-info-circle"
                            v-tooltip="`Choose what happens with new products that only exist in the new files`"
                        ></i>
                    </h3>
                    <div class="col-2">
                        <BaseRadioInputField v-model="uploadStrategy.addMissingProducts" :value="false">
                            <span>Don't create products</span>
                        </BaseRadioInputField>
                        <BaseRadioInputField v-model="uploadStrategy.addMissingProducts" :value="true">
                            <span>Create missing products</span>
                        </BaseRadioInputField>
                    </div>
                </div>
            </template>

            <div class="form-controls">
                <button type="button" class="lg primary full-width" @click="$emit('go-to-next-screen')">
                    <span v-if="!uploadStrategy.createNewProductSet">Next: Choose fields</span>
                    <span v-else>Next: Map fields</span>
                </button>
            </div>
        </template>

        <BaseLoader v-else msg="Getting strategies ready" />
    </form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'uploadStrategyScreen',
    props: ['uploadStrategy'],
    async created() {
        // Create default uplaod strategy
        if (!this.uploadStrategy) {
            this.$emit('update:uploadStrategy', {
                dataReplacementStrategy: 'smart',
                removeExtraProducts: false,
                addMissingProducts: false,
                createNewVariants: true,
                updateExistingVariants: true,
                createNewProductSet: false,
            })
        }
    },
}
</script>

<style scoped lang="scss">
.tooltip-icon {
    position: absolute;
    right: 12px;
    top: 10px;
}
</style>

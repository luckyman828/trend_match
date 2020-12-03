<template>
    <v-popover trigger="click">
        <!-- TRIGGER -->
        <!-- <div class="dropdown-input-field input-wrapper"></div> -->
        <BaseInputField :disabled="true" :placeholder="placeholder" type="select">
            <i class="far fa-angle-down"></i>
        </BaseInputField>

        <!-- DROPDOWN -->
        <div slot="popover">
            <!-- <BaseSelectButtonsContextMenu :options="options" :emitOnChange="true" :inline="true" :search="search" /> -->
            <BaseSelectButtons
                :options="options"
                :emitOnChange="true"
                :search="search"
                :type="type"
                @input="$emit('input', $event)"
            />
        </div>
    </v-popover>
</template>

<script>
export default {
    name: 'baseDropdownInputField',
    props: ['placeholder', 'options', 'search', 'type'],
}
</script>

<style></style>

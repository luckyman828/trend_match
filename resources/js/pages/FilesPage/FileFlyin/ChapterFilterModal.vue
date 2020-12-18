<template>
    <BaseModal :show="show" @close="$emit('close')">
        <template v-slot:header>
            <h3>{{ selection.name }}</h3>
            <span class="sub-header">Chapter settings</span>
        </template>
        <template v-slot:default>
            <h3>Show products...</h3>
            <div class="filter-item-list">
                <div class="filter-item flex-list">
                    <BaseDropdownInputField innerLabel="Combinator" value="Where" :readOnly="true" />
                    <BaseDropdownInputField innerLabel="Field" value="Sub catalog" />
                    <BaseDropdownInputField innerLabel="Operator" value="Is" />
                    <BaseDropdownInputField value="Main" />
                </div>
            </div>
        </template>
    </BaseModal>
</template>

<script>
export default {
    name: 'chapterFilterModal',
    props: ['show', 'selection'],
}
</script>

<style></style>

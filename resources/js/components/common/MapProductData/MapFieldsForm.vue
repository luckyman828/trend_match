<template>
    <div class="table-wrapper map-variant-fields">
        <h3 v-html="title"></h3>
        <slot name="after"/>

        <table class="map-fields-table">
            <tr class="header">
                <th></th>
                <th><label>Kollekt product key</label></th>
                <th></th>
                <th><label>Key to map</label></th>
                <th><label>Example</label></th>
            </tr>
            <slot name="rows"/>
        </table>

        <slot name="after"/>

        <button class="dark" 
            style="margin-top: 12px"
            type=button
            @click="onAddVariantImageMap"
        >
            <i class="fas fa-plus"></i><span>Add variant image map</span>
        </button>
    </div>
</template>

<script>
export default {
    name: 'mapFieldsForm',
    props: [
        'title'
    ]
}
</script>

<style>

</style>
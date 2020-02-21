<template>
    <div v-if="item">
        <p>{{item.name}} | {{new Date}}<button class="primary" 
                @click="item.name = 'Amazing new animal!'">Set animal</button></p>
        </div>
</template>

<script>
export default {
    name: 'testComponent',
    props: [
        'item'
    ]
}
</script>

<style>

</style>
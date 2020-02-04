<template>
    <FlyIn ref="fileSingleFlyin">
        <template v-if="currentFile" v-slot:header="slotProps">
            <FlyinHeader :title="currentFile.title" @closeFlyin="slotProps.close()">
                <div class="item-group">
                    <button class="ghost editable"><i class="far fa-user shield"></i><span>File owners</span></button>
                    <button class="ghost"><span>Edit products</span></button>
                </div>
            </FlyinHeader>
        </template>
        <template v-slot>
            <p>I am the body</p>
        </template>
    </FlyIn>
</template>

<script>
export default {

}
</script>

<style>

</style>
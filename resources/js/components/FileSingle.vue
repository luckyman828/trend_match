<template>
    <div class="file-single">
        <div class="flyin-header">
            <div class="left">
                <span class="circle light-2"><i class="far fa-times"></i></span>
                <h3>{{file.title}}</h3>
            </div>
            <div class="right">

            </div>
        </div>
        <div class="body">
            <SubfilesTable :subfiles="file.subfiles"/>
        </div>
    </div>
</template>

<script>
import SubfilesTable from './SubfilesTable'

export default {
    name: 'fileSingle',
    props: [
        'file'
    ],
    components: {
        SubfilesTable,
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .file-single {
        height: 100%;
        background: $grey;
        .body {
            padding: 16px;
        }
    }
    .flyin-header {
        height: 72px;
        background: $light1;
        display: flex;
        width: 100%;
        justify-content: space-between;
        box-shadow: 0px 2px 10px #0000001A;
        .left, .right {
            display: flex;
        }
    }
</style>
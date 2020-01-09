<template>
    <div class="subfile-row">
        <tr class="subfile">
            <td class="title clickable" :style="indent">
                <i v-if="subfile.master" class="fad fa-file-certificate master"></i> 
                <i v-else class="fas fa-file light-2"></i> 
                <span :title="subfile.name">{{subfile.name}}</span>
            </td>
            <td class="items">-</td>
            <td class="in">-</td>
            <td class="out">-</td>
            <td class="nd">-</td>
            <td class="users">-</td>
            <td class="status">
                <span class="square ghost icon-right">Locked <i class="far fa-lock"></i></span>
                <span class="square ghost icon-right">Hidden <i class="far fa-eye"></i></span>
            </td>
            <td class="action">
                <span class="button invisible ghost-hover true-square" @click="toggleExpanded(subfile.id)"><i class="fas fa-ellipsis-h"></i></span>
            </td>
        </tr>
        <subfileRow v-for="subfile in subfile.children" :subfile="subfile" :key="subfile.id" :depth="depth+1"/>
    </div>
</template>

<script>
import SubfileRow from './SubfileRow'

export default {
    name: 'subfileRow',
    components: {
        'subfileRow': SubfileRow,
    },
    props: [
        'subfile',
        'depth'
    ],
    computed: {
        indent() {
            const baseIndent = 12
            const indentAmount = 20
            return {paddingLeft: `${this.depth * indentAmount + baseIndent}px` }
        }
    },
    methods: {
        toggleExpanded(id) {
            this.$emit('toggleExpanded', id)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .title {
        i {
            font-size: 20px;
            margin-right: 8px;
            width: 24px;
            font-size: 16px;
            color: $dark2;
            &.master {
                --fa-primary-color: #3b86ff;
                &::after {
                    opacity: 1;
                }
            }
        }
    }
    
</style>
<template>
    <div class="subfile-row">
        <tr class="subfile">
            <td class="expand" :class="{active: childrenExpanded}" @click="toggleExpanded" :style="indent">
                <span class="square invisible" v-if="subfile.children.length > 0">
                    <i class="fas fa-caret-down"></i>
                </span>
            </td>
            <td class="title clickable" @click="$router.push({name: 'subfile', params: {fieId: subfile.file_id, subfileId: subfile.id}})">
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
        <template v-if="childrenExpanded">
            <subfileRow v-for="subfile in subfile.children" :subfile="subfile" :key="subfile.id" :depth="depth+1"/>
        </template>
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
    data: function() { return {
        childrenExpanded: false
    }},
    computed: {
        indent() {
            const baseIndent = 48
            const indentAmount = 20
            return {maxWidth: `${this.depth * indentAmount + baseIndent}px`, minWidth: `${this.depth * indentAmount + baseIndent}px` }
        }
    },
    methods: {
        toggleExpanded() {
            this.childrenExpanded = !this.childrenExpanded
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .title {
        i {
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
    .expand {
        i {
            font-size: 16px;
            color: $dark2;
        }
        &.active {
            i {
                transform: rotate(180deg);
                color: $dark15;
            }
        }
        &:hover {
            cursor: pointer;
            i {
                color: $primary;
            }
        }
    }
    
</style>
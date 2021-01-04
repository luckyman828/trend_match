<template>
    <div class="feedback-list-item" :class="{ 'is-self': isSelf }">
        <div class="user-name">
            <i class="fas fa-user"></i>
            <span>{{ isSelf ? 'You' : action.user ? action.user.name : 'Anonymous' }}</span>
        </div>
        <span class="action" v-if="!showQty || ['None', 'Out'].includes(action.action)">{{ action.action }}</span>
        <div class="quantity pill ghost xs" v-else>
            <i class="fas fa-box"></i>
            <span>{{ totalQty }}</span>
        </div>
        <div class="action-indicator" :class="action.action" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'feedbackListItem',
    props: ['action', 'showQty'],
    computed: {
        ...mapGetters('auth', ['authUser']),
        totalQty() {
            return this.action.variants.reduce((total, variant) => {
                return total + variant.quantity
            }, 0)
        },
        isSelf() {
            return this.authUser.id == this.action.user_id
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.feedback-list-item {
    display: flex;
    align-items: center;
    .user-name {
        font-size: 12px;
        font-weight: 500;
        i {
            margin-right: 8px;
        }
    }
    &.is-self {
        .user-name {
            color: $primary;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            i {
                color: $primary;
            }
        }
    }
    .action {
        margin-left: auto;
        text-transform: uppercase;
        font-size: 11px;
        flex-shrink: 0;
    }
    .quantity {
        margin-left: auto;
        flex-shrink: 0;
        .pill i {
            margin-left: 4px;
        }
    }
    .action-indicator {
        width: 8px;
        height: 24px;
        border-radius: 8px 0 0 8px;
        margin-left: 8px;
        background: $grey500;
        flex-shrink: 0;
        &.Focus {
            background: $primary;
        }
        &.In {
            background: $green;
        }
        &.Out {
            background: $red;
        }
    }
}
</style>

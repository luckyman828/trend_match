<template>
    <div class="request-wrapper" :class="[{own: isOwn}, {master: isMaster}, 
    {'has-traits': request.focus}]">
        <div class="traits">
            <span v-if="request.focus" class="pill small primary"><i class="fas fa-star"></i> Focus</span>
        </div>
        <div class="request">
            <strong class="sender">
                {{request.selection.name}} | 
                {{request.author_id == authUser.id ? 'You' : request.author ? request.author.name : 'Anonymous'}}</strong>
            <span class="content">{{request.content}}</span>
            <small class="id">Request ID: {{request.id}}</small>
        </div>        
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AuthUser from '../store/models/AuthUser';

export default {
    name: 'request',
    props: [
        'request'
    ],
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', ['currentSelection']),
        isOwn() {
            return this.request.selection_id == this.currentSelection.id
        },
        isMaster() {
            return this.request.selection.type == 'Master'
        }
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .request-wrapper {
        margin-bottom: 4px;
        position: relative;
        transition: margin-bottom .2s;
        &.has-traits {
            margin-top: 24px;
        }
        &:hover {
            margin-bottom: 32px;
        }
    }
    .traits {
        position: absolute;
        top: -16px;
        left: -10px;
        z-index: 1;
        white-space: nowrap;
        > * {
            box-shadow: 0 3px 6px rgba(0,0,0,.2);
            &:not(:last-child) {
                margin-right: 8px;
            }
        }
    }
    .pill {
        i {
            font-size: 8px;
            margin-right: 4px;
        }
    }
    .request {
        padding: 12px;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        background: white;
        .sender {
            font-size: 12px;
        }
        .id {
            font-size: 12px;
            font-weight: 500;
        }
        .own:not(.master) & {
            background: $primary;
            color: white;
            strong {
                color: white;
            }
        }
        .master & {
            background: $yellow;
            strong {
            }
        }
        .content {
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 12px 0;
        }
    }
</style>
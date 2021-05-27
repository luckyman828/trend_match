<template>
    <div class="timing-list-item" @click="seekTo(timing.start_at_ms)">
        <div class="card" :class="{ active: isCurrent }">
            <div class="header">
                <span class="truncate ft-md ft-10">{{ variant.name }}</span>
            </div>
            <div class="body">
                <BaseImageSizer class="img-wrapper" fit="cover">
                    <BaseVariantImage :variant="variant" />
                </BaseImageSizer>
            </div>
        </div>
        <div class="timestamp flex-list center-h">
            <span class="ft-10 color-white">{{ timing.start_at_ms | timestampify }}</span>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'timingListItem',
    props: ['timing'],
    computed: {
        ...mapGetters('playPresentation', {
            currentVariant: 'getCurrentVariant',
        }),
        isCurrent() {
            return this.currentVariant && this.currentVariant.id == this.variant.id
        },
        variant() {
            return this.timing.variants[0]
        },
    },
    methods: {
        ...mapActions('player', ['seekTo']),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.timing-list-item {
    .card {
        width: 92px;
        overflow: hidden;
        .header {
            background: white;
            border-radius: $borderRadiusSm $borderRadiusSm 0 0;
            padding: 4px 6px;
        }
        .img-wrapper {
            width: 100%;
        }
        .body {
            border-radius: 0 0 $borderRadiusSm $borderRadiusSm;
            overflow: hidden;
        }
        &.active {
            .body {
                position: relative;
                border-top: none;
                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: solid 2px $primary;
                    pointer-events: none;
                }
            }
            .header {
                background: $primary;
                color: white;
            }
        }
    }
}
</style>

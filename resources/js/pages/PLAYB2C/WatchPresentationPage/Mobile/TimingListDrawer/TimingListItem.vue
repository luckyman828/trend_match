<template>
    <div class="timing-list-item" @click="seekTo(timing.start_at_ms)">
        <div class="card" :class="{ active: isCurrent }">
            <div class="header">
                <span class="truncate ft-md ft-10">{{ variant.name }}</span>
            </div>
            <div class="body">
                <BaseImageSizer class="img-wrapper" fit="contain">
                    <BaseVariantImage :variant="variant" :class="{ 'sold-out': soldOut }" />
                </BaseImageSizer>
                <div class="icon-list flex-list justify flex-end-v">
                    <div class="pill red xxs" v-if="soldOut">
                        <span>Sold out</span>
                    </div>
                    <div class="pill yellow xs" v-if="timing.variantList.length > 1">
                        <i class="far fa-layer-group"></i>
                        <span>{{ timing.variantList.length }}</span>
                    </div>
                </div>
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
            currentTiming: 'getCurrentTiming',
        }),
        isCurrent() {
            return this.currentTiming && this.currentTiming.id == this.timing.id
        },
        variant() {
            return this.timing.variant
        },
        soldOut() {
            return !this.timing.variantList.find(variant => !!variant.inStock)
        },
    },
    methods: {
        ...mapActions('player', ['seekTo']),
    },
}
</script>

<style lang="scss" scoped>
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
            position: relative;
            &::after{
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: solid 1px white;
                pointer-events: none;
            }
            .icon-list {
                position: absolute;
                bottom: 4px;
                right: 4px;
            }
        }
        &.active {
            .body {
                position: relative;
                border-top: none;
                &::after {
                    border: solid 2px $primary;
                }
            }
            .header {
                background: $primary;
                color: white;
            }
        }
    }
    img.sold-out {
        opacity: 0.5;
    }
}
</style>

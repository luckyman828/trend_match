<template>
    <div class="presentation-card flex-list flex-v min">
        <div class="img-wrapper">
            <img :src="presentation.thumbnail" />
        </div>
        <div class="details">
            <div class="name">{{ presentation.name }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'presentationCard',
    props: ['presentation'],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.presentation-card {
    overflow: hidden;
    .img-wrapper {
        overflow: hidden;
        flex: 1;
        background: $grey300;
        img {
            overflow: hidden;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .details {
        padding: 12px 16px 20px;
    }
}
</style>

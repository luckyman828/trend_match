<template>
    <div class="signoff-portrait">
        <img :src="imageUrl">
        <div class="title-list">
            <span class="name">{{name}}</span>
            <span class="title">{{title}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'signoffPortrait',
    props: [
        'imageUrl',
        'name',
        'title',
    ]
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.signoff-portrait {
    display: flex;
    align-items: center;
    margin-right: 40px;
}
img {
    border-radius: 50px;
    overflow: hidden;
    height: 64px;
    width: 64px;
    min-width: 64px;
    object-fit: cover;
    margin-right: 8px;
    border: $borderModule;
}
.title-list {
    display: flex;
    flex-direction: column;
}
.name {
    font-size: 12px;
    font-weight: 500;
}
.title {
    font-size: 12px;
    color: $fontSoft;
}
</style>
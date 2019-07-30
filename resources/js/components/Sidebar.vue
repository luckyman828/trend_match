<template>
    <div class="sidebar">
        <img src="/images/44report-logo_color@2x.png" alt="Trendmatch Insights logo in color" class="logo" height="38px">
        <ul class="navbar">
            <li><a href="#" class="active"><i class="fas fa-chart-bar"></i>Oversigt</a></li>
            <li><a href="#"><i class="fas fa-chart-line"></i>Title 2</a></li>
            <li><a href="#"><i class="fas fa-chart-line"></i>Title 2</a></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Sidebar',
}
</script>

<style lang="scss" scoped>
    @import '~@/_variables.scss';
    $paddingSide: 20px;
    .sidebar {
        background: $dark;
        width: $sidebarWidth;
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        padding: 20px $paddingSide;
        box-sizing: border-box;
    }
    .logo {
        margin-bottom: 20px;
    }
    i {
        color: $primary;
        margin-right: 8px;
        font-size: 1.2rem;
    }
    a {
        color: $light1;
    }
    ul {
        width: calc(100% + #{$paddingSide} * 2);
        padding: 0;
        margin-left: -$paddingSide;
        li {
            width: 100%;
            > a {
                text-decoration: none;
                font-weight: 500;
                display: block;
                padding: $paddingSide;
                width: 100%;
                box-sizing: border-box;
                position: relative;
                &::before {
                    content: "";
                    display: block;
                    width: 5px;
                    height: 100%;
                    left: 0;
                    top: 0;
                    position: absolute;
                }
                &.active {
                    background: $darker;
                    &::before {
                        content: "";
                        background: $primary;
                    }
                }
                &:hover {
                    background: $darker1;
                }
            }
        }
    }
</style>

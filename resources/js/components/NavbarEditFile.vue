<template>
    <div class="navbar-file flex-wrapper">

        <div class="items-left">

            <router-link :to="{name: 'files'}" class="back-link"><span class="circle primary"><i class="far fa-arrow-left"></i></span><span>Back to Files</span></router-link>
            <div class="breadcrumbs">
                <router-link class="text-link" :to="{name: 'files'}">Files</router-link>
                <span class="current"><strong>{{(currentFile != null) ? currentFile.title : 'Fetching..'}}</strong></span>
            </div>

        </div>

        <div class="items-center">
            <!-- <input type="search" class="input-wrapper"> -->
            <div class="input-wrapper small clickable" @click="openSearch">
                <i class="fas fa-search"></i>
                Search..
            </div>
        </div>

        <div class="items-right">

            <button class="button primary wide" @click="showNewProduct">Create new product</button>

        </div>

        <SearchModal ref="searchModal"/>
    </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex'
import SearchModal from './SearchModal'

export default {
    name: "navbarFile",
    components: {
        SearchModal
    },
    data: function () { return {
    }},
    computed: {
        ...mapGetters('persist', ['userPermissionLevel', 'currentFile', 'currentWorkspace']),
        productsToExport() {
            const products = this.products
            if (this.onlyWithRequests) {
                return products.filter(product => product.requests.length > 0)
            } else return products
        }
    },
    methods: {
        ...mapActions('entities/products', ['showSingle', 'setAvailableProductIds', 'instantiateNewProduct']),
        openSearch() {
            this.$refs.searchModal.toggle()
        },
        showNewProduct() {
            // Generate UUID for new product
            console.log('show new product')
            const newUUID = this.$uuid.v4()
            this.instantiateNewProduct({id: newUUID, fileId: this.currentFile.id})
            // Show single with the new ID
            this.showSingle(newUUID)
            // Set the available products to only the new id, to disable going to prev/next product.
            this.setAvailableProductIds([newUUID])
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

    .navbar-file {
        width: 100%;
        padding: 8px 60px;
        padding-right: 77px;
        display: flex;
        justify-content: space-between;
        > * {
            display: flex;
            align-items: center;
        }
    }
    .items-center {
        flex: 1;
        padding: 0 40px;
    }
    .back-link {
        padding-right: 28px;
        border-right: solid 2px $light2;
        margin-right: 28px;
        .circle {
            margin-right: 8px;
        }
    }
    .breadcrumbs {
        display: flex;
        > * {
            display: inline-flex;
            align-items: center;
        }
        > *:not(:first-child)::before {
            content: '';
            pointer-events: none;
            color: $dark1;
            margin-left: 8px;
            margin-right: 10px;
            margin-bottom: 2px;
            font-size: 10px;
            font-family: "Font Awesome 5 Pro";
            font-weight: 900;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            font-style: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1;
        }
        > *:last-child::before {
            content: '';
        }
    }

</style>

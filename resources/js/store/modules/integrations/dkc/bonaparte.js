import axios from "axios"

export default {
    namespaced: true,
    actions: {
        async fetchWebshopProductsFromFeed() {
            let products = []
            console.log('fetchy fethcy')

            await axios.get('https://integration.wakeupdata.com/Url/Fetch/3517-9391-7351-9612-5708-9122').then(async response => {
                console.log('response from feed', response)
                const xml = response.data
                xml2js = require('xml2js')
                await xml2js.parseStringPromise(xml).then(result => {
                    products = result
                    console.log('result', result)
                    console.dir('result', result)
                })
            })

            return products
        }

    }
}
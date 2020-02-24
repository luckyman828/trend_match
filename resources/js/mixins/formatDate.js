export default {
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric',
            })
        },
    },
}

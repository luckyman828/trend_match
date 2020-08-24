import { shallowMount } from '@vue/test-utils'
import UsersPage from '@pages/UsersPage/UsersPage.vue'

describe('UsersPage.vue', () => {
    it('renders h1 tag', () => {
        const wrapper = shallowMount(UsersPage)
        expect(
            wrapper
                .find('h1')
                .text()
                .equal('Users')
        )
    })
})

// window._ = require('lodash');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */
// try {
//     window.Popper = require('popper.js').default;
//     window.$ = window.jQuery = require('jquery');

//     require('bootstrap');
// } catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios')

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

let token = document.head.querySelector('meta[name="csrf-token"]')

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo'

window.Pusher = require('pusher-js')
// Pusher.logToConsole = true

// var pusher = new Pusher(process.env.MIX_PUSHER_APP_KEY, {
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     authEndpoint: '/broadcasting/auth',
//     auth: {
//         headers: {
//             // Authorization:
//             // 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFhNzZhYWRiNTM5NGNkYjM2Yjc1MzJjMmU0ZDA0YzBlZWUxZDllZDk4MWNhZjNjMmNkYzFjZWQ1MzZiMDhiNWI2MmI5Zjk2NjBiMTA5NjQzIn0.eyJhdWQiOiIyIiwianRpIjoiYWE3NmFhZGI1Mzk0Y2RiMzZiNzUzMmMyZTRkMDRjMGVlZTFkOWVkOTgxY2FmM2MyY2RjMWNlZDUzNmIwOGI1YjYyYjlmOTY2MGIxMDk2NDMiLCJpYXQiOjE1NjUyNTM0NzMsIm5iZiI6MTU2NTI1MzQ3MywiZXhwIjoxNTk2ODc1ODczLCJzdWIiOiI3NjY3OTgxMS00YTcwLTRmNjUtYjc1MS0xZTI1MzE4MWIzNjMiLCJzY29wZXMiOltdfQ.WCXHBoRnZ2qg1e6RyRBa_vNx-kOYGIrijlfxgDouP0UBpoAHGTcgV9sHFCejSev7biOt4agB9BPnNVsUyF_hhBqtQ8TWs53hgk7hb3j8j5z03w6F4pbG8gQnja21MXTLYudHFp2ke8UWQMOTfmLocONeeL2-ZuVlzt2b0AZR81dU9aU_dhWPVQqrrA5AJ7XjNBiBLh_i3WqxazZrz2By2P9YFkUTcJxNS_l9StJTEyI85jk4B73Je8XrG1gQBYVTneR64u4ye0hpPnmOvtTgTKEeR5XhX5p_b_iYjpygS-MNWM-LnoO1fS3KWhvkOa4VIVKRFFhxf4cCLIEt7AponFEjG3A7l1KYPccrAkDfRAsMWtZF_sGwXBW47-8kqb5PFgi4vzvkEG_vbX6in5tCQw3RvtToFuftn_uBSYLa6IrX0ohX6ZN-4ZfSDlUoykq62esHH1rL1Kt79uy7yp55cgYp6iJaj9LxGFlGHaGq7My9wYXbz8l_M4eISPduXLnNBG696Ox5cgYMpmi37Y9UcrSt5IIGI6sGkUQSHU_1HFBA60rPBSGa5P8bkwM-MyP-stmFtjOQ_PS9bO34-hOP0jocsYglpi9kxtD9wPiDWPYRKLoeM4FY-Un1gORkmq-rFZPb7JGJsOY3T0rLqjN_sertZN-HDAuXqqIFrWrS7dg',
//             // 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjI0YTViNWQyNWMxMzczNmFjZTRjNjI0MDFlNTRmZjE4MmY3ODEyZWYwYjliNWNmMzlkYTA0ODI4OTQ2MjA4YWNkMTQxNTg1Y2Y0NzA4OTg0In0.eyJhdWQiOiIyIiwianRpIjoiMjRhNWI1ZDI1YzEzNzM2YWNlNGM2MjQwMWU1NGZmMTgyZjc4MTJlZjBiOWI1Y2YzOWRhMDQ4Mjg5NDYyMDhhY2QxNDE1ODVjZjQ3MDg5ODQiLCJpYXQiOjE1NzAyNTkxNjMsIm5iZiI6MTU3MDI1OTE2MywiZXhwIjoxNjAxODgxNTYyLCJzdWIiOiJiMjEzMmFkYS1iN2Y5LTQxNjUtOGNmNC1iNTlhMTRjZDZhOTAiLCJzY29wZXMiOltdfQ.rqVGqvBAtQ6UTNpOLjQxzcvJz5lmuukFBUuD4mEnR4sQzUTVZxootKVYJcmA-rlo0gk76blVXTQLTp8FaMqVEDqHTGArzOOujMSWwwxUPfd-kNM1Se6rQ_eSTUr95LFKdio8iNA5diA6we5o573HmfKS18wdUrLeQlh7-iP0PEwqE1kSd65r6t6C_ZWkwTqVMGKah8hg1YTfHsHUN9wWlcorFlAZ8SwEJeWNqX7Tcjd86So0mobWXjXCyIGT7fQP6hzrIih7bYzvo8i-diFox8syxpcOzWQERQfl5bfWEgwmzZCgZUJxL6iUEn3SK5dc6kxxYQCK19aCXTg-6gWwt7KAqsl1vIjzB-Nk7lER87MTiuJgqjulFhQRxNHBZx2M92QOEMvFWWQJhrnS-kJ4CI3ilzPv56HqoKyzuqCPaXtI4R9GDxpEJ_j70GoIRS1-0yz3szE2R41KWYwVa31MaXj6MblwQLibLfKXnec1dmCuuPZZCG78dwhCt58N6ezQBzndVdeQR6oSS1eiMeph5rNiz9aT8WkV47CmRuie52nypy1QjmFrZoVcd1lGHYZ2tk5dA1LL2_VuGyF_flz0SdQ8iuWtdUrNmsqs10kCZXRgwX22tEK4wDGkbqXEx1ma0IZ0zzwAu_Kekr7jq_VS9eNS039BJeix8V6T6tbP1tg',
//             'X-CSRF-Token': token,
//             Accept: 'application/json',
//             Random: 'Value',
//         },
//     },
// })
// var channel = pusher.subscribe('private-secret')
// channel.bind('pusher:subscription_error', function(status) {
//     console.log('ERROR ERROR')
//     console.log(status)
//     // if (status == 408 || status == 503) {
//     //     // retry?
//     // }
// })
// channel.bind('pusher:subscription_succeeded', function(status) {
//     console.log('SUCCESS SUCCES')
//     console.log(status)
//     // if (status == 408 || status == 503) {
//     //     // retry?
//     // }
// })

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    forceTLS: true,
    // authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            Authorization:
                // 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFhNzZhYWRiNTM5NGNkYjM2Yjc1MzJjMmU0ZDA0YzBlZWUxZDllZDk4MWNhZjNjMmNkYzFjZWQ1MzZiMDhiNWI2MmI5Zjk2NjBiMTA5NjQzIn0.eyJhdWQiOiIyIiwianRpIjoiYWE3NmFhZGI1Mzk0Y2RiMzZiNzUzMmMyZTRkMDRjMGVlZTFkOWVkOTgxY2FmM2MyY2RjMWNlZDUzNmIwOGI1YjYyYjlmOTY2MGIxMDk2NDMiLCJpYXQiOjE1NjUyNTM0NzMsIm5iZiI6MTU2NTI1MzQ3MywiZXhwIjoxNTk2ODc1ODczLCJzdWIiOiI3NjY3OTgxMS00YTcwLTRmNjUtYjc1MS0xZTI1MzE4MWIzNjMiLCJzY29wZXMiOltdfQ.WCXHBoRnZ2qg1e6RyRBa_vNx-kOYGIrijlfxgDouP0UBpoAHGTcgV9sHFCejSev7biOt4agB9BPnNVsUyF_hhBqtQ8TWs53hgk7hb3j8j5z03w6F4pbG8gQnja21MXTLYudHFp2ke8UWQMOTfmLocONeeL2-ZuVlzt2b0AZR81dU9aU_dhWPVQqrrA5AJ7XjNBiBLh_i3WqxazZrz2By2P9YFkUTcJxNS_l9StJTEyI85jk4B73Je8XrG1gQBYVTneR64u4ye0hpPnmOvtTgTKEeR5XhX5p_b_iYjpygS-MNWM-LnoO1fS3KWhvkOa4VIVKRFFhxf4cCLIEt7AponFEjG3A7l1KYPccrAkDfRAsMWtZF_sGwXBW47-8kqb5PFgi4vzvkEG_vbX6in5tCQw3RvtToFuftn_uBSYLa6IrX0ohX6ZN-4ZfSDlUoykq62esHH1rL1Kt79uy7yp55cgYp6iJaj9LxGFlGHaGq7My9wYXbz8l_M4eISPduXLnNBG696Ox5cgYMpmi37Y9UcrSt5IIGI6sGkUQSHU_1HFBA60rPBSGa5P8bkwM-MyP-stmFtjOQ_PS9bO34-hOP0jocsYglpi9kxtD9wPiDWPYRKLoeM4FY-Un1gORkmq-rFZPb7JGJsOY3T0rLqjN_sertZN-HDAuXqqIFrWrS7dg',
                // 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQxOTEzYmVmZjc5Yzg4YzBhM2NlZTgyNDY1ZTllOGZmNmQ3MzE4MjhhYjYzYjUyNTk1ZTkzMGUwOWY5YTdkOGIzZjI2YjhjMzBjOTZiODZjIn0.eyJhdWQiOiIyIiwianRpIjoiNDE5MTNiZWZmNzljODhjMGEzY2VlODI0NjVlOWU4ZmY2ZDczMTgyOGFiNjNiNTI1OTVlOTMwZTA5ZjlhN2Q4YjNmMjZiOGMzMGM5NmI4NmMiLCJpYXQiOjE1NzEwNTM0OTYsIm5iZiI6MTU3MTA1MzQ5NiwiZXhwIjoxNjAyNjc1ODk1LCJzdWIiOiJiMjEzMmFkYS1iN2Y5LTQxNjUtOGNmNC1iNTlhMTRjZDZhOTAiLCJzY29wZXMiOltdfQ.RQZ-6KuebIcJEY86RtIPoWCVE18LHNKQq8plLeSh-B23QpWMq9aCZKCCYRQPfvKPw0Vfk0yERu4EeJjxJg71a-MaEhaTYBQgzeak-hvHJn3lsVip3LmVyxsw-agS_GdkpWOF9oZJHkjSpy3scSo5-uxYzMzctulQleZLfaftS4hkyqvkw4Aza-X1M2mN-f9Trg0ZTaSTlene_nnT_in_WdPpu0WwwSX-7eOrojMUbSC2Wff3hZ9vI7ivDu2a_1U9JouTaE9FnzVPEJftpTq75mP7RCUe4dXnnMXt2ECSo_awwMPJo1gLUQCpGH6PeR_BSKSs9hH5-i73ZgyAjvUuT3CbvONnSf6m1XbR-IH7902PVP8d7I4CULxJbbcrUxLKnOrWiyQ5J-ql6XwA98lZu5lx2WHN_maCK7LNm-C4QpHVggSkkb7driCBkkxRhTcTjDIquwsTm2x8ypW0Euk4d0AxkIRC7z1fHZByS8eFKoZ0AozOJvjcYMI990ir3HTVQecmhdHgaWJR1O9Y1LoKsqpYuZKpNk2diWokXIHVDtv8tPoNkk7EJ5fTYCScawGtDrvdkk0c-GfDcOORlG1OElaWFjxtpTgLUV7ZHTBP84Zlp2-wnxJ2g1szeq7Q2vDHqlhKgnbwtCHnhx7iEq-cWsWI6eHr9G6z66pc93NMzyA',
                'Bearer ' + process.env.MIX_CLIENT_CREDENTIAL_BEARER_TOKEN,
            'X-CSRF-Token': token,
            // user_id: window.auth_user.id,
        },
    },
})

// console.log('Bearer ' + process.env.MIX_CLIENT_CREDENTIAL_BEARER_TOKEN)
// console.log(`'Bearer ${process.env.MIX_CLIENT_CREDENTIAL_BEARER_TOKEN}'`)

// window.Echo.private(`secret`).listen('pusher:subscription_error', e => {
//     console.log('Error in secret')
//     console.log(e)
// })
// window.Echo.channel(`private-secret`).listen('pusher:subscription_error', e => {
//     console.log('Error in secret')
//     console.log(e)
// })

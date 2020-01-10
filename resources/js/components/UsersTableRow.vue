<template>
    <tr class="user-row table-row" ref="userRow">
        <td class="select"><Checkbox/></td>
        <td class="name">
            <i class="fas fa-user"></i>
            <span>{{user.name}}</span>
        </td>
        <td class="email">{{user.email}}</td>
        <td class="role">{{user.role.title}}</td>
        <td class="currency">{{user.currency}}</td>
        <td class="action">
            <button class="invisible ghost-hover primary">View</button>
            <button class="square true-square invisible ghost-hover more"><i class="far fa-ellipsis-h medium"></i></button>
        </td>
    </tr>
</template>

<script>
export default {
    name: 'usersTableRow',
    props: [
        'user',
        'index'
    ]
}
</script>

<style>

</style>
<template>
    <div class="teams-table card">

        <div class="js-table">
            <div class="row header-row">
                <!-- Header -->
                <th>Header 1</th>
                <th>Header 2</th>
                <th>Header 3</th>
                <th>Header 4</th>
            </div>
            <!-- Row -->
            <div class="team-row-wrapper" v-for="(row, index) in rows" :key="index">

                <div class="team-row row">
                    <td>{{row.title}}</td>
                    <td>{{row.value}}</td>
                    <td>{{row.something}}</td>
                    <td>{{row.name}}</td>
                </div>
                
                <div class="user-rows-wrapper">
                    <div v-if="row.anArray.length > 0" class="row user-row" v-for="(user, index) in row.anArray" :key="index">
                        <td>{{user.a}}</td>
                        <td>{{user.b}}</td>
                        <td>{{user.c}}</td>
                        <td>{{user.d}}</td>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid-table">
            <th>Title</th>
            <th>Title</th>
            <th>Title</th>
            <td>Value</td>
            <td>Value</td>
            <td>Value</td>
            <td>Value</td>
            <td>Value</td>
            <td>Value</td>
            <td>Value</td>
            <td>Value</td>
            <td>Value</td>
        </div>

    </div>

</template>

<script>

export default {
    name: 'teamsTableAlt',
    data: () => {
        return {
            rows: [
                {title: 'fisk fisk hest fugl hane frø stork ribe hylander fars grønland snaps', value: 'hest', something: 'niels', name: 'Henri', anArray: [{a: '123', b: '321', c: '544', d: '422'}, {a: '423', b: '654', c: '765', d: '567'}, {a: '423', b: '654', c: '765', d: '567'}, {a: '5567', b: '666', c: '644', d: '456'}]},
                {title: 'hest', value: 'honning', something: 'sovs', name: 'Margrethe', anArray: [{a: '423', b: '654', c: '765', d: '567'}]},
                {title: 'niels', value: 'marmelade', something: 'pipe', name: 'Gumle', anArray: []},
                {title: 'peter', value: 'ost', something: 'rensdyr', name: 'Filoni', anArray: [{a: '2725', b: '171', c: '515', d: '754'}]},
                ]
        }
    },
    methods: {
        autoSizeTable() {
            const table = document.querySelector('.js-table')
            const rows = table.querySelectorAll('.row')
            let cellWidths = []
            rows.forEach(row => {
                let cellIndex = 0
                Array.from(row.children).forEach(cell => {
                    const cellWidth = cell.scrollWidth
                    if ( cellWidths[cellIndex] != null ) {
                        if ( cellWidths[cellIndex].cellWidth < cellWidth )
                            cellWidths[cellIndex].cellWidth = cellWidth
                    } else {
                        cellWidths.push({cellIndex: cellIndex, cellWidth: cellWidth})
                    }
                    cellIndex++
                })
            })
            rows.forEach(row => {
                let cellIndex = 0
                Array.from(row.children).forEach(cell => {
                    cell.style.minWidth = cellWidths[cellIndex].cellWidth + 'px'
                    // cell.style.minWidth = 100 + 'px'
                    cellIndex++
                })
            })
            console.log(cellWidths)
        }
    },
    mounted () {
        this.autoSizeTable()
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .grid-table {
        display: grid;
        grid-template-columns: repeat(3, minmax(100px, 1fr))
    }
    .header-row {
        background: pink
    }
    td, th {
        padding: 4px 12px;
    }
    .row {
        display: flex;
        > * {
            // flex: 1;
            &:nth-child(3) {
                background: orange;
            }
        }
    }
    .team-row > td {
        background: #333;
        color: white;
        border: solid 1px #555;
        border-left: 0;
        border-right: 0;
    }
    .team-users.collapsed .user-row > td {
        max-height: 0 !important;
    }
    .user-row {
        > td {
            background: #ccc;
            border: solid 1px #eee;
            border-left: 0;
            border-right: 0;
            // display: flex;
            // align-items: center;

            overflow: hidden;
            max-height: 82px;
            height: 82px;
            transition: 1.3s;
        }
    }
</style>

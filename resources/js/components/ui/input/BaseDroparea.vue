<template>
    <div
        class="drop-area"
        :class="{ 'drag-active': dragActive }"
        @click.self="activate"
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @drop="dragDrop"
    >
        <input type="file" ref="fileInput" :accept="accept" :multiple="multiple" @input="onInput" />
        <div class="body">
            <slot :activate="activate">
                <span class="placeholder" @click="activate">Drag files here or click to browse</span>
            </slot>
        </div>
        <div class="drag-display">
            <slot name="dragDisplay">
                <span>Drop files here</span>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'droparea',
    props: ['multiple', 'accept'],
    data: function() {
        return {
            dragActive: false,
            dragCounter: 0,
        }
    },
    methods: {
        activate() {
            this.$refs.fileInput.click()
        },
        dragEnter() {
            this.dragActive = true
            this.dragCounter++
        },
        dragLeave() {
            this.dragCounter--
            if (this.dragCounter == 0) {
                this.dragActive = false
            }
        },
        dragDrop() {
            this.dragActive = false
            this.dragCounter = 0
        },
        onInput(e) {
            // Emit the new files
            const files = e.target.files
            this.$emit('input', this.multiple ? files : files[0])
            // Reset the file input, to allow adding the same file multiple times
            e.target.value = ''
        },
        // reset() {
        //     this.$refs.fileInput
        // }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.drop-area {
    // outline: 2px dashed $light2;
    // outline-offset: -10px;
    border: 2px dashed $divider;
    background: white;
    padding: 20px 16px 24px;
    min-height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    input[type='file'] {
        opacity: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
    }
    .body {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .drag-display {
        display: none;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        justify-content: center;
        align-items: center;
        z-index: 1;
        background: white;
        flex-direction: column;
    }
    &.drag-active {
        input[type='file'] {
            z-index: 2;
        }
        .drag-display {
            display: flex;
        }
    }
}
.placeholder {
    color: $font;
    // pointer-events: none;
}
</style>

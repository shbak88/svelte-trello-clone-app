<script>
    import { tick } from 'svelte';
    import { lists } from '~/store/list.js';
    import { autoFocusout } from '~/actions/autoFocusout';

    let isEditMode = false;
    let title = '';
    let textAreaEl;

    function addList() {
        if (title.trim()) {
            lists.add({
                title,
            });
        }
        offEditMode();
    }

    async function onEditMode() {
        isEditMode = true;
        await tick();
        textAreaEl && textAreaEl.focus();
    }

    function offEditMode() {
        isEditMode = false;
        title = '';
    }

</script>

<div class="create-list">
    {#if isEditMode}
        <div use:autoFocusout={offEditMode}
            class="edit-mode">
            <textarea
                bind:value={title}
                bind:this={textAreaEl}
                placeholder="Enter a title for this list..."
                on:keydown={(e) => {
                    e.key === 'Enter' && addList();
                    e.key === 'Escape' && offEditMode();
                    e.key === 'Esc' && offEditMode();
                }}></textarea>
                <div class="actions">
                    <div class="btn success"
                        on:click={addList}>Add List</div>
                    <div class="btn"
                        on:click={offEditMode}>Cancel</div>
                </div>
        </div>
        {:else}
        <div class="add-another-list"
            on:click={onEditMode}>
            + Add another list
        </div>
    {/if}
    
</div>

<style lang="scss">
    .create-list {
        white-space: normal;
        font-size: 16px;
        display: inline-block;
        width: 290px;
        padding: 10px 8px;
        vertical-align: top;
        background-color: rgba(#ebecf0, .6);
        border-radius: 4px;
        margin: 0 4px;
        line-height: 20px;
        cursor: pointer;
        transition: .2;

        &:hover {
            background: #ebecf0;
        }
    }
    
</style>
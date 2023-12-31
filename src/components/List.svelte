<script>
    import { onMount } from 'svelte';
    import Sortable from 'sortablejs';
    import { cards } from '~/store/list';

    import CreateCard from '~/components/CreateCard.svelte'
    import ListTitle from '~/components/ListTitle.svelte'
    import Card from '~/components/Card.svelte'

    export let list;
    export let sortableLists;

    let cardsEl;
    let sortableCards;

    function disableSortable(event) {
        sortableLists.option('disabled', event.detail);
        sortableCards.option('disabled', event.detail);
    }

    onMount(() => {
        // for Lists
        sortableCards = new Sortable(cardsEl, {
            group: 'My cards', // 한 목록에서 다른 목록으로 요소를 끌어오려면
            handle: '.card', // 드래그 핸들이 될 요소의 선택자를 입력합니다.
            delay: 50, // 클릭이 밀리는 것을 방지하기 위해 약간의 지연 시간을 추가합니다.
            animation: 0, // 정렬할 때 애니메이션 속도(ms)를 지정합니다.
            forceFallback: true, // 다양한 환경의 일관된 Drag&Drop을 위해
            // 요소의 DnD가 종료되면 실행할 핸들러(함수)를 지정합니다.
            onEnd(e) { // event 객체의 정렬에 대한 다양한 정보가 들어있습니다.
                console.log(e);
                cards.reorder({
                    fromListId: e.from.dataset.listId,
                    toListId: e.to.dataset.listId,
                    oldIndex: e.oldIndex,
                    newIndex: e.newIndex,
                });
            }

        });
    });

</script>

<div class="list">
    <div class="list__inner">
        <div class="list__heading">
            <ListTitle
                {list}
                on:editMode={disableSortable}
            />
            <p>{list.cards.length} cards</p>
        </div>
        <div
            data-list-id={list.id}
            bind:this={cardsEl}
            class="list__cards">
            {#each list.cards as card (card.id)}
                <Card
                    {card}
                    listId={list.id}
                    on:editMode={disableSortable}
                />
            {/each}
        </div>
        <CreateCard
            listId={list.id}
            on:editMode={disableSortable}
        />
    </div>
</div>

<style lang="scss">
    .list {
        word-break: break-all;
        display: inline-block;
        font-size: 16px;
        white-space: normal;
        width: 290px;
        height: 100%;
        box-sizing: border-box;
        margin: 0 4px;
        line-height: 20px;
        :global(&.sortable-ghost) {
            opacity: .2;
            position: relative;
            &::after {
                content: "";
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: #000;
                border-radius: 4px;
            }
        }
        :global(&.sortable-chosen) {
            cursor: move;
        }
        .list__inner {
            display: flex;
            flex-direction: column;
            max-height: 10px 8px;
            box-sizing: border-box;
            background: #ebecf0;
            border-radius: 4px;
            .list__heading {
                margin-bottom: 10px;
                p {
                    color: #5e6c84;
                    padding: 0 8px;
                }
            }
            .list__cards {
                overflow-x: hidden;
                overflow-y: auto;
                margin-bottom: 10px;
            }
        }
    }
</style>
export function autoFocusout(el, focustoutListener) {

    const focusinListener = e => {
        // 이벤트 버블링 방지
        e.stopPropagation();
    };

    setTimeout(() => {
        el.addEventListener('click', focusinListener);
        window.addEventListener('click', focustoutListener);
    });

    return {
        destroy() {
            el.removeEventListener('click', focusinListener);
            window.removeEventListener('click', focustoutListener);
        }
    }

}


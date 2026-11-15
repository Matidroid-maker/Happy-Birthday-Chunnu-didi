/* =====================================================
   PAGE 5 — SCRAPBOOK PAGE TURNING
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const coverScene = document.getElementById("scrapbookCoverScene");
    const cover = document.getElementById("scrapbookOpen");
    const inside = document.getElementById("scrapbookInside");

    const previous = document.getElementById("scrapPrev");
    const next = document.getElementById("scrapNext");

    const spreads = Array.from(
        document.querySelectorAll(".scrapbook-spread")
    );

    const pageCount = document.getElementById("scrapPageCount");

    if (
        !coverScene ||
        !cover ||
        !inside ||
        !previous ||
        !next ||
        !pageCount ||
        spreads.length === 0
    ) return;

    let currentSpread = 0;
    let isOpen = false;

    function showSpread() {

        spreads.forEach((spread, index) => {
            spread.classList.toggle(
                "active",
                index === currentSpread
            );
        });

        pageCount.textContent =
            `${currentSpread + 1} / ${spreads.length}`;

    }

    function openBook() {

        if (isOpen) return;

        isOpen = true;
        currentSpread = 0;

        coverScene.style.display = "none";
        inside.classList.add("open");

        showSpread();

    }

    function closeBook() {

        isOpen = false;
        currentSpread = 0;

        inside.classList.remove("open");
        coverScene.style.display = "flex";

        showSpread();

        cover.focus({ preventScroll: true });

    }

    function turnForward() {

        if (!isOpen) return;

        if (currentSpread < spreads.length - 1) {

            currentSpread++;
            showSpread();

        } else {

            // Clicking the right side of the last spread closes the book.
            closeBook();

        }

    }

    function turnBackward() {

        if (!isOpen) return;

        if (currentSpread > 0) {

            currentSpread--;
            showSpread();

        } else {

            // Clicking the left side of the first spread returns to the cover.
            closeBook();

        }

    }

    cover.addEventListener("click", openBook);

    cover.addEventListener("keydown", event => {

        if (event.key === "Enter" || event.key === " ") {

            event.preventDefault();
            openBook();

        }

    });

    previous.addEventListener("click", turnBackward);
    next.addEventListener("click", turnForward);

    showSpread();

});
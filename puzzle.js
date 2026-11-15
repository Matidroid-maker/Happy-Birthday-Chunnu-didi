
/* =========================================
   PAGE 4 — 16 PIECE PHOTO PUZZLE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const board = document.getElementById("puzzleBoard");
    const tray = document.getElementById("puzzlePieces");
    const complete = document.getElementById("puzzleComplete");

    if (!board || !tray) return;

    const TOTAL = 16;
    const SIZE = 4;

    let draggedPiece = null;

    // Create 16 empty puzzle positions.
    for (let i = 0; i < TOTAL; i++) {
        const slot = document.createElement("div");

        slot.className = "puzzle-slot";
        slot.dataset.index = i;

        board.appendChild(slot);
    }

    // Shuffle the pieces.
    const order = Array.from(
        { length: TOTAL },
        (_, index) => index
    );

    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [order[i], order[j]] = [order[j], order[i]];
    }

    // Create blank pieces. No numbers or text.
    order.forEach(index => {

        const piece = document.createElement("div");

        piece.className = "puzzle-piece";
        piece.dataset.index = index;
        piece.draggable = true;
        piece.setAttribute("aria-label", "Puzzle piece");

        // Use the original photo for every puzzle piece
piece.style.backgroundImage =
    "url('Photos/page 4/Puzzle.jpg')";

// Divide the image into a 4 x 4 grid
piece.style.backgroundSize = "400% 400%";
piece.style.backgroundRepeat = "no-repeat";

// Find this piece's original row and column
const row = Math.floor(index / 4);
const col = index % 4;

// Show only the correct section of the original photograph
piece.style.backgroundPosition =
    `${(col / 3) * 100}% ${(row / 3) * 100}%`;

        const rotation = Math.random() * 16 - 8;
        piece.style.transform = `rotate(${rotation}deg)`;

        tray.appendChild(piece);

        piece.addEventListener("dragstart", event => {

            draggedPiece = piece;

            event.dataTransfer.setData(
                "text/plain",
                index.toString()
            );

            event.dataTransfer.effectAllowed = "move";

            piece.classList.add("dragging");

        });

        piece.addEventListener("dragend", () => {

            piece.classList.remove("dragging");
            draggedPiece = null;

        });

    });

    // Allow pieces to be dropped onto the board.
    board.querySelectorAll(".puzzle-slot").forEach(slot => {

        slot.addEventListener("dragover", event => {
            event.preventDefault();
        });

        slot.addEventListener("drop", event => {

            event.preventDefault();

            if (!draggedPiece) return;

            const pieceIndex =
                Number(draggedPiece.dataset.index);

            const slotIndex =
                Number(slot.dataset.index);

            // A piece must go into its matching position.
            if (pieceIndex !== slotIndex) return;

            if (slot.children.length > 0) return;

            slot.appendChild(draggedPiece);

            slot.classList.add("correct");

            draggedPiece.draggable = false;
            draggedPiece.style.transform = "none";
            draggedPiece.style.cursor = "default";

            checkCompletion();

        });

    });

    function checkCompletion() {

        const placed = board.querySelectorAll(
            ".puzzle-slot .puzzle-piece"
        ).length;

        if (placed === TOTAL && complete) {
            complete.classList.add("show");
        }

    }

});

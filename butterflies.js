
/* =========================================
   PAGE 4 — EIGHT INTERACTIVE BUTTERFLIES
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const layer = document.getElementById("butterflyLayer");
    const popup = document.getElementById("butterflyPopup");
    const message = document.getElementById("butterflyMessage");
    const close = document.getElementById("butterflyClose");

    // Do nothing if the Page 4 butterfly elements aren't present.
    if (!layer || !popup || !message || !close) return;

    
const messages = [
    "Thank you for braiding my hair into cool styles. 🥹",
    "Thank you for teaching me makeup — LOL, I used to copy you mostly! 💄",
    "You are Nikki. ❤️",
    "Chunnu <3",
    "Radha Raman ki pyari. 🌸",
    "Hum sab ki pyari. ❤️",
    "Sare cheezy hai messages 😂",
    "I wish I could ever measure up to your expectations, Didi. Happy birthday. I love you. (Shayad jhooth lage, because I fight a lot. ❤️)"
];


    const butterflies = layer.querySelectorAll(".butterfly");

    butterflies.forEach(butterfly => {

        butterfly.addEventListener("click", () => {

            const index =
                Number(butterfly.dataset.message) - 1;

            if (index < 0 || index >= messages.length) return;

            message.textContent = messages[index];

            popup.classList.add("show");

        });

    });

    function closePopup() {
        popup.classList.remove("show");
    }

    close.addEventListener("click", closePopup);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closePopup();
        }
    });

});

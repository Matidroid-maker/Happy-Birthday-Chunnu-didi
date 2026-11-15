
/* ==========================================================
   SAM'S BIRTHDAY SURPRISE

   1. Opening curtains
   2. Age dial: 00 to 31
   3. Final flick: 31 to 32
   4. Blossom celebration
   5. Endless curved hanging photo loop
========================================================== */


/* ==========================================================
   ELEMENTS
========================================================== */

const curtains = document.getElementById("curtains");
const openButton = document.getElementById("openButton");

const ageDisplay = document.getElementById("ageDisplay");
const ageButton = document.getElementById("ageButton");
const clickHint = document.getElementById("clickHint");
const scrollHint = document.getElementById("scrollHint");
const blossomLayer = document.getElementById("blossomLayer");

const memoriesSection = document.getElementById("memoriesSection");
const memoryRibbon = document.getElementById("memoryRibbon");

let openingStarted = false;
let celebrationStarted = false;


/* ==========================================================
   SCREEN 1 — OPENING CURTAINS
========================================================== */

if (curtains && openButton) {

    openButton.addEventListener("click", () => {

        if (openingStarted) return;

        openingStarted = true;

        window.scrollTo(0, 0);

        curtains.classList.add("open");

        setTimeout(() => {

            curtains.classList.add("gone");

            startAgeCount();

        }, 2000);

    });

}


/* ==========================================================
   SCREEN 2 — ORIGINAL MECHANICAL AGE DIAL
========================================================== */

const COUNT_DURATION = 2900;
const FINAL_FLICK_DURATION = 1800;
const FLICK_INTERVAL = 450;
const FINAL_HOLD_DURATION = 750;


function createDial() {

    if (!ageDisplay) return;

    ageDisplay.innerHTML = "";

    for (let digit = 0; digit < 2; digit++) {

        const wheel = document.createElement("div");
        wheel.className = "age-wheel";

        const track = document.createElement("div");
        track.className = "age-wheel-track";

        for (let i = 0; i < 100; i++) {

            const number = document.createElement("span");

            number.textContent = i % 10;

            track.appendChild(number);
        }

        wheel.appendChild(track);
        ageDisplay.appendChild(wheel);
    }

}


function positionWheel(track, value, smooth = false) {

    if (!track || !track.children.length) return;

    const rowHeight =
        track.children[0].getBoundingClientRect().height;

    if (!rowHeight) return;

    const centreIndex = 20 + value;

    const offset = (centreIndex - 1) * rowHeight;

    track.style.transition = smooth
        ? "transform 0.4s cubic-bezier(.22,.61,.36,1)"
        : "none";

    track.style.transform =
        `translate3d(0, -${offset}px, 0)`;

    Array.from(track.children).forEach((digit, index) => {

        digit.classList.toggle(
            "active-digit",
            index === centreIndex
        );

    });

}


function moveDial(age) {

    if (!ageDisplay) return;

    const tracks =
        ageDisplay.querySelectorAll(".age-wheel-track");

    if (tracks.length !== 2) return;

    const wholeAge = Math.floor(age);

    const tens = Math.floor(wholeAge / 10);
    const units = wholeAge % 10;

    positionWheel(tracks[0], tens);
    positionWheel(tracks[1], units);

}


function startAgeCount() {

    if (!ageDisplay || !ageButton) return;

    const startTime = performance.now();

    function animate(now) {

        const elapsed = now - startTime;

        const progress = Math.min(
            elapsed / COUNT_DURATION,
            1
        );

        const currentAge = progress * 31;

        moveDial(currentAge);

        if (progress < 1) {

            requestAnimationFrame(animate);

        } else {

            const tracks =
                ageDisplay.querySelectorAll(".age-wheel-track");

            positionWheel(tracks[0], 3);
            positionWheel(tracks[1], 1);

            startFinalFlick();

        }

    }

    requestAnimationFrame(animate);

}


/* ==========================================================
   FINAL FLICK — 31 TO 32
========================================================== */

function startFinalFlick() {

    const tracks =
        ageDisplay.querySelectorAll(".age-wheel-track");

    if (tracks.length !== 2) return;

    const tensTrack = tracks[0];
    const unitsTrack = tracks[1];

    positionWheel(tensTrack, 3);
    positionWheel(unitsTrack, 1);

    const startTime = performance.now();

    let previousValue = 1;

    function flick(now) {

        const elapsed = now - startTime;

        if (elapsed < FINAL_FLICK_DURATION) {

            const value =
                Math.floor(elapsed / FLICK_INTERVAL) % 2 === 0
                    ? 1
                    : 2;

            if (value !== previousValue) {

                previousValue = value;

                positionWheel(unitsTrack, value, true);

            }

            requestAnimationFrame(flick);

        } else {

            positionWheel(tensTrack, 3);
            positionWheel(unitsTrack, 2, true);

            setTimeout(
                enableBirthdayClick,
                FINAL_HOLD_DURATION
            );

        }

    }

    requestAnimationFrame(flick);

}


function enableBirthdayClick() {

    if (!ageButton) return;

    const tracks =
        ageDisplay.querySelectorAll(".age-wheel-track");

    positionWheel(tracks[0], 3);
    positionWheel(tracks[1], 2, true);

    ageButton.disabled = false;

    ageButton.classList.add("ready");

    if (clickHint) {

        clickHint.textContent =
            "A little wish is waiting for you ♡";

    }

}


/* Initialise dial at 00. */

createDial();

window.addEventListener("load", () => {

    requestAnimationFrame(() => {
        moveDial(0);
    });

});


/* ==========================================================
   SCREEN 2 — BLOSSOM CELEBRATION
========================================================== */

function createBlossoms() {

    if (!blossomLayer) return;

    if (blossomLayer.children.length > 0) return;

    const colours = [
        "#fff1fa",
        "#ffd0eb",
        "#f3b1dc",
        "#e4c2ff",
        "#d8a5f5"
    ];

    for (let i = 0; i < 65; i++) {

        const petal = document.createElement("div");

        petal.className = "blossom";

        petal.style.left =
            Math.random() * 100 + "%";

        petal.style.animationDelay =
            Math.random() * 5 + "s";

        petal.style.animationDuration =
            (7 + Math.random() * 7) + "s";

        petal.style.setProperty(
            "--drift",
            (Math.random() * 180 - 90) + "px"
        );

        petal.style.background =
            `linear-gradient(135deg, #fff8fc, ${colours[i % colours.length]})`;

        blossomLayer.appendChild(petal);

    }

}


function celebrateBirthday() {

    if (celebrationStarted) return;

    celebrationStarted = true;

    ageButton.classList.add("celebrated");

    if (clickHint) {

        clickHint.textContent =
            "A beautiful new chapter begins ♡";

    }

    createBlossoms();

    if (scrollHint) {
        scrollHint.classList.add("visible");
    }

    document.body.classList.add("memories-unlocked");

}


if (ageButton) {

    ageButton.addEventListener("click", () => {

        if (!ageButton.classList.contains("ready")) return;

        celebrateBirthday();

    });

}


/* ==========================================================
   SCREEN 3 — ENDLESS HANGING PHOTO LOOP
========================================================== */

if (memoriesSection && memoryRibbon) {

    const photos = Array.from(
        memoryRibbon.querySelectorAll(".memory-photo")
    );

    const photoContainer =
        memoryRibbon.querySelector(".memory-photos");

    const svgNamespace = "http://www.w3.org/2000/svg";

    let pathLength = 0;
    let travelled = 0;
    let lastFrame = 0;
    let animationFrame = null;
    let isVisible = false;
    let isPageVisible = !document.hidden;

    // Move the photos directly onto the animation surface.
    if (photoContainer) {

        photos.forEach(photo => {
            memoryRibbon.appendChild(photo);
        });

        photoContainer.remove();

    }

    // Create the visible curved rope.
    const svg = document.createElementNS(
        svgNamespace,
        "svg"
    );

    svg.classList.add("memory-rope");
    svg.setAttribute("viewBox", "0 0 1000 700");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");

    const ropePath = document.createElementNS(
        svgNamespace,
        "path"
    );

    ropePath.classList.add("memory-rope-path");

    svg.appendChild(ropePath);

    memoryRibbon.insertBefore(
        svg,
        memoryRibbon.firstChild
    );


    function buildRopePath() {

        const width = memoriesSection.clientWidth;
        const height = memoriesSection.clientHeight;

        if (!width || !height) return;

        const x = value => (value / width) * 1000;
        const y = value => (value / height) * 700;

        const path = [

            `M ${x(width * 0.43)} ${y(height * 0.34)}`,

            `C ${x(width * 0.45)} ${y(height * 0.13)}, ${x(width * 0.58)} ${y(height * 0.07)}, ${x(width * 0.70)} ${y(height * 0.17)}`,

            `C ${x(width * 0.82)} ${y(height * 0.27)}, ${x(width * 0.91)} ${y(height * 0.07)}, ${x(width * 0.99)} ${y(height * 0.20)}`,

            `C ${x(width * 1.08)} ${y(height * 0.34)}, ${x(width * 1.02)} ${y(height * 0.56)}, ${x(width * 0.91)} ${y(height * 0.67)}`,

            `C ${x(width * 0.79)} ${y(height * 0.80)}, ${x(width * 0.66)} ${y(height * 0.67)}, ${x(width * 0.58)} ${y(height * 0.78)}`,

            `C ${x(width * 0.49)} ${y(height * 0.91)}, ${x(width * 0.36)} ${y(height * 0.78)}, ${x(width * 0.37)} ${y(height * 0.61)}`,

            `C ${x(width * 0.37)} ${y(height * 0.49)}, ${x(width * 0.41)} ${y(height * 0.40)}, ${x(width * 0.43)} ${y(height * 0.34)}`,

            "Z"

        ].join(" ");

        ropePath.setAttribute("d", path);

        pathLength = ropePath.getTotalLength();

    }


    function getPointAtDistance(distance) {

        const safeDistance =
            ((distance % pathLength) + pathLength) % pathLength;

        return ropePath.getPointAtLength(safeDistance);

    }


    function positionPhotos() {

        if (!pathLength || !photos.length) return;

        const spacing = pathLength / photos.length;

        photos.forEach((photo, index) => {

            const distance =
                index * spacing + travelled;

            const point =
                getPointAtDistance(distance);

            const nextPoint =
                getPointAtDistance(distance + 2);

            const angle = Math.atan2(
                nextPoint.y - point.y,
                nextPoint.x - point.x
            ) * (180 / Math.PI);

            const screenX =
                (point.x / 1000) * memoriesSection.clientWidth;

            const screenY =
                (point.y / 700) * memoriesSection.clientHeight;

            const gentleTilt =
                Math.sin(index * 1.7) * 4;

            const hangingAngle = Math.max(
                -13,
                Math.min(13, angle * 0.35 + gentleTilt)
            );

            photo.style.left = `${screenX}px`;
            photo.style.top = `${screenY}px`;

            photo.style.transform =
                `translate(-50%, 0) rotate(${hangingAngle}deg)`;

        });

    }


    function animate(timestamp) {

        if (!isVisible || !isPageVisible) {

            animationFrame = null;
            lastFrame = 0;

            return;

        }

        if (!lastFrame) lastFrame = timestamp;

        const delta = Math.min(
            timestamp - lastFrame,
            40
        );

        lastFrame = timestamp;

        // Constant speed keeps the loop moving continuously.
        travelled += (15 * delta) / 1000;

        if (pathLength) {
            travelled %= pathLength;
        }

        positionPhotos();

        animationFrame =
            window.requestAnimationFrame(animate);

    }


    function startAnimation() {

        if (
            animationFrame !== null ||
            !isVisible ||
            !isPageVisible
        ) {
            return;
        }

        lastFrame = 0;

        animationFrame =
            window.requestAnimationFrame(animate);

    }


    function stopAnimation() {

        if (animationFrame !== null) {

            window.cancelAnimationFrame(animationFrame);

            animationFrame = null;

        }

        lastFrame = 0;

    }


    function refreshLoop() {

        buildRopePath();

        travelled = 0;

        positionPhotos();

    }


    refreshLoop();


    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                isVisible = entry.isIntersecting;

                if (isVisible) {
                    startAnimation();
                } else {
                    stopAnimation();
                }

            });

        },
        { threshold: 0.05 }
    );

    observer.observe(memoriesSection);


    document.addEventListener(
        "visibilitychange",
        () => {

            isPageVisible = !document.hidden;

            if (isPageVisible) {
                startAnimation();
            } else {
                stopAnimation();
            }

        }
    );


    window.addEventListener("resize", refreshLoop);

}

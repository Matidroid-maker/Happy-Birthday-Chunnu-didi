
(() => {
    "use strict";

    // MOM'S PHOTOS — we'll add these later
    const MOM_AVATAR = "Photos/page 7/mom.png";
const MOM_PHOTO = "Photos/page 7/mom.png";

    // SOUND FILES — we'll add these later
    const SOUNDS = {
        phoneEntrance: "",
        conversationOpen: "",
        typing: "",
        send: "",
        reveal: ""
    };

    const MESSAGES = [
        {
            text: "Happy Birthday mere bache! khoob khush raho",
            gap: 1000,
            dots: 1900,
            hold: 750,
            plan: [
                { t: "Happy Birthday" },
                { p: 420 },
                { t: " mere bache!" },
                { p: 480 },
                { t: " khoob" },
                { p: 560 },
                { t: " khush raho" }
            ]
        },
        {
            text: "We all love you and see you winning and happy everyday.",
            gap: 1100,
            dots: 1400,
            hold: 650,
            plan: [
                { t: "We all love you and see you wining" },
                { p: 900 },
                { b: 4 },
                { p: 500 },
                { t: "nning and happy everyday." }
            ]
        },
        {
            text: "Humari pari, Radha rani kripa kre, babaji ki blessings bani rahe, jai mata di!!",
            gap: 1300,
            dots: 1700,
            hold: 850,
            plan: [
                { t: "Humari pari," },
                { p: 460 },
                { t: " Radha rani kripa kre," },
                { p: 520 },
                { t: " babaji ki blesings" },
                { p: 700 },
                { b: 4 },
                { p: 350 },
                { t: "sings bani rahe," },
                { p: 640 },
                { t: " jai mata di!!" }
            ]
        },
        {
            text: "we love you, we miss you!",
            gap: 1600,
            dots: 1400,
            hold: 1200,
            speed: 1.18,
            plan: [
                { t: "we love you," },
                { p: 900 },
                { t: " we miss you!" }
            ]
        }
    ];

    MESSAGES.forEach(m => {
        let s = "";
        m.plan.forEach(step => {
            if (step.t) s += step.t;
            if (step.b) s = s.slice(0, -step.b);
        });
        if (s !== m.text) console.warn("Typing plan does not match text:", JSON.stringify(s), "vs", JSON.stringify(m.text));
    });

    const page = document.getElementById("phonePage");
    if (!page) {
        console.error("Page 7 not found.");
        return;
    }

    const get = id => document.getElementById(id);

    const rig = get("ppRig");
    const screen = get("ppScreen");
    const row = get("ppRow");
    const touch = get("ppTouch");
    const thread = get("ppThread");
    const inner = get("ppThreadInner");
    const reveal = get("ppReveal");
    const replay = get("ppReplay");
    const ambient = get("ppAmbient");

    if (!rig || !screen || !row || !touch ||
        !thread || !inner || !reveal || !replay) {
        console.error("Some Page 7 HTML elements are missing.");
        return;
    }

    // Apply photos when we add them
    function applyPhoto(slot, src) {
        const img = slot.querySelector("img");
        if (!img || !src) return;

        img.onload = () => {
            slot.classList.add("has-image");
            img.hidden = false;
        };

        img.src = src;
    }

    page.querySelectorAll("[data-pp-avatar]").forEach(slot => {
        applyPhoto(slot, MOM_AVATAR || MOM_PHOTO);
    });

    page.querySelectorAll("[data-pp-photo]").forEach(slot => {
        applyPhoto(slot, MOM_PHOTO);
    });

    // Optional sound support
    const sounds = {};

    Object.entries(SOUNDS).forEach(([name, path]) => {
        if (path) {
            sounds[name] = new Audio(path);
            sounds[name].volume = 0.45;
        }
    });

    function sound(name) {
        const audio = sounds[name];
        if (!audio) return;

        audio.currentTime = 0;
        audio.play().catch(() => {});
    }

    // Fit the phone to the available screen
    function fitPhone() {
        const scale = Math.min(
            (page.clientHeight - 104) / 876,
            (page.clientWidth - 20) / 417,
            1.15
        );

        page.style.setProperty(
            "--pp-fit",
            Math.max(0.3, scale).toFixed(3)
        );
    }

    window.addEventListener("resize", fitPhone);
    fitPhone();

    // Cinematic camera movement
    function camera(transform, duration = 2000) {
        rig.style.transition =
            `transform ${duration}ms cubic-bezier(.16,1,.3,1), opacity ${duration}ms ease, filter ${duration}ms ease`;

        rig.style.transform = transform;
        rig.style.opacity = "1";
        rig.style.filter = "blur(0)";
    }

    // Wait helper
    const wait = ms =>
        new Promise(resolve => setTimeout(resolve, ms));

    // Create a message bubble
    let lastBubble = null;

    function makeBubble(extra = "") {
        const bubble = document.createElement("div");

        bubble.className =
            "pp-bubble has-tail is-dots " + extra;

        bubble.innerHTML =
            '<span class="pp-dots"><i></i><i></i><i></i></span>' +
            '<span class="pp-text"><span class="pp-chars"></span><i class="pp-caret"></i></span>';

        if (lastBubble) {
            lastBubble.classList.remove("has-tail");
        }

        inner.appendChild(bubble);
        lastBubble = bubble;

        thread.scrollTop = thread.scrollHeight;

        return bubble;
    }

    // Natural typing speed
    function typingDelay(character, speed = 1) {
        let delay = 65 + Math.random() * 65;

        if (character === " ") delay += 25;
        if (",.!?".includes(character)) delay += 130;
        if (Math.random() < 0.04) delay += 250;

        return delay * speed;
    }

    // Type, pause, backspace and correct
    async function typeMessage(bubble, message) {
        const chars = bubble.querySelector(".pp-chars");
        const caret = bubble.querySelector(".pp-caret");

        let written = "";

        for (const step of message.plan) {
            if (step.p) {
                await wait(step.p);
            }

            if (step.t) {
                for (const character of step.t) {
                    written += character;
                    chars.textContent = written;

                    caret.classList.add("is-active");
                    sound("typing");

                    thread.scrollTop = thread.scrollHeight;

                    await wait(
                        typingDelay(character, message.speed || 1)
                    );

                    caret.classList.remove("is-active");
                }
            }

            if (step.b) {
                for (let i = 0; i < step.b; i++) {
                    written = written.slice(0, -1);
                    chars.textContent = written;

                    caret.classList.add("is-active");
                    sound("typing");

                    await wait(i < 2 ? 150 : 65);

                    caret.classList.remove("is-active");
                }
            }
        }

        // Ensure the final sent message is exact
        chars.textContent = message.text;
    }

    // Final photo bubble
    async function showPhoto() {
        const bubble = makeBubble("pp-photo-bubble");

        await wait(1800);

        bubble.classList.remove("is-dots", "has-tail");
        bubble.innerHTML = `
            <div class="pp-photo" data-pp-photo>
                <div class="pp-photo-fallback">
                    <span>Mom's photo<br>goes here</span>
                    <small>Photo placeholder</small>
                </div>
                <img alt="Mom" hidden>
            </div>
        `;

        applyPhoto(
            bubble.querySelector("[data-pp-photo]"),
            MOM_PHOTO
        );

        sound("send");
        thread.scrollTop = thread.scrollHeight;
    }

    // Reset the film
    function resetFilm() {
        page.classList.remove("is-lit", "is-warm");
        screen.classList.remove("is-open", "is-awake");

        row.classList.remove("is-pressed");
        touch.classList.remove("is-on");

        reveal.classList.remove("is-on");
        reveal.setAttribute("aria-hidden", "true");

        replay.classList.remove("is-visible");

        inner.querySelectorAll(".pp-bubble").forEach(b => b.remove());

        lastBubble = null;
        thread.scrollTop = 0;

        rig.style.transition = "none";
        rig.style.opacity = "0";
        rig.style.filter = "blur(12px)";
        rig.style.transform =
            "perspective(1800px) translate3d(0,60px,0) rotateX(10deg) rotateY(-16deg) scale(.86)";

        void rig.offsetWidth;
    }

    // The complete film
    async function playFilm() {
        resetFilm();

        sound("phoneEntrance");

        await wait(300);
        camera(
            "perspective(1800px) translate3d(0,0,0) rotateX(2deg) rotateY(-7deg) scale(1)",
            2800
        );

        await wait(1900);

        page.classList.add("is-lit");
        screen.classList.add("is-awake");

        await wait(2300);

        row.classList.add("is-pressed");
        touch.classList.add("is-on");

        await wait(500);

        sound("conversationOpen");
        screen.classList.add("is-open");

        camera(
            "perspective(1800px) translate3d(0,0,0) rotateX(1deg) rotateY(-3deg) scale(1.03)",
            1800
        );

        await wait(1800);

        for (const message of MESSAGES) {
            await wait(message.gap);

            const bubble = makeBubble();

            await wait(message.dots);

            bubble.classList.remove("is-dots");

            await wait(250);

            await typeMessage(bubble, message);

            await wait(message.hold);

            bubble.classList.add("is-sent");
            sound("send");

            await wait(350);
        }

        await wait(2300);

        await showPhoto();

        await wait(2200);

        page.classList.add("is-warm");
        sound("reveal");

        reveal.classList.add("is-on");
        reveal.setAttribute("aria-hidden", "false");

        camera(
            "perspective(1800px) translate3d(0,6px,0) rotateX(0deg) rotateY(0deg) scale(1.09)",
            2500
        );

        await wait(5600);

        replay.classList.add("is-visible");
    }

    // Replay button
    replay.addEventListener("click", playFilm);

    // Start when Page 7 enters view
    let started = false;

    const observer = new IntersectionObserver(entries => {
        if (entries[0].intersectionRatio >= 0.55 && !started) {
            started = true;
            playFilm();
        }
    }, { threshold: [0, 0.55, 1] });

    observer.observe(page);

    // Decorative floating lights
    if (ambient) {
        for (let i = 0; i < 10; i++) {
            const light = document.createElement("span");
            light.className = "pp-bokeh";
            light.style.width = (20 + Math.random() * 35) + "px";
            light.style.height = light.style.width;
            light.style.left = Math.random() * 100 + "%";
            light.style.animationDuration = (18 + Math.random() * 12) + "s";
            light.style.animationDelay = (-Math.random() * 20) + "s";
            ambient.appendChild(light);
        }
    }

})();

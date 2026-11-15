
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("galaxySection");
  const scene = document.getElementById("g6Scene");
  const world = document.getElementById("g6World");
  const canvas = document.getElementById("g6Stars");

  if (!section || !scene || !world || !canvas) return;

  const photos = Array.from(world.querySelectorAll(".g6-photo"));
  if (!photos.length) return;

  // -----------------------------
  // 1. Build the 3D photo sphere
  // -----------------------------

  // Photos sit on a band around the viewer (not over the poles),
  // so every one passes in front of the camera as the galaxy turns.
  const small = window.innerWidth < 700;
  scene.style.perspective = small ? "1400px" : "2300px";
  world.style.transformStyle = "preserve-3d";

  const radius = small
    ? Math.min(window.innerWidth * 0.62, 340)
    : Math.min(window.innerWidth * 0.34, 500);

  photos.forEach((photo, index) => {
    const count = photos.length;
    const phi = (index / count) * Math.PI * 2;          // even spacing around
    const lat = [-14, 12, -4, 16, -18, 6][index % 6] * (small ? 0.8 : 1); // gentle up/down wave

    photo.dataset.phi = String(phi);
    photo.dataset.lat = String(lat);

    photo.style.transform =
      `translate(-50%, -50%) rotateY(${(phi * 180) / Math.PI}deg) rotateX(${lat}deg) translateZ(${radius}px)`;

    photo.style.transformStyle = "preserve-3d";
    photo.style.setProperty("--photo-index", index);
  });

  // Fly-in when the page comes into view
  const seen = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      section.classList.add("is-in");
      seen.disconnect();
    }
  }, { threshold: 0.35 });
  seen.observe(section);

  // -----------------------------
  // 2. Camera movement
  // -----------------------------

  let yaw = 0;
  let pitch = 0;

  let targetYaw = 0;
  let targetPitch = -6;

  let dragging = false;
  let moved = false;
  let hovered = false;
  let focusedPhoto = null;

  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;

  let idleRotation = 0;

  const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

  function updateCamera() {
    world.style.transform =
      `rotateX(${pitch}deg) rotateY(${yaw}deg)`;
  }

  function clearFocus() {
    focusedPhoto = null;
    targetPitch = -6;

    photos.forEach(photo => {
      photo.classList.remove("is-focused");
    });
  }

  // -----------------------------
  // 3. Mouse and touch dragging
  // -----------------------------

  scene.addEventListener("pointerdown", event => {
    if (event.target.closest(".g6-photo")) return;

    dragging = true;
    moved = false;

    startX = event.clientX;
    startY = event.clientY;
    lastX = event.clientX;
    lastY = event.clientY;

    clearFocus();
  });

  window.addEventListener("pointermove", event => {
    if (!dragging) return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    if (
      Math.abs(event.clientX - startX) > 5 ||
      Math.abs(event.clientY - startY) > 5
    ) {
      moved = true;
    }

    yaw += dx * 0.35;
    pitch = clamp(pitch - dy * 0.25, -75, 75);

    targetYaw = yaw;
    targetPitch = pitch;

    lastX = event.clientX;
    lastY = event.clientY;

    updateCamera();
  });

  window.addEventListener("pointerup", () => {
    dragging = false;
  });

  // -----------------------------
  // 4. Click a photo to focus it
  // -----------------------------

  photos.forEach(photo => {
    photo.addEventListener("click", event => {
      if (moved) {
        moved = false;
        return;
      }

      event.stopPropagation();

      if (focusedPhoto === photo) {
        clearFocus();
        return;
      }

      clearFocus();
      focusedPhoto = photo;

      const phiDeg = (Number(photo.dataset.phi) * 180) / Math.PI;
      const lat = Number(photo.dataset.lat);

      // shortest turn to bring this photo to the front
      let want = -phiDeg;
      want += Math.round((yaw - want) / 360) * 360;
      targetYaw = want;
      targetPitch = -lat;

      photo.classList.add("is-focused");
    });

    photo.addEventListener("mouseenter", () => {
      hovered = true;
    });

    photo.addEventListener("mouseleave", () => {
      hovered = false;
    });
  });

  // Clicking empty space removes focus
  scene.addEventListener("click", event => {
    if (!event.target.closest(".g6-photo")) {
      clearFocus();
    }
  });

  // Escape key removes focus
  window.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      clearFocus();
    }
  });

  // -----------------------------
  // 5. Starfield background
  // -----------------------------

  const ctx = canvas.getContext("2d");
  let stars = [];

  function resizeCanvas() {
    const rect = section.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars = Array.from({ length: 260 }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.008 + 0.002
    }));
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // -----------------------------
  // 6. Animation loop
  // -----------------------------

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function animate() {
    const rect = section.getBoundingClientRect();

    // Slowly rotate the galaxy when untouched
    if (!reduceMotion && !dragging && !hovered && !focusedPhoto) {
      targetYaw += 0.09;
    }

    // Smooth camera movement
    yaw += (targetYaw - yaw) * 0.045;
    pitch += (targetPitch - pitch) * 0.045;

    updateCamera();

    // Depth: photos at the back are dimmer and softer
    photos.forEach(photo => {
      const ang = Number(photo.dataset.phi) + (yaw * Math.PI) / 180;
      const facing = (Math.cos(ang) + 1) / 2;           // 1 = front, 0 = back
      photo.style.setProperty("--shade", (0.35 + facing * 0.75).toFixed(3));
      photo.style.setProperty("--fade", (0.3 + facing * 0.7).toFixed(3));
      photo.style.zIndex = Math.round(facing * 100);
    });

    // Draw twinkling stars
    ctx.clearRect(0, 0, rect.width, rect.height);

    stars.forEach(star => {
      if (!reduceMotion) {
        star.alpha += star.speed;
        if (star.alpha > 0.9 || star.alpha < 0.15) {
          star.speed *= -1;
        }
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
});

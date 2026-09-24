// ============ Username Estate Properties ============
// Gallery interactions + lazy-loaded map for speed.

// ---------- Photo thumbnails per card ----------
// First 3 projects show all 3 photos as switchable thumbnails;
// remaining projects use their hero photo (images stay cached).
const THUMB_PROJECTS = ["matuu-sunrise", "nakuru-grove-gardens", "prestige-ngong"];

document.querySelectorAll(".card").forEach(card => {
  const mainImg = card.querySelector(".card-img img");
  if (!mainImg) return;
  const match = mainImg.src.match(/properties\/([\w-]+)\//);
  if (!match) return;
  const folder = match[1];
  if (!THUMB_PROJECTS.includes(folder)) return;

  const thumbs = document.createElement("div");
  thumbs.className = "thumbs";
  [1, 2, 3].forEach(n => {
    const t = document.createElement("img");
    t.src = `images/properties/${folder}/${n}.webp`;
    t.alt = "";
    t.loading = "lazy";
    t.decoding = "async";
    t.addEventListener("click", () => {
      mainImg.src = t.src;
      thumbs.querySelectorAll("img").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
    });
    thumbs.appendChild(t);
  });
  card.querySelector(".card-body").prepend(thumbs);
  thumbs.querySelector("img").classList.add("active");
});

// ---------- Lazy map: load Leaflet only when the map scrolls near the viewport ----------
const mapEl = document.getElementById("map");
let mapStarted = false;

function initMap() {
  if (mapStarted) return;
  mapStarted = true;

  // Load Leaflet CSS+JS, then draw the map
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  css.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
  css.crossOrigin = "";
  document.head.appendChild(css);

  const js = document.createElement("script");
  js.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  js.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
  js.crossOrigin = "";
  js.onload = buildMap;
  document.body.appendChild(js);
}

function buildMap() {
  const map = L.map("map", { scrollWheelZoom: false }).setView([-0.2275, 36.1456], 14);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Red pin with the Nakuru Grove Gardens map logo (square, sharp edges)
  const pinIcon = L.divIcon({
    className: "",
    html: `
      <div style="position:relative;transform:translate(-50%,-100%);width:64px;">
        <div style="width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:26px solid #e02b2b;margin:0 auto;"></div>
        <div style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);width:56px;height:56px;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.4);overflow:hidden;background:#fff;">
          <img src="assets/map-logo.webp" alt="Nakuru Grove Gardens" style="width:100%;height:100%;object-fit:cover;">
        </div>
      </div>
    `,
    iconSize: [64, 84],
    iconAnchor: [32, 84]
  });

  L.marker([-0.2275, 36.1456], { icon: pinIcon }).addTo(map)
    .bindPopup("<strong>Nakuru Grove Gardens Phase 2</strong><br>Bahati, Nakuru County<br><a href='https://wa.me/254742674709' target='_blank' rel='noopener'>Enquire on WhatsApp</a>")
    .openPopup();

  map.on("click", () => map.scrollWheelZoom.enable());
  map.on("mouseout", () => map.scrollWheelZoom.disable());
}

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      initMap();
      io.disconnect();
    }
  }, { rootMargin: "300px" });
  io.observe(mapEl);
} else {
  initMap();
}

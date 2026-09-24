// ============ Username Estate Properties ============

// ---------- Gallery data (from "gallery infomation" price sheet) ----------
const PROJECTS = [
  {
    name: "Matuu Sunrise Estate",
    folder: "matuu-sunrise",
    price: "250,000",
    location: "Matuu, Machakos County",
    blurb: "Affordable 1/8 acre plots in fast-growing Matuu with ready title deeds."
  },
  {
    name: "Nakuru Grove Gardens Phase 2",
    folder: "nakuru-grove-gardens",
    price: "450,000",
    location: "Bahati, Nakuru County",
    blurb: "Just 10 minutes off the Nakuru–Nyeri highway in the fast-growing Bahati area."
  },
  {
    name: "Prestige Estate Ngong",
    folder: "prestige-ngong",
    price: "599,000",
    location: "Ngong, Kajiado County",
    blurb: "Prime value-added plots moments from Ngong town."
  },
  {
    name: "Nakuru Opal Estate Annex",
    folder: "nakuru-opal",
    price: "750,000",
    location: "Nakuru County",
    blurb: "Value-added plots in Nakuru's rapidly developing corridor."
  },
  {
    name: "The Delight Nakuru Phase 2",
    folder: "delight-nakuru",
    price: "750,000",
    location: "Nakuru County",
    blurb: "Gated community living with developed amenities in Nakuru."
  },
  {
    name: "Fairview Estate Ngong",
    folder: "fairview-ngong",
    price: "850,000",
    location: "Ngong, Kajiado County",
    blurb: "Scenic plots on the ever-popular Ngong ridge."
  },
  {
    name: "Juja Park Estate",
    folder: "juja-park",
    price: "895,000",
    location: "Juja, Kiambu County",
    blurb: "Plots minutes from Juja town and the Thika Superhighway."
  },
  {
    name: "Imperial Gardens Kikuyu",
    folder: "imperial-kikuyu",
    price: "1,249,000",
    location: "Kikuyu, Kiambu County",
    blurb: "Premium plots in the heart of Kikuyu's growth belt."
  },
  {
    name: "Jewel Estate Kikuyu",
    folder: "jewel-kikuyu",
    price: "1,299,000",
    location: "Kikuyu, Kiambu County",
    blurb: "High-value investment plots near Kikuyu town."
  },
  {
    name: "Greenvale Court Kamakis",
    folder: "greenvale-kamakis",
    price: "3,400,000",
    location: "Kamakis, Ruiru, Kiambu County",
    blurb: "Upscale plots in the sought-after Kamakis area of Ruiru."
  },
  {
    name: "Royale Court Juja",
    folder: "royale-juja",
    price: "3,500,000",
    location: "Juja, Kiambu County",
    blurb: "Flagship development minutes from Juja farm and Thika Road."
  }
];

// ---------- Build gallery cards ----------
const grid = document.getElementById("galleryGrid");
PROJECTS.forEach(p => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-img">
      <img src="images/properties/${p.folder}/" alt="${p.name}" loading="lazy">
      <span class="price-tag">KSHS ${p.price}</span>
    </div>
    <div class="card-body">
      <h3>${p.name}</h3>
      <span class="loc">📍 ${p.location}</span>
      <p style="font-size:14px;color:#5a6b52;">${p.blurb}</p>
      <div class="price-line">
        <span class="kshs">KSHS.</span>
        <span class="price">${p.price}</span>
      </div>
      <a class="card-cta" href="https://wa.me/254742674709?text=${encodeURIComponent("Hello! I'm interested in " + p.name + " (KSHS " + p.price + "). Is it available?")}" target="_blank" rel="noopener">Enquire on WhatsApp</a>
    </div>
  `;
  grid.appendChild(card);
});

// Fill each card with its property images (3 per project) + thumbnail switcher
document.querySelectorAll(".card").forEach((card, i) => {
  const p = PROJECTS[i];
  const img = card.querySelector(".card-img img");
  const base = `images/properties/${p.folder}`;
  const thumbs = document.createElement("div");
  thumbs.className = "thumbs";
  [1, 2, 3].forEach(n => {
    const t = document.createElement("img");
    t.src = `${base}/${n}.jpg`;
    t.alt = `${p.name} photo ${n}`;
    t.loading = "lazy";
    t.onclick = () => {
      img.src = `${base}/${n}.jpg`;
      thumbs.querySelectorAll("img").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
    };
    thumbs.appendChild(t);
  });
  card.querySelector(".card-body").prepend(thumbs);
  img.onerror = () => { img.src = thumbs.querySelector("img").src; };
  img.src = `${base}/1.jpg`;
  thumbs.querySelector("img").classList.add("active");
});

// ---------- Live map: Nakuru Grove Gardens Phase 2 (Bahati, Nakuru) ----------
const map = L.map("map", { scrollWheelZoom: false }).setView([-0.2275, 36.1456], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Red pin with the Nakuru Grove Gardens map logo
const pinIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;transform:translate(-50%,-100%);width:64px;">
      <div style="width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:26px solid #e02b2b;margin:0 auto;"></div>
      <div style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);width:56px;height:56px;border-radius:50%;border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.4);overflow:hidden;background:#fff;">
        <img src="assets/map-logo.jpeg" alt="Nakuru Grove Gardens" style="width:100%;height:100%;object-fit:cover;">
      </div>
    </div>
  `,
  iconSize: [64, 84],
  iconAnchor: [32, 84]
});

L.marker([-0.2275, 36.1456], { icon: pinIcon }).addTo(map)
  .bindPopup("<strong>Nakuru Grove Gardens Phase 2</strong><br>Bahati, Nakuru County<br><a href='https://wa.me/254742674709' target='_blank'>Enquire on WhatsApp</a>")
  .openPopup();

map.on("click", () => map.scrollWheelZoom.enable());
map.on("mouseout", () => map.scrollWheelZoom.disable());

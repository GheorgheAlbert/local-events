
window.addEventListener("load", function () {
    const events = [
        { id: 1, title: "Rock Night Live", category: "Concert", date: "2026-01-10", city: "Cluj-Napoca", desc: "Local bands concert in an outdoor garden.", lat: 46.7712, lng: 23.6236, img: "images/rock.jpg" },
        { id: 2, title: "All City Run – 5K", category: "Sport", date: "2026-01-11", city: "Bucharest", desc: "Friendly city run for all levels. Charity event.", lat: 44.4268, lng: 26.1025, img: "images/run.jpg" },
        { id: 3, title: "Street Food Festival", category: "Festival", date: "2026-01-12", city: "Timișoara", desc: "Tasty food, live music and a kids area. Free entry.", lat: 45.7489, lng: 21.2087, img: "images/food.jpg" },
        { id: 4, title: "Jazz Night – Live Quartet", category: "Concert", date: "2026-01-09", city: "Iași", desc: "Relaxed evening with local jazz musicians.", lat: 47.1585, lng: 27.6014, img: "images/jazz.jpg" },
        { id: 5, title: "Open Air DJ Session", category: "Concert", date: "2026-01-10", city: "Brașov", desc: "Chill beats by local DJs, picnic vibe.", lat: 45.6579, lng: 25.6012, img: "images/dj.jpg" },
        { id: 6, title: "Park Volunteering Day", category: "Workshop", date: "2026-01-11", city: "Bucharest", desc: "Help clean the park and meet new friends.", lat: 44.4268, lng: 26.1025, img: "images/volunteer.jpg" },

        { id: 7, title: "Photography Walk", category: "Workshop", date: "2026-01-17", city: "Brașov", desc: "Beginner friendly photo walk in the old town.", lat: 45.6579, lng: 25.6012, img: "images/photo.jpg" },
        { id: 8, title: "Indoor Climbing Intro", category: "Sport", date: "2026-01-18", city: "Cluj-Napoca", desc: "Try climbing with a coach. Equipment included.", lat: 46.7712, lng: 23.6236, img: "images/climb.jpg" },
        { id: 9, title: "Local Makers Market", category: "Festival", date: "2026-01-16", city: "Iași", desc: "Handmade products, snacks, and music.", lat: 47.1585, lng: 27.6014, img: "images/market.jpg" },
        { id: 10, title: "Yoga in the Park", category: "Sport", date: "2026-01-17", city: "Bucharest", desc: "Slow yoga session for beginners.", lat: 44.4268, lng: 26.1025, img: "images/yoga.jpg" },
        { id: 11, title: "Cooking Workshop: Pasta", category: "Workshop", date: "2026-01-18", city: "Timișoara", desc: "Learn simple pasta recipes with a chef.", lat: 45.7489, lng: 21.2087, img: "images/pasta.jpg" },
        { id: 12, title: "Acoustic Evening", category: "Concert", date: "2026-01-16", city: "Timișoara", desc: "Small acoustic set with local artists.", lat: 45.7489, lng: 21.2087, img: "images/acoustic.jpg" },

        { id: 13, title: "Board Games Meetup", category: "Workshop", date: "2026-01-24", city: "Cluj-Napoca", desc: "Meet people and play easy board games.", lat: 46.7712, lng: 23.6236, img: "images/games.jpg" },
        { id: 14, title: "Winter Mini Festival", category: "Festival", date: "2026-01-25", city: "Brașov", desc: "Lights, food stands and live performances.", lat: 45.6579, lng: 25.6012, img: "images/winter.jpg" },
        { id: 15, title: "City Bike Ride", category: "Sport", date: "2026-01-24", city: "Bucharest", desc: "Casual bike ride with breaks and photos.", lat: 44.4268, lng: 26.1025, img: "images/bike.jpg" },
        { id: 16, title: "Street Jazz Jam", category: "Concert", date: "2026-01-23", city: "Iași", desc: "Open jam session, audience welcome.", lat: 47.1585, lng: 27.6014, img: "images/jam.jpg" },
        { id: 17, title: "Craft Workshop: Candles", category: "Workshop", date: "2026-01-25", city: "Bucharest", desc: "Make your own scented candles.", lat: 44.4268, lng: 26.1025, img: "images/candles.jpg" },
        { id: 18, title: "Night Run Training", category: "Sport", date: "2026-01-23", city: "Timișoara", desc: "Easy pace training run with group.", lat: 45.7489, lng: 21.2087, img: "images/nightrun.jpg" },
    ];

    const PAGE_SIZE = 6;
    let currentPage = 1;
    let totalPages = 1;

    const grid = document.getElementById("eventsGrid");

    const btnFilter = document.getElementById("btnFilter");
    const inpKeywords = document.getElementById("keywords");
    const inpDate = document.getElementById("date");
    const selCategory = document.getElementById("category");

    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const pageInfo = document.getElementById("pageInfo");

    const modalEl = document.getElementById("eventModal");
    const modal = new bootstrap.Modal(modalEl);

    const modalTitle = document.getElementById("modalTitle");
    const modalInfo = document.getElementById("modalInfo");
    const btnShowOnMap = document.getElementById("btnShowOnMap");

    function normalize(s) {
        return (s || "").toLowerCase().trim();
    }

    function applyFilters(all) {
        const kw = normalize(inpKeywords.value);
        const dt = inpDate.value;
        const cat = selCategory.value;

        return all.filter(ev => {
            const kwOk =
                !kw ||
                normalize(ev.title).includes(kw) ||
                normalize(ev.desc).includes(kw) ||
                normalize(ev.city).includes(kw);

            const dtOk = !dt || ev.date === dt;
            const catOk = cat === "All" || ev.category === cat;

            return kwOk && dtOk && catOk;
        });
    }

    function updatePaginationUI() {
        pageInfo.textContent = `${currentPage} / ${totalPages}`;
        btnPrev.disabled = currentPage <= 1;
        btnNext.disabled = currentPage >= totalPages;
    }

    function paginate(list) {
        totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * PAGE_SIZE;
        return list.slice(start, start + PAGE_SIZE);
    }

    function openDetailsById(id) {
        const ev = events.find(e => e.id === id);
        if (!ev) return;

        modalTitle.textContent = ev.title;
        modalInfo.textContent = `${ev.date} • ${ev.city} • ${ev.category} — ${ev.desc}`;


        btnShowOnMap.onclick = function () {
            bootstrap.Modal.getInstance(modalEl).hide();
            document.getElementById("map").scrollIntoView({ behavior: "smooth" });
            if (window.MAP && window.MAP.focusEvent) window.MAP.focusEvent(id);
        };

        modal.show();
    }

    function render(list) {
        grid.innerHTML = "";

        list.forEach(ev => {
            const col = document.createElement("div");
            col.className = "col";

            col.innerHTML = `
        <div class="card h-100">
          <img src="${ev.img}" class="card-img-top" alt="${ev.title}">
          <div class="card-body">
            <h5 class="card-title">${ev.title}</h5>
            <p class="card-text small text-muted">${ev.date} • ${ev.city} • ${ev.category}</p>
            <p class="card-text">${ev.desc}</p>
            <button class="btn btn-outline-primary btn-sm btn-details" data-id="${ev.id}">Details</button>
          </div>
        </div>
      `;

            grid.appendChild(col);
        });

        grid.querySelectorAll(".btn-details").forEach(btn => {
            btn.addEventListener("click", function () {
                openDetailsById(parseInt(btn.getAttribute("data-id")));
            });
        });
    }

    function refresh() {
        const filtered = applyFilters(events);
        const pageList = paginate(filtered);

        render(pageList);
        updatePaginationUI();

        if (window.MAP && window.MAP.setMarkers) {
            window.MAP.setMarkers(filtered);
        }
    }

    btnFilter.addEventListener("click", function () {
        currentPage = 1;
        refresh();
    });

    btnPrev.addEventListener("click", function () {
        if (currentPage > 1) currentPage--;
        refresh();
    });

    btnNext.addEventListener("click", function () {
        if (currentPage < totalPages) currentPage++;
        refresh();
    });

    if (window.MAP && window.MAP.init) {
        window.MAP.init(events, openDetailsById);
    }

    refresh();
});

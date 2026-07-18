/* Energy Plus · master template behavior.
   Everything here enhances a page that already works without it. */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header: the mark alone over the hero ---------- */
  const head = document.getElementById("head");
  const hero = document.querySelector(".hero");
  if (head && hero) {
    const sync = () => head.classList.toggle("is-clear", window.scrollY < hero.offsetHeight - 64);
    sync();
    addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync, { passive: true });
  }

  /* ---------- reveals: armed only when frames are actually painting ---------- */
  if (!reduced && "IntersectionObserver" in window) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.documentElement.classList.add("anim-ready");
      const targets = document.querySelectorAll(".beat > .wrap, .close__in");
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      targets.forEach((el) => io.observe(el));
      const catchUp = () => targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) el.classList.add("is-in");
      });
      setTimeout(catchUp, 1500);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) targets.forEach((el) => el.classList.add("is-in"));
      });
    }));
  }

  /* ---------- text-the-founder panels ---------- */
  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (/Mac/.test(navigator.userAgent) && "ontouchend" in document);
  const buildSms = (panel) => {
    const msg = panel.querySelector("textarea");
    const send = panel.querySelector(".js-sms-send");
    if (msg && send) send.href = "sms:" + (send.getAttribute("data-phone") || "") + (isIOS ? "&" : "?") + "body=" + encodeURIComponent(msg.value);
  };
  document.querySelectorAll(".js-sms-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.closest("section, .hero__in, .close__in").querySelector(".sms");
      if (!panel) return;
      const open = panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
      if (open) { buildSms(panel); panel.querySelector("textarea").focus(); }
    });
  });
  document.addEventListener("input", (e) => {
    if (e.target.matches(".sms textarea")) buildSms(e.target.closest(".sms"));
  });

  /* ---------- Cal.com: load once, open from any [data-book] ---------- */
  let calReady = false;
  const ensureCal = () => {
    if (calReady) return;
    calReady = true;
    (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
    window.Cal("init", "15min", { origin: "https://app.cal.com" });
    window.Cal.ns["15min"]("ui", { hideEventTypeDetails: false, layout: "month_view", theme: "light", cssVarsPerTheme: { light: { "cal-brand": "#2a7f79" } } });
  };
  document.querySelectorAll("[data-book]").forEach((btn) => {
    btn.setAttribute("data-cal-namespace", "15min");
    btn.setAttribute("data-cal-link", "dan-knows-a-gut/15min");
    btn.setAttribute("data-cal-config", '{"layout":"month_view","theme":"light"}');
  });
  if (document.readyState === "complete") setTimeout(ensureCal, 800);
  else addEventListener("load", () => setTimeout(ensureCal, 800));
  ["pointerdown", "keydown", "scroll"].forEach((ev) => addEventListener(ev, ensureCal, { once: true, passive: true }));

  /* ---------- the gate: estimator + worksheet for an email ----------
     Progressive: without JS the estimator is simply open. With JS, the gate
     shows until an email is given once; a capture-service outage never blocks
     the visitor (we unlock regardless and fail quietly). */
  const gateEl = document.getElementById("calc-gate");
  const gateCalc = document.querySelector("[data-calc]");
  const gateDl = document.getElementById("gate-download");
  if (gateEl && gateCalc) {
    const unlock = () => { gateEl.hidden = true; gateCalc.hidden = false; };
    if (localStorage.getItem("ep-unlocked")) {
      unlock();
    } else {
      gateCalc.hidden = true;
      gateEl.hidden = false;
      const form = document.getElementById("gate-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const email = input.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { input.focus(); return; }
        const btn = form.querySelector("button");
        btn.disabled = true; btn.textContent = "Unlocking…";
        const finish = () => {
          try { localStorage.setItem("ep-unlocked", "1"); } catch (err) {}
          unlock();
          if (gateDl) gateDl.hidden = false;
        };
        fetch("https://formsubmit.co/ajax/dan@yourenergyplus.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ email, _subject: "Estimator unlock (new lead)", page: "energy-plus-landing", _template: "table" }),
        }).then(finish, finish);
      });
    }
  }

  /* ---------- calculator: height messages + loading state ---------- */
  const calcFrame = document.getElementById("calc-frame");
  const calcWrap = document.querySelector("[data-calc]");
  if (calcFrame) {
    calcFrame.addEventListener("load", () => {
      const l = calcWrap && calcWrap.querySelector(".calc__loading");
      if (l) l.remove();
    });
    addEventListener("message", (e) => {
      if (!/danknowsaguy-web\.github\.io$/.test(new URL(e.origin || "https://x.invalid").hostname)) return;
      let h = null;
      if (typeof e.data === "number") h = e.data;
      else if (e.data && typeof e.data === "object" && typeof e.data.height === "number") h = e.data.height;
      if (h && h > 300 && h < 4000) calcFrame.style.height = h + "px";
    });
  }

  /* ---------- the full record ---------- */
  /* [figure, site, context, method]; measured at the named sites under their own
     conditions; attribution and limits are covered by notes 1 and 9. */
  const RECORD = [
    { t: "Whole building examples", c: 3, rows: [
      ["49.2%", "AZ Ford Dealership", "Auto dealership · Arizona", "Documented project total (power quality + HVAC + lighting)"],
      ["27% avg", "City of Rainsville", "Municipal · Alabama", "First-year monitored, power conditioning + LED"],
      ["+50% / +2%", "Commercial Bottling Plant", "Manufacturing · Upper Midwest", "Growth-adjusted net cost study (50% more output, 2% more cost)"]
    ]},
    { t: "HVAC examples", c: 67, rows: [
      ["33%", "Durham College", "Education / research · Oshawa, ON", "16,851 data points; ANOVA / t-test"],
      ["27.75% avg", "City of Windsor", "Municipal · Windsor, ON", "Enwin Utilities verified; OPA approved"],
      ["23.6%", "NASA Jet Propulsion Lab", "Government · Pasadena, CA", "7-day before/after, Caltech / Emcor"],
      ["21.1% kWh", "Simon Property Group", "Retail, Jersey Gardens mall · Elizabeth, NJ", "IPMVP; $41,473/yr, 12-mo payback"],
      ["19.2% RTU", "Anheuser-Busch (Mitchell Distributing)", "Distribution · United States", "20-mo payback; 904% lifetime ROI"],
      ["20–35%", "Trebor International", "Manufacturing · Windsor, ON", "P.E. licensed in 6 jurisdictions"],
      ["21–32%", "Kenya program", "Lab + field · Kenya Bureau of Standards; LECOL Mombasa", "KEBS lab test vs BS EN 60335-1"],
      ["27–30%", "Lebanon program", "2 sites · DALFA Beirut · HSZ Zgharta", "ENISCOPE data, witnessed and co-signed"],
      ["47.6% ΔT", "Electrolux", "Lab / OEM · United States", "Tri-S ECM thermal report"],
      ["284% ROI", "Men's Wearhouse (Tailored Brands)", "Retail · United States", "Dual-RTU, 12.5-mo payback"],
      ["24%+ / yr", "McDonald's franchisee", "Quick-serve · United States", "Annual study"],
      ["20% avg", "Bangladesh Ministry of Power", "Government pilot · Dhaka", "Official certification issued"],
      ["20% avg", "AT&T Mobility / SDG&E", "Telecom, 9 cell sites · San Diego, CA", "HOBO loggers; utility-engineer co-authored"],
      ["19.5–21.6%", "Verizon Network Services", "Telecom · Dallas, TX", "P.E.-authored; approved for deployment"],
      ["~21%", "DOE FEMP demonstration", "Government, gymnasium RTUs · United States", "U.S. DOE / ORNL controlled study"],
      ["22%", "Bashas' Supermarket", "Grocery · Gold Canyon, AZ", "Grocery vertical study"],
      ["19.4% / yr", "Domino's Store 6711", "Quick-serve · United States", "2-year study"],
      ["12–27%", "UAE program", "14 institutions · Sheraton Jumeirah · Sharjah FZ · Jotun · Flora Grand", "14-institution deployment"],
      ["15–39%", "Multi-country program", "South Africa · Pakistan · Indonesia · Puerto Rico", "Field studies per country"],
      ["15–21%", "Bangladesh enterprise", "56 units · GraphicPeople (WPP) · BEXIMCO · IDLC Finance", "Enterprise deployment"],
      ["15% eff.", "DHL (ammonia refrigeration)", "Logistics · United States", "Compressor study, 13.8-mo payback"],
      ["200 sites", "Airtel Bangladesh", "Telecom, 200 BTS sites · Nationwide", "3-month pilot, no performance issues"],
      ["5-mo payback", "Italgas Toscana", "Utility, heat pump · Italy", "Field efficiency trial"],
      ["50%", "General Electric", "Voltas · 1.5 ton", "India · HVAC Optimizer field test"],
      ["45%", "IIT, Mumbai", "Voltas · 1.5 ton", "India · HVAC Optimizer field test"],
      ["44%", "Merrill Lynch", "Carrier · 2.0 ton", "India · HVAC Optimizer field test"],
      ["39%", "GTL", "Carrier · 1.5 ton", "India · HVAC Optimizer field test"],
      ["39%", "Premier Energy Transmission", "Commander · 1.5 ton", "India · HVAC Optimizer field test"],
      ["35%", "Reliance Communication", "Daikin · 2.0 ton", "India · HVAC Optimizer field test"],
      ["35%", "EPIC Energy", "LG · 1.5 ton", "India · HVAC Optimizer field test"],
      ["34%", "CTV", "National · 1.5 ton", "India · HVAC Optimizer field test"],
      ["33%", "Airtel", "Carrier · 8.5 ton", "India · HVAC Optimizer field test"],
      ["30%", "The Association Building Company (TATA)", "Voltas · 1.5 ton", "India · HVAC Optimizer field test"],
      ["29%", "Reliance Energy", "Videocon · 1.5 ton", "India · HVAC Optimizer field test"],
      ["28%", "Larsen & Toubro", "Voltas · 1.5 ton", "India · HVAC Optimizer field test"],
      ["28%", "Agility Logistics", "LG · 1.5 ton", "India · HVAC Optimizer field test"],
      ["27%", "Indian School of Business", "Hitachi · 1.5 ton", "India · HVAC Optimizer field test"],
      ["27%", "ENAM Securities", "Videocon · 1.5 ton", "India · HVAC Optimizer field test"],
      ["27%", "India Independent Strategy and Research", "Mitsubishi · 2.0 ton", "India · HVAC Optimizer field test"],
      ["26%", "TATA Consultancy Services", "Blue Star · 11 ton", "India · HVAC Optimizer field test"],
      ["26%", "Hero Moto Corp", "Carrier · 2.0 ton", "India · HVAC Optimizer field test"],
      ["26%", "CCI Club, Mumbai", "O General · 2.0 ton", "India · HVAC Optimizer field test"],
      ["25%", "Daikin", "Daikin · 2.0 ton", "India · HVAC Optimizer field test"],
      ["25%", "Godrej", "Godrej · 2.0 ton", "India · HVAC Optimizer field test"],
      ["25%", "Infosys", "Toshiba · 1.8 ton", "India · HVAC Optimizer field test"],
      ["25%", "ICICI", "Videocon · 1.5 ton", "India · HVAC Optimizer field test"],
      ["25%", "ISPAT", "LG · 1.5 ton", "India · HVAC Optimizer field test"],
      ["25%", "Vinergy", "Mitsubishi · 1.0 ton", "India · HVAC Optimizer field test"],
      ["25%", "Raj Bhavan", "LG · 2.0 ton", "India · HVAC Optimizer field test"],
      ["25%", "Diners Business Service", "LG · 1.5 ton", "India · HVAC Optimizer field test"],
      ["25%", "Great Eastern Shipping Company", "Daikin · 2.0 ton", "India · HVAC Optimizer field test"],
      ["24%", "Blue Star", "Blue Star · 2.0 ton", "India · HVAC Optimizer field test"],
      ["24%", "TATA Tele", "Voltas · 2.0 ton", "India · HVAC Optimizer field test"],
      ["23%", "Reliance Web World", "Carrier · 1.5 ton", "India · HVAC Optimizer field test"],
      ["23%", "Tech Mahindra", "LG · 1.5 ton", "India · HVAC Optimizer field test"],
      ["23%", "Raymond Industries", "LG · 1.5 ton", "India · HVAC Optimizer field test"],
      ["22%", "Siemens", "Panasonic · 1.5 ton", "India · HVAC Optimizer field test"],
      ["21%", "TATA Motors", "Voltas · 1.5 ton", "India · HVAC Optimizer field test"],
      ["21%", "KPMG", "Carrier · 17 ton", "India · HVAC Optimizer field test"],
      ["20%", "Viom", "SpaceMaker · 3.5 ton", "India · HVAC Optimizer field test"],
      ["20%", "AT&T Mobility", "LG · 2.0 ton", "India · HVAC Optimizer field test"],
      ["20%", "Veritas", "LG · 1.0 ton", "India · HVAC Optimizer field test"],
      ["20%", "Vitz Hotel", "Voltas · 3.0 ton", "India · HVAC Optimizer field test"],
      ["19%", "Mahindra & Mahindra", "Blue Star · 2.0 ton", "India · HVAC Optimizer field test"],
      ["19%", "MTNL", "Voltas · 2.0 ton", "India · HVAC Optimizer field test"],
      ["19%", "Naval Dockyard", "Videocon · 1.5 ton", "India · HVAC Optimizer field test"],
      ["18%", "TATA Power", "Carrier · 8.5 ton", "India · HVAC Optimizer field test"]
    ]},
    { t: "Power conditioning examples (a later-phase upgrade)", c: 25, rows: [
      ["24.0%", "Edward Hospital", "Hospital · Naperville, IL", "Power factor + voltage conditioning + line reactors; metered, beat projection, $84,270 / 9 mo"],
      ["20% avg", "Starnes Quarter Horses", "Agriculture · Alabama", "Monthly bill comparison"],
      ["16% kWh", "Team Wow (Domino's)", "Quick-serve · El Paso, TX", "Weather-adjusted, U.S. DOE standards"],
      ["15.0% kWh", "Buffalo Rock", "Manufacturing · Birmingham, AL", "Noesis, 12-month study"],
      ["15% kWh", "Henkel", "Manufacturing · Richmond, VA", "Exceeded corporate sustainability goal"],
      ["15% kWh", "Cowabunga (Domino's)", "Quick-serve · Georgia", "Third-party metering, 7-store install"],
      ["14.8% kWh", "Corey Center", "Office + warehouse · Atlanta, GA", "Noesis, 4-year average"],
      ["14% kWh", "Caribe Resort", "Hospitality · Orange Beach, AL", "Facilities-director measured"],
      ["up to 14%", "Serra Mazda", "Retail / auto · Trussville, AL", "CHI Energy, 12-month study"],
      ["13.5% kWh", "Hilton Garden Inn", "Hospitality · Marietta, GA", "ABRAXAS, 12-month study"],
      ["13.0% kWh", "Planet Fitness", "Fitness · Birmingham, AL", "CHI Energy"],
      ["12.9% kWh", "Hi-Noon (Sinclair)", "C-store / fuel · Missoula, MT", "Verified by NorthWestern Energy"],
      ["12.5% kWh", "RPM Pizza (Domino's)", "Quick-serve, 170+ stores · MS · LA · AL · IN · MI", "Normalized; >$100k/yr projected"],
      ["12.5% kWh", "Wheeling University", "Education · Wheeling, WV", "Engineering capstone study"],
      ["12% kWh", "Pinnacle Center 4 (J&J HQ)", "Office · Rogers, AR", "Occupancy-adjusted baseline"],
      ["9–19%", "The Massey Building", "Office (historic) · Birmingham, AL", "Per-floor metering"],
      ["9% kWh", "Popeyes", "Quick-serve, 25 locations · GA · AL · LA · MS · TN", "ABRAXAS"],
      ["9.7% delta", "Krystal", "Quick-serve · Georgia", "Noesis, vs. control store"],
      ["8.59% kW", "Las Vegas Hotel & Casino", "Hospitality · Las Vegas, NV", "Independent panel metering"],
      ["~1 yr payback", "Pacific Steel", "Manufacturing · Montana", "PE-sealed technoeconomic analysis"],
      ["18% panel", "Haven Health", "Medical · United States", "Industria Energy independent study"],
      ["40% motor", "Sequoyah Elementary", "Education · Tennessee", "Data-logged 14 days, 9.5-mo ROI"],
      ["15.4% amps", "Arnie's Gas & Tire", "C-store / fuel · Ronan, MT", "Verified by electrical engineer"],
      ["~$1,500 / store", "C-Store program (TeamSledd / Liberty)", "C-store / fuel, 12 stores · OH · WV · PA", "3-year year-over-year study"],
      ["THD −30 / −45%", "Off-grid solar residence", "Power-quality test · South Carolina", "PowerSight 5000 metering"]
    ]}
  ];

  const sheet = document.getElementById("record-sheet");
  const openBtn = document.getElementById("record-open");
  const closeBtn = document.getElementById("record-close");
  if (sheet && openBtn && closeBtn) {
    let rendered = false;
    const render = () => {
      if (rendered) return;
      rendered = true;
      const body = document.getElementById("record-body");
      const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      body.innerHTML = RECORD.map((g) =>
        '<section class="rec-group"><h3>' + esc(g.t) + "<span>" + g.c + "</span></h3><ul>" +
        g.rows.map((r) =>
          '<li><span class="r">' + esc(r[0]) + '</span><span class="n"><b>' + esc(r[1]) + "</b><span>" + esc(r[2]) + '</span></span><span class="b">' + esc(r[3]) + "</span></li>"
        ).join("") + "</ul></section>"
      ).join("");
    };
    openBtn.addEventListener("click", () => { render(); sheet.showModal(); });
    closeBtn.addEventListener("click", () => sheet.close());
    sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });
  }

  /* ---------- the film ---------- */
  const filmDialog = document.getElementById("film-dialog");
  const filmFrame = document.getElementById("film-frame");
  const filmClose = document.getElementById("film-close");
  document.querySelectorAll("[data-film]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!filmDialog || !filmFrame) return;
      if (!filmFrame.firstChild) {
        const f = document.createElement("iframe");
        f.src = "https://fast.wistia.net/embed/iframe/n765rk6v4z?autoPlay=true&playbar=true&dnt=true";
        f.allow = "autoplay; fullscreen";
        f.title = "Energy Plus: how we cut your energy bill, 6 minutes";
        filmFrame.appendChild(f);
      }
      filmDialog.showModal();
    });
  });
  if (filmDialog && filmClose) {
    const stop = () => { if (filmFrame) filmFrame.replaceChildren(); };
    filmClose.addEventListener("click", () => filmDialog.close());
    filmDialog.addEventListener("close", stop);
    filmDialog.addEventListener("click", (e) => { if (e.target === filmDialog) filmDialog.close(); });
  }

  /* ---------- print: nothing ships collapsed ---------- */
  addEventListener("beforeprint", () => {
    document.querySelectorAll("details:not([open])").forEach((d) => { d.setAttribute("data-print-opened", ""); d.setAttribute("open", ""); });
  });
  addEventListener("afterprint", () => {
    document.querySelectorAll("details[data-print-opened]").forEach((d) => { d.removeAttribute("open"); d.removeAttribute("data-print-opened"); });
  });
})();

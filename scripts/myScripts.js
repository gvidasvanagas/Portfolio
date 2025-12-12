// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// ScrollSpy: highlight current section link in navbar
function initScrollSpy() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  const offset = nav.offsetHeight + 12;
  document.documentElement.style.setProperty("--nav-offset", offset + "px");

  const existing = bootstrap.ScrollSpy.getInstance(document.body);
  if (existing) existing.dispose();

  new bootstrap.ScrollSpy(document.body, { target: "#mainNav", offset });
  bootstrap.ScrollSpy.getInstance(document.body)?.refresh();
}

window.addEventListener("load", initScrollSpy);
window.addEventListener("resize", initScrollSpy);

// Back-to-top
const backToTop = document.getElementById("backToTop");
function toggleBackToTop() {
  if (!backToTop) return;
  backToTop.style.display = window.scrollY > 600 ? "grid" : "none";
}
window.addEventListener("scroll", toggleBackToTop);
window.addEventListener("load", toggleBackToTop);
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Nav click smooth scroll with offset (keeps ScrollSpy accurate)
document.querySelectorAll('#mainNav a.nav-link[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    const target = href ? document.querySelector(href) : null;
    if (!target) return;

    e.preventDefault();

    const nav = document.getElementById("mainNav");
    const offset = (nav?.offsetHeight || 0) + 12;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top, behavior: "smooth" });

    window.setTimeout(() => {
      bootstrap.ScrollSpy.getInstance(document.body)?.refresh();
      forceActiveNav(href);
    }, 450);
  });
});

function forceActiveNav(href) {
  document.querySelectorAll("#mainNav .nav-link").forEach(a => a.classList.remove("active"));
  document.querySelector(`#mainNav a.nav-link[href="${href}"]`)?.classList.add("active");
}

// Form validation + toast (only keep if you still have #contactForm and #sentToast)
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  form.classList.add("was-validated");
  const toastEl = document.getElementById("sentToast");
  if (toastEl) new bootstrap.Toast(toastEl).show();

  form.reset();
  form.classList.remove("was-validated");
});


// -------- Education year filters (Year 1–4) --------
const educationData = {
  1: {
    sem1: [
      { module: "Critical Skills Development", grade: "B" },
      { module: "Discrete Mathematics 1", grade: "B+" },
      { module: "Business & Information Systems", grade: "C" },
      { module: "Visual Design & User Experience", grade: "B+" },
      { module: "Computer Architecture", grade: "A" },
      { module: "Software Development 1", grade: "A" },
    ],
    sem2: [
      { module: "Operating System Fundamentals", grade: "B" },
      { module: "Database Fundamentals", grade: "A" },
      { module: "Social Media Communications", grade: "D" },
      { module: "Systems Analysis", grade: "B" },
      { module: "Software Development 2", grade: "A" },
      { module: "Statistics", grade: "B+" },
    ],
  },
  2: {
    sem1: [
      { module: "Client Side Web Development", grade: "C" },
      { module: "Discrete Mathematics 2", grade: "B+" },
      { module: "Advanced Database Technologies", grade: "B" },
      { module: "Network Fundementals", grade: "B" },
      { module: "Software Quality Assurance & Testing", grade: "C" },
      { module: "Software Development 3", grade: "C" },
    ],
    sem2: [
      { module: "Information Security", grade: "B-" },
      { module: "Database Admin & Analysis", grade: "C" },
      { module: "Management Science", grade: "A" },
      { module: "Routing & Switching Essentials", grade: "B" },
      { module: "Project", grade: "D" },
      { module: "Software Development 4", grade: "A" },
    ],
  },
  3: {
    sem1: [
      { module: "Data Analysis", grade: "B+" },
      { module: "Data Structures & Algorithms", grade: "B+" },
      { module: "Big Data Technologies", grade: "C+" },
      { module: "Cloud Service & Distributed Computing", grade: "D" },
      { module: "Operating Systems", grade: "B" },
      { module: "Server-side Web Development", grade: "D" },
    ]
  },
  4: {
    sem1: [
      { module: "Enterprise Performance Architecture", grade: "TBC" },
      { module: "Applied Machine Learning", grade: "TBC" },
      { module: "Software Architecture", grade: "TBC" },
      { module: "Interactive Media Design & Visualisation", grade: "TBC" },
      { module: "Project", grade: "TBC" },
    ],
    sem2: [
      { module: "Project", grade: "TBC" },
      { module: "Software Architecture", grade: "TBC" },
      { module: "TBC", grade: "TBC" },
      { module: "TBC", grade: "TBC" },
      { module: "TBC", grade: "TBC" },
    ],
  },
};

const yearButtons = document.querySelectorAll(".year-btn");
const eduYearLabel = document.getElementById("eduYearLabel");
const sem1Body = document.getElementById("sem1Body");
const sem2Body = document.getElementById("sem2Body");

function renderSemester(tbody, rows) {
  if (!tbody) return;
  tbody.innerHTML = rows
    .map(
      (r) => `
      <tr>
        <td>${r.module}</td>
        <td class="text-end">${r.grade}</td>
      </tr>`
    )
    .join("");
}


function getYearLabel(year) {
  switch (year) {
    case "1": return "First Year Modules";
    case "2": return "Second Year Modules";
    case "3": return "Third Year Modules";
    case "4": return "Fourth Year Modules";
    default: return "";
  }
}


function setEducationYear(year) {
  const data = educationData[year];
  if (!data) return;

  // Update heading text
  eduYearLabel.textContent = getYearLabel(year);

  // Semester 1 (always shown)
  renderSemester(sem1Body, data.sem1);
  document.getElementById("sem1Col").style.display = "";

  // Semester 2 (only if it exists)
  if (data.sem2) {
    renderSemester(sem2Body, data.sem2);
    document.getElementById("sem2Col").style.display = "";
  } else {
    document.getElementById("sem2Col").style.display = "none";
  }

  // Refresh ScrollSpy (height changes)
  bootstrap.ScrollSpy.getInstance(document.body)?.refresh();
}


// button events
yearButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    yearButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    setEducationYear(btn.dataset.year);
  });
});

// default
setEducationYear("1");

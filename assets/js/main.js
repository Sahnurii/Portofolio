function initScrollAnimation() {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("opacity-100", "translate-y-0");
                    entry.target.classList.remove("opacity-0", "translate-y-6");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    document.querySelectorAll(".scroll-animate").forEach(el => {
        observer.observe(el);
    });
}

function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");

                    navLinks.forEach((link) => {
                        const isActive = link.getAttribute("href") === `#${id}`;
                        link.classList.toggle("active", isActive);
                    });
                }
            });
        },
        {
            rootMargin: "-40% 0px -50% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => observer.observe(section));
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link") || e.target.classList.contains("mobile-link")) {
        document.querySelectorAll(".nav-link, .mobile-link").forEach((l) => {
            l.classList.remove("active");
        });

        e.target.classList.add("active");

        const href = e.target.getAttribute("href");
        document.querySelectorAll(`[href="${href}"]`).forEach(link => {
            link.classList.add("active");
        });
    }
});


function initMobileMenu() {
    const mobileBtn = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!mobileBtn || !mobileMenu) return;

    mobileBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });

    // optional: auto close saat klik link
    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
        });
    });
}

let loadedSections = new Set();

document.addEventListener("sectionLoaded", (e) => {

    initScrollAnimation();

    if (e.detail === "header") {
        initMobileMenu();
        setTimeout(() => {
            initScrollSpy();
        }, 100);
    }

    if (e.detail === "skills") {
        loadSkills();
    }

    if (e.detail === "projects") {
        loadProjects();
    }

    if (e.detail === "organization") {
        loadOrganizations();
    }

    if (e.detail === "experience") {
        loadExperience();
    }
});

window.addEventListener("load", () => {
    setTimeout(() => {
        initScrollSpy();
    }, 200);
});

function loadSkills() {
    fetch("data/skills.json")
        .then(res => res.json())
        .then(data => {
            renderTechSkills(data.technical);
            renderSoftSkills(data.soft);
        })
        .catch(err => console.error("Error loading skills:", err));
}

function renderTechSkills(skills) {
    const container = document.getElementById("tech-skills");

    skills.forEach(skill => {
        const div = document.createElement("div");
        div.className =
            "flex flex-col items-center justify-center p-4 border rounded-xl hover:shadow-md transition bg-gray-50";

        div.innerHTML = `
  <div class="w-14 h-14 flex items-center justify-center mb-3">
    <img src="assets/icons/tech/${skill.icon}"
         alt="${skill.name}"
         class="max-w-full max-h-full object-contain">
  </div>
  <span class="text-sm font-medium text-gray-700 text-center">
    ${skill.name}
  </span>
`;


        container.appendChild(div);
    });
}

function renderSoftSkills(skills) {
    const container = document.getElementById("soft-skills");

    skills.forEach(skill => {
        const span = document.createElement("span");
        span.className =
            "px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium";

        span.textContent = skill;
        container.appendChild(span);
    });
}


function loadOrganizations() {
    fetch("data/organizations.json")
        .then(res => res.json())
        .then(data => {
            renderOrganizationDesktop(data);
            renderOrganizationMobile(data);
            initOrganizationScroll();
        })
        .catch(err => console.error("Organization load error:", err));
}

function createOrganizationCard(item, isMobile = false) {
    const card = document.createElement("div");

    if (isMobile) {
        card.className = `
            min-w-[85vw] sm:min-w-[400px] max-w-[85vw] sm:max-w-[400px]
            bg-white rounded-2xl shadow-lg overflow-hidden
            snap-start snap-always
            flex flex-col
            hover:shadow-2xl transition-all duration-300
            transform hover:-translate-y-1
        `;
    } else {
        card.className = `
            bg-white rounded-2xl shadow-lg overflow-hidden
            hover:shadow-2xl transition-all duration-300
            transform hover:-translate-y-2
            flex flex-col h-full
        `;
    }

    card.innerHTML = `
        <!-- Header with Logo -->
        <div class="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div class="relative flex items-center gap-4">
                <div class="w-16 h-16 bg-white rounded-xl p-2 shadow-lg flex items-center justify-center flex-shrink-0">
                    <img src="assets/icons/org/${item.logo}"
                         alt="${item.organization}"
                         class="w-full h-full object-contain"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236366f1%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4%22/%3E%3C/svg%3E'">
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="text-white font-bold text-lg leading-tight mb-1 line-clamp-2">
                        ${item.role}
                    </h3>
                    <div class="flex items-center gap-2 text-white/90 text-xs">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="font-medium">${item.period}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Body -->
        <div class="p-6 flex-1 flex flex-col">
            <!-- Organization Name -->
            <div class="mb-4 pb-4 border-b border-gray-100">
                <div class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <p class="text-gray-700 font-medium text-sm leading-relaxed">
                        ${item.organization}
                    </p>
                </div>
            </div>

            <!-- Description -->
            <div class="flex-1">
                <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Tanggung Jawab:
                </h4>
                <ul class="space-y-3">
                    ${item.description.map(desc => `
                        <li class="flex items-start gap-3 text-gray-600 text-sm">
                            <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            <span class="leading-relaxed">${desc}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <!-- Footer Badge -->
            <div class="mt-6 pt-4 border-t border-gray-100">
                <div class="flex items-center justify-between">
                    <span class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        Kepemimpinan
                    </span>
                    <span class="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                        Selesai
                    </span>
                </div>
            </div>
        </div>
    `;

    return card;
}

function renderOrganizationDesktop(data) {
    const container = document.getElementById("organization-list-desktop");
    if (!container) return;

    container.innerHTML = "";

    data.forEach(item => {
        const card = createOrganizationCard(item, false);
        container.appendChild(card);
    });
}

function renderOrganizationMobile(data) {
    const container = document.getElementById("organization-list-mobile");
    const dotsContainer = document.getElementById("scroll-dots");

    if (!container) return;

    container.innerHTML = "";

    data.forEach((item, index) => {
        const card = createOrganizationCard(item, true);
        container.appendChild(card);

        // Create dot for this card
        if (dotsContainer) {
            const dot = document.createElement("button");
            dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${index === 0 ? 'bg-blue-600 w-8' : 'bg-gray-300'}`;
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        }
    });
}

function initOrganizationScroll() {
    const container = document.getElementById("organization-list-mobile");
    const leftBtn = document.getElementById("scroll-left");
    const rightBtn = document.getElementById("scroll-right");
    const dotsContainer = document.getElementById("scroll-dots");

    if (!container) return;

    // Get card width
    const getCardWidth = () => {
        const card = container.querySelector('div');
        return card ? card.offsetWidth + 24 : 0; // 24 is gap
    };

    // Scroll left
    leftBtn?.addEventListener("click", () => {
        container.scrollBy({
            left: -getCardWidth(),
            behavior: 'smooth'
        });
    });

    // Scroll right
    rightBtn?.addEventListener("click", () => {
        container.scrollBy({
            left: getCardWidth(),
            behavior: 'smooth'
        });
    });

    // Update dots and buttons on scroll
    const updateScrollIndicators = () => {
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const cardWidth = getCardWidth();
        const currentIndex = Math.round(scrollLeft / cardWidth);

        // Update buttons
        if (leftBtn) {
            leftBtn.disabled = scrollLeft <= 10;
        }
        if (rightBtn) {
            rightBtn.disabled = scrollLeft >= maxScroll - 10;
        }

        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.className = 'w-8 h-2 rounded-full bg-blue-600 transition-all duration-300';
                } else {
                    dot.className = 'w-2 h-2 rounded-full bg-gray-300 transition-all duration-300';
                }
            });
        }
    };

    // Listen to scroll
    container.addEventListener('scroll', updateScrollIndicators);

    // Click dots to scroll
    if (dotsContainer) {
        dotsContainer.addEventListener('click', (e) => {
            const dot = e.target.closest('button');
            if (dot) {
                const index = parseInt(dot.dataset.index);
                container.scrollTo({
                    left: index * getCardWidth(),
                    behavior: 'smooth'
                });
            }
        });
    }

    // Initial update
    updateScrollIndicators();

    // Update on resize
    window.addEventListener('resize', updateScrollIndicators);
}


function loadExperience() {
    fetch("data/experience.json")
        .then(res => res.json())
        .then(data => {
            renderWork(data.work);
            renderTraining(data.training);
            renderCertification(data.certification);
        })
        .catch(err => console.error("Experience load error:", err));
}

// IMPROVED RENDER FUNCTIONS - Replace these in your main.js

function renderWork(items) {
    const container = document.getElementById("experience-work");
    if (!container) return;

    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600";

        div.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div class="flex-1">
                    <h4 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        ${item.title}
                    </h4>
                    <div class="flex items-center gap-2 text-gray-600 mb-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <span class="font-medium">${item.company}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-500 text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>${item.period}</span>
                    </div>
                </div>
            </div>

            <ul class="space-y-3">
                ${item.description.map(d => `
                    <li class="flex items-start gap-3 text-gray-700">
                        <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <span>${d}</span>
                    </li>
                `).join("")}
            </ul>
        `;

        container.appendChild(div);
    });
}

function renderTraining(items) {
    const container = document.getElementById("experience-training");
    if (!container) return;

    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-green-600";

        div.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div class="flex-1">
                    <h4 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        ${item.title}
                    </h4>
                    <div class="flex items-center gap-2 text-gray-600 mb-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <span class="font-medium">${item.institution}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-500 text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>${item.period}</span>
                    </div>
                </div>
            </div>

            <ul class="space-y-3">
                ${item.description.map(d => `
                    <li class="flex items-start gap-3 text-gray-700">
                        <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <span>${d}</span>
                    </li>
                `).join("")}
            </ul>
        `;

        container.appendChild(div);
    });
}

function renderCertification(items) {
    const container = document.getElementById("experience-certification");
    if (!container) return;

    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = `
            group bg-white rounded-2xl overflow-hidden shadow-sm 
            hover:shadow-2xl transition-all duration-300
            transform hover:-translate-y-2
        `;

        div.innerHTML = `
            <!-- Certificate Image -->
            <div class="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                ${item.image
                ? `<img src="assets/img/certificates/${item.image}" 
                           alt="${item.name}" 
                           class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                           onerror="this.src='https://via.placeholder.com/400x200/6366f1/ffffff?text=Certificate'">`
                : `<div class="w-full h-full flex items-center justify-center">
                           <svg class="w-20 h-20 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                               <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                           </svg>
                       </div>`
            }
                
                <!-- Badge Overlay -->
                <div class="absolute top-3 right-3">
                    <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-600 text-xs font-bold rounded-full shadow-lg">
                        ${item.year}
                    </span>
                </div>
            </div>

            <!-- Certificate Info -->
            <div class="p-6">
                <h4 class="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    ${item.name}
                </h4>
                
                <div class="flex items-center gap-2 text-gray-600 mb-4">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-sm font-medium">${item.issuer}</span>
                </div>

                ${item.skills ? `
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${item.skills.map(skill => `
                            <span class="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full">
                                ${skill}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}

                ${item.credentialUrl ? `
                    <a href="${item.credentialUrl}" 
                       target="_blank" 
                       class="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium group/link">
                        <span>Lihat Kredensial</span>
                        <svg class="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                    </a>
                ` : ''}
            </div>
        `;

        container.appendChild(div);
    });
}

function loadProjects() {
    fetch("data/projects.json")
        .then(res => res.json())
        .then(data => {
            renderProjectDesktop(data);
            renderProjectMobile(data);
            initProjectScroll();
            initModalHandlers();
        })
        .catch(err => console.error("Project load error:", err));
}

function createProjectCard(project, isMobile = false) {
    const card = document.createElement("div");

    if (isMobile) {
        card.className = `
            min-w-[85vw] sm:min-w-[400px] max-w-[85vw] sm:max-w-[400px]
            bg-white rounded-2xl shadow-lg overflow-hidden
            snap-start snap-always
            flex flex-col
            hover:shadow-2xl transition-all duration-300
            transform hover:-translate-y-1
        `;
    } else {
        card.className = `
            bg-white rounded-2xl shadow-lg overflow-hidden
            hover:shadow-2xl transition-all duration-300
            transform hover:-translate-y-2
            flex flex-col h-full
        `;
    }

    card.innerHTML = `
        <!-- Header with Image -->
        <div class="relative bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden cursor-pointer group" onclick="openModal('assets/img/projects/${project.image}')">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div class="relative h-48">
                <img
                    src="assets/img/projects/${project.image}"
                    alt="${project.title}"
                    class="w-full h-full object-cover"
                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%23ffffff%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z%22/%3E%3C/svg%3E'"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <svg class="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
                    </svg>
                </div>
            </div>

            <div class="absolute top-4 right-4">
                <span class="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full text-xs font-bold shadow-lg">
                    ${project.year}
                </span>
            </div>
        </div>

        <!-- Body -->
        <div class="p-6 flex-1 flex flex-col">
            <div class="mb-4 pb-4 border-b border-gray-100">
                <h3 class="font-bold text-xl text-gray-900 line-clamp-2 mb-2">
                    ${project.title}
                </h3>
            </div>

            <div class="flex-1 mb-4">
                <p class="text-sm text-gray-600 leading-relaxed">
                    ${project.description}
                </p>
            </div>

            <div class="mb-4">
                <h4 class="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                    </svg>
                    Teknologi:
                </h4>
                <div class="flex flex-wrap gap-2">
                    ${project.tech.map(tech =>
        `<span class="badge-tech px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full font-medium cursor-default">${tech}</span>`
    ).join("")}
                </div>
            </div>

            <div class="pt-4 border-t border-gray-100">
                ${project.link ? `
                    <a href="${project.link}" target="_blank" class="inline-flex items-center justify-center gap-2 w-full text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg">
                        Lihat Proyek
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                    </a>
                ` : `
                    <div class="inline-flex items-center justify-center gap-2 w-full text-sm text-gray-400 bg-gray-100 font-medium py-3 px-4 rounded-xl cursor-not-allowed">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        Private Project
                    </div>
                `}
            </div>
        </div>
    `;

    return card;
}

function renderProjectDesktop(data) {
    const container = document.getElementById("project-list-desktop");
    if (!container) return;

    container.innerHTML = "";

    data.forEach(project => {
        const card = createProjectCard(project, false);
        container.appendChild(card);
    });
}

function renderProjectMobile(data) {
    const container = document.getElementById("project-list-mobile");
    const dotsContainer = document.getElementById("scroll-dots-project");

    if (!container) return;

    container.innerHTML = "";
    if (dotsContainer) dotsContainer.innerHTML = "";

    data.forEach((project, index) => {
        const card = createProjectCard(project, true);
        container.appendChild(card);

        if (dotsContainer) {
            const dot = document.createElement("button");
            dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${index === 0 ? 'bg-blue-600 w-8' : 'bg-gray-300'}`;
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        }
    });
}

function initProjectScroll() {
    const container = document.getElementById("project-list-mobile");
    const leftBtn = document.getElementById("scroll-left-project");
    const rightBtn = document.getElementById("scroll-right-project");
    const dotsContainer = document.getElementById("scroll-dots-project");

    if (!container) return;

    const getCardWidth = () => {
        const card = container.querySelector('div');
        return card ? card.offsetWidth + 24 : 0;
    };

    leftBtn?.addEventListener("click", () => {
        container.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    });

    rightBtn?.addEventListener("click", () => {
        container.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    });

    const updateScrollIndicators = () => {
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const cardWidth = getCardWidth();
        const currentIndex = Math.round(scrollLeft / cardWidth);

        if (leftBtn) leftBtn.disabled = scrollLeft <= 10;
        if (rightBtn) rightBtn.disabled = scrollLeft >= maxScroll - 10;

        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.className = index === currentIndex
                    ? 'w-8 h-2 rounded-full bg-blue-600 transition-all duration-300'
                    : 'w-2 h-2 rounded-full bg-gray-300 transition-all duration-300';
            });
        }
    };

    container.addEventListener('scroll', updateScrollIndicators);

    if (dotsContainer) {
        dotsContainer.addEventListener('click', (e) => {
            const dot = e.target.closest('button');
            if (dot) {
                const index = parseInt(dot.dataset.index);
                container.scrollTo({ left: index * getCardWidth(), behavior: 'smooth' });
            }
        });
    }

    updateScrollIndicators();
    window.addEventListener('resize', updateScrollIndicators);
}

// Modal functionality
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    if (!modal || !modalImg) return;

    modal.classList.add('active');
    modalImg.src = imageSrc;
    document.body.style.overflow = 'hidden';
}

// Initialize modal close handlers
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Load projects
    loadProjects();
});

// Fungsi untuk inisialisasi modal handlers
function initModalHandlers() {
    const modal = document.getElementById('imageModal');
    const closeModalBtn = document.querySelector('.close-modal');

    if (!modal || !closeModalBtn) return;

    // Close button click
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Click outside modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}
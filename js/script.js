/**
 * Show/hide a modal based on its ID.
 * @param {string} modalId - The Id of the modal to show or hide.
 */
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('active');
    } else {
        console.error(`Errore: Modal con ID '${modalId}' non trovato.`);
    }
}

/**
 * Toggle the visibility of the notifications dropdown.
 * @param {Event} event - The click event.
 */
function toggleNotifications(event) {
    if (event) {
        event.stopPropagation();
    }
    const dropdown = document.getElementById('notifications-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

/**
 * Clear all notifications (mark as read).
 * @param {Event} event - The click event.
 */
function clearNotifications(event) {
    if (event) {
        event.stopPropagation();
    }
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.style.display = 'none';
    }
}

/**
 * Toggle the sidebar navigation menu on mobile devices.
 * @param {Event} event - The click event.
 */
function toggleSidebarMenu(event) {
    if (event) {
        event.stopPropagation();
    }
    const sidebarNav = document.querySelector('.sidebar-nav');
    const hamburgerBtn = document.getElementById('hamburger-menu');
    if (sidebarNav && hamburgerBtn) {
        const isActive = sidebarNav.classList.toggle('active');
        const iconSpan = hamburgerBtn.querySelector('.material-symbols-outlined');
        if (iconSpan) {
            iconSpan.textContent = isActive ? 'close' : 'menu';
        }
    }
}

/**
 * Dynamically add a course on a day in the calendar.
 * @param {string} dayId - The element Id of the day (es. 'day-3').
 * @param {object} courseData - Object containing the course infos (title, professor, room).
 */
function addCourseToCalendar(dayId, courseData) {
    const dayElement = document.getElementById(dayId);
    if (!dayElement) {
        console.warn(`Giorno con ID '${dayId}' non trovato nel calendario.`);
        return;
    }

    const eventHtml = `
        <div class="calendar-event" onclick="showCourseDetails('${courseData.title}')">
            <div class="event-title">${courseData.title}</div>
            <div class="event-prof"><span class="material-symbols-outlined">person</span> ${courseData.professor}</div>
            <div class="event-class"><span class="material-symbols-outlined">room</span> ${courseData.room}</div>
        </div>
    `;
    
    dayElement.insertAdjacentHTML('beforeend', eventHtml);
}

/**
 * Function to manage the click on a course card.
 * @param {string} title - Course's title.
 */
function showCourseDetails(title) {
    console.log(`Visualizzazione dei dettagli per: ${title}`);
    alert(`Hai selezionato il corso: ${title}`);
}

/**
 * Inizializza la funzionalità di ricerca e filtraggio nella tabella dei corsi disponibili.
 */
function initCourseSearch() {
    const searchForm = document.forms['search-courses'];
    if (!searchForm) return;

    const courseNameInput = document.getElementById('search-course-name');
    const profNameInput = document.getElementById('search-prof-name');
    const tableBody = document.querySelector('table tbody');

    if (!tableBody) return;

    function filterCourses() {
        const courseQuery = courseNameInput ? courseNameInput.value.toLowerCase().trim() : '';
        const profQuery = profNameInput ? profNameInput.value.toLowerCase().trim() : '';

        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            if (cols.length >= 3) {
                const subject = cols[1].textContent.toLowerCase();
                const professor = cols[2].textContent.toLowerCase();

                const matchesCourse = courseQuery === '' || subject.includes(courseQuery);
                const matchesProf = profQuery === '' || professor.includes(profQuery);

                if (matchesCourse && matchesProf) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        filterCourses();
    });

    if (courseNameInput) {
        courseNameInput.addEventListener('input', filterCourses);
    }
    if (profNameInput) {
        profNameInput.addEventListener('input', filterCourses);
    }
}

/**
 * Inizializza la funzionalità di ordinamento dinamico per le card dei corsi (courses.html).
 */
function initCourseSort() {
    const sortSelect = document.getElementById('sort-courses-select');
    // Seleziona la griglia specifica delle card dei corsi (escludendo la sezione delle statistiche)
    const cardContainer = document.querySelector('.main-content .grid-2');

    if (!sortSelect || !cardContainer) return;

    sortSelect.addEventListener('change', () => {
        const criteria = sortSelect.value;
        const cards = Array.from(cardContainer.children);

        cards.sort((a, b) => {
            // Lettura del titolo della card (Nome Corso)
            const titleA = a.querySelector('.card-title')?.textContent.trim().toLowerCase() || '';
            const titleB = b.querySelector('.card-title')?.textContent.trim().toLowerCase() || '';

            // Lettura dei crediti dall'elemento <strong> nell'header della card
            const strongA = a.querySelector('.card-header strong')?.textContent || '';
            const strongB = b.querySelector('.card-header strong')?.textContent || '';
            const creditsA = parseInt(strongA) || 0;
            const creditsB = parseInt(strongB) || 0;

            switch (criteria) {
                case 'name-asc':
                    return titleA.localeCompare(titleB);
                case 'name-desc':
                    return titleB.localeCompare(titleA);
                case 'credits-asc':
                    return creditsA - creditsB;
                case 'credits-desc':
                    return creditsB - creditsA;
                default:
                    return 0;
            }
        });

        // Svuota il contenitore e riappende le card nell'ordine corretto
        cardContainer.innerHTML = '';
        cards.forEach(card => cardContainer.appendChild(card));
    });
}

// Initialization of the events at the load of the DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // Sidebar Navigation logic
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(link => {
        link.addEventListener('click', function() {
            navItems.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Tabs logic
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const parent = tab.parentElement;
            parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Close notifications dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('notifications-dropdown');
        const container = document.querySelector('.notifications-dropdown-container');
        if (dropdown && dropdown.classList.contains('active')) {
            if (!container || !container.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        }
    });

    // Close sidebar menu when clicking outside (on mobile)
    document.addEventListener('click', (e) => {
        const sidebarNav = document.querySelector('.sidebar-nav');
        const hamburgerBtn = document.getElementById('hamburger-menu');
        if (window.innerWidth <= 768 && sidebarNav && sidebarNav.classList.contains('active')) {
            if (!sidebarNav.contains(e.target) && (!hamburgerBtn || !hamburgerBtn.contains(e.target))) {
                sidebarNav.classList.remove('active');
                const iconSpan = hamburgerBtn.querySelector('.material-symbols-outlined');
                if (iconSpan) {
                    iconSpan.textContent = 'menu';
                }
            }
        }
    });

    // Mark notification as read when clicked
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.remove('unread');
            const unreadCount = document.querySelectorAll('.notification-item.unread').length;
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                if (unreadCount > 0) {
                    badge.textContent = unreadCount;
                } else {
                    badge.style.display = 'none';
                }
            }
        });
    });

    // Inizializza la ricerca dei corsi (se presente nella pagina)
    initCourseSearch();

    // Inizializza l'ordinamento delle card dei corsi (se presente nella pagina)
    initCourseSort();

    // Example of the use of the JS ,let's add day 4
    addCourseToCalendar('day-4', {
        title: 'Programmazione Web',
        professor: 'Prof. Neri',
        room: 'Lab 42'
    });
});
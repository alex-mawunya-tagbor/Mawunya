// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hero rotation
const heroSection = document.querySelector('.hero');
const backgrounds = [
    'url("files/hero-bg.jpeg")',
    'url("files/hero-bg1.jpg")',
    'url("files/hero-bg2.jpg")', 
    'url("files/hero-bg3.jpg")',
    'url("files/hero-bg4.jpg")', 
    'url("files/hero-bg5.jpg")', 
    'url("files/hero-bg6.jpg")',
    'url("files/hero-bg7.jpg")', 
    'url("files/hero-bg8.jpg")',
    'url("files/hero-bg9.jpg")',
    'url("files/hero-bg10.jpg")', 
    'url("files/hero-bg11.jpg")',
];
// Preload hero background images
backgrounds.forEach(url => {
    const img = new Image();
    img.src = url.slice(5, -2);
});
let currentBackground = 0;
function changeBackground() {
    currentBackground = (currentBackground + 1) % backgrounds.length;
    heroSection.style.backgroundImage = backgrounds[currentBackground];
}
setInterval(changeBackground, 5000);

// Night Mode Toggle with localStorage
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
    if (savedTheme === 'dark-mode') {
        themeToggleBtn.innerHTML = '<i class="uil uil-sun"></i>';
    }
}
themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    if (isDarkMode) {
        themeToggleBtn.innerHTML = '<i class="uil uil-sun"></i>';
        localStorage.setItem('theme', 'dark-mode');
    } else {
        themeToggleBtn.innerHTML = '<i class="uil uil-moon"></i>';
        localStorage.removeItem('theme');
    }
});

// Mobile menu toggle and link functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav_links');
const navItems = document.querySelectorAll('.nav_links li a');
const overlay = document.querySelector('.overlay');

function closeMenu() {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false'); 
}
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
});
navItems.forEach(link => link.addEventListener('click', closeMenu));
overlay.addEventListener('click', closeMenu);

// Form Submission Handling
const contactForm = document.querySelector('.contact_form');
const formStatusMessage = document.getElementById('form-status-message');

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);
    const formUrl = contactForm.action;

    try {
        const response = await fetch(formUrl, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            formStatusMessage.textContent = 'Message sent successfully! Thank you.';
            formStatusMessage.classList.remove('error');
            formStatusMessage.classList.add('success');
            contactForm.reset();
        } else {
            const data = await response.json();
            if (data.errors) {
                formStatusMessage.textContent = data.errors.map(error => error.message).join(', ');
            } else {
                formStatusMessage.textContent = 'Oops! There was an error sending your message.';
            }
            formStatusMessage.classList.remove('success');
            formStatusMessage.classList.add('error');
        }
    } catch (error) {
        formStatusMessage.textContent = 'Network error. Please try again later.';
        formStatusMessage.classList.remove('success');
        formStatusMessage.classList.add('error');
        console.error('Form submission error:', error);
    } finally {
        submitBtn.disabled = false;
        formStatusMessage.style.opacity = '1';
        formStatusMessage.style.visibility = 'visible';
        setTimeout(() => {
            formStatusMessage.style.opacity = '0';
            formStatusMessage.style.visibility = 'hidden';
            formStatusMessage.textContent = '';
        }, 5000);
    }
});

// ======================================
// Modal & TWO independent sliders
// ======================================
const modal = document.getElementById('projectModal');
const closeButton = document.querySelector('.close-button');
const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

const modalTitle = document.getElementById('modalTitle');
const modalSection1 = document.getElementById('modalSection1');
const modalSection1Title = document.getElementById('modalSection1Title');
const modalSection1Text = document.getElementById('modalSection1Text');
const modalSection2 = document.getElementById('modalSection2');
const modalSection2Title = document.getElementById('modalSection2Title');
const modalSection2Text = document.getElementById('modalSection2Text');

const mediaContainer1 = document.getElementById('mediaSliderContainer1');
const mediaContainer2 = document.getElementById('mediaSliderContainer2');

// Helpers
function clearContainer(container) {
    const slider = container.querySelector('.modal-media-slider');
    slider.innerHTML = '';
}

// Create a media element with optional description
function createMediaElement(item) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("slide");

    let src, desc;
    if (typeof item === "string") {
        src = item;
        desc = null;
    } else {
        src = item.src;
        desc = item.desc || null;
    }

    const ext = src.split('.').pop().toLowerCase();
    let media;

    if (['jpg','jpeg','png','gif','webp'].includes(ext)) {
        media = document.createElement("img");
        media.src = src;
        media.alt = desc || "Project media";
    } else if (['mp4','webm','ogg'].includes(ext)) {
        media = document.createElement("video");
        media.controls = true;
        const source = document.createElement("source");
        source.src = src;
        source.type = "video/mp4";
        media.appendChild(source);
    } else if (ext === 'pdf') {
        media = document.createElement("iframe");
        media.src = src;
        media.style.width = '100%';
        media.style.height = '500px';
        media.style.border = 'none';
    } else {
        media = document.createElement("a");
        media.href = src;
        media.textContent = "Open link";
        media.target = "_blank";
    }

    wrapper.appendChild(media);

    if (desc) {
        const caption = document.createElement("p");
        caption.classList.add("media-desc");
        caption.textContent = desc;
        wrapper.appendChild(caption);
    }

    return wrapper;
}

function initSlider(container) {
    const slider = container.querySelector('.modal-media-slider');
    const slides = slider.querySelectorAll('.slide');
    let current = 0;

    function update() {
        slider.style.transform = `translateX(-${current * 100}%)`;
    }
    const prev = container.querySelector('.prev-button');
    const next = container.querySelector('.next-button');

    prev.onclick = () => { current = (current - 1 + slides.length) % slides.length; update(); };
    next.onclick = () => { current = (current + 1) % slides.length; update(); };
    update();
}

// Build media for a section
function buildMedia(container, listOrLinks) {
    clearContainer(container);

    const slider = container.querySelector('.modal-media-slider');
    if (!listOrLinks || listOrLinks.length === 0) {
        container.style.display = 'none';
        return;
    }

    listOrLinks.forEach(item => {
        if (typeof item === 'string' || (item && item.src)) {
            // plain URL or {src, desc}
            slider.appendChild(createMediaElement(item));
        } else if (item && item.url) {
            // link object {url, text}
            const slide = document.createElement('div');
            slide.classList.add('slide');
            const ext = item.url.split('.').pop().toLowerCase();
            if (ext === 'pdf') {
                const iframe = document.createElement('iframe');
                iframe.src = item.url;
                iframe.style.width = '100%';
                iframe.style.height = '500px';
                iframe.style.border = 'none';
                slide.appendChild(iframe);
            } else {
                const a = document.createElement('a');
                a.href = item.url;
                a.textContent = item.text || 'Open link';
                a.target = '_blank';
                slide.appendChild(a);
            }
            slider.appendChild(slide);
        }
    });

    container.style.display = 'block';
    initSlider(container);
}

// Show modal
function showProjectModal(e) {
    e.preventDefault();
    const btn = e.currentTarget; 

    modalTitle.textContent = btn.getAttribute('data-title') || '';

    // Reset sections & media
    [mediaContainer1, mediaContainer2].forEach(c => { c.style.display = 'none'; clearContainer(c); });
    modalSection1.style.display = 'none';
    modalSection2.style.display = 'none';

    // Section 1 content
    const s1Title = btn.getAttribute('data-section1-title');
    const s1Text  = btn.getAttribute('data-section1-text');
    if (s1Title && s1Text) {
        modalSection1Title.textContent = s1Title;
        modalSection1Text.textContent  = s1Text;
        modalSection1.style.display = 'block';
    }

    // Section 2 content
    const s2Title = btn.getAttribute('data-section2-title');
    const s2Text  = btn.getAttribute('data-section2-text');
    if (s2Title && s2Text) {
        modalSection2Title.textContent = s2Title;
        modalSection2Text.textContent  = s2Text;
        modalSection2.style.display = 'block';
    }

    // Media for Section 1
    let links = [];
    let media1 = [];
    const linksData = btn.getAttribute('data-links');
    if (linksData) {
        try { links = JSON.parse(linksData); } catch {}
    }
    const media1Data = btn.getAttribute('data-media');
    if (media1Data) {
        try { media1 = JSON.parse(media1Data); } catch {}
    }
    buildMedia(mediaContainer1, [...links, ...media1]);

    // Media for Section 2
    let media2 = [];
    const media2Data = btn.getAttribute('data-media2');
    if (media2Data) {
        try { media2 = JSON.parse(media2Data); } catch {}
    }
    buildMedia(mediaContainer2, media2);

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Bind open
viewDetailsButtons.forEach(button => {
    button.addEventListener('click', showProjectModal);
});

// Close modal
function hideModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}
closeButton.addEventListener('click', hideModal);
window.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideModal(); });

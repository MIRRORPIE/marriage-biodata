// ===== State =====
let currentLang = 'en';
let biodataCache = null;

// ===== Age Calculation =====
function calculateAge(dobString) {
  const months = {
    january:0, february:1, march:2, april:3, may:4, june:5,
    july:6, august:7, september:8, october:9, november:10, december:11
  };
  const parts = dobString.trim().split(/\s+/);
  if (parts.length !== 3) return '';
  const day = parseInt(parts[0]);
  const month = months[parts[1].toLowerCase()];
  const year = parseInt(parts[2]);
  if (isNaN(day) || month === undefined || isNaN(year)) return '';
  const dob = new Date(year, month, day);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return String(age) + ' years';
}

// ===== Label Mappings =====
const labelsEn = {
  dateOfBirth: "Date of Birth", age: "Age",
  birthPlace: "Birth Place", height: "Height", complexion: "Complexion",
  gotra: "Gotra", caste: "Caste", mulBan: "Mul / Ban", motherTongue: "Mother Tongue",
  qualification: "Qualification",
  currentStatus: "Current Status", ctetQualification: "CTET",
  stetQualification: "STET", otherAchievements: "Other Achievements",
  fatherName: "Father's Name", fatherOccupation: "Father's Occupation",
  motherName: "Mother's Name", motherOccupation: "Mother's Occupation",
  brother: "Brother", sister: "Sister",
  address: "Address", phone: "Phone", whatsapp: "WhatsApp"
};

const labelsHi = {
  dateOfBirth: "जन्म तिथि", age: "उम्र",
  birthPlace: "जन्म स्थान", height: "ऊँचाई", complexion: "रंग",
  gotra: "गोत्र", caste: "जाति", mulBan: "मूल / बाण", motherTongue: "मातृभाषा",
  qualification: "शिक्षा",
  currentStatus: "वर्तमान स्थिति", ctetQualification: "CTET",
  stetQualification: "STET", otherAchievements: "अन्य उपलब्धियाँ",
  fatherName: "पिता का नाम", fatherOccupation: "पिता का व्यवसाय",
  motherName: "माता का नाम", motherOccupation: "माता का व्यवसाय",
  brother: "भाई", sister: "बहन",
  address: "पता", phone: "फ़ोन", whatsapp: "व्हाट्सएप"
};

// ===== Helpers =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getLabels() {
  return currentLang === 'hi' ? labelsHi : labelsEn;
}

function renderDetails(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data) return;
  const labels = getLabels();
  let html = '';
  for (const [key, value] of Object.entries(data)) {
    if (key === 'name' || key === 'photo') continue;
    const label = labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
    html += `<div class="detail-row">
      <div class="detail-label">${escapeHtml(label)}</div>
      <div class="detail-value">${escapeHtml(value)}</div>
    </div>`;
  }
  container.innerHTML = html;
}

// ===== Gallery =====
let carouselIndex = 0;
let carouselTotal = 0;
let carouselAutoTimer = null;
let carouselPhotos = [];

function renderGallery(photos) {
  const section = document.getElementById('gallerySection');
  if (!photos || photos.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';
  carouselPhotos = photos;
  carouselTotal = photos.length;
  carouselIndex = 0;

  // Desktop grid
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = photos.map(src =>
    `<div class="gallery-item" onclick="openLightbox('${escapeHtml(src)}')">
      <img src="${escapeHtml(src)}" alt="Gallery Photo" loading="lazy">
    </div>`
  ).join('');

  // Mobile carousel slides
  const track = document.getElementById('carouselTrack');
  track.innerHTML = photos.map(src =>
    `<div class="carousel-slide" onclick="openLightbox('${escapeHtml(src)}')">
      <img src="${escapeHtml(src)}" alt="Gallery Photo" loading="lazy">
    </div>`
  ).join('');

  // Dots
  const dotsEl = document.getElementById('carouselDots');
  dotsEl.innerHTML = photos.map((_, i) =>
    `<button class="carousel-dot${i === 0 ? ' active' : ''}" onclick="carouselGoTo(${i})" aria-label="Slide ${i + 1}"></button>`
  ).join('');

  // Nav buttons
  document.getElementById('carouselPrev').onclick = () => { carouselGoTo(carouselIndex - 1); carouselResetAuto(); };
  document.getElementById('carouselNext').onclick = () => { carouselGoTo(carouselIndex + 1); carouselResetAuto(); };

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { carouselGoTo(carouselIndex + (diff > 0 ? 1 : -1)); carouselResetAuto(); }
  }, { passive: true });

  carouselGoTo(0);
  carouselStartAuto();
}

function carouselGoTo(index) {
  carouselIndex = ((index % carouselTotal) + carouselTotal) % carouselTotal;
  document.getElementById('carouselTrack').style.transform = `translateX(-${carouselIndex * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((d, i) =>
    d.classList.toggle('active', i === carouselIndex)
  );
}

function carouselStartAuto() {
  carouselStopAuto();
  carouselAutoTimer = setInterval(() => carouselGoTo(carouselIndex + 1), 2000);
}

function carouselStopAuto() {
  if (carouselAutoTimer) { clearInterval(carouselAutoTimer); carouselAutoTimer = null; }
}

function carouselResetAuto() {
  carouselStopAuto();
  carouselStartAuto();
}

function openLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ===== Render All =====
function renderBiodata(data) {
  const isHindi = currentLang === 'hi';
  const src = isHindi && data.hindi ? data.hindi : data;

  // Name
  const hindiPersonal = data.hindi && data.hindi.personal ? data.hindi.personal : null;
  const name = isHindi && hindiPersonal && hindiPersonal.name
    ? hindiPersonal.name : data.personal.name;
  document.getElementById('candidateName').textContent = name || '';

  // Photo
  const photoEl = document.getElementById('profilePhoto');
  if (data.personal.photo) {
    photoEl.src = data.personal.photo;
    photoEl.alt = name || 'Profile Photo';
  } else {
    photoEl.closest('.photo-frame').style.display = 'none';
  }

  // About
  const aboutSection = document.getElementById('aboutSection');
  const aboutText = isHindi && data.aboutMeHindi ? data.aboutMeHindi : data.aboutMe;
  if (aboutText) {
    document.getElementById('aboutText').textContent = aboutText;
    aboutSection.style.display = '';
  } else {
    aboutSection.style.display = 'none';
  }

  // Section titles
  document.querySelectorAll('.section-title span[data-en]').forEach(el => {
    el.textContent = isHindi ? el.dataset.hi : el.dataset.en;
  });

  // Main title & footer
  document.getElementById('mainTitle').textContent = isHindi ? 'विवाह बायोडाटा' : 'Marriage Biodata';
  document.getElementById('footerText').textContent = isHindi
    ? '🙏 इस बायोडाटा को पढ़ने के लिए धन्यवाद 🙏'
    : '🙏 Thank you for taking the time to review this biodata 🙏';

  // Build personal data with auto-calculated age injected after dateOfBirth
  const rawPersonal = src.personal || data.personal;
  const personalOrdered = {};
  for (const [k, v] of Object.entries(rawPersonal)) {
    personalOrdered[k] = v;
    if (k === 'dateOfBirth' && data.personal.dateOfBirth) {
      personalOrdered.age = calculateAge(data.personal.dateOfBirth);
    }
  }

  // Render detail sections
  renderDetails('personalDetails', personalOrdered);
  renderDetails('educationDetails', src.education || data.education);
  renderDetails('careerDetails', src.career || data.career);
  renderDetails('familyDetails', src.family || data.family);
  renderDetails('contactDetails', src.contact || data.contact);

  // Gallery
  renderGallery(data.galleryPhotos);

  // Page title
  if (data.personal.name) {
    document.title = `${data.personal.name} - ${isHindi ? 'विवाह बायोडाटा' : 'Marriage Biodata'}`;
  }
}

// ===== Language Toggle =====
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  document.getElementById('langToggle').textContent = currentLang === 'en' ? 'हिन्दी' : 'English';
  document.body.classList.toggle('hindi', currentLang === 'hi');
  if (biodataCache) renderBiodata(biodataCache);
}

// ===== PDF Download =====
function downloadPDF() {
  const btn = document.getElementById('pdfBtn');
  const originalText = btn.textContent;
  btn.textContent = '⏳ Generating...';
  btn.disabled = true;

  const element = document.getElementById('biodataContent');
  const actionBar = document.querySelector('.action-bar');
  const gallerySection = document.getElementById('gallerySection');
  actionBar.style.display = 'none';
  gallerySection.style.display = 'none';

  const opt = {
    margin: [10, 10, 10, 10],
    filename: ((biodataCache && biodataCache.personal && biodataCache.personal.name) ? biodataCache.personal.name : 'biodata').replace(/\s+/g, '_') + '_Biodata.pdf',
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    actionBar.style.display = '';
    gallerySection.style.display = '';
    btn.textContent = originalText;
    btn.disabled = false;
  }).catch(() => {
    actionBar.style.display = '';
    gallerySection.style.display = '';
    btn.textContent = originalText;
    btn.disabled = false;
  });
}

// ===== Init =====
async function loadBiodata() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error('Failed to load data');
    biodataCache = await response.json();
    renderBiodata(biodataCache);
  } catch (error) {
    console.error('Error loading biodata:', error);
    document.getElementById('biodataContent').innerHTML =
      '<p style="text-align:center;padding:40px;color:#888;">Unable to load biodata. Please check data.json file.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadBiodata);

'use strict';

// ==========================================
// 1. دوال مساعدة لتنسيق المحتوى (Helper Functions)
// ==========================================

const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// تلوين كود C++
function highlight(source) {
  const tokens = /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:class|public|private|protected|return|const|void|int|double|bool|virtual|override|for|if|else|using|namespace|this|true|false|new|delete|include)\b|\b(?:string|Student|Person|Shape|Rectangle|Circle|Resource)\b|\b\d+(?:\.\d+)?\b)/g;
  let result = '', offset = 0;
  for (const match of source.matchAll(tokens)) {
    result += escapeHTML(source.slice(offset, match.index));
    const token = match[0];
    const kind = token.startsWith('//') ? 'comment' : /^["']/.test(token) ? 'str' : /^\d/.test(token) ? 'num' : /^(string|Student|Person|Shape|Rectangle|Circle|Resource)$/.test(token) ? 'type' : 'kw';
    result += `<span class="${kind}">${escapeHTML(token)}</span>`;
    offset = match.index + token.length;
  }
  return result + escapeHTML(source.slice(offset));
}

// صندوق كود مع إمكانية عرض المخرجات والوسم
const code = (source, output = '', label = 'C++ · snippet') => `<div class="codebox"><div class="codehead"><span>${escapeHTML(label)}</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div><pre dir="ltr"><code>${highlight(source)}</code></pre>${output ? `<div class="code-output"><span class="output-label">OUTPUT</span>${escapeHTML(output)}</div>` : ''}</div>`;

// بطاقة محتوى (يمكن تمرير green = true لجعلها بلون مميز)
const card = (title, text, green = false) => `<div class="card${green ? ' green' : ''}"><h3>${title}</h3><p>${text}</p></div>`;

// قائمة نقاط
const points = items => `<ul class="points">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;

// صندوق ملاحظة / تنبيه
const note = text => `<div class="callout">${text}</div>`;

// رسم توضيحي لكائن أو كلاس
const object = (title, lines, extra = '') => `<div class="object ${extra}"><div class="object-title">${title}</div><div class="object-body">${lines.map(line => `<span>${line}</span>`).join('')}</div></div>`;

// سؤال وجواب قابل للفتح والطي
const quiz = (question, answer) => `<details class="quiz"><summary>${question}</summary><div class="quiz-answer">${answer}</div></details>`;

// قالب للأمثلة المحلولة
const workedExample = example => ({
  title: example.title,
  chapter: example.chapter,
  subtitle: example.subtitle,
  example: true,
  body: `<div class="grid"><div class="stack">${code(example.definition.replace(/\n\s*\n/g, '\n'), '', example.complete ? 'main.cpp · 1 / 2' : 'تعريف الكلاس · قبل main()')}${note(example.takeaway)}</div><div class="stack">${code(example.usage.replace(/\n\s*\n/g, '\n'), example.output, example.complete ? 'main.cpp · 2 / 2' : 'استخدام الكائن · داخل main()')}${points(example.explanation)}</div></div>`
});

// ==========================================
// 2. الفصول والشرائح (مفرغة وجاهزة لإضافة محتواك)
// ==========================================

// قائمة الفصول
const chapters = ['الأساسيات'];

// قائمة الشرائح: أضف شرائحك هنا
const slides = [
  {
    title: 'عنوان الشريحة الأولى',
    chapter: 0,
    subtitle: 'وصف أو عنوان فرعي للشريحة',
    body: `<div class="card"><h3>مرحباً بك</h3><p>ابدأ بإضافة محتوى شرائحك هنا.</p></div>`
  }
];

// أمثلة محلولة اختيارية (يتم إدراجها تلقائياً بعد الشريحة المحددة بالعنوان)
const teachingExamples = [];
teachingExamples.forEach(([afterTitle, example]) => {
  const position = slides.findIndex(slide => slide.title === afterTitle);
  if (position >= 0) {
    slides.splice(position + 1, 0, workedExample(example));
  }
});

// ==========================================
// 3. محرك عرض الشرائح والتفاعل (Slides Engine)
// ==========================================

const stage = document.getElementById('slides');
stage.innerHTML = slides.map((s,i) => `<section class="slide${s.example ? ' teaching-example' : ''}" id="slide-${i+1}" aria-labelledby="slide-title-${i+1}" data-print-label="C++ · ${String(i+1).padStart(2,'0')} / ${slides.length}">${s.hero ? `<h2 id="slide-title-${i+1}" class="sr-only">${s.title}</h2>` : `<div class="eyebrow">${chapters[s.chapter] ? `${String(s.chapter+1).padStart(2,'0')} / ${chapters[s.chapter]}` : ''}${s.example ? ' / مثال محلول' : ''}</div><h2 id="slide-title-${i+1}"${/^[A-Za-z]/.test(s.title) ? ' dir="ltr"' : ''}>${s.title}</h2>${s.subtitle ? `<p class="lead">${s.subtitle}</p>` : ''}`}${s.body || ''}</section>`).join('');
const sections = [...stage.querySelectorAll('.slide')];
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const progress = document.getElementById('progress');
progress.setAttribute('aria-valuemax', slides.length);
let current = -1;

function showSlide(index, updateHash = true) {
  if (slides.length === 0) return;
  const target = Math.max(0, Math.min(slides.length - 1, index));
  if (current === target) return;
  current = target;
  sections.forEach((section, i) => {
    section.classList.toggle('active', i === current);
    section.setAttribute('aria-hidden', String(i !== current));
  });
  previous.disabled = current === 0;
  next.disabled = current === slides.length - 1;
  document.getElementById('counter').innerHTML = `${String(current + 1).padStart(2, '0')} <span>/ ${slides.length}</span>`;
  document.getElementById('progress-fill').style.width = `${((current + 1) / slides.length) * 100}%`;
  progress.setAttribute('aria-valuenow', current + 1);
  document.getElementById('announcement').textContent = `الشريحة ${current + 1} من ${slides.length}: ${slides[current]?.title || ''}`;
  document.title = `${slides[current]?.title || ''} — C++ Slides`;
  if (updateHash) {
    try { history.replaceState(null, '', `#slide-${current + 1}`); } catch { /* Local file viewers can restrict history. */ }
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function fromHash() {
  const match = location.hash.match(/^#slide-(\d+)$/);
  const index = match ? Number(match[1]) - 1 : 0;
  showSlide(Number.isSafeInteger(index) ? index : 0);
}

previous.addEventListener('click', () => showSlide(current - 1));
next.addEventListener('click', () => showSlide(current + 1));
window.addEventListener('hashchange', fromHash);

const fullscreenButton = document.getElementById('fullscreen-button');
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    document.getElementById('announcement').textContent = 'ملء الشاشة غير متاح في هذا المتصفح. يمكن استخدام F11.';
  }
}
fullscreenButton.addEventListener('click', toggleFullscreen);
if (!document.fullscreenEnabled) fullscreenButton.hidden = true;
document.addEventListener('fullscreenchange', () => {
  const label = document.fullscreenElement ? 'الخروج من ملء الشاشة' : 'ملء الشاشة';
  fullscreenButton.setAttribute('aria-label', label);
  fullscreenButton.title = label + ' (F)';
});

const printState = [];
window.addEventListener('beforeprint', () => {
  printState.length = 0;
  sections.forEach(section => section.removeAttribute('aria-hidden'));
  document.querySelectorAll('details').forEach(detail => {
    printState.push([detail, detail.open]);
    detail.open = true;
  });
});
window.addEventListener('afterprint', () => {
  printState.forEach(([detail, wasOpen]) => { detail.open = wasOpen; });
  sections.forEach((section, i) => section.setAttribute('aria-hidden', String(i !== current)));
});

document.addEventListener('keydown', event => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
  if (event.key === ' ' && event.target.closest('button,summary,a')) return;
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); showSlide(current + 1); }
  else if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); showSlide(current - 1); }
  else if (event.key === 'Home') { event.preventDefault(); showSlide(0); }
  else if (event.key === 'End') { event.preventDefault(); showSlide(slides.length - 1); }
  else if (event.key.toLowerCase() === 'f') { event.preventDefault(); toggleFullscreen(); }
});

const gpaForm = document.getElementById('gpa-form');
if (gpaForm) {
  let storedGpa = 3.2;
  gpaForm.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('gpa-input');
    const raw = input.value.trim().replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace('٫', '.');
    const value = Number(raw);
    const valid = raw !== '' && Number.isFinite(value) && value >= 0 && value <= 4;
    if (valid) storedGpa = value;
    input.setAttribute('aria-invalid', String(!valid));
    const message = document.getElementById('gpa-message');
    message.classList.toggle('error', !valid);
    message.textContent = valid ? `تم قبول القيمة. setGpa() أعادت true؛ المعدل الآن ${storedGpa.toFixed(2)}.` : `تم رفض القيمة. أدخل رقماً من 0 إلى 4؛ المعدل بقي ${storedGpa.toFixed(2)}.`;
    document.getElementById('gpa-value').textContent = storedGpa.toFixed(2);
  });
}

fromHash();

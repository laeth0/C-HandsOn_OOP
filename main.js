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

// Chapters list
const chapters = ['Introduction', 'Classes & Objects', 'Encapsulation', 'Constructors & Destructors', 'Inheritance & Abstraction'];

// Slides list
const slides = [

  // ─── Slide 1: What is OOP? ───────────────────────────────────
  {
    title: 'What is Object-Oriented Programming?',
    chapter: 0,
    subtitle: 'A programming paradigm that organizes code around objects — combining data and behavior in one place.',
    body: `<div class="grid">
      <div class="stack">
        ${card('The Core Idea', 'Instead of writing a list of instructions, OOP lets you model real-world things as <strong>objects</strong> — each with its own data and actions.', true)}
        ${points([
          '<strong>Object</strong> — a single instance of something (e.g. a specific car).',
          '<strong>Class</strong> — the blueprint that defines what every object looks like.',
          '<strong>Data (State)</strong> — what an object <em>knows</em> (e.g. color, speed).',
          '<strong>Behavior</strong> — what an object <em>does</em> (e.g. start(), brake()).'
        ])}
        ${note('Think of a Class like a cookie cutter, and Objects as the cookies — same shape, different details.')}
      </div>
    </div>`
  },

  // ─── Slide 2: Encapsulation ───────────────────────────────────
  {
    title: 'Encapsulation',
    chapter: 0,
    subtitle: 'Bundle data and behavior together — and hide the details the outside world doesn\'t need to see.',
    body: `<div class="grid">
      <div class="stack">
        ${card('The Problem Without Encapsulation', 'If <code>gpa</code> is public, any part of the program can write <code>s.gpa = 99</code> — no checks, no rules, broken data.', false)}
        ${card('The Solution', 'Make <code>gpa</code> <code>private</code>. Provide a <code>setGpa()</code> method that validates the value before storing it.', true)}
        ${note('<strong>private</strong> controls <em>who</em> can access the data. The setter controls <em>what values</em> are accepted. These are two separate concerns.')}
        ${quiz(
          'What does Encapsulation actually protect?',
          'It protects the object\'s internal state from being put into an invalid or unexpected condition by outside code.'
        )}
      </div>
      <div class="stack">
        ${code(
`class Student {
private:
    double gpa = 0.0;  // locked

public:
    // Read the value
    double getGpa() const {
        return gpa;
    }

    // Write only if valid
    bool setGpa(double value) {
        if (value >= 0.0 && value <= 4.0) {
            gpa = value;
            return true;
        }
        return false;  // rejected
    }
};

int main() {
    Student s;
    s.setGpa(3.8);           // OK → true
    s.setGpa(99);            // rejected → false
    cout << s.getGpa();      // 3.8
}`,
          '3.8',
          'C++ · Encapsulation'
        )}
      </div>
    </div>`
  },

  // ─── Slide 3: Classes & Objects ──────────────────────────────
  {
    title: 'Classes & Objects',
    chapter: 0,
    subtitle: 'A Class is the blueprint. An Object is a real instance built from that blueprint.',
    body: `<div class="grid">
      <div class="stack">
        ${card('Class — The Blueprint', 'Defines the structure: what data each object holds and what actions it can perform. Written once, used many times.', true)}
        ${card('Object — The Instance', 'A concrete entity created from the class. Each object has its own copy of the data.')}
        ${note('<code>Student s1</code> and <code>Student s2</code> share the same class definition, but their data is completely independent.')}
      </div>
      <div class="stack">
        ${code(
`class Student {
public:
    string name;
    double gpa;

    void introduce() {
        cout << "Hi, I am " << name << "\\n";
    }
};

int main() {
    Student s1;
    s1.name = "Alice";
    s1.gpa  = 3.9;

    Student s2;
    s2.name = "Bob";
    s2.gpa  = 3.4;

    s1.introduce();
    s2.introduce();
}`,
`Hi, I am Alice
Hi, I am Bob`,
          'C++ · Classes & Objects'
        )}
      </div>
    </div>`
  },

  // ─── Slide 4: Arrays of Objects ──────────────────────────────
  {
    title: 'Arrays of Objects',
    chapter: 0,
    subtitle: 'Store multiple objects of the same class in an array — then loop through them to work with each one.',
    body: `<div class="grid">
      <div class="stack">
        ${card('Why Arrays of Objects?', 'Instead of creating <code>s1</code>, <code>s2</code>, <code>s3</code>… separately, store them all in one array and process them with a loop.', true)}
        ${points([
          '<code>Student roster[3];</code> — creates an array of 3 Student objects.',
          'Access members with <code>roster[i].name</code> and <code>roster[i].gpa</code>.',
          'Use a <code>for</code> loop to read, print, or search through all objects.',
          'Array indices start at <code>0</code> — the last element is at <code>size - 1</code>.'
        ])}
        ${note('Each element of the array is a full object — it has its own copy of all the data members.')}
      </div>
      <div class="stack">
        ${code(
`class Student {
public:
    string name;
    double gpa = 0.0;
};

int main() {
    Student roster[3];

    roster[0].name = "Alice";  roster[0].gpa = 3.9;
    roster[1].name = "Bob";    roster[1].gpa = 3.4;
    roster[2].name = "Carol";  roster[2].gpa = 3.7;

    for (int i = 0; i < 3; i++) {
        cout << roster[i].name
             << " — GPA: " << roster[i].gpa
             << "\\n";
    }
}`,
`Alice — GPA: 3.9
Bob   — GPA: 3.4
Carol — GPA: 3.7`,
          'C++ · Arrays of Objects'
        )}
        ${quiz(
          'How do you print only students with GPA ≥ 3.5?',
          'Add an <code>if (roster[i].gpa >= 3.5)</code> check inside the loop — Alice and Carol would be printed.'
        )}
      </div>
    </div>`
  },

  // ─── Slide 5: Objects as Function Parameters ─────────────────
  {
    title: 'Objects as Function Parameters',
    chapter: 0,
    subtitle: 'You can pass an object into a function just like any other variable — giving functions access to its data and methods.',
    body: `<div class="grid">
      <div class="stack">
        ${card('Pass by Value', 'The function gets a <strong>copy</strong> of the object. Changes inside the function do not affect the original.', false)}
        ${points([
          'Use <code>const Student&</code> when you only need to read — faster and safer.',
          'Use <code>Student&</code> when you need to modify the original object.',
          'Use pass by value only when you intentionally want a separate copy.'
        ])}
        ${note('Prefer <code>const Student&</code> as the default for passing objects to functions — it avoids unnecessary copying.')}
      </div>
      <div class="stack">
        ${code(
`class Student {
public:
    string name;
    double gpa = 0.0;
};

// Read-only: const reference
void printInfo(const Student& s) {
    cout << s.name << " — " << s.gpa << "\\n";
}

// Modify: reference
void applyBonus(Student& s, double bonus) {
    s.gpa += bonus;
}

int main() {
    Student alice;
    alice.name = "Alice";
    alice.gpa  = 3.5;

    printInfo(alice);       // Alice — 3.5
    applyBonus(alice, 0.3);
    printInfo(alice);       // Alice — 3.8
}`,
`Alice — 3.5
Alice — 3.8`,
          'C++ · Objects as Function Parameters'
        )}
        ${quiz(
          'What happens if you remove the & from applyBonus?',
          'The function receives a copy of alice. The bonus is applied to the copy only — the original alice.gpa stays at 3.5.'
        )}
      </div>
    </div>`
  },

  // ─── Slide 6: Inheritance ─────────────────────────────────────
  {
    title: 'Inheritance',
    chapter: 0,
    subtitle: 'A derived class automatically gets all the data and methods of its base class — then adds its own on top.',
    body: `<div class="grid">
      <div class="stack">
        ${card('Base Class', 'The parent — defines shared data and behavior that all derived classes will inherit.', false)}
        ${card('Derived Class', 'The child — inherits everything from the base and can add new members or override existing ones.', true)}
        ${points([
          '<code>class GradStudent : public Student</code> — GradStudent inherits from Student.',
          'The derived class can use <code>name</code> and <code>gpa</code> without redeclaring them.',
          'Add new members that only the derived class needs (e.g. <code>thesis</code>).',
          '<code>public</code> inheritance keeps the base\'s public members public in the derived class.'
        ])}
        ${note('Inheritance models an <strong>is-a</strong> relationship: a GradStudent <em>is a</em> Student. If that sentence feels wrong, inheritance is probably the wrong tool.')}
      </div>
      <div class="stack">
        ${code(
`class Student {
public:
    string name;
    double gpa = 0.0;

    void introduce() {
        cout << "Hi, I am " << name << "\\n";
    }
};

// GradStudent inherits Student
class GradStudent : public Student {
public:
    string thesis;

    void showThesis() {
        cout << name << " is writing: "
             << thesis << "\\n";
    }
};

int main() {
    GradStudent g;
    g.name   = "Alice";
    g.gpa    = 3.9;
    g.thesis = "Deep Learning";

    g.introduce();    // inherited
    g.showThesis();   // own method
}`,
`Hi, I am Alice
Alice is writing: Deep Learning`,
          'C++ · Inheritance'
        )}
        ${quiz(
          'Can a GradStudent call introduce()?',
          'Yes — <code>introduce()</code> is defined in Student and inherited by GradStudent. The derived class gets it for free.'
        )}
      </div>
    </div>`
  },

  // ─── Slide 4: Arrays of Objects ──────────────────────────────
  {
    title: 'Arrays of Objects',
    chapter: 0,
    subtitle: 'Store multiple objects of the same class in an array — then loop through them to work with each one.',
    body: `<div class="grid">
      <div class="stack">
        ${card('Why Arrays of Objects?', 'Instead of creating <code>s1</code>, <code>s2</code>, <code>s3</code>… separately, store them all in one array and process them with a loop.', true)}
        ${points([
          '<code>Student roster[3];</code> — creates an array of 3 Student objects.',
          'Access members with <code>roster[i].name</code> and <code>roster[i].gpa</code>.',
          'Use a <code>for</code> loop to read, print, or search through all objects.',
          'Array indices start at <code>0</code> — the last element is at <code>size - 1</code>.'
        ])}
        ${note('Each element of the array is a full object — it has its own copy of all the data members.')}
      </div>
      <div class="stack">
        ${code(
`class Student {
public:
    string name;
    double gpa = 0.0;
};

int main() {
    Student roster[3];

    roster[0].name = "Alice";  roster[0].gpa = 3.9;
    roster[1].name = "Bob";    roster[1].gpa = 3.4;
    roster[2].name = "Carol";  roster[2].gpa = 3.7;

    for (int i = 0; i < 3; i++) {
        cout << roster[i].name
             << " — GPA: " << roster[i].gpa
             << "\\n";
    }
}`,
`Alice — GPA: 3.9
Bob   — GPA: 3.4
Carol — GPA: 3.7`,
          'C++ · Arrays of Objects'
        )}
        ${quiz(
          'How do you print only students with GPA ≥ 3.5?',
          'Add an <code>if (roster[i].gpa >= 3.5)</code> check inside the loop — Alice and Carol would be printed.'
        )}
      </div>
    </div>`
  },

  // ─── Slide 5: Objects as Function Parameters ─────────────────
  {
    title: 'Objects as Function Parameters',
    chapter: 0,
    subtitle: 'You can pass an object into a function just like any other variable — giving functions access to its data and methods.',
    body: `<div class="grid">
      <div class="stack">
        ${card('Pass by Value', 'The function gets a <strong>copy</strong> of the object. Changes inside the function do not affect the original.', false)}
        ${points([
          'Use <code>const Student&</code> when you only need to read — faster and safer.',
          'Use <code>Student&</code> when you need to modify the original object.',
          'Use pass by value only when you intentionally want a separate copy.'
        ])}
        ${note('Prefer <code>const Student&</code> as the default for passing objects to functions — it avoids unnecessary copying.')}
      </div>
      <div class="stack">
        ${code(
`class Student {
public:
    string name;
    double gpa = 0.0;
};

// Read-only: const reference
void printInfo(const Student& s) {
    cout << s.name << " — " << s.gpa << "\\n";
}

// Modify: reference
void applyBonus(Student& s, double bonus) {
    s.gpa += bonus;
}

int main() {
    Student alice;
    alice.name = "Alice";
    alice.gpa  = 3.5;

    printInfo(alice);       // Alice — 3.5
    applyBonus(alice, 0.3);
    printInfo(alice);       // Alice — 3.8
}`,
`Alice — 3.5
Alice — 3.8`,
          'C++ · Objects as Function Parameters'
        )}
        ${quiz(
          'What happens if you remove the & from applyBonus?',
          'The function receives a copy of alice. The bonus is applied to the copy only — the original alice.gpa stays at 3.5.'
        )}
      </div>
    </div>`
  },

  // ─── Slide 6: Inheritance ─────────────────────────────────────
  {
    title: 'Inheritance',
    chapter: 0,
    subtitle: 'A derived class automatically gets all the data and methods of its base class — then adds its own on top.',
    body: `<div class="grid">
      <div class="stack">
        ${card('Base Class', 'The parent — defines shared data and behavior that all derived classes will inherit.', false)}
        ${card('Derived Class', 'The child — inherits everything from the base and can add new members or override existing ones.', true)}
        ${points([
          '<code>class GradStudent : public Student</code> — GradStudent inherits from Student.',
          'The derived class can use <code>name</code> and <code>gpa</code> without redeclaring them.',
          'Add new members that only the derived class needs (e.g. <code>thesis</code>).',
          '<code>public</code> inheritance keeps the base\'s public members public in the derived class.'
        ])}
        ${note('Inheritance models an <strong>is-a</strong> relationship: a GradStudent <em>is a</em> Student. If that sentence feels wrong, inheritance is probably the wrong tool.')}
      </div>
      <div class="stack">
        ${code(
`class Student {
public:
    string name;
    double gpa = 0.0;

    void introduce() {
        cout << "Hi, I am " << name << "\\n";
    }
};

// GradStudent inherits Student
class GradStudent : public Student {
public:
    string thesis;

    void showThesis() {
        cout << name << " is writing: "
             << thesis << "\\n";
    }
};

int main() {
    GradStudent g;
    g.name   = "Alice";
    g.gpa    = 3.9;
    g.thesis = "Deep Learning";

    g.introduce();    // inherited
    g.showThesis();   // own method
}`,
`Hi, I am Alice
Alice is writing: Deep Learning`,
          'C++ · Inheritance'
        )}
        ${quiz(
          'Can a GradStudent call introduce()?',
          'Yes — <code>introduce()</code> is defined in Student and inherited by GradStudent. The derived class gets it for free.'
        )}
      </div>
    </div>`
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

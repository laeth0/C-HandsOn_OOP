'use strict';
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
const code = (source, output = '', label = 'C++ · snippet') => `<div class="codebox"><div class="codehead"><span>${escapeHTML(label)}</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div><pre dir="ltr"><code>${highlight(source)}</code></pre>${output ? `<div class="code-output"><span class="output-label">OUTPUT</span>${escapeHTML(output)}</div>` : ''}</div>`;
const card = (title, text, green = false) => `<div class="card${green ? ' green' : ''}"><h3>${title}</h3><p>${text}</p></div>`;
const points = items => `<ul class="points">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
const note = text => `<div class="callout">${text}</div>`;
const object = (title, lines, extra = '') => `<div class="object ${extra}"><div class="object-title">${title}</div><div class="object-body">${lines.map(line => `<span>${line}</span>`).join('')}</div></div>`;
const quiz = (question, answer) => `<details class="quiz"><summary>${question}</summary><div class="quiz-answer">${answer}</div></details>`;
const chapters = ['الأساسيات', 'التغليف وحماية البيانات', 'الإنشاء وعمر الكائن', 'مصفوفات الكائنات', 'الوراثة والتجريد'];
const slides = [
  {title:'Introduction to OOP', chapter:0, hero:true, body:`<div class="hero"><div class="hero-layout"><div class="hero-copy"><div class="eyebrow">C++ / INTRODUCTION / 01</div><h1 dir="ltr">Introduction<br>to <em>OOP.</em></h1></div><div class="hero-art" aria-label="Class Student تنشئ Object اسمه student"><span class="art-label">ONE BLUEPRINT. MANY OBJECTS.</span>${object('class Student',['− name : string','− gpa : double','+ introduce()'])}${object('student : Student',['name = "Lina"','gpa = 3.8','introduce();'])}</div></div></div>`},
  {
    title: "قبل ما نبدأ · الأساسيات المطلوبة",
    chapter: 0,
    subtitle: "مبتدئ في OOP؟ ممتاز. نحتاج فقط معرفة بسيطة بالمتغيرات والشروط والحلقات والدوال.",
    body: `<div class="grid"><div class="stack">${card("هدفنا في نهاية الدرس", "تقدر تكتب Class، تنشئ Objects، تحمي بياناتها، وتشرح متى نستخدم الوراثة والفئة المجرّدة.", true)}${points(["<code>string</code> نص، مثل اسم الطالب.", "<code>int</code> عدد صحيح، و<code>double</code> عدد عشري.", "<code>bool</code> قيمة من اثنتين: true أو false.", "الدالة مجموعة أوامر ننفذها عند استدعائها."])}</div>${code("string name = \"Lina\";\nint age = 18;\ndouble gpa = 3.8;\nbool passed = true;\n\nif (gpa >= 2.0) {\n    cout << \"Passed\\n\";\n}", "Passed", "C++ · تذكير بالمتغيرات والشرط")}</div>${note("إذا كانت هذه الأسطر جديدة عليك، راجع المتغيرات وif وfor والدوال أولاً. سنشرح مصطلحات OOP من البداية.")}`
  },
  {
    title: "كيف نقرأ أمثلة الكود؟",
    chapter: 0,
    subtitle: "تعريف Student يتغيّر أثناء الشرح. لا تجمع تعريفاته المختلفة كلها في ملف واحد.",
    body: `<div class="grid"><div class="stack">${points(["<code>#include</code> يضيف المكتبات: iostream للطباعة وstring للنصوص.", "<code>using namespace std;</code> يسمح بكتابة cout وstring دون std:: في هذه الأمثلة.", "تعريف الكلاس يوضع عادةً قبل <code>main()</code>.", "إنشاء الكائنات واستدعاء دوالها يوضعان داخل <code>main()</code>."])}${card("الجزء الموسوم OUTPUT", "هذا هو الناتج المتوقع على الشاشة، وليس كوداً ننسخه في البرنامج.", true)}</div>${code("#include <iostream>\n#include <string>\nusing namespace std;\n\n// Put the class definition here.\n\nint main() {\n    // Create and use objects here.\n    cout << \"Start\\n\";\n}", "Start", "C++ · هيكل برنامج كامل")}</div>${note("في المقاطع المختصرة نحذف المكتبات وmain. المقاطع التي تستخدم الكلاس السابق تكمل تعريفه؛ والأمثلة الكاملة تذكر الهيكل. عند التجربة ضع كل جزء في مكانه.")}`
  },
  {title:'What is OOP?', chapter:0, subtitle:'أسلوب لتنظيم البرنامج حول كائنات تجمع البيانات والسلوك المرتبط فيها.', body:`<div class="grid"><div class="stack">${card('البيانات + السلوك = كائن','بدل ما نفصل بيانات الطالب عن العمليات المتعلقة فيه، نجمعها داخل كائن يمثّله.',true)}${points(['<strong>State:</strong> ما اسم الطالب؟ وما معدّله؟','<strong>Behavior:</strong> كيف يعرّف الطالب عن نفسه؟','نُقسّم البرنامج إلى أجزاء واضحة، لكل جزء مسؤولية.'])}</div><div class="diagram">${object('Student',['DATA / STATE','name = "Lina"','gpa = 3.8','──────────────','BEHAVIOR','introduce()','setGpa(3.9)'])}</div></div>${note('الفكرة الأساسية: الكائن يجمع <strong>ماذا يعرف؟</strong> و<strong>ماذا يستطيع أن يفعل؟</strong>')}`},
  {
    title: "من الواقع إلى الكود · بطاقة طالب",
    chapter: 0,
    subtitle: "قبل كتابة الكود، اسأل: ما البيانات التي تصف الطالب؟ وما العمليات المرتبطة بها؟",
    body: `<div class="grid">${card("بيانات الطالب · ماذا يعرف؟", "الاسم Lina، العمر 18، والمعدل 3.8. هذه القيم تصف حالة طالب معيّن، وسنسميها Attributes.", true)}${card("عمليات الطالب · ماذا يفعل؟", "يعرّف عن نفسه، ويعرض معدله، ويعدّله وفق قواعد النظام. هذه العمليات سنكتبها على شكل Methods.")}</div><div class="grid spaced-grid">${card("Class يشبه نموذج البطاقة الفارغ", "يحدّد أن لكل طالب اسماً وعمراً ومعدلاً؛ لكنه لا يحدّد طالباً بعينه.")}${card("Object يشبه بطاقة معبّأة", "بطاقة Lina وبطاقة Omar لهما نفس الحقول، ولكل بطاقة قيمها الخاصة.")}</div>${note("<strong>اسأل الطلاب:</strong> في كلاس Car، هل color بيانات أم سلوك؟ وماذا عن start()؟ الإجابة: color بيانات، وstart() سلوك.")}`
  },
  {title:'Classes & Objects', chapter:0, subtitle:'الـ Class تعريف لنوع جديد، والـ Object كائن فعلي من هذا النوع له قيمه الخاصة.', body:`<div class="grid"><div class="stack">${card('Class — القالب','يحدّد أسماء البيانات والدوال التي ستملكها الكائنات.',true)}${card('Object — الكائن','له قيمه الخاصة، ويستخدم السلوك الذي عرّفه القالب.')}</div><div class="diagram">${object('class Student',['name : string','gpa : double','introduce()'])}<span class="diagram-arrow">→</span><div class="object-stack">${object('s1 : Student',['name = "Lina"','gpa = 3.8'])}${object('s2 : Student',['name = "Omar"','gpa = 3.2'],'blue')}</div></div></div>${note('<code>s1</code> و<code>s2</code> من نفس النوع، لكن بيانات كل واحد مستقلة عن الثاني.')}`},
  {
    title: "أول Class في C++",
    chapter: 0,
    subtitle: "نستخدم class لتعريف نوع جديد، ونضع البيانات والدوال داخله.",
    body: `<div class="grid wide-code"><div class="stack">${points(["<code>Student</code> اسم الكلاس، وليس اسم طالب معيّن.", "<code>name</code> بيانات؛ و<code>introduce()</code> دالة تطبع هذه البيانات.", "<code>public:</code> يسمح باستخدام هذه الأعضاء من خارج الكلاس؛ سنشرح الوصول لاحقاً.", "نغلق تعريف الكلاس بـ <code>};</code>؛ الفاصلة المنقوطة ضرورية."])}${note("هذا تعريف للقالب فقط. لم ننشئ أي طالب بعد؛ الإنشاء يأتي في الشريحة التالية.")}</div>${code("class Student {\npublic:\n    string name;\n\n    void introduce() {\n        cout << \"Hi, I am \" << name << \"\\n\";\n    }\n};", "", "C++ · تعريف الكلاس قبل main()")}</div>`
  },
  {
    title: "نفكّك أسطر إنشاء الكائن واستخدامه",
    chapter: 0,
    subtitle: "النوع، اسم الكائن، النقطة، والأقواس: كل جزء له معنى.",
    body: `<div class="grid"><div class="stack">${code("Student s;\ns.name = \"Lina\";\ns.introduce();", "", "C++ · داخل main()، باستخدام الكلاس السابق")}${note("<code>;</code> تنهي التعليمة، و<code>=</code> تسند قيمة، و<code>\\n</code> في نص الطباعة تنقلنا لسطر جديد.")}</div><div class="stack">${points(["<code>Student</code>: نوع الكائن؛ مثلما int نوع عدد صحيح.", "<code>s</code>: اسم الكائن الذي أنشأناه.", "<code>s.name</code>: نستخدم النقطة للوصول إلى عضو في s.", "<code>introduce()</code>: الأقواس تعني استدعاء دالة؛ وهي فارغة هنا لأن الدالة لا تحتاج مدخلات."])}</div></div>${quiz("أي سطر ينشئ الكائن فعلياً؟", "<code>Student s;</code> ينشئ الكائن. أما السطران التاليان فيستخدمان الكائن الموجود.")}`
  },
  {
    title: "Attributes · Data Members",
    chapter: 0,
    subtitle: "الـ Attribute متغيّر داخل الكلاس يخزّن معلومة عن الكائن، مثل اسم الطالب أو معدّله.",
    body: `<div class="grid"><div class="stack">${points(["<code>string name</code>: مكان لتخزين الاسم.", "<code>int age = 18</code>: العمر يبدأ هنا من 18.", "<code>double gpa = 0.0</code>: المعدل يبدأ من 0.", "في أمثلتنا، لكل كائن قيمه الخاصة. تعديل معدل طالب لا يغيّر معدل غيره."])}${note("أعطِ البيانات العددية قيمة ابتدائية قبل قراءتها. لا تفترض أن كل عدد سيبدأ من صفر تلقائياً.")}</div>${code("class Student {\npublic:\n    string name;\n    int age = 18;\n    double gpa = 0.0;\n};\n\nStudent s1;\nStudent s2;\ns1.gpa = 3.8;\ns2.gpa = 3.2;\n\ncout << s1.gpa << \"\\n\";\ncout << s2.gpa;", "3.8\n3.2", "C++ · مقطع من برنامج")}</div>`
  },
  {
    title: "Methods · Member Functions",
    chapter: 0,
    subtitle: "الـ Method دالة داخل الكلاس. تستخدم بيانات الكائن لتنفيذ عملية مرتبطة به.",
    body: `<div class="grid wide-code"><div class="stack">${points(["<code>void</code>: الدالة تنفّذ عملاً ولا تعيد قيمة للمستدعي.", "<code>bool</code>: الدالة تعيد true أو false.", "<code>return</code>: يرسل النتيجة إلى مكان استدعاء الدالة.", "المعامل Parameter متغيّر يستقبل مدخلاً للدالة؛ سنراه في المثال التالي."])}${note("الطباعة وإرجاع القيمة عمليتان مختلفتان: cout يعرض نصاً، وreturn يعيد قيمة يمكن أن يستخدمها باقي البرنامج.")}</div>${code("class Student {\npublic:\n    string name;\n    double gpa = 0.0;\n\n    void introduce() {\n        cout << \"I am \" << name << \"\\n\";\n    }\n\n    bool isHonorStudent() {\n        return gpa >= 3.5;\n    }\n};", "", "C++ · مقطع من برنامج")}</div>`
  },
  {title:'Access Modifiers', chapter:0, subtitle:'من يقدر يقرأ البيانات أو يستدعي الدوال؟ public وprivate يحددان حدود الوصول.', body:`<div class="table-wrap"><table><thead><tr><th>محدد الوصول</th><th>داخل الكلاس</th><th>من خارج الكلاس</th></tr></thead><tbody><tr><td><code>public</code></td><td>مسموح</td><td>مسموح عبر الكائن</td></tr><tr><td><code>private</code></td><td>مسموح</td><td>غير مسموح مباشرةً</td></tr></tbody></table></div><div class="grid spaced-grid">${code('class Student {\nprivate:\n    double gpa = 0.0;\npublic:\n    double getGpa() const {\n        return gpa;\n    }\n};')}${code('Student s;\n\ncout << s.getGpa(); // OK\n\n// s.gpa = 9.0;\n// Error: gpa is private')}</div>${note('داخل <code>class</code> يكون الوصول <code>private</code> افتراضياً. الأفضل كتابة محددات الوصول بوضوح.')}`},
  {title:'Creating & Using Objects', chapter:0, subtitle:'نعرّف الكلاس مرة، ثم ننشئ كائنات ونستخدمها داخل main().', body:`<div class="grid wide-code"><div class="stack">${points(['<code>Student s;</code> ينشئ كائناً اسمه s.','<code>s.name</code> يصل إلى عضو public.','<code>s.introduce()</code> يستدعي دالة عضو.'])}${card('جرّب بنفسك','أنشئ كائناً ثانياً باسم Omar، واجعله يعرّف عن نفسه.',true)}</div>${code('#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\npublic:\n    string name;\n    void introduce() const {\n        cout << "Hi, I am " << name << "\\n";\n    }\n};\n\nint main() {\n    Student s;\n    s.name = "Lina";\n    s.introduce();\n}', 'Hi, I am Lina', 'C++ · complete program')}</div>`},
  {title:'Encapsulation', chapter:1, subtitle:'نجمع البيانات والدوال المرتبطة فيها، ونحمي الحالة الداخلية بواجهة واضحة.', body:`<div class="grid"><div class="stack">${card('المشكلة','لو كان المعدل public، يمكن لأي جزء من البرنامج تنفيذ s.gpa = 9.0؛ حتى لو النظام يسمح فقط من 0 إلى 4.')} ${card('الحل','نخفي المعدل داخل private، ونسمح بتعديله من خلال دالة تتحقق من القيمة.',true)}${note('private تمنع التعديل المباشر؛ أما شرط if داخل الدالة فهو الذي يتحقق من صحة القيمة. نحدّد واجهة واضحة لاستخدام الكائن بشكل صحيح.')}</div><div class="diagram">${object('PUBLIC INTERFACE',['setGpa(value)','getGpa()','──────────────','PRIVATE STATE','gpa : double'])}</div></div>`},
  {
    title: "Getters & Setters",
    chapter: 1,
    subtitle: "Getter يقرأ بيانات خاصة. Setter يسمح بتعديلها وفق شروط نحددها.",
    body: `<div class="grid wide-code"><div class="stack">${points(["<code>getGpa()</code> يعيد قيمة المعدل؛ ولا يطبعه بنفسه.", "<code>setGpa(value)</code> يستقبل القيمة الجديدة في value.", "إذا كانت بين 0 و4، يخزنها ويعيد <code>true</code>؛ وإلا يعيد <code>false</code>.", "<code>&amp;&amp;</code> يعني أن الشرطين يجب أن يتحققا معاً."])}${note("<code>const</code> بعد أقواس getter تعني أنه يقرأ بيانات الكائن دون تعديلها. نوفّر فقط الدوال التي يحتاجها الاستخدام؛ ليس لكل عضو setter بالضرورة.")}</div>${code("class Student {\nprivate:\n    double gpa = 0.0;\npublic:\n    double getGpa() const {\n        return gpa;\n    }\n\n    bool setGpa(double value) {\n        if (value >= 0.0 && value <= 4.0) {\n            gpa = value;\n            return true;\n        }\n        return false;\n    }\n};", "", "C++ · مقطع من برنامج")}</div>`
  },
  {title:'خلّينا نجرّب الـ Setter', chapter:1, subtitle:'القيمة غير الصحيحة تُرفض، ويبقى المعدل السابق كما هو.', body:`<div class="grid"><div class="card green"><span class="mini-label">LIVE OBJECT / student</span><label class="live-label" for="gpa-input">أدخل معدلاً بين 0 و4، أو جرّب القيمة 9</label><form id="gpa-form"><div class="input-row"><input id="gpa-input" type="text" inputmode="decimal" value="3.8" aria-describedby="gpa-message" aria-label="قيمة المعدل الجديدة"><button type="submit">setGpa()</button></div></form><div class="live-label">القيمة المخزّنة في الكائن</div><div class="gpa-value" id="gpa-value" dir="ltr">3.20</div><div id="gpa-message" class="live-message" role="status">المعدل الحالي 3.20. جرّب تعديل القيمة.</div></div><div class="stack">${code('Student s;\ns.setGpa(3.2);\n\nbool ok = s.setGpa(9.0);\ncout << boolalpha << ok << "\\n";\ncout << s.getGpa();', 'false\n3.2')}${note('<strong>القاعدة التي نحافظ عليها:</strong> المعدل بين 0 و4. boolalpha يعرض نتيجة bool بالكلمتين true وfalse بدلاً من 1 و0.')}</div></div>`},
  {
    title: "Constructors",
    chapter: 2,
    subtitle: "الـ Constructor دالة خاصة تُنفّذ تلقائياً عند إنشاء الكائن، حتى يبدأ ببيانات جاهزة.",
    body: `<div class="grid wide-code"><div class="stack">${points(["الاسم <code>Student</code> مطابق لاسم الكلاس.", "لا نكتب نوع إرجاع للـ constructor، حتى void.", "في <code>Student s(\"Lina\");</code> تنتقل Lina إلى المعامل n.", "<code>: name(n)</code> قائمة تهيئة: تعطي عضو name قيمة n قبل تنفيذ جسم الـ constructor."])}${note("تتبّع القيمة: <strong>\"Lina\" → n → name</strong>. إنشاء s هو الذي يشغّل constructor؛ لا نحتاج استدعاءً ثانياً.")}</div>${code("class Student {\nprivate:\n    string name;\npublic:\n    Student(string n) : name(n) {\n        cout << \"Created: \" << name << \"\\n\";\n    }\n};\n\nStudent s(\"Lina\");", "Created: Lina", "C++ · مقطع من برنامج")}</div>`
  },
  {title:'Default & Parameterized', chapter:2, subtitle:'يمكن إنشاء كائن بقيم افتراضية، أو تمرير القيم عند إنشائه.', body:`<div class="grid">${code('class Student {\nprivate:\n    string name;\n    double gpa;\npublic:\n    Student()\n        : name("Unknown"), gpa(0.0) {}\n\n    Student(string n, double g)\n        : name(n), gpa(0.0) {\n        if (g >= 0.0 && g <= 4.0)\n            gpa = g;\n    }\n};')}<div class="stack">${card('Default constructor','يمكن استدعاؤه دون معاملات. في هذا المثال يبدأ الطالب باسم Unknown ومعدل 0.',true)}${card('Parameterized constructor','يستقبل بيانات البداية. نتحقق من المعدل؛ القيمة غير الصحيحة تترك المعدل 0.')}${code('Student a;             // Default\nStudent b("Lina", 3.8); // Parameterized')}</div></div>${note('عند تعريف constructor بمعاملات، لا يولّد المترجم default constructor تلقائياً؛ عرّفه إذا احتجته.')}`},
  {
    title: "Constructor Overloading",
    chapter: 2,
    subtitle: "يمكن للكلاس أن يملك أكثر من constructor، بشرط اختلاف عدد المعاملات أو أنواعها.",
    body: `<div class="grid wide-code"><div class="stack">${points(["بدون معاملات: نستخدم قيماً افتراضية.", "اسم فقط: نأخذ الاسم، ويبدأ المعدل من 0.", "اسم ومعدل: نستقبل القيمتين ونتحقق من المعدل."])}${code("Student a;\nStudent b(\"Lina\");\nStudent c(\"Omar\", 3.6);", "", "C++ · ثلاثة استدعاءات مختلفة")}${note("هذا Overloading: نفس الاسم مع معاملات مختلفة. تغيير أسماء المعاملات فقط لا يصنع نسخة جديدة.")}</div>${code("class Student {\nprivate:\n    string name;\n    double gpa;\npublic:\n    Student() : name(\"Unknown\"), gpa(0.0) {}\n\n    Student(string n) : name(n), gpa(0.0) {}\n\n    Student(string n, double g)\n        : name(n), gpa(0.0) {\n        if (g >= 0.0 && g <= 4.0) {\n            gpa = g;\n        }\n    }\n};", "", "C++ · مقطع من برنامج")}</div>`
  },
  {
    title: "Scope · نفهم النطاق أولاً",
    chapter: 2,
    subtitle: "النطاق جزء من الكود تحدّه الأقواس { }. المتغير المحلي ينتهي عمره عند الخروج من نطاقه.",
    body: `<div class="grid"><div class="stack">${code("int outer = 10;\n{\n    int inner = 20;\n    cout << inner << \"\\n\";\n}\ncout << outer << \"\\n\";\n// cout << inner; // Not available here", "20\n10", "C++ · داخل main()")}</div><div class="stack">${points(["outer موجود في نطاق main، فيبقى متاحاً بعد القوس الداخلي.", "inner أُنشئ داخل النطاق الداخلي، فلا يمكن استخدامه بعد إغلاقه.", "نفس الفكرة تنطبق على الكائنات المحلية؛ عند انتهاء عمر الكائن يعمل destructor."])}${card("ربط بالفكرة القادمة", "إذا أنشأنا Student داخل هذه الأقواس، ينتهي عمره عند القوس المغلق، قبل متابعة السطر التالي.", true)}</div></div>`
  },
  {
    title: "Destructors · نهاية عمر الكائن",
    chapter: 2,
    subtitle: "الـ Destructor دالة تعمل تلقائياً عند انتهاء عمر الكائن. هنا نطبع رسالة لنرى توقيت عملها.",
    body: `<div class="grid wide-code"><div class="stack">${points(["نكتب اسم الكلاس مسبوقاً بـ <code>~</code>: مثل <code>~Student()</code>.", "لا نوع إرجاع له، ولا معاملات.", "الكائن s محلي؛ ينتهي عمره عند إغلاق النطاق الداخلي.", "الدالة تستطيع تنظيف موارد يملكها الكائن. لا نحتاج استدعاءها يدوياً في هذه الأمثلة."])}${note("إذا لم نحتج عملاً خاصاً عند نهاية العمر، عادةً نترك الـ destructor الافتراضي. الطباعة هنا لتتبّع التنفيذ فقط.")}</div>${code("class Student {\npublic:\n    Student() {\n        cout << \"Created\\n\";\n    }\n    ~Student() {\n        cout << \"Destroyed\\n\";\n    }\n};\n\nint main() {\n    {\n        Student s;\n        cout << \"Inside scope\\n\";\n    }\n    cout << \"After scope\\n\";\n}", "Created\nInside scope\nDestroyed\nAfter scope", "C++ · مقطع من برنامج")}</div>`
  },
  {
    title: "The this Pointer",
    chapter: 2,
    subtitle: "المؤشر يحتفظ بعنوان كائن. this مؤشر متاح تلقائياً داخل دالة العضو ويشير إلى الكائن الذي استدعاها.",
    body: `<div class="grid wide-code"><div class="stack">${points(["في <code>s.setName(\"Lina\")</code> يكون this مشيراً إلى s.", "<code>this->name</code> هو عضو الكائن؛ وname على يمين الإسناد هو المعامل.", "نستخدم النقطة مع الكائن مثل s، والسهم <code>-&gt;</code> مع مؤشر مثل this."])}${note("<code>name = name;</code> هنا يسند المعامل لنفسه، ولا يغيّر عضو الكائن. كتابة <code>this-&gt;name = name;</code> تزيل الالتباس.")}</div>${code("class Student {\nprivate:\n    string name;\npublic:\n    void setName(string name) {\n        this->name = name;\n    }\n\n    string getName() const {\n        return name;\n    }\n};\n\nStudent s;\ns.setName(\"Lina\");\ncout << s.getName();", "Lina", "C++ · مقطع من برنامج")}</div>`
  },
  {title:'وقفة سريعة · اختبر فهمك', chapter:2, subtitle:'جاوب أولاً، ثم افتح السؤال لتشوف الإجابة.', body:`${quiz('هل Class وObject نفس الشيء؟','لا. Class تعريف لنوع، وObject كائن فعلي من هذا النوع وله حالته الخاصة.')}${quiz('ليش نحط gpa داخل private؟','حتى نتحكم بتغييره ونمنع القيم غير الصحيحة من خلال واجهة عامة تتحقق من المدخلات.')}${quiz('متى يعمل constructor ومتى يعمل destructor؟','الـ constructor عند إنشاء الكائن، والـ destructor عند انتهاء عمره. الكائن المحلي ينتهي عمره عند الخروج من نطاقه.')}${quiz('هل Student s(); ينشئ كائناً بالـ default constructor؟','لا، هذا تصريح عن دالة اسمها s تعيد Student. استخدم <code>Student s;</code> أو <code>Student s{};</code>.')}${note('قاعدة مفيدة: <strong>التهيئة أولاً، ثم الاستخدام، ثم التنظيف تلقائياً.</strong>')}`},
  {title:'Arrays of Objects', chapter:3, subtitle:'مصفوفة تحتوي عدة كائنات من نفس النوع، ولكل عنصر بياناته الخاصة.', body:`<div class="grid"><div class="stack">${code('class Student {\npublic:\n    string name;\n    double gpa = 0.0;\n};\n\nStudent students[3];\nstudents[0].name = "Lina";\nstudents[0].gpa = 3.8;\nstudents[1].name = "Omar";\nstudents[2].name = "Sara";')}${note('الفهرسة تبدأ من <code>0</code>. آخر عنصر هنا هو <code>students[2]</code>.')}</div><div class="stack">${object('students[0]',['name = "Lina"','gpa = 3.8'])}${object('students[1]',['name = "Omar"','gpa = 0.0'],'blue')}${object('students[2]',['name = "Sara"','gpa = 0.0'])}</div></div>`},
  {
    title: "تهيئة المصفوفة والمرور عليها",
    chapter: 3,
    subtitle: "نجهّز ثلاثة كائنات، ثم نستخدم حلقة for عادية للوصول إلى كل واحد حسب فهرسه.",
    body: `<div class="grid wide-code"><div class="stack">${points(["عند i = 0 نقرأ اسم Lina.", "عند i = 1 نقرأ اسم Omar، وعند i = 2 نقرأ اسم Sara.", "<code>i &lt; 3</code> يمنع الوصول إلى الفهرس 3 غير الموجود.", "كل عنصر في المصفوفة كائن Student كامل، ويمكن استدعاء دواله."])}${note("<code>Student students[3];</code> دون قيم يحتاج constructor يمكن استدعاؤه دون معاملات. هنا أعطينا كل عنصر اسماً عند تهيئته.")}</div>${code("class Student {\nprivate:\n    string name;\npublic:\n    Student(string n) : name(n) {}\n    string getName() const { return name; }\n};\n\nStudent students[3] = {\n    Student(\"Lina\"),\n    Student(\"Omar\"),\n    Student(\"Sara\")\n};\n\nfor (int i = 0; i < 3; i = i + 1) {\n    cout << students[i].getName() << \"\\n\";\n}", "Lina\nOmar\nSara", "C++ · مقطع من برنامج")}</div>`
  },
  {title:'تطبيق صغير · مجموعة طلاب', chapter:3, subtitle:'اجمع ما تعلّمته: بيانات خاصة، constructor، getter، ومصفوفة كائنات.', body:`<div class="grid"><div class="card green"><span class="mini-label">YOUR TURN / 5 MINUTES</span><h3>مين معدّله أعلى؟</h3>${points(['أنشئ <code>Student</code> ببيانات name وgpa خاصة.','أضف constructor يتحقق أن المعدل بين 0 و4.','أضف <code>getName()</code> و<code>getGpa()</code>.','أنشئ مصفوفة من ثلاثة طلاب، واطبع اسم صاحب أعلى معدل.'])}</div><div class="stack">${code('Student students[] = {\n    Student("Lina", 3.8),\n    Student("Omar", 3.2),\n    Student("Sara", 3.9)\n};\n\n// Expected: Sara')}${quiz('تلميح للحل','احتفظ بفهرس أعلى معدل، وابدأ من 0، ثم قارِن بقية العناصر به وحدّث الفهرس عند إيجاد معدل أعلى. عند التعادل يمكن الاحتفاظ بأول طالب.')}</div></div>`},
  {title:'What is Inheritance?', chapter:4, subtitle:'الوراثة تسمح بإنشاء كلاس جديد مبني على كلاس موجود، مع إضافة بيانات أو سلوك.', body:`<div class="grid"><div class="stack">${card('Base Class — الفئة الأساسية','Person يجمع الأشياء المشتركة، مثل الاسم والتعريف بالنفس.',true)}${card('Derived Class — الفئة المشتقة','Student يرث من Person ويضيف ما يخص الطالب، مثل المعدل.')}${note('اختبار العلاقة: <strong>Student is a Person.</strong><br>استخدم الوراثة العامة عندما يكون الكائن المشتق نوعاً من الكائن الأساسي.')}</div><div class="diagram vertical">${object('Person',['name : string','introduce()'])}<span class="up-arrow">↑</span><span class="inherit-caption">public inheritance / is-a</span>${object('Student',['gpa : double','study()'],'blue')}</div></div>`},
  {title:'Base Class & Derived Class', chapter:4, subtitle:'نكتب : public Person لنعبّر عن أن Student يرث علناً من Person.', body:`<div class="grid">${code('class Person {\nprivate:\n    string name;\npublic:\n    Person(string n) : name(n) {}\n\n    string getName() const {\n        return name;\n    }\n};')}${code('class Student : public Person {\npublic:\n    Student(string n) : Person(n) {}\n\n    void study() const {\n        cout << getName() << " studies\\n";\n    }\n};\n\nStudent s("Lina");\ncout << s.getName() << "\\n";\ns.study();', 'Lina\nLina studies')}</div>${note('<code>Person(n)</code> يستدعي constructor الفئة الأساسية. يُنشأ الجزء الأساسي قبل الجزء المشتق.')}`},
  {title:'الوصول مع public Inheritance', chapter:4, subtitle:'الوراثة لا تعطي الفئة المشتقة وصولاً مباشراً إلى private في الفئة الأساسية.', body:`<div class="table-wrap"><table><thead><tr><th>العضو في Base</th><th>داخل Derived</th><th>من خارج الكلاسين</th></tr></thead><tbody><tr><td><code>public</code></td><td>مسموح</td><td>مسموح</td></tr><tr><td><code>protected</code></td><td>مسموح</td><td>غير مسموح</td></tr><tr><td><code>private</code></td><td>غير مسموح مباشرةً</td><td>غير مسموح</td></tr></tbody></table></div><div class="grid spaced-grid">${card('private يحمي بيانات Base','داخل Student نستخدم getName() لقراءة الاسم الخاص بـ Person. العضو الخاص موجود ضمن الجزء الأساسي لكن لا نصل إليه مباشرةً.',true)}${card('protected باختصار','يسمح بالوصول داخل الكلاس والفئات المشتقة. غالباً نفضّل private مع دوال مناسبة للحفاظ على قواعد البيانات.')}</div>${note('عند التدمير ينعكس ترتيب الإنشاء: <strong>Derived أولاً، ثم Base.</strong>')}`},
  {
    title: "Reference · اسم آخر لنفس الكائن",
    chapter: 4,
    subtitle: "المرجع لا ينشئ نسخة جديدة. يتيح التعامل مع الكائن الموجود باسم آخر.",
    body: `<div class="grid"><div class="stack">${code("int mark = 80;\nint& alias = mark;\nalias = 90;\ncout << mark;", "90", "C++ · مرجع بسيط داخل main()")}${points(["<code>int&amp; alias</code> يعني أن alias مرجع لمتغير int موجود.", "تعديل alias غيّر mark لأن الاثنين يشيران إلى نفس المتغير."])}</div><div class="stack">${code("Student s(\"Lina\");\nPerson& person = s;\ncout << person.getName();", "Lina", "C++ · باستخدام كلاسات Base Class & Derived Class")}${points(["لأن Student نوع من Person، نستطيع التعامل معه عبر مرجع Person.", "<code>const Person&amp;</code> يعني أن هذا المرجع لا يسمح بتعديل الكائن من خلاله."])}</div></div>${note("في الإعلان <code>Person&amp; person</code> الرمز &amp; يعني مرجعاً. سنستخدم المراجع حتى يبقى الكائن الأصلي بنوعه Student أو Rectangle، دون نسخه إلى كائن أساسي.")}`
  },
  {
    title: "Virtual Functions & Overriding",
    chapter: 4,
    subtitle: "إذا تعاملنا مع طالب على أنه Person، نريد أن تظل دالة describe() تصفه كطالب.",
    body: `<div class="grid">${code("class Person {\npublic:\n    virtual void describe() const {\n        cout << \"Person\\n\";\n    }\n    virtual ~Person() = default;\n};\n\nclass Student : public Person {\npublic:\n    void describe() const override {\n        cout << \"Student\\n\";\n    }\n};", "", "C++ · مقطع من برنامج")}<div class="stack">${code("Student s;\nPerson& p = s;\np.describe();", "Student", "C++ · نفس الكائن عبر مرجع أساسي")}${points(["<code>virtual</code>: عند الاستدعاء عبر مرجع أساسي نختار التنفيذ حسب نوع الكائن الفعلي.", "<code>override</code>: نعيد تنفيذ الدالة الموروثة، ونطلب من المترجم التحقق من تطابقها.", "<code>= default</code> يطلب استخدام تنفيذ الـ destructor الطبيعي الذي يولّده المترجم."])}</div></div>${note("Overloading يغيّر قائمة المعاملات. أما Overriding هنا فيعيد تنفيذ دالة virtual موروثة بنفس التوقيع، بما فيه const.")}`
  },
  {
    title: "لماذا نحتاج Abstract Class؟",
    chapter: 4,
    subtitle: "كل شكل له مساحة، لكن كلمة «شكل» وحدها لا تعطينا طريقة حساب واحدة.",
    body: `<div class="trio">${card("Rectangle · مستطيل", "نحتاج العرض والارتفاع. المساحة = العرض × الارتفاع؛ مثلاً 4 × 3 = 12.", true)}${card("Circle · دائرة", "نحتاج نصف القطر. المساحة = π × نصف القطر × نصف القطر؛ عند نصف قطر 1 تقارب 3.14159.")}${card("Shape · شكل عام", "نريد أن نطلب area() من أي شكل، ونترك طريقة الحساب لنوع الشكل المحدد.")}</div>${note("<strong>العقد هنا:</strong> كل فئة شكل قابلة لإنشاء كائنات منها يجب أن توفّر area(). الفئة المجرّدة تكتب هذا الشرط، والفئة المشتقة تكتب الحساب.")}${quiz("ليش ما ننشئ Shape عام ونحسب مساحته؟", "لأننا لم نحدد هل هو مستطيل أم دائرة، ولا المعطيات وطريقة الحساب المناسبة. ننشئ Rectangle أو Circle، ونتعامل معهما من خلال واجهة Shape.")}`
  },
  {
    title: "Abstract Classes",
    chapter: 4,
    subtitle: "الفئة المجرّدة تحدد عمليات مطلوبة، ولا تسمح بإنشاء كائن مباشر منها.",
    body: `<div class="grid wide-code"><div class="stack">${points(["<code>virtual double area() const = 0;</code> يعلن دالة افتراضية خالصة.", "<code>= 0</code> تعني أن على الفئة المشتقة تنفيذ الدالة حتى تصبح قابلة لإنشاء كائنات؛ لا تعني أن المساحة صفر.", "<code>Shape s;</code> غير مسموح لأن Shape ما زالت مجرّدة.", "يمكن أن تحتوي الفئة المجرّدة بيانات وconstructor ودوال عادية أيضاً."])}${note("<code>virtual ~Shape() = default;</code> يسمح بالتنظيف الصحيح للكائن المشتق عند حذفه عبر مؤشر Shape. لا نحتاج إدارة ذاكرة يدوية في أمثلتنا المحلية.")}</div>${code("class Shape {\npublic:\n    virtual double area() const = 0;\n    virtual ~Shape() = default;\n};\n\n// Shape s; // Error: abstract class\n\n// Create a Rectangle or Circle instead.", "", "C++ · مقطع من برنامج")}</div>`
  },
  {
    title: "Implementing an Abstract Class",
    chapter: 4,
    subtitle: "Rectangle يحقق شرط Shape: يكتب الحساب المطلوب داخل area().",
    body: `<div class="grid wide-code"><div class="stack">${points(["<code>: public Shape</code> يعني أن Rectangle نوع من Shape.", "constructor يخزن العرض 4 والارتفاع 3.", "<code>area() const override</code> يطابق الدالة المطلوبة في Shape.", "عند الاستدعاء نحسب <code>4 × 3</code> فنعيد 12."])}${code("Rectangle r(4.0, 3.0);\ncout << r.area();", "12", "C++ · داخل main()")}${note("إذا نسينا area()، يبقى Rectangle مجرّداً ولا نستطيع إنشاء r. نفترض أبعاداً موجبة في المثال.")}</div>${code("class Rectangle : public Shape {\nprivate:\n    double width;\n    double height;\npublic:\n    Rectangle(double w, double h)\n        : width(w), height(h) {}\n\n    double area() const override {\n        return width * height;\n    }\n};", "", "C++ · مقطع من برنامج")}</div>`
  },
  {
    title: "Polymorphism · واجهة واحدة",
    chapter: 4,
    subtitle: "تعدد الأشكال: نفس الطلب area()، لكن طريقة تنفيذه تعتمد على نوع الشكل الفعلي.",
    body: `<div class="grid">${code("class Circle : public Shape {\nprivate:\n    double radius;\npublic:\n    Circle(double r) : radius(r) {}\n\n    double area() const override {\n        return 3.14159 * radius * radius;\n    }\n};", "", "C++ · مقطع من برنامج")}<div class="stack">${code("void printArea(const Shape& shape) {\n    cout << shape.area() << \"\\n\";\n}\n\nRectangle r(4.0, 3.0);\nCircle c(1.0);\n\nprintArea(r);\nprintArea(c);", "12\n3.14159", "C++ · مقطع من برنامج")}${points(["<code>const Shape&amp;</code> مرجع للشكل الموجود؛ لا ينسخه، ولا يسمح بتعديله عبر هذا المرجع.", "مع r تعمل area() الخاصة بالمستطيل، ومع c تعمل الخاصة بالدائرة."])}</div></div>${note("دالة printArea لا تحتاج شرط if لمعرفة نوع الشكل. تطلب المساحة، والكائن يوفّر تنفيذ الحساب المناسب بفضل virtual.")}`
  },
  {title:'من الفكرة إلى التصميم', chapter:4, subtitle:'صار عندنا أدوات نمثّل فيها البيانات والسلوك والعلاقات بشكل واضح.', body:`<div class="trio"><div class="card"><div class="big-number">01</div><div class="section-name">ENCAPSULATION</div><h3>احمِ الحالة</h3><p>ضع البيانات داخل private، واعرض عمليات تحافظ على صحة الكائن.</p></div><div class="card green"><div class="big-number">02</div><div class="section-name">INHERITANCE</div><h3>عبّر عن العلاقة</h3><p>Student نوع من Person، فيرث الواجهة المناسبة ويضيف سلوكه الخاص.</p></div><div class="card"><div class="big-number">03</div><div class="section-name">ABSTRACTION</div><h3>حدّد العقد</h3><p>Shape يحدد أن لكل شكل area()، ويترك طريقة الحساب للفئات المشتقة.</p></div></div>${note('ابدأ بكلاس صغير ومسؤولية واضحة. أضف الوراثة والتجريد عندما تعبّر عن حاجة فعلية في التصميم.')}`},
  {title:'أخطاء شائعة تستحق الانتباه', chapter:4, subtitle:'تفاصيل صغيرة، لكنها تفسّر كثيراً من أخطاء البداية.', body:`<div class="table-wrap"><table><thead><tr><th>الخطأ</th><th>التصحيح أو السبب</th></tr></thead><tbody><tr><td>نسيان <code>;</code> بعد الكلاس</td><td>اختم التعريف بـ <code>};</code></td></tr><tr><td>تعديل عضو <code>private</code> مباشرةً</td><td>استخدم واجهة public المناسبة</td></tr><tr><td>كتابة <code>void Student()</code></td><td>الـ constructor لا يملك نوع إرجاع</td></tr><tr><td>كتابة <code>Student s();</code></td><td>هذا تصريح دالة؛ لإنشاء كائن استخدم <code>Student s{};</code></td></tr><tr><td>الوصول إلى <code>students[3]</code> في مصفوفة حجمها 3</td><td>الفهارس المسموحة هي 0 و1 و2</td></tr><tr><td>إنشاء <code>Shape s;</code></td><td>أنشئ كائناً من فئة مشتقة تحقق كل الدوال الخالصة</td></tr></tbody></table></div>`},
  {
    title: "التحدّي الأخير · طبّق بنفسك",
    chapter: 4,
    subtitle: "ابدأ بالتحدي الأساسي. بعد أن تستطيع شرحه، انتقل إلى الوراثة والتجريد.",
    body: `<div class="grid"><div class="card green"><span class="mini-label">المستوى الأول · أساسيات</span><h3>كلاس طالب يعمل بشكل صحيح</h3>${points(["اجعل name وgpa خاصين private.", "جهّز الطالب بـ constructor، ووفّر getters وsetter يتحقق من المعدل.", "أنشئ طالبين، ثم جرّب معدلاً صحيحاً وآخر خارج 0 إلى 4.", "أنشئ مصفوفة طلاب واطبع أسماءهم."])}</div><div class="card"><span class="mini-label">المستوى الثاني · علاقات وتجريد</span><h3>أشكال تحسب مساحتها</h3>${points(["أنشئ Shape مجرّدة بدالة area().", "نفّذ Rectangle وCircle مع override.", "مرّر الكائنين إلى <code>printArea(const Shape&amp;)</code>.", "توقع الناتج قبل التشغيل، ثم جرّب أبعاداً موجبة مختلفة."])}</div></div>${quiz("كيف أتأكد أن الأساسيات واضحة؟", "اشرح الفرق بين Class وObject، ولماذا gpa خاصة، ومتى يبدأ عمر الكائن وينتهي. ثم اشرح لماذا Shape لا تُنشأ مباشرةً، وكيف يختار استدعاء area() التنفيذ المناسب.")}${note("قيّم الفهم بالتفسير والتجربة: تغيير واحد في الكود، توقع النتيجة، ثم التشغيل ومقارنة الناتج بالتوقع.")}`
  },
  {title:'Think in objects.', chapter:4, subtitle:'كل كائن لديه حالة، وسلوك، وعمر. وكل واجهة جيدة تجعل استخدامه أوضح.', body:`<div class="trio">${card('ما الذي يعرفه؟','Attributes / Data Members',true)}${card('ما الذي يفعله؟','Methods / Member Functions')}${card('كيف يرتبط بغيره؟','Inheritance / Abstract Interfaces')}</div><div class="card recap-card"><h3>صرت تعرف الطريق</h3><p>Classes & Objects → Encapsulation → Constructors & Destructors → Arrays of Objects → Inheritance → Abstract Classes</p></div><div class="tags"><span class="tag">LEARN IT.</span><span class="tag">BUILD IT.</span><span class="tag">EXPLAIN IT.</span></div>${note('للمراجعة، اضغط <kbd>Home</kbd> للعودة للبداية.')}`}
];

// Worked examples sit directly after the concept they demonstrate.
const workedExample = example => ({
  title: example.title,
  chapter: example.chapter,
  subtitle: example.subtitle,
  example: true,
  body: `<div class="grid"><div class="stack">${code(example.definition.replace(/\n\s*\n/g, '\n'), '', example.complete ? 'main.cpp · 1 / 2' : 'تعريف الكلاس · قبل main()')}${note(example.takeaway)}</div><div class="stack">${code(example.usage.replace(/\n\s*\n/g, '\n'), example.output, example.complete ? 'main.cpp · 2 / 2' : 'استخدام الكائن · داخل main()')}${points(example.explanation)}</div></div>`
});
const teachingExamples = [
  ['Methods · Member Functions', {
    title: 'مثال محلول · مدخلات الدالة ونتيجتها', chapter: 0,
    subtitle: 'نرسل 5 إلى الدالة، نغيّر علامة الطالب، ثم نعيد العلامة الجديدة ونطبعها.',
    definition: String.raw`class Student {
public:
    int mark = 80;
    void addBonus(int bonus) {
        mark = mark + bonus;
    }
    int getMark() const {
        return mark;
    }
};`,
    usage: String.raw`Student s;
s.addBonus(5);
int result = s.getMark();
cout << result;`,
    output: '85',
    explanation: [
      'القيمة 5 تنتقل إلى المعامل bonus؛ فتصبح mark مساوية لـ 80 + 5.',
      'addBonus نوعها void؛ تغيّر العلامة دون إرجاع قيمة.',
      'getMark تعيد int؛ نخزّن النتيجة في result ثم نطبعها.',
      'const بعد () تعني أن getMark تقرأ حالة الكائن دون تعديلها.'
    ],
    takeaway: '<strong>اسأل الطلاب:</strong> لو استدعينا addBonus(2) بعد ذلك، تصبح العلامة 87. تذكّر: return يعيد قيمة؛ وcout يعرضها على الشاشة.'
  }],
  ['Creating & Using Objects', {
    title: 'مثال محلول · كل كائن له بياناته', chapter: 0,
    subtitle: 'أنشئ طالبين، غيّر اسم الأول، ثم تتبّع ماذا يحدث لاسم الثاني.',
    definition: String.raw`class Student {
public:
    string name;

    void introduce() const {
        cout << name << "\n";
    }
};`,
    usage: String.raw`Student first;
Student second;
first.name = "Lina";
second.name = "Omar";

first.introduce();
second.introduce();
first.name = "Sara";
first.introduce();
second.introduce();`,
    output: 'Lina\nOmar\nSara\nOmar',
    explanation: ['أنشأنا كائنين من نفس القالب.', 'تغيير <code>first.name</code> لا يغيّر <code>second.name</code>.'],
    takeaway: '<strong>اسأل الطلاب:</strong> لو غيّرنا اسم second، هل تتغير قيمة first؟ خلّيهم يتوقعوا الناتج قبل تشغيل الكود.'
  }],
  ['خلّينا نجرّب الـ Setter', {
    title: 'مثال محلول · حساب بنكي يحمي الرصيد', chapter: 1,
    subtitle: 'نطبّق Encapsulation على مثال جديد: الإيداع الموجب مقبول، والمبلغ السالب مرفوض.',
    definition: String.raw`class BankAccount {
private:
    double balance = 0.0;
public:
    bool deposit(double amount) {
        if (amount <= 0.0) return false;
        balance += amount;
        return true;
    }

    double getBalance() const {
        return balance;
    }
};`,
    usage: String.raw`BankAccount account;
cout << boolalpha;
cout << account.deposit(100.0) << "\n";
cout << account.deposit(-20.0) << "\n";
cout << account.getBalance();

// account.balance = -500; // Not allowed`,
    output: 'true\nfalse\n100',
    explanation: ['أول إيداع يزيد الرصيد من 0 إلى 100.', 'الإيداع السالب يُرفض، ويبقى الرصيد 100.', 'الـ getter يقرأ الرصيد دون أن يسمح بتعديله مباشرةً.'],
    takeaway: '<strong>فكرة للشرح:</strong> الواجهة العامة قد تكون عملية ذات معنى مثل deposit()؛ مش شرط تكون مجرد setBalance(). نفترض هنا مبالغ مالية عادية ومحدودة.'
  }],
  ['Constructor Overloading', {
    title: 'مثال محلول · أي Constructor سيعمل؟', chapter: 2,
    subtitle: 'ثلاث طرق لإنشاء الطالب؛ المترجم يختار حسب عدد المعاملات وأنواعها.',
    definition: String.raw`class Student {
private:
    string name;
    int age;
public:
    Student() : name("Unknown"), age(18) {
        cout << "Default\n";
    }

    Student(string n) : name(n), age(18) {
        cout << name << "\n";
    }

    Student(string n, int a)
    : name(n), age(a) {
        cout << name << ": " << age << "\n";
    }
};`,
    usage: String.raw`Student a;
Student b("Lina");
Student c("Omar", 20);`,
    output: 'Default\nLina\nOmar: 20',
    explanation: ['بدون معاملات: يعمل <code>Student()</code>.', 'اسم فقط: يعمل <code>Student(string)</code>.', 'اسم وعمر: يعمل <code>Student(string, int)</code>.'],
    takeaway: '<strong>قبل إظهار الناتج:</strong> اطلب من الطلاب ربط كل سطر إنشاء بالـ constructor المناسب، وتحديد قيم name وage لكل كائن.'
  }],
  ['Destructors · نهاية عمر الكائن', {
    title: 'مثال محلول · تتبّع عمر كائنين', chapter: 2,
    subtitle: 'نراقب ترتيب الإنشاء والتدمير لكائنين محليين داخل نفس النطاق.',
    definition: String.raw`class Student {
private:
    string name;
public:
    Student(string n) : name(n) {
        cout << "Create " << name << "\n";
    }

    ~Student() {
        cout << "Destroy " << name << "\n";
    }
};`,
    usage: String.raw`{
    Student a("Lina");
    Student b("Omar");
    cout << "Inside scope\n";
}
cout << "After scope\n";`,
    output: 'Create Lina\nCreate Omar\nInside scope\nDestroy Omar\nDestroy Lina\nAfter scope',
    explanation: ['ينشأ a قبل b حسب ترتيب الأسطر.', 'عند إغلاق النطاق يُدمَّر b ثم a.', 'يُطبع After scope بعد اكتمال تدمير الكائنين.'],
    takeaway: '<strong>اسأل الطلاب:</strong> إذا نقلنا b إلى نطاق داخلي، متى سينتهي عمره؟ ارسموا أقواس النطاق وحدّدوا نقطة التدمير.'
  }],
  ['The this Pointer', {
    title: 'مثال محلول · this يتبع الكائن المستدعي', chapter: 2,
    subtitle: 'نفس الدالة تعمل على طالبين؛ this يحدد أي كائن سيتغير.',
    definition: String.raw`class Student {
private:
    string name;
public:
    void setName(string name) {
        this->name = name;
    }

    string getName() const {
        return name;
    }
};`,
    usage: String.raw`Student a;
Student b;
a.setName("Lina"); // this points to a
b.setName("Omar"); // this points to b

cout << a.getName() << "\n";
cout << b.getName();`,
    output: 'Lina\nOmar',
    explanation: ['في الاستدعاء الأول، <code>this-&gt;name</code> هو اسم a.', 'في الاستدعاء الثاني، يصبح <code>this-&gt;name</code> اسم b.'],
    takeaway: '<strong>على اللوح:</strong> ارسم سهم this نحو a، ثم انقله إلى b عند الاستدعاء التالي. الدالة واحدة، والكائن المستهدف يتغيّر.'
  }],
  ['تطبيق صغير · مجموعة طلاب', {
    title: 'حل التطبيق · الطالب صاحب أعلى معدل', chapter: 3,
    subtitle: 'ابدأ بأول طالب، وقارن معدله ببقية الطلاب، واحتفظ بفهرس الأفضل.',
    definition: String.raw`class Student {
private:
    string name;
    double gpa = 0.0;
public:
    Student(string n, double g) : name(n) {
        if (g >= 0.0 && g <= 4.0) gpa = g;
    }

    string getName() const { return name; }
    double getGpa() const { return gpa; }
};`,
    usage: String.raw`Student students[] = {
    Student("Lina", 3.8),
    Student("Omar", 3.2),
    Student("Sara", 3.9)
};
int best = 0;
for (int i = 1; i < 3; ++i) {
    if (students[i].getGpa() >
    students[best].getGpa()) {
        best = i;
    }
}
cout << students[best].getName() << " ";
cout << students[best].getGpa();`,
    output: 'Sara 3.9',
    explanation: ['يبدأ best عند Lina؛ Omar لا يتفوق عليها.', 'Sara تتفوق على Lina، فيصبح best مساوياً لـ 2.'],
    takeaway: '<strong>غيّر المثال:</strong> اجعل معدل Omar يساوي 4.0 وأعد تتبّع الحلقة. عند التعادل يحتفظ هذا الحل بأول طالب يملك أعلى معدل.'
  }],
  ['الوصول مع public Inheritance', {
    title: 'مثال محلول · ترتيب الإنشاء مع الوراثة', chapter: 4,
    subtitle: 'الجزء الأساسي يُنشأ أولاً. وعند انتهاء العمر، ينعكس الترتيب.',
    definition: String.raw`class Person {
public:
    Person() {
        cout << "Create Person\n";
    }
    ~Person() {
        cout << "Destroy Person\n";
    }
};

class Student : public Person {
public:
    Student() {
        cout << "Create Student\n";
    }
    ~Student() {
        cout << "Destroy Student\n";
    }
};`,
    usage: String.raw`{
    Student s;
} // End of s's lifetime`,
    output: 'Create Person\nCreate Student\nDestroy Student\nDestroy Person',
    explanation: ['إنشاء Student يتضمن أولاً إنشاء جزئه Person.', 'عند الخروج من النطاق، يعمل destructor الخاص بـ Student ثم Person.'],
    takeaway: '<strong>نطاق المثال:</strong> نستخدم كائناً محلياً من Student. في الأمثلة التالية سنضيف virtual destructor للفئة الأساسية عند استخدامها بواجهة متعددة الأشكال.'
  }],
  ['Polymorphism · واجهة واحدة', {
    title: 'مثال كامل · من Abstract Class إلى الناتج', chapter: 4, complete: true,
    subtitle: 'اجمع الجزأين في ملف main.cpp واحد، ثم شغّل البرنامج. المخرَج المتوقع هو 12.',
    definition: String.raw`#include <iostream>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};`,
    usage: String.raw`class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(double w, double h)
    : width(w), height(h) {}
    double area() const override {
        return width * height;
    }
};

int main() {
    Rectangle r(4.0, 3.0);
    const Shape& shape = r;
    cout << shape.area() << "\n";
}`, output: '12',
    explanation: ['shape مرجع من النوع الأساسي يشير إلى r.', 'بفضل virtual يُستدعى تنفيذ Rectangle::area().'],
    takeaway: '<strong>جرّب مع الطلاب:</strong> احذف تنفيذ area() من Rectangle. سيصبح Rectangle مجرّداً، وسيرفض المترجم إنشاء r. نفترض أبعاداً موجبة في هذا المثال.'
  }]
];
teachingExamples.forEach(([afterTitle, example]) => {
  const position = slides.findIndex(slide => slide.title === afterTitle);
  if (position < 0) throw new Error(`Missing example anchor: ${afterTitle}`);
  slides.splice(position + 1, 0, workedExample(example));
});

const stage = document.getElementById('slides');
stage.innerHTML = slides.map((s,i) => `<section class="slide${s.example ? ' teaching-example' : ''}" id="slide-${i+1}" aria-labelledby="slide-title-${i+1}" data-print-label="INTRODUCTION TO OOP / C++ · ${String(i+1).padStart(2,'0')} / ${slides.length}">${s.hero ? `<h2 id="slide-title-${i+1}" class="sr-only">${s.title}</h2>` : `<div class="eyebrow">${String(s.chapter+1).padStart(2,'0')} / ${chapters[s.chapter]}${s.example ? ' / مثال محلول' : ''}</div><h2 id="slide-title-${i+1}"${/^[A-Za-z]/.test(s.title) ? ' dir="ltr"' : ''}>${s.title}</h2><p class="lead">${s.subtitle || ''}</p>`}${s.body}</section>`).join('');
const sections = [...stage.querySelectorAll('.slide')];
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const progress = document.getElementById('progress');
progress.setAttribute('aria-valuemax', slides.length);
let current = -1;
function showSlide(index, updateHash = true) {
  const target = Math.max(0,Math.min(slides.length-1,index));
  if (current === target) return;
  current = target;
  sections.forEach((section,i) => {
    section.classList.toggle('active',i === current);
    section.setAttribute('aria-hidden',String(i !== current));
  });
  previous.disabled = current === 0;
  next.disabled = current === slides.length-1;
  document.getElementById('counter').innerHTML = `${String(current+1).padStart(2,'0')} <span>/ ${slides.length}</span>`;
  document.getElementById('progress-fill').style.width = `${((current+1)/slides.length)*100}%`;
  progress.setAttribute('aria-valuenow',current+1);
  document.getElementById('announcement').textContent = `الشريحة ${current+1} من ${slides.length}: ${slides[current].title}`;
  document.title = `${slides[current].title} — Introduction to OOP`;
  if(updateHash) {
    try { history.replaceState(null,'',`#slide-${current+1}`); } catch { /* Local file viewers can restrict history. */ }
  }
  window.scrollTo({top:0,behavior:'instant'});
}
function fromHash() {
  const match = location.hash.match(/^#slide-(\d+)$/);
  const index = match ? Number(match[1])-1 : 0;
  showSlide(Number.isSafeInteger(index) ? index : 0);
}
previous.addEventListener('click',() => showSlide(current-1));
next.addEventListener('click',() => showSlide(current+1));
window.addEventListener('hashchange',fromHash);

const fullscreenButton=document.getElementById('fullscreen-button');
async function toggleFullscreen() {
  try {
    if(document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch { document.getElementById('announcement').textContent='ملء الشاشة غير متاح في هذا المتصفح. يمكن استخدام F11.'; }
}
fullscreenButton.addEventListener('click',toggleFullscreen);
if(!document.fullscreenEnabled) fullscreenButton.hidden=true;
document.addEventListener('fullscreenchange',() => { const label=document.fullscreenElement?'الخروج من ملء الشاشة':'ملء الشاشة';fullscreenButton.setAttribute('aria-label',label);fullscreenButton.title=label+' (F)'; });
const printState=[];
window.addEventListener('beforeprint',() => {
  printState.length=0;
  sections.forEach(section => section.removeAttribute('aria-hidden'));
  document.querySelectorAll('details').forEach(detail=>{printState.push([detail,detail.open]);detail.open=true;});
});
window.addEventListener('afterprint',() => {
  printState.forEach(([detail,wasOpen])=>{detail.open=wasOpen;});
  sections.forEach((section,i)=>section.setAttribute('aria-hidden',String(i!==current)));
});
document.addEventListener('keydown',event => {
  if(event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
  if(event.key===' ' && event.target.closest('button,summary,a')) return;
  if(['ArrowRight','PageDown',' '].includes(event.key)) {event.preventDefault();showSlide(current+1);}
  else if(['ArrowLeft','PageUp'].includes(event.key)) {event.preventDefault();showSlide(current-1);}
  else if(event.key==='Home') {event.preventDefault();showSlide(0);}
  else if(event.key==='End') {event.preventDefault();showSlide(slides.length-1);}
  else if(event.key.toLowerCase()==='f') {event.preventDefault();toggleFullscreen();}
});
let storedGpa=3.2;
document.getElementById('gpa-form').addEventListener('submit',event=>{
  event.preventDefault();
  const input=document.getElementById('gpa-input');
  const raw=input.value.trim().replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace('٫','.');
  const value=Number(raw);
  const valid=raw!=='' && Number.isFinite(value) && value>=0 && value<=4;
  if(valid) storedGpa=value;
  input.setAttribute('aria-invalid',String(!valid));
  const message=document.getElementById('gpa-message');
  message.classList.toggle('error',!valid);
  message.textContent=valid ? `تم قبول القيمة. setGpa() أعادت true؛ المعدل الآن ${storedGpa.toFixed(2)}.` : `تم رفض القيمة. أدخل رقماً من 0 إلى 4؛ المعدل بقي ${storedGpa.toFixed(2)}.`;
  document.getElementById('gpa-value').textContent=storedGpa.toFixed(2);
});
fromHash();

# Introduction to OOP slides implementation plan

**Goal:** Create a complete Arabic teaching presentation with English terminology and C++ examples in the existing `index.html`.
**Architecture:** Offline `index.html` contains the presentation shell; linked `main.js` contains slide content and interactions, and `main.css` contains all presentation styles. Buildless, with no libraries or remote assets.
**Scope:** All user topics, progressing from classes and objects through encapsulation, lifetime, object arrays, inheritance, and abstract classes.

## Tasks

- [x] Build the slide content and responsive presentation layout, with RTL prose and LTR code.
- [x] Add buttons and keyboard navigation, a searchable contents dialog, deep links, fullscreen, and print styles.
- [x] Verify every slide in desktop/mobile viewports, navigation and boundaries, accessible controls, print visibility, and representative C++ examples.

## Design decisions

Use a light paper background, emerald accents, dark code panels, and a repeated Student example. Provide small exercises and an interactive GPA setter demonstration. Keep the user's requested local file as the deliverable; no hosting or remote changes.

## Review focus

Check long code on narrow screens, Arabic/English direction, invalid slide hashes, dialog keyboard behavior, and printing every slide.

## Verification

Playwright with installed Chrome checked all 32 slides at 1440, 768, and 390 pixels wide, with no horizontal page overflow or JavaScript errors. Verified navigation boundaries, RTL keyboard navigation, contents search, invalid hashes, Escape behavior, and GPA validation including Arabic digits. Compiled and ran 10 representative C++11 programs with GCC, including encapsulation assertions and polymorphic dispatch. PDF export contains exactly 32 pages, each beginning with its corresponding slide number. QA scripts, screenshots, compilers' outputs, and generated PDF live in the OS temporary directory, outside the deliverable.

## Teaching examples and stylesheet follow-up

Moved all embedded CSS and inline declarations into readable `main.css`, linked from `index.html`. Added eight worked examples after their corresponding concepts: independent object state, bank-account encapsulation, constructor selection, destructor ordering, the this pointer, finding the highest GPA, base/derived lifetime, and a complete abstract-class program. Each example includes expected output and classroom discussion prompts.

Verified all 40 slides at desktop, tablet, and mobile sizes; the external stylesheet loads and no embedded or inline CSS remains. All 18 C++ examples compile and run with expected output. PDF export has 40 pages, one per slide.

JavaScript follow-up: extracted the existing script into `main.js` and loaded it at the end of `index.html`, preserving its logic. `node --check main.js` and the browser checks pass, including all 40 slides, navigation, search, GPA validation, responsive layouts, and the 40-page PDF export.

## Beginner content review

Revised the teaching sequence for students new to OOP, with basic C++ variables, conditions, loops, and functions as prerequisites. Added seven foundation slides: prerequisites, code placement and output conventions, the student-card analogy, object syntax, scope, references, and the reason for abstract classes. Added a ninth worked example tracing method input, state change, return value, and output.

Explained `const`, constructor initializer lists, `this`, `virtual`, `override`, `= default`, and pure virtual `= 0` at their first substantive use. Replaced range-for/auto-reference syntax with an indexed loop and removed delegating constructors, static-member jargon, and RAII/invariant terminology from the introductory explanation. Clarified that private controls access while setters validate values, and that repeated Student definitions are separate evolving examples. Restored readable indentation inside C++ raw strings and split the final exercises into basic and extended levels.

Final verification: all 48 slides checked at 1440, 768, and 390 pixels wide; navigation, search, GPA validation, and invalid hashes pass with no JavaScript errors. All 28 C++ verification programs compile under C++11 and produce the expected output. Five intentional errors fail for the described reasons: private access, direct abstract-class instantiation, missing pure virtual implementation, incorrect override signature, and missing default constructor. PDF has 48 pages, each starting with the corresponding slide number.

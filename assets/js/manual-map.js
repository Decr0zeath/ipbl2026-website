// ============================================================
// MANUAL MAP: single source of truth for the manual structure.
// Sidebar, page header, document title, and prev/next pagination
// are all generated from this by assets/js/main.js.
// To add a section: drop its fragment in sections/<slug>.html and
// add one entry here, in order.
// ============================================================

var MANUAL_MAP = [
  {
    slug: 'overview',
    num: '01',
    crumb: 'Section 01 · Foundations',
    title: 'Overview',
    subtitle: "A short briefing on what you're building, why it's shaped the way it is, and what we expect you to know before you begin."
  },
  {
    slug: 'bom',
    num: '02',
    crumb: 'Section 02 · Foundations',
    title: 'Bill of Materials & Tools',
    subtitle: "Every component, every fastener, every tool you'll need at the bench. Read this before you order anything."
  },
  {
    slug: 'printing',
    num: '03',
    crumb: 'Section 03 · The Structure',
    title: '3D-Printed Parts',
    subtitle: 'Ten STL files, one printer, roughly fourteen hours of bed time. The structure of the entire robot is plastic, and the quality of that plastic determines everything that follows.'
  },
  {
    slug: 'assembly',
    num: '04',
    crumb: 'Section 04 · The Build',
    title: 'Mechanical Assembly',
    subtitle: 'Twelve servos, four legs, two chassis plates. With patience and a screwdriver this takes three or four hours. With impatience, it takes considerably longer.'
  },
  {
    slug: 'electronics',
    num: '05',
    crumb: 'Section 05 · The Electrons',
    title: 'Electronics & Wiring',
    subtitle: 'Pinouts, channel assignments, power budgeting, and the conventions that will keep your wiring clean once the PCB is soldered.'
  },
  {
    slug: 'pcb',
    num: '06',
    crumb: 'Section 06 · The PCB',
    title: 'PCB Assembly',
    subtitle: "A schematic walkthrough (so you understand what you're soldering) followed by the assembly sequence for the board itself."
  },
  {
    slug: 'firmware',
    num: '07',
    crumb: 'Section 07 · The Software',
    title: 'Arduino Firmware',
    subtitle: 'Toolchain setup, a walk through the base sketch, and the calibration ritual that turns twelve imperfectly-centred servos into a usable robot.'
  },
  {
    slug: 'testing',
    num: '08',
    crumb: 'Section 08 · The Last Mile',
    title: 'Testing & Calibration',
    subtitle: "Bench tests, gait verification, common failure modes, and the pre-flight checklist that confirms you're ready to fly."
  }
];

var MANUAL_REFERENCE = [
  {
    slug: 'credits',
    num: null,
    crumb: 'Reference',
    title: 'Credits & Acknowledgments',
    subtitle: 'No project of this size is built alone. The work below was made possible by the open-hardware community, our partner institutions, and the host team in Cebu.'
  }
];

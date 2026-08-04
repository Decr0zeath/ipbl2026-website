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
    subtitle: "A concise briefing on what you are building, why it takes the form it does, and what you are expected to know before you begin."
  },
  {
    slug: 'bom',
    num: '02',
    crumb: 'Section 02 · Foundations',
    title: 'Bill of Materials & Tools',
    subtitle: 'Every component, every fastener, and every tool required at the bench.'
  },
  {
    slug: 'printing',
    num: '03',
    crumb: 'Section 03 · The Structure',
    title: '3D-Printed Parts',
    subtitle: 'Ten STL files and one printer, from raw filament to a complete set of parts.'
  },
  {
    slug: 'assembly',
    num: '04',
    crumb: 'Section 04 · The Build',
    title: 'Mechanical Assembly',
    subtitle: 'Twelve servos, four legs, two chassis plates. With patience and a screwdriver, the process takes three to four hours; with impatience, considerably longer.'
  },
  {
    slug: 'pcb',
    num: '05',
    crumb: 'Section 05 · The PCB',
    title: 'PCB Assembly',
    subtitle: 'A schematic walkthrough, so that you understand what you are soldering, followed by the assembly sequence for the board itself.'
  },
  {
    slug: 'electronics',
    num: '06',
    crumb: 'Section 06 · The Electrons',
    title: 'Electronics & Wiring',
    subtitle: 'Pinouts, channel assignments, power budgeting, and the conventions that will keep your wiring clean once the PCB is soldered.'
  },
  {
    slug: 'firmware',
    num: '07',
    crumb: 'Section 07 · The Software',
    title: 'Arduino Firmware',
    subtitle: 'Toolchain setup, then the two sketches that take the robot from bare assembly to a walker: centring the servos before the rocker arms go on, then flashing the robot itself.'
  },
  {
    slug: 'testing',
    num: '08',
    crumb: 'Section 08 · The Last Mile',
    title: 'Testing & Calibration',
    subtitle: 'Reference footage of a completed unit, and the one bar to clear before departure: a robot that stands and crawls.'
  }
];

var MANUAL_REFERENCE = [
  {
    slug: 'credits',
    num: null,
    crumb: 'Reference',
    title: 'Credits & Acknowledgments',
    subtitle: 'No project of this scale is completed alone. The work that follows was made possible by the open-hardware community, our partner institutions, and the host team in Cebu.'
  }
];

# iPBL 2026 — Quadruped Pre-Training Manual

Pre-training field manual for delegates of **International Project-Based Learning 2026**, hosted by the **University of San Jose – Recoletos** in Cebu, Philippines.

Built as a static multi-page site for GitHub Pages.

## What this is

A 10-page web manual covering everything a student needs to assemble and program a four-legged, eight-servo quadruped robot before arriving on-site for the on-ground iPBL programme. The mechanical platform is adapted from [Regis Hsu's open quadruped on PCBWay](https://www.pcbway.com/project/shareproject/Quadruped_Spider_Robot_3D_Printed_Parts_SG90_Servo_Motor_Arduino_Nano_10107fe3.html).

The site covers:

- §01 Overview — what the robot is, system block diagrams
- §02 Bill of Materials & Tools
- §03 3D-Printed Parts — STL inventory, print settings, orientation
- §04 Mechanical Assembly — step-by-step build
- §05 Electronics & Wiring — pinout, channel map, power architecture
- §06 PCB Assembly — schematic walkthrough and soldering sequence
- §07 Arduino Firmware — toolchain, sketch walkthrough, calibration
- §08 Testing & Calibration — bench tests, troubleshooting, pre-flight checklist
- Credits & Acknowledgments

## Participating universities

- **University of San Jose – Recoletos** (host, Cebu, Philippines)
- **Southern Taiwan University of Science and Technology** (Tainan, Taiwan)
- **Osaka Institute of Technology** (Osaka, Japan)

## Deploying to GitHub Pages

1. Push this entire folder to a GitHub repository.
2. In the repo settings, go to **Pages**.
3. Source: **Deploy from a branch**. Branch: `main` (or `gh-pages`), folder `/ (root)`.
4. Save. After a minute or two, the site will be live at `https://<your-username>.github.io/<repo-name>/`.

No build step. All assets are static HTML, CSS, and a tiny JS file.

## File structure

```
/
├── index.html              Home / welcome page
├── overview.html           §01
├── bom.html                §02
├── printing.html           §03
├── assembly.html           §04
├── electronics.html        §05
├── pcb.html                §06
├── firmware.html           §07
├── testing.html            §08
├── credits.html            Credits page
├── assets/
│   ├── css/
│   │   └── style.css       Shared stylesheet
│   ├── js/
│   │   └── main.js         Mobile nav + current-page highlight
│   └── images/             (Empty — drop your photos here)
└── README.md
```

## Replacing placeholder images

Every figure in the manual currently displays a styled placeholder with the figure label. To replace one with a real photograph:

1. Drop the image into `assets/images/` (e.g. `fig-06-leg-exploded.jpg`).
2. In the corresponding HTML file, find the `<figure>` block.
3. Replace the placeholder div:
   ```html
   <div class="frame"><div class="placeholder"><span>FIG. 06 — ...</span></div></div>
   ```
   with:
   ```html
   <div class="frame"><img src="assets/images/fig-06-leg-exploded.jpg" alt="Exploded view of single leg assembly" /></div>
   ```

The frame's corner brackets and styling stay; only the inner content changes.

## Design

- **Type:** Fraunces (display), Newsreader (body), JetBrains Mono (code/labels)
- **Palette:** USJ-R green `#0D3E20` + gold `#FEB104` on warm cream `#FAF6EC`
- **Aesthetic:** Academic field-guide / vintage technical manual

## Credits

Original quadruped platform — [Regis Hsu on PCBWay](https://www.pcbway.com/project/shareproject/Quadruped_Spider_Robot_3D_Printed_Parts_SG90_Servo_Motor_Arduino_Nano_10107fe3.html). Manual adaptation and PCB redesign by the USJ-R iPBL 2026 host team.

## License

Manual text and design: see the host team for redistribution terms.
Original quadruped design: refer to Regis Hsu's original publication.

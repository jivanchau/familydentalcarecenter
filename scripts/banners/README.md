# Hero banner sources (1920x1080, saved to public/img/images/)

| Slide | Output | How it was made |
|---|---|---|
| 1 | `hero-smile.jpg` | `make_hero.py` from the clinic's own photo (blue panel + smile-centred face) |
| 2 | `hero-implant.jpg` | `make_banner.py` from [Jonathan Borba on Unsplash](https://unsplash.com/photos/W9YEY6G8LVM) (Unsplash License: free commercial use)<br>`python make_banner.py implant.jpg hero-implant.jpg 1207 860 1300 1150 260` |
| 3 | `hero-root-canal.jpg` | Custom SVG in `root-canal-illustration.html`, rendered with headless Chrome at 1920x1080 |

Python scripts need Pillow: `pip install pillow`.
Render the illustration:
`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --force-device-scale-factor=1 --window-size=1920,1080 --screenshot=out.png file://$PWD/root-canal-illustration.html`

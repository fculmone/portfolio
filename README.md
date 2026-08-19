# Portfolio

**Live site: [fculmone.github.io/portfolio](https://fculmone.github.io/portfolio/)**

A Zelda-inspired interactive portfolio — explore a little world built with
[Phaser 3](https://phaser.io/), find the geese, pet the dogs, and enter the
house to reach the [About page](https://fculmone.github.io/portfolio/aboutme/).

## Controls

- **Desktop:** WASD or arrow keys
- **Mobile:** on-screen joystick ([joy.js](https://github.com/bobboteck/JoyStick))

## Development

```bash
npm install
npm run dev      # dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

Built with Vite. The site is a two-page app (`index.html` game + `aboutme/`)
configured in `vite.config.js`.

## Deployment

Every push to `main` is automatically built and deployed to GitHub Pages via
GitHub Actions (`.github/workflows/deploy.yml`).

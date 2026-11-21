# Allen Odoom's Portfolio Website

Welcome to the repository of my personal portfolio website. This site showcases my projects, experiences, and skills as a Software Engineer.

## Live Demo

Visit the live site: [allenodoom.com](https://allenodoom.com)

## Technologies Used

- React
- Vite
- React Router
- SCSS Modules
- Tailwind CSS
- PowerGlitch
- react-vertical-timeline-component
- react-markdown
- lucide-react
- Giscus (comments)
- Canvas 2D + Web Audio (game)
- Upstash Redis (game leaderboard)
- Vercel (hosting + serverless functions)

## Features

- Responsive design
- Interactive "VCR" intro screen
- Smooth scrolling navigation
- Project showcase with GitHub links
- Vertical experience timeline
- Blog with markdown support
- Comment system (Giscus/GitHub Discussions)
- Animated backgrounds
- "Eject" feature
- Interactive terminal (type `help` for commands)
- Playable Space Invader game: press **PLAY ▶** on the eject screen, or type `play` in the terminal
  - You play as the site's invader; desktop: A/D or ←/→ to move, Space to fire, P to pause
  - Mobile: drag anywhere to move, hold to fire
  - Anonymous shared leaderboard ("secret user N", no signup), best score per player

## Current Project Structure

```
api/
├── leaderboard.js    # Vercel function: GET/POST /api/leaderboard
└── _leaderboard.js   # Shared leaderboard logic (Redis + in-memory dev store)
src/
├── components/
│   ├── ui/           # Reusable UI (FlipImage, Typewriter, AnimatedBackground, Giscus)
│   ├── layout/       # Layout components (Navbar, ContactLinks)
│   ├── sections/     # Page sections (Hero, About/terminal, ExperienceTimeline, ProjectsGrid)
│   └── game/         # InvadersGame (menus, HUD buttons, leaderboard UI)
├── game/             # Game engine (canvas), sound effects, leaderboard client
├── pages/            # Route pages (Home, Blog, EjectScreen, NoSignal)
│   └── blog/         # Blog index and post pages
├── content/
│   └── blog/         # Markdown blog posts
├── data/             # Data files (experiences, projects, blogPosts, aboutMe)
├── styles/           # Shared styles
├── utils/            # Terminal commands, theme helpers
├── App.jsx           # Main app with routing
└── main.jsx          # Entry point with intro screen
```

## Getting Started

Requires Node.js 26 (the same version Vercel builds with).

1. Clone the repository
   ```
   git clone https://github.com/allenocvb/my-portfolio.git
   cd my-portfolio
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

## Building for Production

```
npm run build
```

This will generate a `dist` folder with the built assets.

## Tests

```
node --test api/_leaderboard.test.js src/utils/terminalCommands.test.js
```


## Deployment

This site is deployed using Vercel. I push changes to the main branch and Vercel automatically deploys.
The Vercel project (`allen`) builds with **Node.js 26.x** (Project Settings → Build and Deployment).

Ensure `vercel.json` is configured for client-side routing:

```json
{
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }]
}
```

## Game leaderboard

- `api/leaderboard.js` (a Vercel function) stores scores in Upstash Redis.
- The Redis database (`portfolio-leaderboard`, free plan, Washington D.C.) is connected to the Vercel project from the Storage tab with the env prefix `KV`, which provides `KV_REST_API_URL` and `KV_REST_API_TOKEN`. `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` also work.
- Each browser gets a random id that maps to an auto-incrementing "secret user N"; only each player's best score is kept. Submissions are sanity-checked (score vs. play time) and rate-limited.
- If the database is unreachable or not configured, the game still works and shows scores saved on the player's device.
- During `npm run dev`, `vite.config.js` serves an in-memory leaderboard that resets when the dev server restarts.

## Customization

- **Content**: Update data files in `src/data/`
- **Components**: Modify components in `src/components/`
- **Styles**: SCSS modules alongside components, Tailwind for utilities
- **Blog**: Add markdown files to `src/content/blog/`

## Credit

Took a lot of inspiration from the following:
@aidenybai
@Renovamen

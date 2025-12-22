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
- Vercel (hosting)

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

## Current Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI (FlipImage, Typewriter, AnimatedBackground, Giscus)
│   ├── layout/       # Layout components (Navbar, ContactLinks)
│   └── sections/     # Page sections (Hero, About, ExperienceTimeline, ProjectsGrid)
├── pages/            # Route pages (Home, Blog, EjectScreen, NoSignal)
│   └── blog/         # Blog index and post pages
├── content/
│   └── blog/         # Markdown blog posts
├── data/             # Data files (experiences, projects, blogPosts, aboutMe)
├── styles/           # Shared styles
├── App.jsx           # Main app with routing
└── main.jsx          # Entry point with intro screen
```

## Getting Started

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


## Deployment

This site is deployed using Vercel. I push changes to the main branch and Vercel automatically deploys.

Ensure `vercel.json` is configured for client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Customization

- **Content**: Update data files in `src/data/`
- **Components**: Modify components in `src/components/`
- **Styles**: SCSS modules alongside components, Tailwind for utilities
- **Blog**: Add markdown files to `src/content/blog/`

## Credit

Took a lot of inspiration from the following:
@aidenybai
@Renovamen

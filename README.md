# Allen Odoom's Portfolio Website

Welcome to the repository of my personal portfolio website. This site showcases my projects, experiences, and skills as a Software Engineer and college student.

## 🚀 Live Demo

Visit the live site: [allenodoom.com](https://allenodoom.com)

## 🛠 Technologies Used

- React
- Vite
- React Router
- SCSS Modules
- Tailwind CSS
- PowerGlitch
- Vercel (for hosting)

## 🌟 Features

- Responsive design
- Interactive "VCR" intro screen
- Smooth scrolling navigation
- Project showcase with GitHub links
- Experience timeline
- Animated backgrounds
- "Eject" feature for a unique user experience

## 🚀 Getting Started

To run this project locally:

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

## 📦 Building for Production

To create a production build:

```
npm run build
```

This will generate a `dist` folder with the built assets.

## 🚀 Deployment

This site is deployed using Vercel. The deployment process is as follows:

1. Push changes to the main branch of the GitHub repository
2. Vercel automatically detects the changes and triggers a new deployment
3. The site is built and deployed to Vercel's global CDN

Note: Ensure that the `vercel.json` file is properly configured for client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 🎨 Customization

- To modify the content, update the relevant components in the `src/components` directory
- Styles are managed using a combination of SCSS modules and Tailwind CSS

### Tailwind CSS Configuration

This project uses Tailwind CSS for styling. The configuration can be found in `tailwind.config.js`:

Key points about the Tailwind configuration:
- It's set up to scan all HTML, JS, JSX, TS, TSX, and CSS files in the `src` directory for Tailwind classes
- A custom mono font family 'VCR' is defined
- No additional plugins are currently in use

## 🤝 Contributing

While this is a personal portfolio, I'm open to suggestions and improvements. Feel free to open an issue or submit a pull request.

## 📞 Contact

Feel free to reach out to me for any questions or collaborations. You can find my contact information on the live site.

---

Thank you for checking out my portfolio project! You're an awesome person!!

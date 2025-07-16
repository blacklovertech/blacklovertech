# Janarthanan's Portfolio Website

A modern, responsive portfolio website showcasing full-stack development, IoT solutions, and SaaS applications. Built with HTML, CSS, JavaScript, and optimized for GitHub Pages deployment.

## Features

### 🌙 Dark Mode
- Toggle between light and dark themes
- Automatic system preference detection
- Smooth transitions and animations
- Persistent theme preference

### 📝 Blog Management
- Easy blog post creation and editing
- JSON-based storage for GitHub Pages compatibility
- Category filtering and search functionality
- Admin panel for development environment

### 📬 Contact Form
- Form submissions stored in JSON format
- Admin panel for managing contacts
- Email notifications ready for integration
- Export functionality for data backup

### 🚀 GitHub Pages Optimized
- Static site generation
- No backend dependencies
- Automatic deployment ready
- Fast loading and SEO optimized

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Open locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using Live Server extension in VS Code
   ```

3. **Deploy to GitHub Pages**
   - Push to GitHub repository
   - Enable GitHub Pages in repository settings
   - Select source branch (main/master)
   - Your site will be available at `https://yourusername.github.io/portfolio`

## File Structure

```
portfolio/
├── index.html              # Main landing page
├── pages/                  # Individual page components
│   ├── portfolio_homepage.html
│   ├── projects_showcase.html
│   ├── technical_blog.html
│   ├── contact_consultation.html
│   ├── services_pricing.html
│   └── about_experience.html
├── css/                    # Stylesheets
│   ├── main.css           # Generated CSS (don't edit)
│   └── tailwind.css       # Custom styles and dark mode
├── js/                     # JavaScript modules
│   ├── theme-manager.js   # Dark mode functionality
│   ├── blog-manager.js    # Blog post management
│   └── contact-manager.js # Contact form handling
├── data/                   # JSON data files
│   ├── blog-posts.json    # Blog posts data
│   └── contacts.json      # Contact submissions
├── public/                 # Static assets
│   ├── favicon.ico
│   └── manifest.json
└── README.md
```

## Configuration

### Dark Mode
The dark mode is automatically enabled. No configuration needed. Users can toggle between light and dark themes using the theme toggle button in the navigation.

### Blog Management
In development mode (localhost), an admin panel appears for:
- Creating new blog posts
- Editing existing posts
- Exporting blog data to JSON

To add a new blog post in production:
1. Use the admin panel in development
2. Export the updated `blog-posts.json`
3. Replace the file in your repository
4. Commit and push changes

### Contact Form
Contact form submissions are stored in `data/contacts.json`. To access submissions:
1. Use the admin panel in development
2. Export contact data
3. Process submissions as needed

## Customization

### Colors and Themes
Edit CSS variables in `css/tailwind.css`:
```css
:root {
  --color-primary: #1a1a1a;
  --color-accent: #3b82f6;
  /* ... other colors */
}

[data-theme="dark"] {
  --color-primary: #f9fafb;
  --color-accent: #60a5fa;
  /* ... dark theme colors */
}
```

### Content
- Edit HTML files in `pages/` directory
- Update `data/blog-posts.json` for blog content
- Modify contact form in `pages/contact_consultation.html`

### Styling
- Only edit `css/tailwind.css` for custom styles
- Never modify `css/main.css` (auto-generated)
- Use existing CSS classes and utilities

## Deployment

### GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select source branch
4. Your site will be live at `https://yourusername.github.io/repository-name`

### Custom Domain
1. Add `CNAME` file to repository root
2. Configure DNS settings
3. Enable custom domain in GitHub Pages settings

## Development

### Local Development
```bash
# Start local server
python -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Admin Features
When running locally, admin panels are available for:
- Blog management
- Contact form management
- Data export/import

### Adding New Features
1. Create new JavaScript modules in `js/`
2. Add new pages in `pages/`
3. Update navigation in all pages
4. Test in both light and dark modes

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images with lazy loading
- Minimal JavaScript bundles
- CSS variables for theme switching
- Efficient animations and transitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in both themes
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Contact

For questions or support, please contact:
- Email: janarthanan@example.com
- GitHub: @yourusername
- LinkedIn: linkedin.com/in/janarthanan

---

**Note**: This portfolio is optimized for GitHub Pages deployment and includes features like dark mode, blog management, and contact form handling without requiring a backend server.
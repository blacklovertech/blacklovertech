// Blog Management System for easy blog post creation and management
class BlogManager {
    constructor() {
        this.blogPosts = [];
        this.categories = ['web-development', 'iot', 'saas', 'tutorials'];
        this.init();
    }

    init() {
        this.loadBlogPosts();
        this.setupEventListeners();
    }

    async loadBlogPosts() {
        try {
            const response = await fetch('/data/blog-posts.json');
            if (response.ok) {
                this.blogPosts = await response.json();
            } else {
                this.blogPosts = this.getDefaultPosts();
            }
        } catch (error) {
            console.log('No blog posts file found, using default posts');
            this.blogPosts = this.getDefaultPosts();
        }
    }

    getDefaultPosts() {
        return [
            {
                id: 'featured-js-frameworks',
                title: 'Modern JavaScript Frameworks: A Comprehensive Comparison',
                excerpt: 'Exploring the latest trends in JavaScript frameworks and their impact on modern web development.',
                content: 'Full article content here...',
                category: 'web-development',
                tags: ['javascript', 'react', 'vue', 'angular'],
                date: '2025-07-12',
                readTime: '8 min read',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2940&auto=format&fit=crop',
                featured: true,
                author: 'Janarthanan'
            },
            {
                id: 'iot-security-2025',
                title: 'IoT Security Best Practices for 2025',
                excerpt: 'Essential security considerations when developing IoT applications and connected devices.',
                content: 'Full article content here...',
                category: 'iot',
                tags: ['iot', 'security', 'encryption'],
                date: '2025-07-08',
                readTime: '7 min read',
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2925&auto=format&fit=crop',
                featured: false,
                author: 'Janarthanan'
            },
            {
                id: 'saas-architecture-patterns',
                title: 'Scalable SaaS Architecture Patterns',
                excerpt: 'Building robust and scalable SaaS applications with modern architecture patterns and best practices.',
                content: 'Full article content here...',
                category: 'saas',
                tags: ['saas', 'architecture', 'scalability'],
                date: '2025-07-05',
                readTime: '6 min read',
                image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2874&auto=format&fit=crop',
                featured: false,
                author: 'Janarthanan'
            }
        ];
    }

    createBlogPost(postData) {
        const newPost = {
            id: this.generateId(postData.title),
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            category: postData.category,
            tags: postData.tags || [],
            date: new Date().toISOString().split('T')[0],
            readTime: this.calculateReadTime(postData.content),
            image: postData.image || '',
            featured: postData.featured || false,
            author: postData.author || 'Janarthanan'
        };

        this.blogPosts.unshift(newPost);
        this.saveBlogPosts();
        return newPost;
    }

    updateBlogPost(id, updatedData) {
        const index = this.blogPosts.findIndex(post => post.id === id);
        if (index !== -1) {
            this.blogPosts[index] = { ...this.blogPosts[index], ...updatedData };
            this.saveBlogPosts();
            return this.blogPosts[index];
        }
        return null;
    }

    deleteBlogPost(id) {
        const index = this.blogPosts.findIndex(post => post.id === id);
        if (index !== -1) {
            const deletedPost = this.blogPosts.splice(index, 1)[0];
            this.saveBlogPosts();
            return deletedPost;
        }
        return null;
    }

    getBlogPost(id) {
        return this.blogPosts.find(post => post.id === id);
    }

    getFeaturedPost() {
        return this.blogPosts.find(post => post.featured) || this.blogPosts[0];
    }

    getPostsByCategory(category) {
        if (category === 'all') return this.blogPosts;
        return this.blogPosts.filter(post => post.category === category);
    }

    searchPosts(query) {
        const searchTerm = query.toLowerCase();
        return this.blogPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    generateId(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    }

    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    }

    saveBlogPosts() {
        // For GitHub Pages, we'll store in localStorage and provide export functionality
        localStorage.setItem('blogPosts', JSON.stringify(this.blogPosts));
        this.triggerExport();
    }

    triggerExport() {
        // Create downloadable JSON file for GitHub Pages deployment
        const dataStr = JSON.stringify(this.blogPosts, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        // You can use this to download the file manually
        console.log('Blog posts data updated. Download the JSON file to update your repository:');
        console.log(dataUri);
    }

    exportBlogPosts() {
        const dataStr = JSON.stringify(this.blogPosts, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'blog-posts.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    setupEventListeners() {
        // Admin panel functionality for easy blog management
        document.addEventListener('DOMContentLoaded', () => {
            this.setupAdminPanel();
        });
    }

    setupAdminPanel() {
        // Create admin panel for blog management (only visible in development)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.createAdminPanel();
        }
    }

    createAdminPanel() {
        const adminPanel = document.createElement('div');
        adminPanel.id = 'blog-admin-panel';
        adminPanel.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: white; border: 1px solid #ccc; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 1000;">
                <h3>Blog Admin</h3>
                <button onclick="blogManager.showCreatePostModal()">Create Post</button>
                <button onclick="blogManager.exportBlogPosts()">Export JSON</button>
                <button onclick="blogManager.toggleAdminPanel()">Hide</button>
            </div>
        `;
        document.body.appendChild(adminPanel);
    }

    showCreatePostModal() {
        const modal = document.createElement('div');
        modal.id = 'create-post-modal';
        modal.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1001; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 20px; border-radius: 10px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                    <h2>Create New Blog Post</h2>
                    <form id="create-post-form">
                        <div style="margin-bottom: 15px;">
                            <label>Title:</label>
                            <input type="text" name="title" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Excerpt:</label>
                            <textarea name="excerpt" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; height: 60px;"></textarea>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Content:</label>
                            <textarea name="content" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; height: 200px;"></textarea>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Category:</label>
                            <select name="category" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="web-development">Web Development</option>
                                <option value="iot">IoT</option>
                                <option value="saas">SaaS</option>
                                <option value="tutorials">Tutorials</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Tags (comma-separated):</label>
                            <input type="text" name="tags" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Image URL:</label>
                            <input type="url" name="image" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>
                                <input type="checkbox" name="featured"> Featured Post
                            </label>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button type="submit" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Create Post</button>
                            <button type="button" onclick="blogManager.closeCreatePostModal()" style="background: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('create-post-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const postData = {
                title: formData.get('title'),
                excerpt: formData.get('excerpt'),
                content: formData.get('content'),
                category: formData.get('category'),
                tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
                image: formData.get('image'),
                featured: formData.has('featured')
            };
            
            this.createBlogPost(postData);
            this.closeCreatePostModal();
            alert('Blog post created successfully!');
        });
    }

    closeCreatePostModal() {
        const modal = document.getElementById('create-post-modal');
        if (modal) {
            modal.remove();
        }
    }

    toggleAdminPanel() {
        const panel = document.getElementById('blog-admin-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }
}

// Initialize blog manager
const blogManager = new BlogManager();

// Export for use in other modules
window.blogManager = blogManager;
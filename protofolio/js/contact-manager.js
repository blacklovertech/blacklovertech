// Contact Form Management System with JSON storage
class ContactManager {
    constructor() {
        this.contacts = [];
        this.init();
    }

    init() {
        this.loadContacts();
        this.setupEventListeners();
    }

    async loadContacts() {
        try {
            const response = await fetch('/data/contacts.json');
            if (response.ok) {
                this.contacts = await response.json();
            } else {
                this.contacts = [];
            }
        } catch (error) {
            console.log('No contacts file found, starting with empty array');
            this.contacts = [];
        }
    }

    submitContact(formData) {
        const contactSubmission = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            name: formData.name,
            email: formData.email,
            projectType: formData.projectType,
            budget: formData.budget,
            timeline: formData.timeline,
            description: formData.description,
            requirements: formData.requirements || '',
            company: formData.company || '',
            website: formData.website || '',
            technologies: formData.technologies || [],
            newsletter: formData.newsletter || false,
            status: 'new'
        };

        this.contacts.unshift(contactSubmission);
        this.saveContacts();
        return contactSubmission;
    }

    updateContactStatus(id, status) {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
            contact.status = status;
            contact.lastUpdated = new Date().toISOString();
            this.saveContacts();
            return contact;
        }
        return null;
    }

    getContacts() {
        return this.contacts;
    }

    getContactById(id) {
        return this.contacts.find(c => c.id === id);
    }

    getContactsByStatus(status) {
        return this.contacts.filter(c => c.status === status);
    }

    deleteContact(id) {
        const index = this.contacts.findIndex(c => c.id === id);
        if (index !== -1) {
            const deletedContact = this.contacts.splice(index, 1)[0];
            this.saveContacts();
            return deletedContact;
        }
        return null;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveContacts() {
        // For GitHub Pages, we'll store in localStorage and provide export functionality
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
        this.triggerExport();
    }

    triggerExport() {
        // Create downloadable JSON file for GitHub Pages deployment
        const dataStr = JSON.stringify(this.contacts, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        // You can use this to download the file manually
        console.log('Contacts data updated. Download the JSON file to update your repository:');
        console.log(dataUri);
    }

    exportContacts() {
        const dataStr = JSON.stringify(this.contacts, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'contacts.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupContactForm();
            this.setupAdminPanel();
        });
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form-element');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const contactData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    projectType: formData.get('project-type'),
                    budget: formData.get('budget'),
                    timeline: formData.get('timeline'),
                    description: formData.get('description'),
                    requirements: formData.get('requirements'),
                    company: formData.get('company'),
                    website: formData.get('website'),
                    technologies: formData.getAll('tech[]'),
                    newsletter: formData.has('newsletter')
                };

                try {
                    const submission = this.submitContact(contactData);
                    this.showSuccessMessage();
                    contactForm.reset();
                    
                    // Optional: Send email notification (would require backend service)
                    this.sendEmailNotification(submission);
                    
                } catch (error) {
                    console.error('Error submitting contact form:', error);
                    this.showErrorMessage();
                }
            });
        }
    }

    showSuccessMessage() {
        const successDiv = document.getElementById('form-success');
        const errorDiv = document.getElementById('form-error');
        
        if (successDiv) {
            successDiv.classList.remove('hidden');
            errorDiv?.classList.add('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                successDiv.classList.add('hidden');
            }, 5000);
        }
    }

    showErrorMessage() {
        const errorDiv = document.getElementById('form-error');
        const successDiv = document.getElementById('form-success');
        
        if (errorDiv) {
            errorDiv.classList.remove('hidden');
            successDiv?.classList.add('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 5000);
        }
    }

    sendEmailNotification(submission) {
        // This would typically send to a backend service
        // For GitHub Pages, we'll just log the notification
        console.log('Email notification would be sent for:', submission);
        
        // You could integrate with services like EmailJS, Netlify Forms, or Formspree
        // Example with EmailJS:
        // emailjs.send('service_id', 'template_id', submission);
    }

    setupAdminPanel() {
        // Admin panel for contact management (only visible in development)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.createAdminPanel();
        }
    }

    createAdminPanel() {
        const adminPanel = document.createElement('div');
        adminPanel.id = 'contact-admin-panel';
        adminPanel.innerHTML = `
            <div style="position: fixed; top: 70px; right: 20px; background: white; border: 1px solid #ccc; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 1000;">
                <h3>Contact Admin</h3>
                <p>Total Contacts: ${this.contacts.length}</p>
                <button onclick="contactManager.showContactsList()">View All</button>
                <button onclick="contactManager.exportContacts()">Export JSON</button>
                <button onclick="contactManager.toggleAdminPanel()">Hide</button>
            </div>
        `;
        document.body.appendChild(adminPanel);
    }

    showContactsList() {
        const modal = document.createElement('div');
        modal.id = 'contacts-list-modal';
        modal.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1001; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 20px; border-radius: 10px; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto;">
                    <h2>Contact Submissions</h2>
                    <div id="contacts-list">
                        ${this.generateContactsList()}
                    </div>
                    <button onclick="contactManager.closeContactsList()" style="margin-top: 20px; background: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    generateContactsList() {
        if (this.contacts.length === 0) {
            return '<p>No contacts yet.</p>';
        }

        return this.contacts.map(contact => `
            <div style="border: 1px solid #e5e7eb; padding: 15px; margin-bottom: 10px; border-radius: 5px;">
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: #1f2937;">${contact.name}</h3>
                    <span style="background: ${this.getStatusColor(contact.status)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${contact.status}</span>
                </div>
                <p><strong>Email:</strong> ${contact.email}</p>
                <p><strong>Project Type:</strong> ${contact.projectType}</p>
                <p><strong>Budget:</strong> ${contact.budget}</p>
                <p><strong>Timeline:</strong> ${contact.timeline}</p>
                <p><strong>Description:</strong> ${contact.description}</p>
                <p><strong>Submitted:</strong> ${new Date(contact.timestamp).toLocaleDateString()}</p>
                <div style="margin-top: 10px;">
                    <button onclick="contactManager.updateContactStatus('${contact.id}', 'contacted')" style="background: #10b981; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px;">Mark Contacted</button>
                    <button onclick="contactManager.updateContactStatus('${contact.id}', 'completed')" style="background: #3b82f6; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px;">Mark Completed</button>
                    <button onclick="contactManager.deleteContact('${contact.id}')" style="background: #ef4444; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
                </div>
            </div>
        `).join('');
    }

    getStatusColor(status) {
        switch (status) {
            case 'new': return '#f59e0b';
            case 'contacted': return '#10b981';
            case 'completed': return '#3b82f6';
            default: return '#6b7280';
        }
    }

    closeContactsList() {
        const modal = document.getElementById('contacts-list-modal');
        if (modal) {
            modal.remove();
        }
    }

    toggleAdminPanel() {
        const panel = document.getElementById('contact-admin-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }
}

// Initialize contact manager
const contactManager = new ContactManager();

// Export for use in other modules
window.contactManager = contactManager;
class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return [
            'data-index',
            'title',
            'description',
            'image',
            'image-alt',
            'link',
            'overview',
            'tags',
        ];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const index = this.getAttribute('data-index') || '1';
        const title = this.getAttribute('title') || 'Project Title';
        const description =
            this.getAttribute('description') || 'Project description';
        const image = this.getAttribute('image') || '';
        const imageAlt = this.getAttribute('image-alt') || 'Project image';
        const link = this.getAttribute('link') || '#';
        const overview = this.getAttribute('overview') || '';
        const tags = this.getAttribute('tags') || '';

        // Generate image path for avif (same name, different extension)
        const avifImage = image
            .replace('/gif/', '/avif/')
            .replace('.gif', '.avif');

        // Parse tags into array
        const tagList = tags ? tags.split(',').map((tag) => tag.trim()) : [];

        // Check if we're in light theme
        const isLightTheme = document.body.classList.contains('light-theme');

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap');

                /* CSS Variables - Dark Theme (default) */
                :host {
                    /* Colors */
                    --card-bg-start: #252526;
                    --card-bg-end: #2d2d30;
                    --card-border: #3e3e42;
                    --card-border-accent: #569cd6;
                    --card-border-hover: #4ec9b0;
                    --card-shadow: rgba(86, 156, 214, 0.3);

                    --text-primary: #d4d4d4;
                    --text-description: white;
                    --text-heading: #6a9955;
                    --text-accent: #4ec9b0;
                    --text-tag: #b5cea8;

                    --badge-bg: #1e1e1e;
                    --badge-text: #569cd6;
                    --badge-border: #569cd6;

                    --pitch-bg: #2d2d30;
                    --tag-bg: #1e1e1e;

                    /* Spacing */
                    --card-padding: 2rem;
                    --card-margin-bottom: 2rem;
                    --card-border-radius: 8px;

                    /* Typography */
                    --font-family: 'Fira Code', 'Courier New', monospace;
                    --font-size-base: 0.9rem;
                    --font-size-heading: 1.4rem;
                    --font-size-subheading: 1rem;
                    --font-size-tag: 0.8rem;
                    --font-size-badge: 0.75rem;
                    --line-height: 1.8;

                    /* Layout */
                    display: block;
                    position: relative;
                    padding: var(--card-padding);
                    margin-bottom: var(--card-margin-bottom);
                    
                    background: linear-gradient(135deg, var(--card-bg-start) 0%, var(--card-bg-end) 100%);
                    border: 1px solid var(--card-border);
                    border-left: 4px solid var(--card-border-accent);
                    border-radius: var(--card-border-radius);

                    transition: transform 0.3s ease, box-shadow 0.3s ease;

                    font-family: var(--font-family);
                    line-height: var(--line-height);
                    font-size: var(--font-size-base);
                    color: var(--text-primary);
                }

                :host(:hover) {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px var(--card-shadow);
                    border-left-color: var(--card-border-hover);
                }

                /* Light theme variables */
                :host(.light-theme) {
                    --card-bg-start: #ececec;
                    --card-bg-end: #f8f8f8;
                    --card-border: #d4d4d4;
                    --card-border-accent: #569cd6;
                    --card-border-hover: #4ec9b0;

                    --text-primary: #3a3a3a;
                    --text-description: #3a3a3a;

                    --badge-bg: #f5f5f5;
                    --pitch-bg: #ececec;
                    --tag-bg: #f5f5f5;
                }

                /* Index badge */
                .index-badge {
                    position: absolute;
                    padding: 0.25rem 0.75rem;
                    top: -0.75rem;
                    left: 1rem;

                    background: var(--badge-bg);
                    color: var(--badge-text);

                    font-size: var(--font-size-badge);
                    font-weight: 700;
                    border-radius: 3px;
                    border: 1px solid var(--badge-border);
                }

                .project-header h2 {
                    color: var(--text-heading);
                    font-size: var(--font-size-heading);
                    margin-bottom: 1rem;
                    font-weight: 700;
                }

                .project-description {
                    color: var(--text-description);
                    margin-bottom: 1.5rem;
                    line-height: 1.7;

                    padding-left: 1rem;
                    border-left: 3px solid var(--card-border);
                }

                .image-container {
                    margin: 1.5rem 0;
                    border-radius: 6px;
                    border: 2px solid var(--card-border);
                    overflow: hidden;
                }

                .image-container a {
                    display: block;
                }

                .image-container img {
                    display: block;
                    width: 100%;
                    height: auto;
                }

                .project-pitch {
                    margin-top: 1.5rem;
                    padding: 1.5rem;

                    background: var(--pitch-bg);
                    border-radius: 6px;
                    border-left: 3px solid var(--text-accent);
                }

                .project-pitch h3 {
                    color: var(--text-accent);
                    font-size: var(--font-size-subheading);
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                }

                .project-pitch p {
                    color: var(--text-primary);
                    line-height: 1.7;
                }

                .tech-stack {
                    margin-top: 1.5rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--card-border);
                }

                .tech-stack span {
                    display: inline-block;

                    background: var(--tag-bg);
                    color: var(--text-tag);

                    padding: 0.4rem 0.75rem;
                    margin: 0.25rem 0.25rem 0.25rem 0;
                    border-radius: 4px;
                    font-size: var(--font-size-tag);
                    border: 1px solid var(--card-border);
                }

                .tech-stack span::before {
                    content: '▸ ';
                    color: var(--card-border-accent);
                }

                /* Responsive styles */
                @media (max-width: 768px) {
                    :host {
                        --card-padding: 1.5rem;
                        --font-size-base: 0.85rem;
                        --font-size-heading: 1.2rem;
                        --font-size-tag: 0.75rem;
                    }

                    .project-description {
                        padding-left: 0.5rem;
                    }

                    .tech-stack span {
                        padding: 0.3rem 0.5rem;
                    }
                }

                @media (max-width: 480px) {
                    :host {
                        --card-padding: 1rem;
                        --font-size-base: 0.8rem;
                        --font-size-heading: 1rem;
                        --font-size-subheading: 0.9rem;
                        --font-size-tag: 0.7rem;
                        --font-size-badge: 0.65rem;
                    }

                    .index-badge {
                        padding: 0.2rem 0.5rem;
                    }

                    .project-description {
                        padding-left: 0.25rem;
                        font-size: 0.85rem;
                    }

                    .project-pitch {
                        padding: 1rem;
                    }

                    .tech-stack span {
                        padding: 0.25rem 0.4rem;
                    }
                }
            </style>

            <span class="index-badge">[${index}]</span>

            <header class="project-header">
                <h2>${title}</h2>
            </header>

            <p class="project-description">${description}</p>

            <figure class="image-container">
                <a href="${link}" target="_blank" rel="noopener noreferrer">
                    <picture>
                        <source srcset="${avifImage}" type="image/avif">
                        <img src="${image}" alt="${imageAlt}">
                    </picture>
                </a>
            </figure>

            <aside class="project-pitch">
                <h3>Project Overview</h3>
                <p>${overview}</p>
            </aside>

            <footer class="tech-stack">
                ${tagList.map((tag) => `<span>${tag}</span>`).join('')}
            </footer>
        `;

        // Apply light theme class if needed
        if (isLightTheme) {
            this.shadowRoot.host.classList.add('light-theme');
        }
    }
}

// Register the custom element
customElements.define('project-card', ProjectCard);

// Listen for theme changes to update cards
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            const isLight = document.body.classList.contains('light-theme');
            document.querySelectorAll('project-card').forEach((card) => {
                if (isLight) {
                    card.shadowRoot.host.classList.add('light-theme');
                } else {
                    card.shadowRoot.host.classList.remove('light-theme');
                }
            });
        }
    });
});

// Start observing body class changes
if (document.body) {
    observer.observe(document.body, { attributes: true });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { attributes: true });
    });
}

(function () {
    const STORAGE_KEY = 'project-cards-data';

    let projects = [];
    let editingIndex = -1;

    // DOM Elements
    let form, projectsList, messageContainer;
    let submitBtn, cancelBtn, refreshBtn;

    // Initialize when DOM is ready
    function init() {
        // Get DOM elements
        form = document.getElementById('crud-form');
        projectsList = document.getElementById('projects-list');
        messageContainer = document.getElementById('message-container');
        submitBtn = document.getElementById('submit-btn');
        cancelBtn = document.getElementById('cancel-btn');
        refreshBtn = document.getElementById('refresh-btn');

        // Load projects from localStorage
        loadProjects();

        // Event listeners
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', handleCancel);
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                loadProjects();
                renderProjectsList();
            });
        }

        // Initial render
        renderProjectsList();
    }

    // Load projects from localStorage
    function loadProjects() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            projects = data ? JSON.parse(data) : [];
            console.log('✅ Loaded projects from localStorage:', projects);
        } catch (error) {
            console.error('❌ Error loading projects:', error);
            projects = [];
            showMessage('Failed to load projects from localStorage', 'error');
        }
    }

    // Save projects to localStorage
    function saveProjects() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
            console.log('✅ Saved projects to localStorage:', projects);
            showMessage('Changes saved successfully!', 'success');
        } catch (error) {
            console.error('❌ Error saving projects:', error);
            showMessage(`Failed to save: ${error.message}`, 'error');
        }
    }

    // Show success/error message
    function showMessage(message, type = 'success') {
        if (!messageContainer) return;

        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;

        messageContainer.innerHTML = '';
        messageContainer.appendChild(messageEl);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    // Handle form submission (Create or Update)
    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const projectData = {
            index: formData.get('index'),
            title: formData.get('title'),
            description: formData.get('description'),
            image: formData.get('image'),
            imageAlt: formData.get('imageAlt'),
            link: formData.get('link'),
            overview: formData.get('overview'),
            tags: formData.get('tags'),
        };

        if (editingIndex >= 0) {
            // UPDATE
            updateProject(editingIndex, projectData);
        } else {
            // CREATE
            createProject(projectData);
        }
    }

    // CREATE - Add new project
    function createProject(projectData) {
        projects.push(projectData);
        saveProjects();
        renderProjectsList();
        form.reset();
        showMessage('Project created successfully!', 'success');
    }

    // UPDATE - Edit existing project
    function updateProject(index, projectData) {
        projects[index] = projectData;
        saveProjects();
        renderProjectsList();
        form.reset();
        editingIndex = -1;
        submitBtn.textContent = 'Create Project';
        showMessage('Project updated successfully!', 'success');
    }

    // DELETE - Remove project
    function deleteProject(index) {
        const confirmed = confirm(
            `Are you sure you want to delete "${projects[index].title}"?`
        );

        if (confirmed) {
            const deletedTitle = projects[index].title;
            projects.splice(index, 1);
            saveProjects();
            renderProjectsList();
            showMessage(`Deleted: ${deletedTitle}`, 'success');

            // If we were editing this project, reset form
            if (editingIndex === index) {
                handleCancel();
            }
        }
    }

    // Load project data into form for editing
    function loadProjectToForm(index) {
        editingIndex = index;
        const project = projects[index];

        document.getElementById('project-index').value = project.index || '';
        document.getElementById('project-title').value = project.title || '';
        document.getElementById('project-description').value =
            project.description || '';
        document.getElementById('project-image').value = project.image || '';
        document.getElementById('project-image-alt').value =
            project.imageAlt || '';
        document.getElementById('project-link').value = project.link || '';
        document.getElementById('project-overview').value =
            project.overview || '';
        document.getElementById('project-tags').value = project.tags || '';

        submitBtn.textContent = 'Update Project';
        showMessage('Editing project. Modify fields and click Update.', 'info');

        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
    }

    // Cancel / Clear form
    function handleCancel() {
        form.reset();
        editingIndex = -1;
        submitBtn.textContent = 'Create Project';
        messageContainer.innerHTML = '';
    }

    // Render projects list
    function renderProjectsList() {
        if (!projectsList) return;

        projectsList.innerHTML = '';

        if (projects.length === 0) {
            projectsList.innerHTML = `
                <div class="empty-state">
                    <p>No projects found in localStorage.</p>
                    <p>Add a new project using the form above, or load projects from the main page.</p>
                </div>
            `;
            return;
        }

        projects.forEach((project, index) => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';

            projectItem.innerHTML = `
                <div class="project-item-header">
                    <span class="project-item-index">[${project.index}]</span>
                    <h3 class="project-item-title">${project.title}</h3>
                </div>
                <p class="project-item-description">${project.description}</p>
                <div class="project-item-actions">
                    <button class="btn btn-small btn-edit" data-index="${index}">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-small btn-delete" data-index="${index}">
                        🗑️ Delete
                    </button>
                </div>
            `;

            projectsList.appendChild(projectItem);
        });

        // Add event listeners to Edit/Delete buttons
        document.querySelectorAll('.btn-edit').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                loadProjectToForm(index);
            });
        });

        document.querySelectorAll('.btn-delete').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                deleteProject(index);
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

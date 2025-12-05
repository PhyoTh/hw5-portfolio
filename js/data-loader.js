(function () {
    const STORAGE_KEY = 'project-cards-data';
    const JSONBIN_BIN_ID = '69334476d0ea881f401570dc';
    const JSONBIN_ACCESS_KEY = '$2a$10$3hMm9SdKqnFGMonlFcQ2Q.9tyVCEyAUAsonvA5qMGm9NPqDHc81Le';
    const JSONBIN_API_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`;

    let cardsContainer = null;

    // initialize when DOM is ready
    function init() {
        cardsContainer = document.querySelector('#projects-container');
        
        const loadLocalBtn = document.querySelector('#load-local-btn');
        const loadRemoteBtn = document.querySelector('#load-remote-btn');

        if (loadLocalBtn) {
            loadLocalBtn.addEventListener('click', loadFromLocal);
        }

        if (loadRemoteBtn) {
            loadRemoteBtn.addEventListener('click', loadFromRemote);
        }
    }

    // show loading indicator
    function showLoading() {
        if (!cardsContainer) return;
        
        cardsContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading-bar-wrapper">
                    <div class="loading-bar"></div>
                </div>
                <p class="loading-text">Loading projects...</p>
            </div>
        `;
    }

    // show error message
    function showError(message) {
        if (!cardsContainer) return;
        
        cardsContainer.innerHTML = `
            <div class="error-container">
                <p class="error-icon">⚠️</p>
                <p class="error-message">${message}</p>
            </div>
        `;
    }

    // clear all the cards
    function clearCards() {
        if (cardsContainer) {
            cardsContainer.innerHTML = '';
        }
    }

    // render cards from data array
    function renderCards(projectsData) {
        if (!cardsContainer) return;
        
        clearCards();

        if (!projectsData || projectsData.length === 0) {
            showError('No projects found in the data.');
            return;
        }

        projectsData.forEach((project, idx) => {
            const card = document.createElement('project-card');
            
            card.setAttribute('data-index', project.index || (idx + 1));
            card.setAttribute('title', project.title || 'Untitled Project');
            card.setAttribute('description', project.description || '');
            card.setAttribute('image', project.image || '');
            card.setAttribute('image-alt', project.imageAlt || '');
            card.setAttribute('link', project.link || '#');
            card.setAttribute('overview', project.overview || '');
            card.setAttribute('tags', project.tags || '');

            cardsContainer.appendChild(card);
        });
    }

    // load from localStorage
    function loadFromLocal() {
        showLoading();

        // simulate slight delay for loading animation
        setTimeout(() => {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                
                if (!data) {
                    showError('No data found in localStorage. Please load from remote first or add data manually.');
                    return;
                }

                const projectsData = JSON.parse(data);
                
                if (!Array.isArray(projectsData)) {
                    showError('Invalid data format in localStorage. Expected an array.');
                    return;
                }

                renderCards(projectsData);
                console.log('Loaded projects from localStorage:', projectsData);
                
            } catch (error) {
                console.error('Error loading from localStorage:', error);
                showError(`Failed to load from localStorage: ${error.message}`);
            }
        }, 500);
    }

    // load from JSONBin (remote)
    function loadFromRemote() {
        showLoading();

        fetch(JSONBIN_API_URL, {
            method: 'GET',
            headers: {
                'X-Access-Key': JSONBIN_ACCESS_KEY,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // JSONBin v3 returns data in { record: [...] } format
            const projectsData = data.record || data;
            
            if (!Array.isArray(projectsData)) {
                throw new Error('Invalid data format from JSONBin. Expected an array.');
            }

            // Save to localStorage for future use
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsData));
            
            renderCards(projectsData);
            console.log('Loaded projects from JSONBin:', projectsData);
            
        })
        .catch(error => {
            console.error('Error loading from JSONBin:', error);
            showError(`Failed to load from remote: ${error.message}`);
        });
    }

    // initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
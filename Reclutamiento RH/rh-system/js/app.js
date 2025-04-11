class App {
    constructor() {
        this.views = {
            candidates: new CandidatesView(),
            positions: new PositionsView(),
            employees: new EmployeesView(),
            reports: new ReportsView()
        };
        
        this.currentView = 'candidates';
        this.init();
    }
    
    init() {
        this.initEventListeners();
        this.showView(this.currentView);
    }
    
    initEventListeners() {
        // Navegación principal
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const viewName = e.target.closest('a').dataset.view;
                this.showView(viewName);
                
                // Actualizar clase activa
                document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                e.target.closest('a').classList.add('active');
            });
        });
    }
    
    showView(viewName) {
        this.currentView = viewName;
        const container = document.getElementById('app-content');
        container.innerHTML = '';
        
        if (this.views[viewName]) {
            this.views[viewName].render(container);
        } else {
            container.innerHTML = `
                <div class="view-error">
                    <h2>Vista no encontrada</h2>
                    <p>La vista solicitada no está disponible.</p>
                </div>
            `;
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
class PositionsService {
    constructor() {
        this.STORAGE_KEY = 'positionsData';
        this.positions = this.#loadInitialData();
    }

    // Método privado para cargar datos iniciales
    #loadInitialData() {
        // Datos por defecto (los que tenías originalmente)
        const defaultPositions = [
            {
                id: 1,
                name: "Desarrollador Frontend",
                description: "Desarrollo de interfaces web usando React y Angular",
                department: "TI",
                minSalary: 30000,
                maxSalary: 45000,
                riskLevel: "Medio",
                requiredSkills: [1, 3, 5],
                requiredTrainings: [1, 4],
                requiredLanguages: [2],
                status: true,
                createdAt: "2023-01-15"
            },
            {
                id: 2,
                name: "Diseñador UX/UI",
                description: "Diseño de interfaces de usuario y experiencia de usuario",
                department: "TI",
                minSalary: 35000,
                maxSalary: 50000,
                riskLevel: "Bajo",
                requiredSkills: [2, 4],
                requiredTrainings: [2, 3],
                requiredLanguages: [1],
                status: true,
                createdAt: "2023-02-20"
            },
            {
                id: 3,
                name: "Gerente de Proyectos",
                description: "Gestión de proyectos de desarrollo de software",
                department: "TI",
                minSalary: 50000,
                maxSalary: 70000,
                riskLevel: "Alto",
                requiredSkills: [6, 7],
                requiredTrainings: [5, 6],
                requiredLanguages: [1, 2],
                status: true,
                createdAt: "2023-03-10"
            }
        ];

        // Intentar cargar de localStorage
        const storedData = localStorage.getItem(this.STORAGE_KEY);
        
        // Si hay datos guardados, los usamos, sino usamos los por defecto
        return storedData ? JSON.parse(storedData) : defaultPositions;
    }

    // Método privado para guardar datos
    #saveData() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.positions));
    }

    /* 
    ****************************************
    *                                     *
    *   MÉTODOS ORIGINALES (SIN CAMBIOS)  *
    *                                     *
    ****************************************
    */

    getAllPositions() {
        return this.positions;
    }

    getActivePositions() {
        return this.positions.filter(position => position.status);
    }

    getPositionById(id) {
        return this.positions.find(position => position.id === id);
    }

    addPosition(position) {
        position.id = this.positions.length > 0 
            ? Math.max(...this.positions.map(p => p.id)) + 1 
            : 1;
        position.status = true;
        position.createdAt = new Date().toISOString().split('T')[0];
        this.positions.push(position);
        this.#saveData(); // <-- Solo añadí esta línea
        return position;
    }

    updatePosition(id, updatedPosition) {
        const index = this.positions.findIndex(p => p.id === id);
        if (index !== -1) {
            this.positions[index] = { ...this.positions[index], ...updatedPosition };
            this.#saveData(); // <-- Solo añadí esta línea
            return this.positions[index];
        }
        return null;
    }

    togglePositionStatus(id) {
        const position = this.getPositionById(id);
        if (position) {
            position.status = !position.status;
            this.#saveData(); // <-- Solo añadí esta línea
            return position;
        }
        return null;
    }

    deletePosition(id) {
        const index = this.positions.findIndex(p => p.id === id);
        if (index !== -1) {
            const deleted = this.positions.splice(index, 1)[0];
            this.#saveData(); // <-- Solo añadí esta línea
            return deleted;
        }
        return null;
    }

    /*
    ***************************************
    *                                    *
    *   FIN DE MÉTODOS ORIGINALES        *
    *                                    *
    ***************************************
    */

    // Método adicional (opcional) para limpiar el almacenamiento
    clearStorage() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.positions = this.#loadInitialData();
    }
}

const positionsService = new PositionsService();
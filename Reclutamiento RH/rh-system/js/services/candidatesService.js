class CandidatesService {
    constructor() {
        this.STORAGE_KEY = 'candidatesData';
        this.candidates = this.#loadInitialData();
    }

    // Método privado para cargar datos iniciales
    #loadInitialData() {
        // Datos por defecto (los que tenías originalmente)
        const defaultCandidates = [
            { 
                id: 1,
                idNumber: '001-1234567-8',
                name: 'Juan Pérez',
                email: 'juan.perez@example.com',
                phone: '809-555-1234',
                positionId: 1,
                department: 'TI',
                desiredSalary: 35000,
                skills: [1, 3],
                trainings: [1, 4],
                languages: [
                    { languageId: 2, level: 'Avanzado' },
                    { languageId: 1, level: 'Nativo' }
                ],
                workExperience: [
                    { 
                        id: 1,
                        company: 'Tech Solutions',
                        position: 'Desarrollador Junior',
                        startDate: '2018-01-01',
                        endDate: '2020-12-31',
                        salary: 25000,
                        description: 'Desarrollo de aplicaciones web con JavaScript y PHP'
                    }
                ],
                recommendedBy: 'María García',
                status: 'En proceso',
                interviewDate: '2023-06-15',
                notes: 'Excelente desempeño en prueba técnica'
            },
            { 
                id: 2,
                idNumber: '002-7654321-8',
                name: 'María Rodríguez',
                email: 'maria.rodriguez@example.com',
                phone: '809-555-5678',
                positionId: 2,
                department: 'Marketing',
                desiredSalary: 38000,
                skills: [2, 5],
                trainings: [2, 3],
                languages: [
                    { languageId: 1, level: 'Nativo' },
                    { languageId: 2, level: 'Intermedio' }
                ],
                workExperience: [
                    { 
                        id: 1,
                        company: 'Creative Agency',
                        position: 'Diseñadora Gráfica',
                        startDate: '2019-05-15',
                        endDate: '2021-08-20',
                        salary: 32000,
                        description: 'Diseño de material gráfico para campañas publicitarias'
                    }
                ],
                recommendedBy: '',
                status: 'Entrevistado',
                interviewDate: '2023-06-10',
                notes: 'Buena actitud y portfolio interesante'
            }
        ];

        // Intentar cargar de localStorage
        const storedData = localStorage.getItem(this.STORAGE_KEY);
        
        // Si hay datos guardados, los usamos, sino usamos los por defecto
        return storedData ? JSON.parse(storedData) : defaultCandidates;
    }

    // Método privado para guardar datos
    #saveData() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.candidates));
    }

    /* 
    ****************************************
    *                                     *
    *   MÉTODOS ORIGINALES (SIN CAMBIOS)  *
    *                                     *
    ****************************************
    */

    getAllCandidates() {
        return this.candidates;
    }

    getCandidateById(id) {
        return this.candidates.find(candidate => candidate.id === id);
    }

    addCandidate(candidate) {
        candidate.id = this.candidates.length > 0 
            ? Math.max(...this.candidates.map(c => c.id)) + 1 
            : 1;
        candidate.status = 'Nuevo';
        this.candidates.push(candidate);
        this.#saveData(); // <-- Solo añadí esta línea
        return candidate;
    }

    updateCandidate(id, updatedCandidate) {
        const index = this.candidates.findIndex(c => c.id === id);
        if (index !== -1) {
            this.candidates[index] = { ...this.candidates[index], ...updatedCandidate };
            this.#saveData(); // <-- Solo añadí esta línea
            return this.candidates[index];
        }
        return null;
    }

    deleteCandidate(id) {
        const index = this.candidates.findIndex(c => c.id === id);
        if (index !== -1) {
            const deleted = this.candidates.splice(index, 1)[0];
            this.#saveData(); // <-- Solo añadí esta línea
            return deleted;
        }
        return null;
    }

    changeCandidateStatus(id, status) {
        const candidate = this.getCandidateById(id);
        if (candidate) {
            candidate.status = status;
            this.#saveData(); // <-- Solo añadí esta línea
            return candidate;
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
        this.candidates = this.#loadInitialData();
    }
}

const candidatesService = new CandidatesService();
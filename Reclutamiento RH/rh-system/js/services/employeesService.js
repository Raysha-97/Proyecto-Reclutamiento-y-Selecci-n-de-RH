class EmployeesService {
    constructor() {
        this.STORAGE_KEY = 'employeesData';
        this.employees = this.#loadInitialData();
    }

    // Método privado para cargar datos iniciales
    #loadInitialData() {
        // Datos por defecto (los que tenías originalmente)
        const defaultEmployees = [
            {
                id: 1,
                candidateId: 1,
                idNumber: "001-1234567-8",
                name: "Juan Pérez",
                email: "juan.perez@company.com",
                phone: "809-555-1234",
                positionId: 1,
                department: "TI",
                salary: 40000,
                startDate: "2023-04-01",
                endDate: null,
                status: "Activo",
                emergencyContact: "María Pérez - 809-555-4321",
                bankAccount: "1234567890",
                bankName: "Banco Popular",
                createdAt: "2023-03-15"
            },
            {
                id: 2,
                candidateId: 3,
                idNumber: "003-9876543-2",
                name: "Ana Rodríguez",
                email: "ana.rodriguez@company.com",
                phone: "809-555-5678",
                positionId: 2,
                department: "Diseño",
                salary: 45000,
                startDate: "2023-05-10",
                endDate: null,
                status: "Activo",
                emergencyContact: "Carlos Rodríguez - 809-555-8765",
                bankAccount: "0987654321",
                bankName: "Banco BHD",
                createdAt: "2023-04-20"
            }
        ];

        // Intentar cargar de localStorage
        const storedData = localStorage.getItem(this.STORAGE_KEY);
        
        // Si hay datos guardados, los usamos, sino usamos los por defecto
        return storedData ? JSON.parse(storedData) : defaultEmployees;
    }

    // Método privado para guardar datos
    #saveData() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.employees));
    }

    /* 
    ****************************************
    *                                     *
    *   MÉTODOS ORIGINALES (SIN CAMBIOS)  *
    *                                     *
    ****************************************
    */

    getAllEmployees() {
        return this.employees;
    }

    getActiveEmployees() {
        return this.employees.filter(emp => emp.status === "Activo");
    }

    getEmployeeById(id) {
        return this.employees.find(emp => emp.id === id);
    }

    getEmployeesByDepartment(department) {
        return this.employees.filter(emp => emp.department === department && emp.status === "Activo");
    }

    addEmployee(employee) {
        employee.id = this.employees.length > 0 
            ? Math.max(...this.employees.map(e => e.id)) + 1 
            : 1;
        employee.status = "Activo";
        employee.createdAt = new Date().toISOString().split('T')[0];
        this.employees.push(employee);
        this.#saveData(); // <-- Solo añadí esta línea
        return employee;
    }

    updateEmployee(id, updatedEmployee) {
        const index = this.employees.findIndex(e => e.id === id);
        if (index !== -1) {
            this.employees[index] = { ...this.employees[index], ...updatedEmployee };
            this.#saveData(); // <-- Solo añadí esta línea
            return this.employees[index];
        }
        return null;
    }

    terminateEmployee(id, endDate) {
        const employee = this.getEmployeeById(id);
        if (employee) {
            employee.status = "Inactivo";
            employee.endDate = endDate || new Date().toISOString().split('T')[0];
            this.#saveData(); // <-- Solo añadí esta línea
            return employee;
        }
        return null;
    }

    deleteEmployee(id) {
        const index = this.employees.findIndex(e => e.id === id);
        if (index !== -1) {
            const deleted = this.employees.splice(index, 1)[0];
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
        this.employees = this.#loadInitialData();
    }
}

const employeesService = new EmployeesService();
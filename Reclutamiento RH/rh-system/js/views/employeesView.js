class EmployeesView {
    constructor() {
        this.employeeModal = document.getElementById('employee-modal');
        this.hiredModal = document.getElementById('hired-candidates-modal');
        this.employeeForm = document.getElementById('employee-form');
        this.employeesTable = document.getElementById('employees-table').querySelector('tbody');
        this.hiredCandidatesTable = document.getElementById('hired-candidates-table').querySelector('tbody');
        this.initServices();
    }

    initServices() {
        this.employeesService = employeesService;
        this.positionsService = positionsService;
        this.candidatesService = candidatesService;
    }

    init() {
        this.renderEmployeesTable();
        this.setupEventListeners();
        this.loadPositionSelect();
    }

    renderEmployeesTable() {
        this.employeesTable.innerHTML = '';
        const employees = this.employeesService.getAllEmployees();
        const positions = this.positionsService.getAllPositions();
        
        employees.forEach(employee => {
            const position = positions.find(p => p.id === employee.positionId);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${position ? position.name : 'N/A'}</td>
                <td>${employee.department}</td>
                <td>RD$ ${employee.salary.toLocaleString()}</td>
                <td>${employee.startDate}</td>
                <td><span class="status-badge ${employee.status.toLowerCase()}">${employee.status}</span></td>
                <td>
                    <button class="btn btn-edit" data-id="${employee.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-terminate" data-id="${employee.id}">
                        <i class="fas fa-user-slash"></i>
                    </button>
                </td>
            `;
            this.employeesTable.appendChild(row);
        });
    }

    loadPositionSelect() {
        const select = document.getElementById('employee-position');
        select.innerHTML = '<option value="">Seleccione un puesto</option>';
        
        this.positionsService.getAllPositions().forEach(position => {
            const option = document.createElement('option');
            option.value = position.id;
            option.textContent = position.name;
            option.dataset.department = position.department;
            option.dataset.minSalary = position.minSalary;
            option.dataset.maxSalary = position.maxSalary;
            select.appendChild(option);
        });
    }

    setupEventListeners() {
        // Botón para agregar nuevo empleado
        document.getElementById('add-employee').addEventListener('click', () => {
            this.openEmployeeModal();
        });

        // Botón para ver candidatos contratados
        document.getElementById('view-ex-candidates').addEventListener('click', () => {
            this.showHiredCandidates();
        });

        // Delegación de eventos para los botones de la tabla
        this.employeesTable.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const employeeId = parseInt(btn.dataset.id);
            if (btn.classList.contains('btn-edit')) {
                this.editEmployee(employeeId);
            } else if (btn.classList.contains('btn-terminate')) {
                this.terminateEmployee(employeeId);
            }
        });

        // Manejar envío del formulario
        this.employeeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmployee();
        });

        // Botón cancelar
        document.getElementById('cancel-form').addEventListener('click', () => {
            this.closeEmployeeModal();
        });

        // Cerrar modales al hacer clic en la X
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal === this.employeeModal) {
                    this.closeEmployeeModal();
                } else if (modal === this.hiredModal) {
                    this.closeHiredModal();
                }
            });
        });

        // Cerrar modales al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === this.employeeModal) {
                this.closeEmployeeModal();
            } else if (e.target === this.hiredModal) {
                this.closeHiredModal();
            }
        });

        // Actualizar departamento al seleccionar puesto
        document.getElementById('employee-position').addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            if (selectedOption.value) {
                document.getElementById('employee-department').value = selectedOption.dataset.department;
            }
        });
    }

    openEmployeeModal(employeeId = null) {
        this.isEditing = employeeId !== null;
        this.currentEmployeeId = employeeId;
        
        // Configurar el modal según si es edición o nuevo
        document.getElementById('modal-title').textContent = 
            this.isEditing ? 'Editar Empleado' : 'Nuevo Empleado';
        
        // Limpiar formulario
        this.employeeForm.reset();
        
        // Si es edición, cargar los datos del empleado
        if (this.isEditing) {
            const employee = this.employeesService.getEmployeeById(employeeId);
            if (employee) {
                document.getElementById('employee-id').value = employee.id;
                document.getElementById('employee-name').value = employee.name;
                document.getElementById('employee-email').value = employee.email || '';
                document.getElementById('employee-phone').value = employee.phone || '';
                document.getElementById('employee-position').value = employee.positionId || '';
                document.getElementById('employee-department').value = employee.department || '';
                document.getElementById('employee-salary').value = employee.salary || '';
                document.getElementById('employee-start-date').value = employee.startDate || '';
                document.getElementById('employee-status').value = employee.status || 'Activo';
            }
        } else {
            // Establecer fecha actual por defecto
            document.getElementById('employee-start-date').value = new Date().toISOString().split('T')[0];
        }
        
        // Mostrar modal
        this.employeeModal.style.display = 'block';
    }

    closeEmployeeModal() {
        this.employeeModal.style.display = 'none';
    }

    saveEmployee() {
        const formData = {
            id: this.isEditing ? parseInt(document.getElementById('employee-id').value) : null,
            name: document.getElementById('employee-name').value,
            email: document.getElementById('employee-email').value,
            phone: document.getElementById('employee-phone').value,
            positionId: parseInt(document.getElementById('employee-position').value),
            department: document.getElementById('employee-department').value,
            salary: parseFloat(document.getElementById('employee-salary').value),
            startDate: document.getElementById('employee-start-date').value,
            status: document.getElementById('employee-status').value
        };

        // Validar salario según el rango del puesto
        const position = this.positionsService.getPositionById(formData.positionId);
        if (position) {
            if (formData.salary < position.minSalary || formData.salary > position.maxSalary) {
                alert(`El salario debe estar entre RD$ ${position.minSalary.toLocaleString()} y RD$ ${position.maxSalary.toLocaleString()} para este puesto`);
                return;
            }
        }

        if (this.isEditing) {
            this.employeesService.updateEmployee(formData.id, formData);
        } else {
            this.employeesService.addEmployee(formData);
        }

        this.closeEmployeeModal();
        this.renderEmployeesTable();
    }

    editEmployee(employeeId) {
        this.openEmployeeModal(employeeId);
    }

    terminateEmployee(employeeId) {
        if (confirm('¿Está seguro que desea dar de baja a este empleado?')) {
            const employee = this.employeesService.getEmployeeById(employeeId);
            if (employee) {
                employee.status = 'Inactivo';
                this.employeesService.updateEmployee(employeeId, employee);
                this.renderEmployeesTable();
            }
        }
    }

    showHiredCandidates() {
        this.hiredCandidatesTable.innerHTML = '';
        const employees = this.employeesService.getAllEmployees();
        const candidates = this.candidatesService.getAllCandidates();
        const positions = this.positionsService.getAllPositions();

        employees.forEach(employee => {
            if (employee.candidateId) {
                const candidate = candidates.find(c => c.id === employee.candidateId);
                const position = positions.find(p => p.id === employee.positionId);
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${position ? position.name : 'N/A'}</td>
                    <td>${employee.startDate}</td>
                    <td>RD$ ${employee.salary.toLocaleString()}</td>
                `;
                this.hiredCandidatesTable.appendChild(row);
            }
        });

        this.hiredModal.style.display = 'block';
    }

    closeHiredModal() {
        this.hiredModal.style.display = 'none';
    }
}
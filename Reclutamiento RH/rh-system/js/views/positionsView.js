class PositionsView {
    constructor() {
        this.modal = document.getElementById('position-modal');
        this.form = document.getElementById('position-form');
        this.positionsTable = document.getElementById('positions-table').querySelector('tbody');
        this.initServices();
    }

    initServices() {
        this.positionsService = positionsService;
        this.skillsService = skillsService;
        this.languagesService = languagesService;
        this.trainingsService = trainingsService;
        this.employeesService = employeesService;
    }

    init() {
        this.renderPositionsTable();
        this.setupEventListeners();
        this.loadFormCheckboxes();
    }

    renderPositionsTable() {
        this.positionsTable.innerHTML = '';
        const positions = this.positionsService.getAllPositions();
        const employees = this.employeesService.getAllEmployees();
        
        positions.forEach(position => {
            const positionEmployees = employees.filter(emp => emp.positionId === position.id);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${position.id}</td>
                <td>${position.name}</td>
                <td>${position.department}</td>
                <td>RD$ ${position.minSalary.toLocaleString()} - RD$ ${position.maxSalary.toLocaleString()}</td>
                <td>${positionEmployees.length} ${positionEmployees.length === 1 ? 'empleado' : 'empleados'}</td>
                <td>
                    <button class="btn btn-view" data-id="${position.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-edit" data-id="${position.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" data-id="${position.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            this.positionsTable.appendChild(row);
        });
    }

    loadFormCheckboxes() {
        // Cargar competencias
        const skillsContainer = document.getElementById('required-skills');
        skillsContainer.innerHTML = '';
        this.skillsService.getAllSkills().forEach(skill => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="req-skill-${skill.id}" name="required-skills" value="${skill.id}">
                <label for="req-skill-${skill.id}">${skill.name}</label>
            `;
            skillsContainer.appendChild(div);
        });

        // Cargar idiomas
        const languagesContainer = document.getElementById('required-languages');
        languagesContainer.innerHTML = '';
        this.languagesService.getAllLanguages().forEach(language => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="req-lang-${language.id}" name="required-languages" value="${language.id}">
                <label for="req-lang-${language.id}">${language.name}</label>
            `;
            languagesContainer.appendChild(div);
        });

        // Cargar capacitaciones
        const trainingsContainer = document.getElementById('required-trainings');
        trainingsContainer.innerHTML = '';
        this.trainingsService.getAllTrainings().forEach(training => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="req-training-${training.id}" name="required-trainings" value="${training.id}">
                <label for="req-training-${training.id}">${training.description} (${training.level})</label>
            `;
            trainingsContainer.appendChild(div);
        });
    }

    setupEventListeners() {
        // Botón para agregar nuevo puesto
        document.getElementById('add-position').addEventListener('click', () => {
            this.openModal();
        });

        // Delegación de eventos para los botones de la tabla
        this.positionsTable.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const positionId = parseInt(btn.dataset.id);
            if (btn.classList.contains('btn-view')) {
                this.viewPosition(positionId);
            } else if (btn.classList.contains('btn-edit')) {
                this.editPosition(positionId);
            } else if (btn.classList.contains('btn-delete')) {
                this.deletePosition(positionId);
            }
        });

        // Manejar envío del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePosition();
        });

        // Botón cancelar
        document.getElementById('cancel-form').addEventListener('click', () => {
            this.closeModal();
        });

        // Cerrar modal al hacer clic en la X
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    openModal(positionId = null) {
        this.isEditing = positionId !== null;
        this.currentPositionId = positionId;
        
        // Configurar el modal según si es edición o nuevo
        document.getElementById('modal-title').textContent = 
            this.isEditing ? 'Editar Puesto' : 'Nuevo Puesto';
        
        // Limpiar formulario
        this.form.reset();
        
        // Si es edición, cargar los datos del puesto
        if (this.isEditing) {
            const position = this.positionsService.getPositionById(positionId);
            if (position) {
                document.getElementById('position-id').value = position.id;
                document.getElementById('position-name').value = position.name;
                document.getElementById('position-description').value = position.description || '';
                document.getElementById('position-department').value = position.department;
                document.getElementById('position-risk').value = position.riskLevel;
                document.getElementById('position-min-salary').value = position.minSalary;
                document.getElementById('position-max-salary').value = position.maxSalary;
                
                // Marcar competencias requeridas
                position.requiredSkills.forEach(skillId => {
                    const checkbox = document.querySelector(`#req-skill-${skillId}`);
                    if (checkbox) checkbox.checked = true;
                });
                
                // Marcar idiomas requeridos
                position.requiredLanguages.forEach(langId => {
                    const checkbox = document.querySelector(`#req-lang-${langId}`);
                    if (checkbox) checkbox.checked = true;
                });
                
                // Marcar capacitaciones requeridas
                position.requiredTrainings.forEach(trainingId => {
                    const checkbox = document.querySelector(`#req-training-${trainingId}`);
                    if (checkbox) checkbox.checked = true;
                });
            }
        }
        
        // Mostrar modal
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    savePosition() {
        const formData = {
            id: this.isEditing ? parseInt(document.getElementById('position-id').value) : null,
            name: document.getElementById('position-name').value,
            description: document.getElementById('position-description').value,
            department: document.getElementById('position-department').value,
            riskLevel: document.getElementById('position-risk').value,
            minSalary: parseFloat(document.getElementById('position-min-salary').value),
            maxSalary: parseFloat(document.getElementById('position-max-salary').value),
            requiredSkills: Array.from(document.querySelectorAll('#required-skills input[type="checkbox"]:checked'))
                .map(checkbox => parseInt(checkbox.value)),
            requiredLanguages: Array.from(document.querySelectorAll('#required-languages input[type="checkbox"]:checked'))
                .map(checkbox => parseInt(checkbox.value)),
            requiredTrainings: Array.from(document.querySelectorAll('#required-trainings input[type="checkbox"]:checked'))
                .map(checkbox => parseInt(checkbox.value))
        };

        if (this.isEditing) {
            this.positionsService.updatePosition(formData.id, formData);
        } else {
            this.positionsService.addPosition(formData);
        }

        this.closeModal();
        this.renderPositionsTable();
    }

    viewPosition(positionId) {
        const position = this.positionsService.getPositionById(positionId);
        if (!position) return;

        const employees = this.employeesService.getAllEmployees()
            .filter(emp => emp.positionId === positionId);
        
        const requiredSkills = position.requiredSkills.map(skillId => {
            const skill = this.skillsService.getSkillById(skillId);
            return skill ? skill.name : 'Desconocido';
        }).join(', ');
        
        const requiredLanguages = position.requiredLanguages.map(langId => {
            const lang = this.languagesService.getLanguageById(langId);
            return lang ? lang.name : 'Desconocido';
        }).join(', ');
        
        const requiredTrainings = position.requiredTrainings.map(trainingId => {
            const training = this.trainingsService.getTrainingById(trainingId);
            return training ? `${training.description} (${training.level})` : 'Desconocido';
        }).join(', ');

        const modalContent = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Detalles del Puesto: ${position.name}</h2>
                
                <div class="detail-section">
                    <h3>Información General</h3>
                    <p><strong>Departamento:</strong> ${position.department}</p>
                    <p><strong>Nivel de Riesgo:</strong> ${position.riskLevel}</p>
                    <p><strong>Rango Salarial:</strong> RD$ ${position.minSalary.toLocaleString()} - RD$ ${position.maxSalary.toLocaleString()}</p>
                    ${position.description ? `<p><strong>Descripción:</strong> ${position.description}</p>` : ''}
                </div>
                
                <div class="detail-section">
                    <h3>Requisitos</h3>
                    <p><strong>Competencias:</strong> ${requiredSkills || 'No especificado'}</p>
                    <p><strong>Idiomas:</strong> ${requiredLanguages || 'No especificado'}</p>
                    <p><strong>Capacitaciones:</strong> ${requiredTrainings || 'No especificado'}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Empleados en este Puesto (${employees.length})</h3>
                    ${employees.length > 0 ? `
                        <table class="employees-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Salario</th>
                                    <th>Fecha de Ingreso</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${employees.map(emp => `
                                    <tr>
                                        <td>${emp.name}</td>
                                        <td>RD$ ${emp.salary.toLocaleString()}</td>
                                        <td>${emp.startDate}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p>No hay empleados en este puesto actualmente</p>'}
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'view-position-modal';
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);

        // Mostrar modal
        modal.style.display = 'block';

        // Configurar evento para cerrar modal
        modal.querySelector('.close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    editPosition(positionId) {
        this.openModal(positionId);
    }

    deletePosition(positionId) {
        if (confirm('¿Está seguro que desea eliminar este puesto?')) {
            const employeesInPosition = this.employeesService.getAllEmployees()
                .filter(emp => emp.positionId === positionId).length;
            
            if (employeesInPosition > 0) {
                alert('No se puede eliminar el puesto porque tiene empleados asignados');
                return;
            }
            
            this.positionsService.deletePosition(positionId);
            this.renderPositionsTable();
        }
    }
}
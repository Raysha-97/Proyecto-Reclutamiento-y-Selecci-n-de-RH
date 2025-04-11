class CandidatesView {
    constructor() {
        this.modal = document.getElementById('candidate-modal');
        this.form = document.getElementById('candidate-form');
        this.candidatesTable = document.getElementById('candidates-table').querySelector('tbody');
        this.initServices();
    }

    initServices() {
        this.candidatesService = candidatesService;
        this.positionsService = positionsService;
        this.skillsService = skillsService;
        this.languagesService = languagesService;
        this.experienceService = experienceService;
        this.employeesService = employeesService;
    }

    init() {
        this.renderCandidatesTable();
        this.setupEventListeners();
        this.loadFormSelects();
    }

    renderCandidatesTable() {
        this.candidatesTable.innerHTML = '';
        const candidates = this.candidatesService.getAllCandidates();
        
        candidates.forEach(candidate => {
            const age = this.calculateAge(candidate.birthdate);
            const languages = candidate.languages.map(l => 
                `${this.languagesService.getLanguageById(l.languageId)?.name || 'Desconocido'} (${l.level})`
            ).join(', ');
            
            const skills = candidate.skills.map(s => 
                this.skillsService.getSkillById(s)?.name || 'Desconocido'
            ).join(', ');
            
            const experience = candidate.workExperience.length > 0 
                ? `${candidate.workExperience.length} ${candidate.workExperience.length === 1 ? 'experiencia' : 'experiencias'}` 
                : 'Sin experiencia';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${candidate.id}</td>
                <td>${candidate.name}</td>
                <td>${age}</td>
                <td>${languages}</td>
                <td>${experience}</td>
                <td>${skills}</td>
                <td><span class="status-badge ${candidate.status.toLowerCase()}">${candidate.status}</span></td>
                <td>
                    <button class="btn btn-edit" data-id="${candidate.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${candidate.status !== 'Contratado' ? `
                    <button class="btn btn-hire" data-id="${candidate.id}">
                        <i class="fas fa-user-check"></i>
                    </button>
                    ` : ''}
                    <button class="btn btn-delete" data-id="${candidate.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            this.candidatesTable.appendChild(row);
        });
    }

    calculateAge(birthdate) {
        if (!birthdate) return 'N/A';
        const birthDate = new Date(birthdate);
        const diff = Date.now() - birthDate.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    setupEventListeners() {
        // Botón para agregar nuevo candidato
        document.getElementById('add-candidate').addEventListener('click', () => {
            this.openModal();
        });

        // Delegación de eventos para los botones de la tabla
        this.candidatesTable.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const candidateId = parseInt(btn.dataset.id);
            if (btn.classList.contains('btn-edit')) {
                this.editCandidate(candidateId);
            } else if (btn.classList.contains('btn-hire')) {
                this.hireCandidate(candidateId);
            } else if (btn.classList.contains('btn-delete')) {
                this.deleteCandidate(candidateId);
            }
        });

        // Manejar envío del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCandidate();
        });

        // Botón cancelar
        document.getElementById('cancel-form').addEventListener('click', () => {
            this.closeModal();
        });

        // Botón para agregar experiencia
        document.getElementById('add-experience').addEventListener('click', () => {
            this.addExperienceField();
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

    loadFormSelects() {
        // Cargar puestos
        const positionSelect = document.getElementById('position');
        positionSelect.innerHTML = '<option value="">Seleccione un puesto</option>';
        this.positionsService.getAllPositions().forEach(position => {
            const option = document.createElement('option');
            option.value = position.id;
            option.textContent = position.name;
            positionSelect.appendChild(option);
        });

        // Cargar idiomas
        const languagesContainer = document.getElementById('languages-container');
        languagesContainer.innerHTML = '';
        this.languagesService.getAllLanguages().forEach(language => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="lang-${language.id}" name="languages" value="${language.id}">
                <label for="lang-${language.id}">${language.name}</label>
                <select name="language-level" disabled>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Nativo">Nativo</option>
                </select>
            `;
            languagesContainer.appendChild(div);

            // Habilitar select cuando se marca el checkbox
            div.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
                div.querySelector('select').disabled = !e.target.checked;
            });
        });

        // Cargar competencias
        const skillsContainer = document.getElementById('skills-container');
        skillsContainer.innerHTML = '';
        this.skillsService.getAllSkills().forEach(skill => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="skill-${skill.id}" name="skills" value="${skill.id}">
                <label for="skill-${skill.id}">${skill.name}</label>
            `;
            skillsContainer.appendChild(div);
        });
    }

    addExperienceField() {
        const container = document.getElementById('experience-container');
        const experienceId = Date.now(); // ID temporal
        
        const experienceDiv = document.createElement('div');
        experienceDiv.className = 'experience-item';
        experienceDiv.dataset.id = experienceId;
        experienceDiv.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Empresa</label>
                    <input type="text" name="experience-company" class="form-control">
                </div>
                <div class="form-group">
                    <label>Puesto</label>
                    <input type="text" name="experience-position" class="form-control">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Fecha de Inicio</label>
                    <input type="date" name="experience-start" class="form-control">
                </div>
                <div class="form-group">
                    <label>Fecha de Fin</label>
                    <input type="date" name="experience-end" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea name="experience-description" class="form-control"></textarea>
            </div>
            <button type="button" class="btn btn-danger btn-remove-exp" data-id="${experienceId}">
                <i class="fas fa-trash"></i> Eliminar Experiencia
            </button>
        `;
        
        // Insertar antes del botón "Agregar Experiencia"
        container.insertBefore(experienceDiv, document.getElementById('add-experience'));
        
        // Agregar evento para eliminar experiencia
        experienceDiv.querySelector('.btn-remove-exp').addEventListener('click', (e) => {
            container.removeChild(experienceDiv);
        });
    }

    openModal(candidateId = null) {
        this.isEditing = candidateId !== null;
        this.currentCandidateId = candidateId;
        
        // Configurar el modal según si es edición o nuevo
        document.getElementById('modal-title').textContent = 
            this.isEditing ? 'Editar Candidato' : 'Nuevo Candidato';
        
        // Limpiar formulario
        this.form.reset();
        document.getElementById('experience-container').innerHTML = `
            <button type="button" id="add-experience" class="btn btn-secondary">
                <i class="fas fa-plus"></i> Agregar Experiencia
            </button>
        `;
        
        // Si es edición, cargar los datos del candidato
        if (this.isEditing) {
            const candidate = this.candidatesService.getCandidateById(candidateId);
            if (candidate) {
                document.getElementById('candidate-id').value = candidate.id;
                document.getElementById('name').value = candidate.name;
                document.getElementById('birthdate').value = candidate.birthdate || '';
                document.getElementById('email').value = candidate.email || '';
                document.getElementById('phone').value = candidate.phone || '';
                document.getElementById('position').value = candidate.positionId || '';
                
                // Marcar idiomas
                candidate.languages.forEach(lang => {
                    const checkbox = document.querySelector(`#lang-${lang.languageId}`);
                    if (checkbox) {
                        checkbox.checked = true;
                        const select = checkbox.parentElement.querySelector('select');
                        select.disabled = false;
                        select.value = lang.level;
                    }
                });
                
                // Marcar competencias
                candidate.skills.forEach(skillId => {
                    const checkbox = document.querySelector(`#skill-${skillId}`);
                    if (checkbox) checkbox.checked = true;
                });
                
                // Cargar experiencias
                candidate.workExperience.forEach(exp => {
                    this.addExperienceField();
                    const lastExp = document.querySelector('#experience-container .experience-item:last-child');
                    if (lastExp) {
                        lastExp.querySelector('[name="experience-company"]').value = exp.company || '';
                        lastExp.querySelector('[name="experience-position"]').value = exp.position || '';
                        lastExp.querySelector('[name="experience-start"]').value = exp.startDate || '';
                        lastExp.querySelector('[name="experience-end"]').value = exp.endDate || '';
                        lastExp.querySelector('[name="experience-description"]').value = exp.description || '';
                    }
                });
            }
        }
        
        // Mostrar modal
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    saveCandidate() {
        const formData = {
            id: this.isEditing ? parseInt(document.getElementById('candidate-id').value) : null,
            name: document.getElementById('name').value,
            birthdate: document.getElementById('birthdate').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            positionId: parseInt(document.getElementById('position').value),
            skills: Array.from(document.querySelectorAll('#skills-container input[type="checkbox"]:checked'))
                .map(checkbox => parseInt(checkbox.value)),
            languages: Array.from(document.querySelectorAll('#languages-container input[type="checkbox"]:checked'))
                .map(checkbox => ({
                    languageId: parseInt(checkbox.value),
                    level: checkbox.parentElement.querySelector('select').value
                })),
            workExperience: Array.from(document.querySelectorAll('.experience-item'))
                .map(item => ({
                    company: item.querySelector('[name="experience-company"]').value,
                    position: item.querySelector('[name="experience-position"]').value,
                    startDate: item.querySelector('[name="experience-start"]').value,
                    endDate: item.querySelector('[name="experience-end"]').value,
                    description: item.querySelector('[name="experience-description"]').value
                }))
        };

        if (this.isEditing) {
            this.candidatesService.updateCandidate(formData.id, formData);
        } else {
            formData.status = 'Nuevo';
            this.candidatesService.addCandidate(formData);
        }

        this.closeModal();
        this.renderCandidatesTable();
    }

    editCandidate(candidateId) {
        this.openModal(candidateId);
    }

    hireCandidate(candidateId) {
        const candidate = this.candidatesService.getCandidateById(candidateId);
        if (!candidate) return;

        const position = this.positionsService.getPositionById(candidate.positionId);
        if (!position) {
            alert('El candidato no tiene un puesto asignado válido');
            return;
        }

        const salary = prompt(`Ingrese el salario para ${candidate.name} (Rango: ${position.minSalary} - ${position.maxSalary})`, position.minSalary);
        if (salary === null) return;

        const parsedSalary = parseFloat(salary);
        if (isNaN(parsedSalary) || parsedSalary < position.minSalary || parsedSalary > position.maxSalary) {
            alert(`El salario debe estar entre ${position.minSalary} y ${position.maxSalary}`);
            return;
        }

        // Crear empleado
        const employee = {
            candidateId: candidate.id,
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            positionId: candidate.positionId,
            position: position.name,
            department: position.department,
            salary: parsedSalary,
            startDate: new Date().toISOString().split('T')[0],
            status: 'Activo'
        };

        this.employeesService.addEmployee(employee);
        
        // Actualizar estado del candidato
        candidate.status = 'Contratado';
        this.candidatesService.updateCandidate(candidate.id, candidate);
        
        alert(`${candidate.name} ha sido contratado como ${position.name}`);
        this.renderCandidatesTable();
    }

    deleteCandidate(candidateId) {
        if (confirm('¿Está seguro que desea eliminar este candidato?')) {
            this.candidatesService.deleteCandidate(candidateId);
            this.renderCandidatesTable();
        }
    }
}
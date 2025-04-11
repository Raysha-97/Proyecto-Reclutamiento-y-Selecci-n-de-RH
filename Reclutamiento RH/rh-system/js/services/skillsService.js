class SkillsService {
    constructor() {
        this.skills = [
            { id: 1, name: "JavaScript", category: "Técnica", description: "Programación en JavaScript", status: true },
            { id: 2, name: "Diseño UX", category: "Diseño", description: "Diseño de experiencia de usuario", status: true },
            { id: 3, name: "React", category: "Técnica", description: "Desarrollo con React.js", status: true },
            { id: 4, name: "Figma", category: "Diseño", description: "Diseño de interfaces con Figma", status: true },
            { id: 5, name: "CSS", category: "Técnica", description: "Estilos con CSS", status: true },
            { id: 6, name: "Gestión de Proyectos", category: "Gestión", description: "Metodologías ágiles", status: true },
            { id: 7, name: "Liderazgo", category: "Blanda", description: "Habilidades de liderazgo", status: true }
        ];
    }

    getAllSkills() {
        return this.skills;
    }

    getActiveSkills() {
        return this.skills.filter(skill => skill.status);
    }

    getSkillById(id) {
        return this.skills.find(skill => skill.id === id);
    }

    addSkill(skill) {
        skill.id = this.skills.length > 0 
            ? Math.max(...this.skills.map(s => s.id)) + 1 
            : 1;
        skill.status = true;
        this.skills.push(skill);
        return skill;
    }

    updateSkill(id, updatedSkill) {
        const index = this.skills.findIndex(s => s.id === id);
        if (index !== -1) {
            this.skills[index] = { ...this.skills[index], ...updatedSkill };
            return this.skills[index];
        }
        return null;
    }

    toggleSkillStatus(id) {
        const skill = this.getSkillById(id);
        if (skill) {
            skill.status = !skill.status;
            return skill;
        }
        return null;
    }

    deleteSkill(id) {
        const index = this.skills.findIndex(s => s.id === id);
        if (index !== -1) {
            return this.skills.splice(index, 1)[0];
        }
        return null;
    }
}

const skillsService = new SkillsService();
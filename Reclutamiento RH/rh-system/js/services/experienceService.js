class ExperienceService {
    constructor() {
        this.experiences = [
            {
                id: 1,
                candidateId: 1,
                company: "Tech Solutions",
                position: "Desarrollador Junior",
                startDate: "2018-01-01",
                endDate: "2020-12-31",
                salary: 25000,
                description: "Desarrollo de aplicaciones web con JavaScript y PHP",
                referenceName: "Carlos Martínez",
                referenceContact: "carlos.martinez@techsolutions.com",
                status: true
            },
            {
                id: 2,
                candidateId: 1,
                company: "Digital Creators",
                position: "Desarrollador Frontend",
                startDate: "2021-01-15",
                endDate: "2023-03-30",
                salary: 35000,
                description: "Desarrollo de interfaces con React y Redux",
                referenceName: "Laura Fernández",
                referenceContact: "laura.fernandez@digitalcreators.com",
                status: true
            },
            {
                id: 3,
                candidateId: 2,
                company: "Creative Agency",
                position: "Diseñadora Gráfica",
                startDate: "2019-05-15",
                endDate: "2021-08-20",
                salary: 32000,
                description: "Diseño de material gráfico para campañas publicitarias",
                referenceName: "Roberto Sánchez",
                referenceContact: "roberto.sanchez@creativeagency.com",
                status: true
            }
        ];
    }

    getAllExperiences() {
        return this.experiences;
    }

    getExperiencesByCandidate(candidateId) {
        return this.experiences.filter(exp => exp.candidateId === candidateId && exp.status);
    }

    getExperienceById(id) {
        return this.experiences.find(exp => exp.id === id);
    }

    addExperience(experience) {
        experience.id = this.experiences.length > 0 
            ? Math.max(...this.experiences.map(e => e.id)) + 1 
            : 1;
        experience.status = true;
        this.experiences.push(experience);
        return experience;
    }

    updateExperience(id, updatedExperience) {
        const index = this.experiences.findIndex(e => e.id === id);
        if (index !== -1) {
            this.experiences[index] = { ...this.experiences[index], ...updatedExperience };
            return this.experiences[index];
        }
        return null;
    }

    toggleExperienceStatus(id) {
        const experience = this.getExperienceById(id);
        if (experience) {
            experience.status = !experience.status;
            return experience;
        }
        return null;
    }

    deleteExperience(id) {
        const index = this.experiences.findIndex(e => e.id === id);
        if (index !== -1) {
            return this.experiences.splice(index, 1)[0];
        }
        return null;
    }
}

const experienceService = new ExperienceService();
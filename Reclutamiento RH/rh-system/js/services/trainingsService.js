class TrainingsService {
    constructor() {
        this.trainings = [
            {
                id: 1,
                description: "Curso de Desarrollo Web Full Stack",
                institution: "Academia Digital",
                level: "Técnico",
                duration: 120,
                startDate: "2022-01-10",
                endDate: "2022-04-10",
                status: true
            },
            {
                id: 2,
                description: "Diplomado en Diseño UX/UI",
                institution: "Escuela de Diseño",
                level: "Técnico",
                duration: 180,
                startDate: "2022-03-15",
                endDate: "2022-09-15",
                status: true
            },
            {
                id: 3,
                description: "Licenciatura en Informática",
                institution: "Universidad Nacional",
                level: "Grado",
                duration: 1440,
                startDate: "2018-08-20",
                endDate: "2022-12-15",
                status: true
            },
            {
                id: 4,
                description: "Certificación en React Avanzado",
                institution: "Platzi",
                level: "Técnico",
                duration: 40,
                startDate: "2023-01-05",
                endDate: "2023-02-05",
                status: true
            }
        ];
    }

    getAllTrainings() {
        return this.trainings;
    }

    getActiveTrainings() {
        return this.trainings.filter(training => training.status);
    }

    getTrainingById(id) {
        return this.trainings.find(training => training.id === id);
    }

    addTraining(training) {
        training.id = this.trainings.length > 0 
            ? Math.max(...this.trainings.map(t => t.id)) + 1 
            : 1;
        training.status = true;
        this.trainings.push(training);
        return training;
    }

    updateTraining(id, updatedTraining) {
        const index = this.trainings.findIndex(t => t.id === id);
        if (index !== -1) {
            this.trainings[index] = { ...this.trainings[index], ...updatedTraining };
            return this.trainings[index];
        }
        return null;
    }

    toggleTrainingStatus(id) {
        const training = this.getTrainingById(id);
        if (training) {
            training.status = !training.status;
            return training;
        }
        return null;
    }

    deleteTraining(id) {
        const index = this.trainings.findIndex(t => t.id === id);
        if (index !== -1) {
            return this.trainings.splice(index, 1)[0];
        }
        return null;
    }
}

const trainingsService = new TrainingsService();
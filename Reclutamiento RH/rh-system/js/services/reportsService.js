class ReportsService {
    getNewHiresByDateRange(startDate, endDate) {
        // En una aplicación real, esto consultaría una base de datos
        // Por ahora simulamos datos
        return [
            { id: 1, name: 'Juan Pérez', position: 'Desarrollador Frontend', hireDate: '2025-01-15', salary: 35000 },
            { id: 2, name: 'María García', position: 'Diseñadora UX', hireDate: '2025-02-01', salary: 38000 }
        ].filter(hire => {
            const hireDate = new Date(hire.hireDate);
            return hireDate >= new Date(startDate) && hireDate <= new Date(endDate);
        });
    }

    getCandidatesByCriteria(criteria) {
        // Filtra candidatos según los criterios proporcionados
        const candidates = candidatesService.getAllCandidates();
        
        return candidates.filter(candidate => {
            if (criteria.positionId && candidate.positionId != criteria.positionId) return false;
            if (criteria.skillId && !candidate.skills.includes(criteria.skillId)) return false;
            if (criteria.trainingId && !candidate.trainings.includes(criteria.trainingId)) return false;
            if (criteria.languageId && !candidate.languages.some(l => l.languageId == criteria.languageId)) return false;
            return true;
        });
    }
}

const reportsService = new ReportsService();
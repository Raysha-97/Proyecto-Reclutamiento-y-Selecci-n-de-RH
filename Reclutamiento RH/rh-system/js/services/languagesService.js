class LanguagesService {
    constructor() {
        this.languages = [
            { id: 1, name: "Español", code: "es", status: true },
            { id: 2, name: "Inglés", code: "en", status: true },
            { id: 3, name: "Francés", code: "fr", status: true },
            { id: 4, name: "Alemán", code: "de", status: false }
        ];
    }

    getAllLanguages() {
        return this.languages;
    }

    getActiveLanguages() {
        return this.languages.filter(lang => lang.status);
    }

    getLanguageById(id) {
        return this.languages.find(lang => lang.id === id);
    }

    addLanguage(language) {
        language.id = this.languages.length > 0 
            ? Math.max(...this.languages.map(l => l.id)) + 1 
            : 1;
        language.status = true;
        this.languages.push(language);
        return language;
    }

    updateLanguage(id, updatedLanguage) {
        const index = this.languages.findIndex(l => l.id === id);
        if (index !== -1) {
            this.languages[index] = { ...this.languages[index], ...updatedLanguage };
            return this.languages[index];
        }
        return null;
    }

    toggleLanguageStatus(id) {
        const language = this.getLanguageById(id);
        if (language) {
            language.status = !language.status;
            return language;
        }
        return null;
    }

    deleteLanguage(id) {
        const index = this.languages.findIndex(l => l.id === id);
        if (index !== -1) {
            return this.languages.splice(index, 1)[0];
        }
        return null;
    }
}

const languagesService = new LanguagesService();
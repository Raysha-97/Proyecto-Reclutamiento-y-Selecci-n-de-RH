class ReportsView {
    constructor() {
        this.initServices();
        this.charts = {
            department: null,
            status: null,
            hiringTrend: null
        };
    }

    initServices() {
        this.candidatesService = candidatesService;
        this.positionsService = positionsService;
        this.employeesService = employeesService;
        this.reportsService = reportsService;
    }

    init() {
        this.renderGeneralSummary();
        this.initCharts();
        this.renderDataTables();
        this.setupEventListeners();
        this.renderAdvancedStats();
    }

    renderGeneralSummary() {
        const candidates = this.candidatesService.getAllCandidates();
        const positions = this.positionsService.getAllPositions();
        const employees = this.employeesService.getAllEmployees();
        const hiredCandidates = employees.filter(e => e.candidateId).length;

        document.getElementById('total-candidates').textContent = candidates.length;
        document.getElementById('total-positions').textContent = positions.length;
        document.getElementById('total-employees').textContent = employees.length;
        
        const hireRate = candidates.length > 0 
            ? Math.round((hiredCandidates / candidates.length) * 100) 
            : 0;
        document.getElementById('hired-rate').textContent = `${hireRate}%`;
    }

    initCharts() {
        // Gráfico de distribución por departamento
        const departmentData = this.reportsService.getEmployeesByDepartment();
        const departmentCtx = document.getElementById('department-chart').getContext('2d');
        
        this.charts.department = new Chart(departmentCtx, {
            type: 'doughnut',
            data: {
                labels: departmentData.labels,
                datasets: [{
                    data: departmentData.values,
                    backgroundColor: [
                        '#4e73df',
                        '#1cc88a',
                        '#36b9cc',
                        '#f6c23e',
                        '#e74a3b',
                        '#858796'
                    ],
                    hoverBackgroundColor: [
                        '#2e59d9',
                        '#17a673',
                        '#2c9faf',
                        '#dda20a',
                        '#be2617',
                        '#6c757d'
                    ],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        // Gráfico de estados de candidatos
        const statusData = this.reportsService.getCandidatesByStatus();
        const statusCtx = document.getElementById('status-chart').getContext('2d');
        
        this.charts.status = new Chart(statusCtx, {
            type: 'bar',
            data: {
                labels: statusData.labels,
                datasets: [{
                    label: "Candidatos",
                    backgroundColor: "#4e73df",
                    hoverBackgroundColor: "#2e59d9",
                    borderColor: "#4e73df",
                    data: statusData.values
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Gráfico de tendencia de contrataciones
        const trendData = this.reportsService.getHiringTrend();
        const trendCtx = document.getElementById('hiring-trend-chart').getContext('2d');
        
        this.charts.hiringTrend = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: trendData.labels,
                datasets: [{
                    label: "Contrataciones",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: trendData.values
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    renderDataTables() {
        // Tabla de puestos abiertos
        const positionsData = this.reportsService.getOpenPositionsData();
        const positionsTable = document.getElementById('positions-data');
        positionsTable.innerHTML = '';
        
        positionsData.forEach(position => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${position.name}</td>
                <td>${position.department}</td>
                <td>${position.candidates}</td>
                <td>RD$ ${position.avgSalary.toLocaleString()}</td>
                <td>${position.vacancies}</td>
            `;
            positionsTable.appendChild(row);
        });

        // Tabla de candidatos recientes
        const candidatesData = this.reportsService.getRecentCandidates();
        const candidatesTable = document.getElementById('candidates-data');
        candidatesTable.innerHTML = '';
        
        candidatesData.forEach(candidate => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${candidate.name}</td>
                <td>${candidate.position}</td>
                <td>${candidate.applicationDate}</td>
                <td><span class="status-badge ${candidate.status.toLowerCase()}">${candidate.status}</span></td>
                <td>${candidate.experience}</td>
            `;
            candidatesTable.appendChild(row);
        });

        // Tabla de nuevos empleados
        const employeesData = this.reportsService.getRecentEmployees();
        const employeesTable = document.getElementById('employees-data');
        employeesTable.innerHTML = '';
        
        employeesData.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.position}</td>
                <td>RD$ ${employee.salary.toLocaleString()}</td>
                <td>${employee.startDate}</td>
                <td>${employee.origin}</td>
            `;
            employeesTable.appendChild(row);
        });
    }

    renderAdvancedStats() {
        document.getElementById('avg-hiring-time').textContent = 
            this.reportsService.getAverageHiringTime();
        
        const avgSalary = this.reportsService.getAverageSalary();
        document.getElementById('avg-salary').textContent = 
            avgSalary ? `RD$ ${avgSalary.toLocaleString()}` : 'N/A';
        
        document.getElementById('turnover-rate').textContent = 
            this.reportsService.getTurnoverRate();
    }

    setupEventListeners() {
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Remover clase active de todos los botones y contenidos
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Agregar clase active al botón y contenido seleccionado
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // Botón de exportar a PDF
        document.getElementById('generate-pdf').addEventListener('click', () => {
            this.generatePDF();
        });
    }

    generatePDF() {
        // En una implementación real, aquí se usaría una librería como jsPDF o html2pdf
        alert("En una implementación real, esto generaría un PDF con todos los reportes");
        console.log("Generando PDF con los reportes actuales...");
    }
}
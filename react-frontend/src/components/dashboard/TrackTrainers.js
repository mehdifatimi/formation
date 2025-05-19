import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getParticipantProgress } from '../../services/participantService';
import { FaUser, FaCalendarAlt, FaUserClock, FaChartBar, FaSearch, FaFilter, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TrackTrainers.css';

const ITEMS_PER_PAGE = 6;

const TrackTrainers = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trainers, setTrainers] = useState([]);
    const [filteredTrainers, setFilteredTrainers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterOptions, setFilterOptions] = useState({
        minFormations: 0,
        maxAbsenceRate: 100,
        minEvaluationScore: 0
    });

    // Fetch trainer data
    useEffect(() => {
        const fetchTrainerProgress = async () => {
            try {
                setLoading(true);
                const data = await getParticipantProgress();
                if (!data || !Array.isArray(data)) {
                    throw new Error('Format de données invalide');
                }
                setTrainers(data);
                setFilteredTrainers(data);
            } catch (err) {
                setError(err.message || 'Erreur lors du chargement des données des formateurs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainerProgress();
    }, []);

    // Filter and sort trainers
    useEffect(() => {
        let result = [...trainers];
        
        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(trainer => 
                trainer.nom?.toLowerCase().includes(term) || 
                trainer.prenom?.toLowerCase().includes(term) ||
                trainer.email?.toLowerCase().includes(term)
            );
        }
        
        // Apply filter options
        result = result.filter(trainer => {
            const formations = trainer.total_formations || 0;
            const absenceRate = trainer.absence_rate || 0;
            const evaluationScore = trainer.evaluation_score || 0;
            
            return formations >= filterOptions.minFormations &&
                   absenceRate <= filterOptions.maxAbsenceRate &&
                   evaluationScore >= filterOptions.minEvaluationScore;
        });

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key] || 0;
                const bValue = b[sortConfig.key] || 0;
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        
        setFilteredTrainers(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, filterOptions, trainers, sortConfig]);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);
        
        if (isNaN(numValue)) {
            return;
        }

        setFilterOptions(prev => ({
            ...prev,
            [name]: numValue
        }));
    }, []);

    const handleSort = useCallback((key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setSearchTerm('');
        setFilterOptions({
            minFormations: 0,
            maxAbsenceRate: 100,
            minEvaluationScore: 0
        });
        setSortConfig({ key: null, direction: 'asc' });
    }, []);

    // Prepare chart data with useMemo for better performance
    const chartData = useMemo(() => {
        return filteredTrainers.map(trainer => ({
            name: `${trainer.prenom || ''} ${trainer.nom || ''}`.trim(),
            formations: trainer.total_formations || 0,
            completed: trainer.completed_formations || 0,
            absences: trainer.absences || 0,
            absenceRate: trainer.absence_rate || 0,
            evaluationScore: trainer.evaluation_score || 0
        }));
    }, [filteredTrainers]);

    // Pagination
    const totalPages = Math.ceil(filteredTrainers.length / ITEMS_PER_PAGE);
    const paginatedTrainers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTrainers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTrainers, currentPage]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="track-trainers-container">
                <div className="loading">Chargement des données...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="track-trainers-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="track-trainers-container">
            <div className="track-trainers-header">
                <h2>Suivi des Formateurs</h2>
                <p>Visualisez la participation et la progression des formateurs</p>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Rechercher un formateur..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="filter-options">
                    <div className="filter-group">
                        <label htmlFor="minFormations">Formations min.</label>
                        <input
                            type="number"
                            id="minFormations"
                            name="minFormations"
                            value={filterOptions.minFormations}
                            onChange={handleFilterChange}
                            min="0"

                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="maxAbsenceRate">Taux d'absence max. (%)</label>
                        <input
                            type="number"
                            id="maxAbsenceRate"
                            name="maxAbsenceRate"
                            value={filterOptions.maxAbsenceRate}
                            onChange={handleFilterChange}
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="minEvaluationScore">Score min.</label>
                        <input
                            type="number"
                            id="minEvaluationScore"
                            name="minEvaluationScore"
                            value={filterOptions.minEvaluationScore}
                            onChange={handleFilterChange}
                            min="0"
                            max="10"
                            step="0.1"
                        />
                    </div>

                    <button className="reset-filters" onClick={resetFilters}>
                        Réinitialiser les filtres
                    </button>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-container">
                    <h3>Formations par Formateur</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar 
                                dataKey="formations" 
                                name="Total Formations" 
                                fill="#8884d8"
                                animationDuration={1500}
                            />
                            <Bar 
                                dataKey="completed" 
                                name="Formations Terminées" 
                                fill="#82ca9d"
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <h3>Taux d'Absence par Formateur</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar 
                                dataKey="absenceRate" 
                                name="Taux d'Absence (%)" 
                                fill="#ff8042"
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="trainers-grid">
                {paginatedTrainers.map(trainer => (
                    <div key={trainer.id} className="trainer-card">
                        <div className="trainer-header">
                            <div className="trainer-avatar">
                                <FaUser />
                            </div>
                            <div className="trainer-info">
                                <h3>{trainer.prenom} {trainer.nom}</h3>
                                <p>{trainer.email}</p>
                            </div>
                        </div>

                        <div className="trainer-stats">
                            <div className="stat-item" onClick={() => handleSort('total_formations')}>
                                <FaCalendarAlt />
                                <div className="stat-content">
                                    <span className="stat-value">{trainer.total_formations || 0}</span>
                                    <span className="stat-label">Formations</span>
                                </div>
                                {sortConfig.key === 'total_formations' && (
                                    sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                )}
                            </div>

                            <div className="stat-item" onClick={() => handleSort('absence_rate')}>
                                <FaUserClock />
                                <div className="stat-content">
                                    <span className="stat-value">{trainer.absence_rate || 0}%</span>
                                    <span className="stat-label">Absences</span>
                                </div>
                                {sortConfig.key === 'absence_rate' && (
                                    sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                )}
                            </div>

                            <div className="stat-item" onClick={() => handleSort('evaluation_score')}>
                                <FaChartBar />
                                <div className="stat-content">
                                    <span className="stat-value">{trainer.evaluation_score || 0}</span>
                                    <span className="stat-label">Évaluation</span>
                                </div>
                                {sortConfig.key === 'evaluation_score' && (
                                    sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                )}
                            </div>
                        </div>

                        <div className="trainer-formations">
                            <h4>Formations Récentes</h4>
                            {trainer.formations && trainer.formations.length > 0 ? (
                                <ul>
                                    {trainer.formations.slice(0, 3).map(formation => (
                                        <li key={formation.id} className={`formation-item ${formation.statut}`}>
                                            <span className="formation-title">{formation.titre}</span>
                                            <span className="formation-date">
                                                {new Date(formation.date_debut).toLocaleDateString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-formations">Aucune formation</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            className={`page-button ${currentPage === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {filteredTrainers.length === 0 && (
                <div className="no-results">
                    <p>Aucun formateur ne correspond aux critères de recherche</p>
                </div>
            )}
        </div>
    );
};

export default TrackTrainers; 
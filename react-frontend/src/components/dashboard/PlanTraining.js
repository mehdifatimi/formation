import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFormation } from '../../services/formationService';
import { getParticipants } from '../../services/participantService';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaSave, FaTimes } from 'react-icons/fa';
import './PlanTraining.css';

const PlanTraining = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        date_debut: '',
        date_fin: '',
        duree: '',
        niveau: 'débutant',
        prix: '',
        places_disponibles: '',
        statut: 'en attente',
        formateur_id: '',
        ville_id: '',
        filiere_id: '',
        participants: []
    });

    // Fetch participants on component mount
    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                setLoading(true);
                const data = await getParticipants();
                setParticipants(data);
            } catch (err) {
                setError('Erreur lors du chargement des participants');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleParticipantChange = (e) => {
        const options = e.target.options;
        const selectedValues = [];
        
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(parseInt(options[i].value));
            }
        }
        
        setFormData(prev => ({
            ...prev,
            participants: selectedValues
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Convert string values to appropriate types
            const submissionData = {
                ...formData,
                duree: parseInt(formData.duree),
                prix: parseFloat(formData.prix),
                places_disponibles: parseInt(formData.places_disponibles),
                formateur_id: parseInt(formData.formateur_id),
                ville_id: parseInt(formData.ville_id),
                filiere_id: parseInt(formData.filiere_id)
            };

            await createFormation(submissionData);
            setSuccess(true);
            
            // Reset form after successful submission
            setTimeout(() => {
                navigate('/dashboard/formations');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création de la formation');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="plan-training-container">
            <div className="plan-training-header">
                <h2>Planifier une Formation</h2>
                <p>Créez et planifiez une nouvelle session de formation</p>
            </div>

            {error && (
                <div className="alert alert-danger">
                    <FaTimes /> {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    Formation créée avec succès! Redirection...
                </div>
            )}

            <form onSubmit={handleSubmit} className="plan-training-form">
                <div className="form-group">
                    <label htmlFor="titre">Titre de la Formation</label>
                    <input
                        type="text"
                        id="titre"
                        name="titre"
                        value={formData.titre}
                        onChange={handleChange}
                        required
                        placeholder="Entrez le titre de la formation"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Décrivez le contenu de la formation"
                        rows="4"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="date_debut">Date de Début</label>
                        <div className="input-with-icon">
                            <FaCalendarAlt />
                            <input
                                type="datetime-local"
                                id="date_debut"
                                name="date_debut"
                                value={formData.date_debut}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="date_fin">Date de Fin</label>
                        <div className="input-with-icon">
                            <FaCalendarAlt />
                            <input
                                type="datetime-local"
                                id="date_fin"
                                name="date_fin"
                                value={formData.date_fin}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="duree">Durée (heures)</label>
                        <input
                            type="number"
                            id="duree"
                            name="duree"
                            value={formData.duree}
                            onChange={handleChange}
                            required
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="niveau">Niveau</label>
                        <select
                            id="niveau"
                            name="niveau"
                            value={formData.niveau}
                            onChange={handleChange}
                            required
                        >
                            <option value="débutant">Débutant</option>
                            <option value="intermédiaire">Intermédiaire</option>
                            <option value="avancé">Avancé</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="prix">Prix</label>
                        <input
                            type="number"
                            id="prix"
                            name="prix"
                            value={formData.prix}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="places_disponibles">Places Disponibles</label>
                        <input
                            type="number"
                            id="places_disponibles"
                            name="places_disponibles"
                            value={formData.places_disponibles}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="formateur_id">Formateur</label>
                        <select
                            id="formateur_id"
                            name="formateur_id"
                            value={formData.formateur_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Sélectionnez un formateur</option>
                            {/* This would be populated from an API call in a real app */}
                            <option value="1">Formateur 1</option>
                            <option value="2">Formateur 2</option>
                            <option value="3">Formateur 3</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ville_id">Ville</label>
                        <div className="input-with-icon">
                            <FaMapMarkerAlt />
                            <select
                                id="ville_id"
                                name="ville_id"
                                value={formData.ville_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionnez une ville</option>
                                {/* This would be populated from an API call in a real app */}
                                <option value="1">Casablanca</option>
                                <option value="2">Rabat</option>
                                <option value="3">Marrakech</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="filiere_id">Filière</label>
                    <select
                        id="filiere_id"
                        name="filiere_id"
                        value={formData.filiere_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Sélectionnez une filière</option>
                        {/* This would be populated from an API call in a real app */}
                        <option value="1">Informatique</option>
                        <option value="2">Gestion</option>
                        <option value="3">Langues</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="participants">Participants</label>
                    <div className="input-with-icon">
                        <FaUsers />
                        <select
                            id="participants"
                            name="participants"
                            value={formData.participants}
                            onChange={handleParticipantChange}
                            multiple
                            size="5"
                        >
                            {participants.map(participant => (
                                <option key={participant.id} value={participant.id}>
                                    {participant.prenom} {participant.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <small>Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs participants</small>
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate('/dashboard/formations')}
                    >
                        Annuler
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Création en cours...' : 'Créer la Formation'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlanTraining; 
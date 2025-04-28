import React, { useEffect, useState } from 'react';
import cdcService from '../../services/cdcService';
import './CDCList.css';

const CDCList = () => {
    const [cdcs, setCdcs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCdcs = async () => {
            try {
                console.log('Starting to fetch CDCs...');
                const data = await cdcService.getAll();
                console.log('Received CDC data:', data);
                setCdcs(data);
                setLoading(false);
            } catch (err) {
                console.error('Error in CDCList:', err);
                setError(`Erreur lors du chargement des CDCs: ${err.message}`);
                setLoading(false);
            }
        };

        fetchCdcs();
    }, []);

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="cdc-list">
            <h2>Liste des Centres de Développement des Compétences</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                    </tr>
                </thead>
                <tbody>
                    {cdcs.map((cdc) => (
                        <tr key={cdc.id}>
                            <td>{cdc.id}</td>
                            <td>{cdc.nom}</td>
                            <td>{cdc.prenom}</td>
                            <td>{cdc.email}</td>
                            <td>{cdc.telephone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CDCList; 
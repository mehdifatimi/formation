import React, { useState, useEffect } from 'react';
import { regionService } from '../services/regionService';

const RegionList = () => {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const data = await regionService.getAll();
                setRegions(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRegions();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Regions</h2>
            <ul>
                {regions.map(region => (
                    <li key={region.id}>
                        {region.nom}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RegionList; 
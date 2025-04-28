import React, { useEffect, useState } from 'react';
import { Card, List, Spin, Empty, Tag, Typography } from 'antd';
import api from '../../services/api';

const { Text } = Typography;

const LatestFormations = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                setLoading(true);
                const response = await api.get('/formations');
                setFormations(response.data.slice(0, 5)); // Prendre les 5 premières formations
                setError(null);
            } catch (err) {
                console.error('Erreur lors du chargement des formations:', err);
                setError('Impossible de charger les formations');
            } finally {
                setLoading(false);
            }
        };

        fetchFormations();
    }, []);

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'en_attente':
                return 'orange';
            case 'validee':
                return 'green';
            case 'terminee':
                return 'blue';
            case 'annulee':
                return 'red';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <Card title="Dernières Formations" className="dashboard-card">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card title="Dernières Formations" className="dashboard-card">
                <Empty
                    description={error}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    return (
        <Card 
            title="Dernières Formations" 
            className="dashboard-card"
            extra={<Text type="secondary">{formations.length} formation(s)</Text>}
        >
            {formations.length === 0 ? (
                <Empty description="Aucune formation disponible" />
            ) : (
                <List
                    dataSource={formations}
                    renderItem={formation => (
                        <List.Item
                            key={formation.id}
                            actions={[
                                <Tag color={getStatusColor(formation.statut)}>
                                    {formation.statut?.replace('_', ' ')}
                                </Tag>
                            ]}
                        >
                            <List.Item.Meta
                                title={formation.titre}
                                description={
                                    <div>
                                        <p>
                                            <Text type="secondary">Début : </Text>
                                            {formatDate(formation.date_debut)}
                                        </p>
                                        <p>
                                            <Text type="secondary">Fin : </Text>
                                            {formatDate(formation.date_fin)}
                                        </p>
                                        <p>
                                            <Text type="secondary">Places : </Text>
                                            {formation.places_disponibles}
                                        </p>
                                        {formation.formateur && (
                                            <p>
                                                <Text type="secondary">Formateur : </Text>
                                                {formation.formateur.name}
                                            </p>
                                        )}
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </Card>
    );
};

export default LatestFormations; 
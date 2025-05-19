import React, { useEffect, useState } from 'react';
import { Card, List, Spin, Empty, Avatar, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Text } = Typography;

const LatestParticipants = () => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                setLoading(true);
                const response = await api.get('/participants');
                setParticipants(response.data.slice(0, 5)); // Prendre les 5 derniers participants
                setError(null);
            } catch (err) {
                console.error('Erreur lors du chargement des participants:', err);
                setError('Impossible de charger les participants');
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, []);

    const getInitials = (nom, prenom) => {
        return `${nom?.charAt(0) || ''}${prenom?.charAt(0) || ''}`.toUpperCase();
    };

    if (loading) {
        return (
            <Card title="Derniers Participants" className="dashboard-card">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card title="Derniers Participants" className="dashboard-card">
                <Empty
                    description={error}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    return (
        <Card 
            title="Derniers Participants" 
            className="dashboard-card"
            extra={<Text type="secondary">{participants.length} participant(s)</Text>}
        >
            {participants.length === 0 ? (
                <Empty description="Aucun participant disponible" />
            ) : (
                <List
                    dataSource={participants}
                    renderItem={participant => (
                        <List.Item
                            key={participant.id}
                            actions={[
                                <Tag color={participant.statut === 'actif' ? 'green' : 'red'}>
                                    {participant.statut}
                                </Tag>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar 
                                        style={{ 
                                            backgroundColor: '#1890ff',
                                            verticalAlign: 'middle' 
                                        }}
                                    >
                                        {getInitials(participant.nom, participant.prenom)}
                                    </Avatar>
                                }
                                title={`${participant.nom} ${participant.prenom}`}
                                description={
                                    <div>
                                        <p>
                                            <Text type="secondary">Email : </Text>
                                            {participant.email}
                                        </p>
                                        <p>
                                            <Text type="secondary">Téléphone : </Text>
                                            {participant.telephone}
                                        </p>
                                        {participant.ville && (
                                            <p>
                                                <Text type="secondary">Ville : </Text>
                                                {participant.ville}
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

export default LatestParticipants; 
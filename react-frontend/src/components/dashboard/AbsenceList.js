import React, { useState, useEffect } from 'react';
import { Space, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import DataTable from '../common/DataTable';
import { getAbsences, deleteAbsence } from '../../services/absenceService';
import { getParticipants } from '../../services/participantService';
import { getFormations } from '../../services/formationService';
import AbsenceForm from './forms/AbsenceForm';
import { useSearchParams } from 'react-router-dom';

const AbsenceList = () => {
    const [absences, setAbsences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [editingAbsence, setEditingAbsence] = useState(null);
    const [filters, setFilters] = useState({});
    const [participants, setParticipants] = useState([]);
    const [formations, setFormations] = useState([]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const formationId = searchParams.get('formation_id');
        if (formationId) {
            setFilters(prev => ({ ...prev, formation_id: formationId }));
        }
    }, [searchParams]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [absencesData, participantsData, formationsData] = await Promise.all([
                getAbsences(filters),
                getParticipants(),
                getFormations()
            ]);
            setAbsences(absencesData);
            setParticipants(participantsData);
            setFormations(formationsData);
        } catch (error) {
            message.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const handleEdit = (record) => {
        setEditingAbsence(record);
        setVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            await deleteAbsence(record.id);
            message.success('Absence supprimée avec succès');
            fetchData();
        } catch (error) {
            message.error('Erreur lors de la suppression de l\'absence');
        }
    };

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
    };

    const handleAdd = () => {
        setEditingAbsence(null);
        setVisible(true);
    };

    const columns = [
        {
            title: 'Participant',
            dataIndex: ['participant', 'nom'],
            key: 'participant',
            render: (_, record) => `${record.participant?.nom} ${record.participant?.prenom}`
        },
        {
            title: 'Formation',
            dataIndex: ['formation', 'titre'],
            key: 'formation',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Motif',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusMap = {
                    'justified': { text: 'Justifiée', color: 'green' },
                    'unjustified': { text: 'Non justifiée', color: 'red' }
                };
                const statusInfo = statusMap[status] || { text: status, color: 'default' };
                return <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cette absence ?"
                        onConfirm={() => handleDelete(record)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filterConfig = [
        {
            name: 'participant_id',
            label: 'Participant',
            type: 'select',
            options: participants.map(p => ({
                label: `${p.nom} ${p.prenom}`,
                value: p.id
            })),
        },
        {
            name: 'formation_id',
            label: 'Formation',
            type: 'select',
            options: formations.map(f => ({
                label: f.titre,
                value: f.id
            })),
        },
        {
            name: 'status',
            label: 'Statut',
            type: 'select',
            options: [
                { label: 'Justifiée', value: 'justified' },
                { label: 'Non justifiée', value: 'unjustified' },
            ],
        },
    ];

    return (
        <>
            <DataTable
                title="Absences"
                columns={columns}
                dataSource={absences}
                loading={loading}
                filters={filterConfig}
                onFilter={handleFilter}
                searchPlaceholder="Rechercher une absence..."
                showDateRange
                dateRangeField="date"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Ajouter une absence
                    </Button>
                }
            />
            <AbsenceForm
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    setEditingAbsence(null);
                }}
                onSuccess={() => {
                    setVisible(false);
                    setEditingAbsence(null);
                    fetchData();
                }}
                initialValues={editingAbsence}
                participants={participants}
                formations={formations}
            />
        </>
    );
};

export default AbsenceList; 
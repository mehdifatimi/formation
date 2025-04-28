import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Space, Modal, message, Tag, Form, Input, DatePicker, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import DataTable from '../common/DataTable';
import api from '../../services/api';
import moment from 'moment';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AbsenceManagement = () => {
    const [absences, setAbsences] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();
    const location = useLocation();
    const formationId = new URLSearchParams(location.search).get('formation_id');

    useEffect(() => {
        if (formationId) {
            fetchAbsences();
        }
    }, [formationId]);

    const fetchAbsences = async () => {
        try {
            setLoading(true);
            const response = await api.get('/absences', {
                params: { formation_id: formationId }
            });
            setAbsences(response.data);
        } catch (error) {
            message.error('Erreur lors du chargement des absences');
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipants = async () => {
        try {
            const response = await api.get('/participants');
            setParticipants(response.data);
        } catch (error) {
            message.error('Erreur lors du chargement des participants');
        }
    };

    const fetchFormations = async () => {
        try {
            const response = await api.get('/formations');
            setFormations(response.data);
        } catch (error) {
            message.error('Erreur lors du chargement des formations');
        }
    };

    useEffect(() => {
        fetchParticipants();
        fetchFormations();
    }, []);

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingId(record.id);
        form.setFieldsValue({
            ...record,
            date: moment(record.date),
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/absences/${id}`);
            message.success('Absence supprimée avec succès');
            fetchAbsences();
        } catch (error) {
            message.error('Erreur lors de la suppression de l\'absence');
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingId) {
                await api.put(`/absences/${editingId}`, values);
                message.success('Absence mise à jour avec succès');
            } else {
                await api.post('/absences', values);
                message.success('Absence ajoutée avec succès');
            }
            setModalVisible(false);
            fetchAbsences();
        } catch (error) {
            message.error('Erreur lors de l\'enregistrement de l\'absence');
        }
    };

    const columns = [
        {
            title: 'Participant',
            dataIndex: ['participant', 'nom'],
            key: 'participant',
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
            render: (date) => moment(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Motif',
            dataIndex: 'motif',
            key: 'motif',
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    pending: 'processing',
                    approved: 'success',
                    rejected: 'error'
                };
                const labels = {
                    pending: 'En attente',
                    approved: 'Approuvé',
                    rejected: 'Rejeté'
                };
                return <Tag color={colors[status]}>{labels[status]}</Tag>;
            },
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
                    >
                        Modifier
                    </Button>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Supprimer
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Ajouter une absence
                </Button>
            </div>

            <DataTable
                columns={columns}
                dataSource={absences}
                loading={loading}
                rowKey="id"
            />

            <Modal
                title={editingId ? 'Modifier l\'absence' : 'Ajouter une absence'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="participant_id"
                        label="Participant"
                        rules={[{ required: true, message: 'Veuillez sélectionner un participant' }]}
                    >
                        <Select>
                            {participants.map(participant => (
                                <Option key={participant.id} value={participant.id}>
                                    {participant.nom} {participant.prenom}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="formation_id"
                        label="Formation"
                        rules={[{ required: true, message: 'Veuillez sélectionner une formation' }]}
                    >
                        <Select>
                            {formations.map(formation => (
                                <Option key={formation.id} value={formation.id}>
                                    {formation.titre}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="date"
                        label="Date"
                        rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="motif"
                        label="Motif"
                        rules={[{ required: true, message: 'Veuillez saisir un motif' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Statut"
                        rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
                    >
                        <Select>
                            <Option value="pending">En attente</Option>
                            <Option value="approved">Approuvé</Option>
                            <Option value="rejected">Rejeté</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingId ? 'Modifier' : 'Ajouter'}
                            </Button>
                            <Button onClick={() => setModalVisible(false)}>
                                Annuler
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AbsenceManagement; 
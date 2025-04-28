import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message, Space, Tag, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../../services/api';
import moment from 'moment';

const FormationCDC = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [form] = Form.useForm();
  const [hotels, setHotels] = useState([]);
  const [lieux, setLieux] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    loadFormations();
    loadOptions();
  }, []);

  const loadFormations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/formations');
      setFormations(response.data);
    } catch (error) {
      message.error('Erreur lors du chargement des formations');
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const response = await api.get('/formations/options');
      if (response.data.success) {
        setHotels(response.data.hotels || []);
        setLieux(response.data.lieux || []);
        setFormateurs(response.data.formateurs || []);
        setParticipants(response.data.participants || []);
      }
    } catch (error) {
      message.error('Erreur lors du chargement des options');
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        date_debut: values.date_debut.format('YYYY-MM-DD'),
        date_fin: values.date_fin.format('YYYY-MM-DD'),
        formateur_id: values.formateur_id,
        statut: 'planifiée',
        participants: values.participants || []
      };

      if (editingFormation) {
        await api.put(`/formations/${editingFormation.id}`, formattedValues);
        message.success('Formation mise à jour avec succès');
      } else {
        await api.post('/formations', formattedValues);
        message.success('Formation créée avec succès');
      }

      setModalVisible(false);
      form.resetFields();
      loadFormations();
    } catch (error) {
      message.error('Erreur lors de la sauvegarde de la formation');
    }
  };

  const handleEdit = (formation) => {
    setEditingFormation(formation);
    form.setFieldsValue({
      ...formation,
      date_debut: moment(formation.date_debut),
      date_fin: moment(formation.date_fin),
      participants: formation.participants?.map(p => p.id) || []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/formations/${id}`);
      message.success('Formation supprimée avec succès');
      loadFormations();
    } catch (error) {
      message.error('Erreur lors de la suppression de la formation');
    }
  };

  const columns = [
    {
      title: 'Titre',
      dataIndex: 'titre',
      key: 'titre',
    },
    {
      title: 'Formateur',
      dataIndex: ['formateur', 'nom'],
      key: 'formateur',
      render: (_, record) => (
        <span>
          {record.formateur?.prenom} {record.formateur?.nom}
        </span>
      ),
    },
    {
      title: 'Date de début',
      dataIndex: 'date_debut',
      key: 'date_debut',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Date de fin',
      dataIndex: 'date_fin',
      key: 'date_fin',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut) => (
        <Tag color={statut === 'planifiée' ? 'blue' : statut === 'en_cours' ? 'green' : 'red'}>
          {statut}
        </Tag>
      ),
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
            danger
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
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingFormation(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Ajouter une formation
      </Button>

      <Table
        columns={columns}
        dataSource={formations}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingFormation ? 'Modifier la formation' : 'Nouvelle formation'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="titre"
            label="Titre"
            rules={[{ required: true, message: 'Veuillez saisir le titre' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Veuillez saisir la description' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="formateur_id"
            label="Formateur"
            rules={[{ required: true, message: 'Veuillez sélectionner un formateur' }]}
          >
            <Select
              loading={loadingOptions}
              placeholder="Sélectionner un formateur"
            >
              {formateurs.map(formateur => (
                <Select.Option key={formateur.id} value={formateur.id}>
                  {formateur.nom} {formateur.prenom}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="participants"
            label="Participants"
          >
            <Select
              mode="multiple"
              loading={loadingOptions}
              placeholder="Sélectionner les participants"
            >
              {participants.map(participant => (
                <Select.Option key={participant.id} value={participant.id}>
                  {participant.nom} {participant.prenom}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date_debut"
            label="Date de début"
            rules={[{ required: true, message: 'Veuillez sélectionner la date de début' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="date_fin"
            label="Date de fin"
            rules={[{ required: true, message: 'Veuillez sélectionner la date de fin' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="hotel_id"
            label="Hôtel"
          >
            <Select
              loading={loadingOptions}
              placeholder="Sélectionner un hôtel"
            >
              {hotels.map(hotel => (
                <Select.Option key={hotel.id} value={hotel.id}>
                  {hotel.nom}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="lieu_id"
            label="Lieu"
          >
            <Select
              loading={loadingOptions}
              placeholder="Sélectionner un lieu"
            >
              {lieux.map(lieu => (
                <Select.Option key={lieu.id} value={lieu.id}>
                  {lieu.nom}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="places_disponibles"
            label="Places disponibles"
            rules={[{ required: true, message: 'Veuillez saisir le nombre de places disponibles' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingFormation ? 'Modifier' : 'Créer'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormationCDC; 
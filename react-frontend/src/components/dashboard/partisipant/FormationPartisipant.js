import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message, Space, Tag, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../../services/api';
import moment from 'moment';

const FormationPartisipant = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [form] = Form.useForm();
  const [options, setOptions] = useState({
    hotels: [],
    lieux: [],
    formateurs: []
  });

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
    try {
      const response = await api.get('/formations/options');
      setOptions(response.data);
    } catch (error) {
      message.error('Erreur lors du chargement des options');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingFormation) {
        await api.put(`/formations/${editingFormation.id}`, values);
        message.success('Formation mise à jour avec succès');
      } else {
        await api.post('/formations', values);
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
      date_debut: formation.date_debut ? moment(formation.date_debut) : null,
      date_fin: formation.date_fin ? moment(formation.date_fin) : null
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
      dataIndex: 'formateur',
      key: 'formateur',
      render: (formateur) => formateur?.nom || 'Non assigné',
    },
    {
      title: 'Date de début',
      dataIndex: 'date_debut',
      key: 'date_debut',
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Date de fin',
      dataIndex: 'date_fin',
      key: 'date_fin',
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : '-',
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
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingFormation(null);
        }}
        onOk={() => form.submit()}
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
            <Select>
              {options.formateurs.map(formateur => (
                <Select.Option key={formateur.id} value={formateur.id}>
                  {formateur.nom}
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
            rules={[{ required: true, message: 'Veuillez sélectionner un hôtel' }]}
          >
            <Select>
              {options.hotels.map(hotel => (
                <Select.Option key={hotel.id} value={hotel.id}>
                  {hotel.nom}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="lieu_id"
            label="Lieu"
            rules={[{ required: true, message: 'Veuillez sélectionner un lieu' }]}
          >
            <Select>
              {options.lieux.map(lieu => (
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
        </Form>
      </Modal>
    </div>
  );
};

export default FormationPartisipant; 
import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, message, Card, Table, Space, Modal, Tag, Tabs, Checkbox } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import api from '../../services/api';
import moment from 'moment';

const FormationList = () => {
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
  const [activeTab, setActiveTab] = useState('1');
  const [absenceModalVisible, setAbsenceModalVisible] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [absenceDate, setAbsenceDate] = useState(null);

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
      if (error.response?.data?.error) {
        message.error(`Erreur: ${error.response.data.error}`);
      } else {
        message.error('Erreur lors de la sauvegarde de la formation');
      }
      console.error('Erreur détaillée:', error.response?.data);
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

  const handleAbsenceClick = (formation) => {
    setSelectedFormation(formation);
    setSelectedParticipants([]);
    setAbsenceDate(null);
    setAbsenceModalVisible(true);
  };

  const handleAbsenceSubmit = async () => {
    if (!absenceDate) {
      message.error('Veuillez sélectionner une date');
      return;
    }

    if (selectedParticipants.length === 0) {
      message.error('Veuillez sélectionner au moins un participant');
      return;
    }

    try {
      const promises = selectedParticipants.map(participantId =>
        api.post(`/formations/${selectedFormation.id}/absences`, {
          participant_id: participantId,
          date: absenceDate.format('YYYY-MM-DD'),
          reason: 'Absence',
          status: 'unjustified',
          commentaire: null
        })
      );

      await Promise.all(promises);
      message.success('Absences enregistrées avec succès');
      setAbsenceModalVisible(false);
      loadFormations();
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data);
      message.error('Erreur lors de l\'enregistrement des absences');
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
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
      render: (participants) => (
        <span>{participants?.length || 0} participants</span>
      ),
    },
    {
      title: 'Absences',
      dataIndex: 'absences',
      key: 'absences',
      render: (absences) => (
        <span>{absences?.length || 0} absences</span>
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
          <Button
            type="default"
            icon={<CalendarOutlined />}
            onClick={() => handleAbsenceClick(record)}
          >
            Gérer les absences
          </Button>
        </Space>
      ),
    },
  ];

  const renderParticipantsTab = (formation) => {
    if (!formation.participants) return null;

    return (
      <div>
        <Table
          dataSource={formation.participants}
          rowKey="id"
          columns={[
            {
              title: 'Nom',
              dataIndex: 'nom',
              key: 'nom',
            },
            {
              title: 'Prénom',
              dataIndex: 'prenom',
              key: 'prenom',
            },
            {
              title: 'Statut',
              dataIndex: 'pivot',
              key: 'statut',
              render: (pivot) => (
                <Tag color={pivot.statut === 'present' ? 'green' : 'red'}>
                  {pivot.statut}
                </Tag>
              ),
            },
          ]}
        />
        <div style={{ marginTop: 20 }}>
          <h4>Historique des absences</h4>
          <Table
            dataSource={formation.absences}
            rowKey="id"
            columns={[
              {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (date) => moment(date).format('DD/MM/YYYY'),
              },
              {
                title: 'Participant',
                dataIndex: ['participant', 'nom'],
                key: 'participant',
                render: (_, record) => (
                  <span>
                    {record.participant?.prenom} {record.participant?.nom}
                  </span>
                ),
              },
              {
                title: 'Statut',
                dataIndex: 'present',
                key: 'present',
                render: (present) => (
                  <Tag color={present ? 'green' : 'red'}>
                    {present ? 'Présent' : 'Absent'}
                  </Tag>
                ),
              },
            ]}
          />
        </div>
      </div>
    );
  };

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
        expandable={{
          expandedRowRender: (record) => (
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: '1',
                  label: (
                    <span>
                      <UserOutlined />
                      Participants
                    </span>
                  ),
                  children: renderParticipantsTab(record),
                },
              ]}
            />
          ),
        }}
      />

      <Modal
        title="Gérer les absences"
        open={absenceModalVisible}
        onCancel={() => setAbsenceModalVisible(false)}
        onOk={handleAbsenceSubmit}
        width={600}
      >
        {selectedFormation && (
          <>
            <Form.Item label="Date">
              <DatePicker
                style={{ width: '100%' }}
                onChange={setAbsenceDate}
                value={absenceDate}
              />
            </Form.Item>
            <div style={{ marginBottom: 16 }}>
              <h4>Participants</h4>
              <Checkbox.Group
                style={{ width: '100%' }}
                onChange={setSelectedParticipants}
                value={selectedParticipants}
              >
                {selectedFormation.participants?.map(participant => (
                  <div key={participant.id} style={{ marginBottom: 8 }}>
                    <Checkbox value={participant.id}>
                      {participant.nom} {participant.prenom}
                    </Checkbox>
                  </div>
                ))}
              </Checkbox.Group>
            </div>
          </>
        )}
      </Modal>

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

export default FormationList;
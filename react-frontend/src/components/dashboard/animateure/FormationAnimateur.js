import React, { useState, useEffect } from 'react';
import { Table, Tag, message } from 'antd';
import api from '../../../services/api';
import moment from 'moment';

const FormationAnimateur = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFormations();
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={formations}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default FormationAnimateur; 
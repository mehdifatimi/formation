import React from 'react';
import { Tabs } from 'antd';
import FormationCDC from './FormationCDC';
import FormateurCDC from './FormateurCDC';
import ParticipantCDC from './ParticipantCDC';

const CDCManager = ({ activeTab = 'formations' }) => {
  const items = [
    {
      key: 'formations',
      label: 'Formations',
      children: <FormationCDC />,
    },
    {
      key: 'formateurs',
      label: 'Formateurs',
      children: <FormateurCDC />,
    },
    {
      key: 'participants',
      label: 'Participants',
      children: <ParticipantCDC />,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Tabs defaultActiveKey={activeTab} items={items} />
    </div>
  );
};

export default CDCManager; 
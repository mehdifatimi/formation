import React from 'react';
import { Layout, Row, Col } from 'antd';
import LatestFormations from '../components/dashboard/LatestFormations';
import LatestParticipants from '../components/dashboard/LatestParticipants';
import CDCManager from './components/dashboard/cdc/CDCManager';

const { Content } = Layout;

const Dashboard = () => {
    return (
        <Content style={{ padding: '24px' }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <LatestFormations />
                </Col>
                <Col xs={24} lg={12}>
                    <LatestParticipants />
                </Col>
            </Row>
            <CDCManager />
        </Content>
    );
};

export default Dashboard; 
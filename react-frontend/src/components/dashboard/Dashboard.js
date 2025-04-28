import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    TeamOutlined,
    CalendarOutlined,
    FileTextOutlined,
    FileDoneOutlined,
    UserSwitchOutlined
} from '@ant-design/icons';
import FormationList from './FormationList';
import ParticipantList from './ParticipantList';
import FormateurList from './FormateurList';
import PlanTraining from './PlanTraining';
import FormationAnimateur from './animateure/FormationAnimateur';
import FormationDRF from './drf/FormationDRF';
import FormationPartisipant from './partisipant/FormationPartisipant';
import CDCManager from './cdc/CDCManager';
import './Dashboard.css';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('home');

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const menuItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Accueil',
        },
        {
            key: 'formations',
            icon: <CalendarOutlined />,
            label: 'Formations',
        },
        {
            key: 'participants',
            icon: <TeamOutlined />,
            label: 'Participants',
        },
        {
            key: 'formateurs',
            icon: <UserOutlined />,
            label: 'Formateurs',
        },
        {
            key: 'plan-training',
            icon: <CalendarOutlined />,
            label: 'Plan de formation',
        },
        {
            key: 'cdc',
            icon: <FileTextOutlined />,
            label: 'CDC',
            children: [
                {
                    key: 'cdc-formations',
                    label: 'Formations',
                },
                {
                    key: 'cdc-formateurs',
                    label: 'Formateurs',
                },
                {
                    key: 'cdc-participants',
                    label: 'Participants',
                },
            ],
        },
        {
            key: 'drf',
            icon: <FileDoneOutlined />,
            label: 'DRF',
            children: [
                {
                    key: 'drf-formations',
                    label: 'Formations',
                },
            ],
        },
        {
            key: 'animateur',
            icon: <UserSwitchOutlined />,
            label: 'Animateur',
            children: [
                {
                    key: 'animateur-formations',
                    label: 'Formations',
                },
            ],
        },
        {
            key: 'partisipant',
            icon: <TeamOutlined />,
            label: 'Participant',
            children: [
                {
                    key: 'partisipant-formations',
                    label: 'Formations',
                },
            ],
        },
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case 'home':
                return <div>Bienvenue sur le tableau de bord</div>;
            case 'formations':
                return <FormationList />;
            case 'participants':
                return <ParticipantList />;
            case 'formateurs':
                return <FormateurList />;
            case 'plan-training':
                return <PlanTraining />;
            case 'cdc-formations':
            case 'cdc-formateurs':
            case 'cdc-participants':
                return <CDCManager activeTab={selectedKey.split('-')[1]} />;
            case 'drf-formations':
                return <FormationDRF />;
            case 'animateur-formations':
                return <FormationAnimateur />;
            case 'partisipant-formations':
                return <FormationPartisipant />;
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['home']}
                    mode="inline"
                    items={menuItems}
                    selectedKeys={[selectedKey]}
                    onClick={({ key }) => setSelectedKey(key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer }}>
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard; 
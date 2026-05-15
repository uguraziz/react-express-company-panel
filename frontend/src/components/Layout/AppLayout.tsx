import { useState } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
    DashboardOutlined,
    BankOutlined,
    AppstoreOutlined,
    LogoutOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useAuth } from '../../context/AuthContext'

const { Sider, Header, Content } = Layout
const { Text } = Typography

const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/companies', icon: <BankOutlined />, label: 'Şirketler' },
    { key: '/products', icon: <AppstoreOutlined />, label: 'Ürünler' },
]

function AppLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const userMenuItems = [
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Çıkış Yap',
            danger: true,
            onClick: handleLogout,
        },
    ]

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                trigger={null}
                style={{ background: '#001529' }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {!collapsed && (
                        <Text style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                            Yönetim Paneli
                        </Text>
                    )}
                    {collapsed && (
                        <Text style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>YP</Text>
                    )}
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{ marginTop: 8 }}
                />
            </Sider>

            <Layout>
                <Header style={{
                    background: '#fff',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f0f0f0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: 16 }}
                    />

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} style={{ background: '#1677ff' }} />
                            <Text strong>{currentUser?.username}</Text>
                        </div>
                    </Dropdown>
                </Header>

                <Content style={{ margin: 24, minHeight: 280 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default AppLayout
import { Row, Col, Card, Statistic, Typography, List, Avatar, Tag, Empty } from 'antd'
import {
    BankOutlined,
    AppstoreOutlined,
    RiseOutlined,
    GlobalOutlined,
} from '@ant-design/icons'
import { useData, Company } from '../context/DataContext'

const { Title, Text } = Typography

function Dashboard() {
    const { companies, products } = useData()

    const lastThreeCompanies = [...companies].slice(-3).reverse()

    const categoryCount = [...new Set(products.map(p => p.category))].length

    const countryCount = [...new Set(companies.map(c => c.country))].length

    const statCards = [
        {
            title: 'Toplam Şirket',
            value: companies.length,
            icon: <BankOutlined style={{ fontSize: 28, color: '#1677ff' }} />,
            color: '#e6f4ff',
        },
        {
            title: 'Toplam Ürün',
            value: products.length,
            icon: <AppstoreOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
            color: '#f6ffed',
        },
        {
            title: 'Ürün Kategorisi',
            value: categoryCount,
            icon: <RiseOutlined style={{ fontSize: 28, color: '#fa8c16' }} />,
            color: '#fff7e6',
        },
        {
            title: 'Farklı Ülke',
            value: countryCount,
            icon: <GlobalOutlined style={{ fontSize: 28, color: '#722ed1' }} />,
            color: '#f9f0ff',
        },
    ]

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
            </div>

            <Row gutter={[16, 16]}>
                {statCards.map((card, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card style={{ borderRadius: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Statistic title={card.title} value={card.value} />
                                <div style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 12,
                                    background: card.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {card.icon}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={12}>
                    <Card
                        title="Son Eklenen Şirketler"
                        style={{ borderRadius: 12 }}
                    >
                        {lastThreeCompanies.length === 0 ? (
                            <Empty description="Henüz şirket eklenmedi" />
                        ) : (
                            <List
                                dataSource={lastThreeCompanies}
                                renderItem={(company: Company) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar style={{ background: '#1677ff' }}>
                                                    {company.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                            }
                                            title={company.name}
                                            description={
                                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                    <Tag color="blue">{company.country}</Tag>
                                                    <a href={company.website} target="_blank" rel="noreferrer">
                                                        {company.website}
                                                    </a>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="Şirket Başına Ürün"
                        style={{ borderRadius: 12 }}
                    >
                        {companies.length === 0 ? (
                            <Empty description="Henüz şirket eklenmedi" />
                        ) : (
                            <List
                                dataSource={companies}
                                renderItem={(company: Company) => {
                                    const count = products.filter(p => p.companyId === company.id).length
                                    return (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar style={{ background: '#52c41a' }}>
                                                        {company.name.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                }
                                                title={company.name}
                                                description={`${count} ürün kayıtlı`}
                                            />
                                            <Tag color={count > 0 ? 'green' : 'default'}>
                                                {count} ürün
                                            </Tag>
                                        </List.Item>
                                    )
                                }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Dashboard
import { useState, useEffect } from 'react'
import {
    Table, Button, Modal, Form, Input, Space,
    Popconfirm, Typography, Tag, message, Tooltip
} from 'antd'
import {
    PlusOutlined, EditOutlined, DeleteOutlined, GlobalOutlined, SearchOutlined
} from '@ant-design/icons'
import { useData, Company } from '../context/DataContext'
import type { TableProps } from 'antd'

const { Title, Text } = Typography

function Companies() {
    const { companies, addCompany, editCompany, deleteCompany } = useData()

    const [searchText, setSearchText] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchText])

    const filteredCompanies = companies.filter(c => 
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.legalNumber.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.country.toLowerCase().includes(debouncedSearch.toLowerCase())
    )

    const [modalOpen, setModalOpen] = useState(false)
    const [editingCompany, setEditingCompany] = useState<Company | null>(null)
    const [form] = Form.useForm()

    const openAddModal = () => {
        setEditingCompany(null)
        form.resetFields()
        setModalOpen(true)
    }

    const openEditModal = (company: Company) => {
        setEditingCompany(company)
        form.setFieldsValue(company)
        setModalOpen(true)
    }

    const handleCancel = () => {
        setModalOpen(false)
        setEditingCompany(null)
        form.resetFields()
    }

    const onFinish = async (values: any) => {
        try {
            if (editingCompany) {
                await editCompany(editingCompany.id, values)
                message.success('Şirket güncellendi')
            } else {
                await addCompany(values)
                message.success('Şirket eklendi')
            }
            handleCancel()
        } catch (error) {
            message.error('Bir hata oluştu')
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteCompany(id)
            message.success('Şirket silindi')
        } catch (error) {
            message.error('Silme işlemi başarısız')
        }
    }

    const columns: TableProps<Company>['columns'] = [
        {
            title: 'Şirket Adı',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Sicil No',
            dataIndex: 'legalNumber',
            key: 'legalNumber',
        },
        {
            title: 'Ülke',
            dataIndex: 'country',
            key: 'country',
            render: (country: string) => <Tag color="blue">{country}</Tag>,
            filters: [...new Set(companies.map(c => c.country))].map(country => ({
                text: country,
                value: country,
            })),
            onFilter: (value: any, record: Company) => record.country === value,
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website',
            render: (url: string) => (
                <a href={url} target="_blank" rel="noreferrer">
                    <GlobalOutlined style={{ marginRight: 4 }} />
                    {url}
                </a>
            ),
        },
        {
            title: 'İşlemler',
            key: 'actions',
            width: 120,
            render: (_, record: Company) => (
                <Space>
                    <Tooltip title="Düzenle">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEditModal(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Bu şirketi silmek istediğine emin misin?"
                        description="Bağlı tüm ürünler de silinecek."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Evet, sil"
                        cancelText="İptal"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Sil">
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24
            }}>
                <div>
                    <Title level={4} style={{ margin: 0 }}>Şirketler</Title>
                    <Text type="secondary">Toplam {companies.length} şirket</Text>
                </div>
                <Space>
                    <Input
                        placeholder="Şirket ara..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 250 }}
                        allowClear
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                    >
                        Şirket Ekle
                    </Button>
                </Space>
            </div>

            <Table
                dataSource={filteredCompanies}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 8, showSizeChanger: true }}
                scroll={{ x: 600 }}
            />

            <Modal
                title={editingCompany ? 'Şirketi Düzenle' : 'Yeni Şirket Ekle'}
                open={modalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item
                        label="Şirket Adı"
                        name="name"
                        rules={[{ required: true, message: 'Şirket adı gerekli' }]}
                    >
                        <Input placeholder="örn. Arçelik A.Ş." />
                    </Form.Item>

                    <Form.Item
                        label="Şirket Sicil Numarası"
                        name="legalNumber"
                        rules={[{ required: true, message: 'Sicil numarası gerekli' }]}
                    >
                        <Input placeholder="örn. 0001234567" />
                    </Form.Item>

                    <Form.Item
                        label="Kuruluş Ülkesi"
                        name="country"
                        rules={[{ required: true, message: 'Ülke gerekli' }]}
                    >
                        <Input placeholder="örn. Türkiye" />
                    </Form.Item>

                    <Form.Item
                        label="Website"
                        name="website"
                        rules={[
                            { required: true, message: 'Website gerekli' },
                            { type: 'url', message: 'Geçerli bir URL girin (https://...)' }
                        ]}
                    >
                        <Input placeholder="https://example.com" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={handleCancel}>İptal</Button>
                            <Button type="primary" htmlType="submit">
                                {editingCompany ? 'Güncelle' : 'Ekle'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Companies
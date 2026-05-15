import { useState, useEffect } from 'react'
import {
    Table, Button, Modal, Form, Input, Select,
    Space, Popconfirm, Typography, Tag, message,
    Tooltip, InputNumber
} from 'antd'
import {
    PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined
} from '@ant-design/icons'
import { useData, Product } from '../context/DataContext'
import type { TableProps } from 'antd'

const { Title, Text } = Typography

const UNITS = ['Adet', 'Kg', 'Litre', 'Metre', 'Kutu', 'Paket', 'Lisans', 'Uygulama']

const CATEGORIES = ['Elektronik', 'Beyaz Eşya', 'Gıda', 'Tekstil', 'Yazılım', 'Mobil Oyun', 'Dijital Servis', 'Diğer']

function Products() {
    const { products, companies, addProduct, editProduct, deleteProduct } = useData()

    const [searchText, setSearchText] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchText])

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedSearch.toLowerCase())
    )

    const [modalOpen, setModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [form] = Form.useForm()

    const getCompanyName = (companyId: number) => {
        const company = companies.find(c => c.id === companyId)
        return company ? company.name : 'Bilinmiyor'
    }

    const openAddModal = () => {
        setEditingProduct(null)
        form.resetFields()
        setModalOpen(true)
    }

    const openEditModal = (product: Product) => {
        setEditingProduct(product)
        form.setFieldsValue(product)
        setModalOpen(true)
    }

    const handleCancel = () => {
        setModalOpen(false)
        setEditingProduct(null)
        form.resetFields()
    }

    const onFinish = async (values: any) => {
        try {
            if (editingProduct) {
                await editProduct(editingProduct.id, values)
                message.success('Ürün güncellendi')
            } else {
                await addProduct(values)
                message.success('Ürün eklendi')
            }
            handleCancel()
        } catch (error) {
            message.error('Bir hata oluştu')
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteProduct(id)
            message.success('Ürün silindi')
        } catch (error) {
            message.error('Silme işlemi başarısız')
        }
    }

    const columns: TableProps<Product>['columns'] = [
        {
            title: 'Ürün Adı',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Kategori',
            dataIndex: 'category',
            key: 'category',
            render: (category: string) => <Tag color="purple">{category}</Tag>,
            filters: [...new Set(products.map(p => p.category))].map(cat => ({
                text: cat,
                value: cat,
            })),
            onFilter: (value: any, record: Product) => record.category === value,
        },
        {
            title: 'Miktar',
            key: 'amount',
            render: (_: any, record: Product) => (
                <Text>{record.amount} {record.unit}</Text>
            ),
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Şirket',
            dataIndex: 'companyId',
            key: 'companyId',
            render: (companyId: number) => (
                <Tag color="blue">{getCompanyName(companyId)}</Tag>
            ),
            filters: companies.map(c => ({
                text: c.name,
                value: c.id,
            })),
            onFilter: (value: any, record: Product) => record.companyId === value,
        },
        {
            title: 'İşlemler',
            key: 'actions',
            width: 120,
            render: (_: any, record: Product) => (
                <Space>
                    <Tooltip title="Düzenle">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEditModal(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Bu ürünü silmek istediğine emin misin?"
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
                    <Title level={4} style={{ margin: 0 }}>Ürünler</Title>
                    <Text type="secondary">Toplam {products.length} ürün</Text>
                </div>
                <Space>
                    <Input
                        placeholder="Ürün ara..."
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
                        Ürün Ekle
                    </Button>
                </Space>
            </div>

            <Table
                dataSource={filteredProducts}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 8, showSizeChanger: true }}
                scroll={{ x: 700 }}
            />

            <Modal
                title={editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
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
                        label="Ürün Adı"
                        name="name"
                        rules={[{ required: true, message: 'Ürün adı gerekli' }]}
                    >
                        <Input placeholder="örn. Bulaşık Makinesi" />
                    </Form.Item>

                    <Form.Item
                        label="Kategori"
                        name="category"
                        rules={[{ required: true, message: 'Kategori gerekli' }]}
                    >
                        <Select
                            placeholder="Kategori seçin"
                            allowClear
                            showSearch
                            options={CATEGORIES.map(cat => ({ label: cat, value: cat }))}
                        />
                    </Form.Item>

                    <Space.Compact style={{ width: '100%' }}>
                        <Form.Item
                            label="Miktar"
                            name="amount"
                            rules={[{ required: true, message: 'Miktar gerekli' }]}
                            style={{ width: '60%' }}
                        >
                            <InputNumber
                                placeholder="örn. 150"
                                min={0}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Birim"
                            name="unit"
                            rules={[{ required: true, message: 'Birim gerekli' }]}
                            style={{ width: '40%' }}
                        >
                            <Select
                                placeholder="Birim"
                                options={UNITS.map(unit => ({ label: unit, value: unit }))}
                            />
                        </Form.Item>
                    </Space.Compact>

                    <Form.Item
                        label="Şirket"
                        name="companyId"
                        rules={[{ required: true, message: 'Şirket seçimi gerekli' }]}
                    >
                        <Select
                            placeholder="Şirket seçin"
                            allowClear
                            showSearch
                            options={companies.map(company => ({
                                label: company.name,
                                value: company.id
                            }))}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={handleCancel}>İptal</Button>
                            <Button type="primary" htmlType="submit">
                                {editingProduct ? 'Güncelle' : 'Ekle'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Products
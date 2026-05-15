import { Form, Input, Button, Card, Typography, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const { Title, Text } = Typography

function Register() {
    const [form] = Form.useForm()
    const { register } = useAuth()
    const navigate = useNavigate()

    const onFinish = async (values: any) => {
        const result = await register(values.username, values.password)
        if (result.success) {
            message.success('Kayıt başarılı, şimdi giriş yapabilirsiniz')
            navigate('/login')
        } else {
            message.error(result.message)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f0f2f5'
        }}>
            <Card style={{ width: 380 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={3} style={{ margin: 0 }}>Kayıt Ol</Title>
                    <Text type="secondary">Yeni hesap oluşturun</Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Kullanıcı Adı"
                        name="username"
                        rules={[
                            { required: true, message: 'Kullanıcı adı gerekli' },
                            { min: 3, message: 'En az 3 karakter olmalı' }
                        ]}
                    >
                        <Input size="large" placeholder="kullanıcı adınız" />
                    </Form.Item>

                    <Form.Item
                        label="Şifre"
                        name="password"
                        rules={[
                            { required: true, message: 'Şifre gerekli' },
                            { min: 6, message: 'En az 6 karakter olmalı' }
                        ]}
                    >
                        <Input.Password size="large" placeholder="şifreniz" />
                    </Form.Item>

                    <Form.Item
                        label="Şifre Tekrar"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Şifre tekrarı gerekli' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('Şifreler eşleşmiyor'))
                                }
                            })
                        ]}
                    >
                        <Input.Password size="large" placeholder="şifrenizi tekrar girin" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" size="large" block>
                            Kayıt Ol
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Text type="secondary">Zaten hesabın var mı? </Text>
                    <Link to="/login">Giriş Yap</Link>
                </div>
            </Card>
        </div>
    )
}

export default Register
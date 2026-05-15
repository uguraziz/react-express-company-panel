import { Form, Input, Button, Card, Typography, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const { Title, Text } = Typography

function Login() {
    const [form] = Form.useForm()
    const { login } = useAuth()
    const navigate = useNavigate()

    const onFinish = async (values: any) => {
        const result = await login(values.username, values.password)
        if (result.success) {
            message.success('Giriş başarılı, hoş geldiniz!')
            navigate('/')
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
                    <Title level={3} style={{ margin: 0 }}>Giriş Yap</Title>
                    <Text type="secondary">Devam etmek için giriş yapın</Text>
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
                        rules={[{ required: true, message: 'Kullanıcı adı gerekli' }]}
                    >
                        <Input size="large" placeholder="kullanıcı adınız" />
                    </Form.Item>

                    <Form.Item
                        label="Şifre"
                        name="password"
                        rules={[{ required: true, message: 'Şifre gerekli' }]}
                    >
                        <Input.Password size="large" placeholder="şifreniz" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                        >
                            Giriş Yap
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Text type="secondary">Hesabın yok mu? </Text>
                    <Link to="/register">Kayıt Ol</Link>
                </div>
            </Card>
        </div>
    )
}

export default Login
import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Input, Typography, message, Modal } from 'antd';
import api from '../services/api';
import TransactionPage from './TransactionPage';
import './DashboardPage.css';

const { Title } = Typography;
const { Search } = Input;

function DashboardPage({ user }) {
  const [packages, setPackages] = useState([]);
  const [activePage, setActivePage] = useState('paket');
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedBuyPkg, setSelectedBuyPkg] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    api.get('/packages')
      .then(res => setPackages(res.data))
      .catch(() => message.error('Gagal mengambil data paket'));
  }, []);

  const showDetail = (pkg) => setSelectedPkg(pkg);
  const closeDetail = () => setSelectedPkg(null);

  const handleBuyClick = (pkg) => {
    setSelectedBuyPkg(pkg);
    setPaymentMethod('');
    setBuyModalOpen(true);
  };

  const handleConfirmBuy = async () => {
    if (!paymentMethod) {
      message.warning('Silakan pilih metode pembayaran');
      return;
    }

    try {
      await api.post('/transactions', {
        userId: user.id,
        packageId: selectedBuyPkg.id,
        date: new Date().toISOString(),
        paymentMethod
      });
      message.success('Pembelian berhasil');
      setBuyModalOpen(false);
    } catch {
      message.error('Transaksi gagal');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = '/login'; // redirect langsung ke halaman login
  };

  return (
    <div className="dashboard">
      <header
        className="dashboard-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 1rem',
          backgroundColor: '#0078d7',
          height: '64px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            Selamat Datang, {user.username}
          </Title>
        </div>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <Search placeholder="Search..." style={{ width: 300 }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            type={activePage === 'paket' ? 'primary' : 'default'}
            onClick={() => setActivePage('paket')}
          >
            Paket
          </Button>
          <Button
            type={activePage === 'transaksi' ? 'primary' : 'default'}
            onClick={() => setActivePage('transaksi')}
          >
            Riwayat Transaksi
          </Button>
          <Button type="default" danger onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="dashboard-content">
        {activePage === 'paket' && (
          <>
            <Title level={4}>Paket Internet</Title>
            <Row gutter={[16, 16]}>
              {packages.map(pkg => (
                <Col xs={24} sm={12} md={8} lg={6} key={pkg.id}>
                  <Card className="package-card">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      style={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: '4px 4px 0 0'
                      }}
                    />
                    <div className="card-text">
                      <p className="package-title">{pkg.name}</p>
                      <p className="package-price">
                        Rp {pkg.price.toLocaleString()}
                      </p>
                      <Button
                        type="primary"
                        block
                        onClick={() => handleBuyClick(pkg)}
                        style={{ marginBottom: 8 }}
                      >
                        Beli
                      </Button>
                      <Button type="link" block onClick={() => showDetail(pkg)}>
                        Detail Paket
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {activePage === 'transaksi' && <TransactionPage user={user} />}
      </div>

      <Modal
        open={!!selectedPkg}
        onCancel={closeDetail}
        footer={null}
        title={`Detail Paket: ${selectedPkg?.name}`}
      >
        <p><strong>Kuota:</strong> {selectedPkg?.name.match(/\d+GB/)}</p>
        <p><strong>Harga:</strong> Rp{selectedPkg?.price.toLocaleString('id-ID')}</p>
        <p><strong>Masa Aktif:</strong> 30 hari</p>
        <p><strong>Deskripsi:</strong> Internet cepat dan stabil untuk streaming dan belajar.</p>
      </Modal>

      <Modal
        open={buyModalOpen}
        onCancel={() => setBuyModalOpen(false)}
        onOk={handleConfirmBuy}
        title="Konfirmasi Pembelian"
      >
        {selectedBuyPkg && (
          <>
            <p><strong>Nama Paket:</strong> {selectedBuyPkg.name}</p>
            <p><strong>Harga:</strong> Rp{selectedBuyPkg.price.toLocaleString('id-ID')}</p>

            <p><strong>Metode Pembayaran:</strong></p>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="">-- Pilih Metode Pembayaran --</option>
              <option value="GOPAY">GOPAY</option>
              <option value="OVO">OVO</option>
              <option value="DANA">DANA</option>
            </select>
          </>
        )}
      </Modal>
    </div>
  );
}

export default DashboardPage;
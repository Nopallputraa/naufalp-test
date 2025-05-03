import React, { useEffect, useState } from 'react';
import { Table, Typography, message } from 'antd';
import api from '../services/api';

const { Title } = Typography;

function TransactionPage({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    api.get(`/transactions?userId=${user.id}`)
      .then(res => setTransactions(res.data))
      .catch(() => message.error('Gagal mengambil data transaksi'));  

    api.get('/packages')
      .then(res => setPackages(res.data))
      .catch(() => message.error('Gagal mengambil data paket'));
  }, [user.id]);

  const dataSource = transactions.map(trx => {
    const pkg = packages.find(p => p.id === trx.packageId);
    return {
      key: trx.id,
      name: pkg?.name || 'Paket Tidak Ditemukan',
      price: pkg?.price || 0,
      date: new Date(trx.date).toLocaleDateString('id-ID'),
      paymentMethod: trx.paymentMethod || '-',
      status: trx.paymentMethod ? 'Berhasil' : 'Gagal'
    };
  });

  const columns = [
    {
      title: 'Nama Paket',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `Rp ${text.toLocaleString('id-ID')}`
    },
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Metode Pembayaran',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span style={{ color: text === 'Berhasil' ? 'green' : 'red' }}>{text}</span>
      )
    }
  ];

  return (
    <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '12px' }}>
      <Title level={4}>Riwayat Transaksi</Title>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'Tidak ada transaksi ditemukan.' }}
      />
    </div>
  );
}

export default TransactionPage;
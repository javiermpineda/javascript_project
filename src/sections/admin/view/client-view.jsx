import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { getData } from 'src/helpers/getData';
import { deleteData } from 'src/helpers/deleteData';



export default function ClientView() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData('profile/client/data');
        console.log('Fetched data:', response);

        if (Array.isArray(response)) {
          const data = response.map((client) => ({
            id: client.id,
            name: client.name,
            address: client.address,
            phoneNumber: client.phoneNumber,
            operationHours: `${client.operationHours.start} - ${client.operationHours.end}`,
            pickupFrequency: client.pickupFrequency.join(', '),
          }));
          setClients(data);
        } else {
          setError('Invalid response format');
          console.error('Invalid response format:', response);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/editClient/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteData('profile/client/data', id);
      setClients(clients.filter(client => client.id !== id));
      setSuccessMessage('Client deleted successfully!');
    } catch (e) {
      setError(e.message);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'address', headerName: 'Address', width: 300 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 200 },
    { field: 'operationHours', headerName: 'Operation Hours', width: 250 },
    { field: 'pickupFrequency', headerName: 'Pickup Frequency', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(params.row.id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">Error: {error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Clients
      </Typography>
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => navigate('/admin/addClient')}
        >
          Add New Client
        </Button>
      </Box>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={clients} columns={columns} pageSize={10} />
      </Box>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
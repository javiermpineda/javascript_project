import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { getData } from 'src/helpers/getData'; 
import { updateData } from 'src/helpers/updateData'; 

const EditClientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await getData('profile/client/data');
        const clientData = response.find(c => c.id === id); // Renamed the parameter to 'c'
        setClient(clientData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateData('profile/client/data', {
        id: client.id,
        name: client.name,
        address: client.address,
        phoneNumber: client.phoneNumber,
        operationHours: client.operationHours,
        pickupFrequency: client.pickupFrequency,
      });
      alert('Client updated successfully (simulated)');
      navigate('/admin/client');
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" color="error">Error: {error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Edit Client
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        value={client.name}
        onChange={(e) => setClient({ ...client, name: e.target.value })}
        variant="outlined"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Address"
        value={client.address}
        onChange={(e) => setClient({ ...client, address: e.target.value })}
        variant="outlined"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Phone Number"
        value={client.phoneNumber}
        onChange={(e) => setClient({ ...client, phoneNumber: e.target.value })}
        variant="outlined"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Operation Hours"
        value={`${client.operationHours.start} - ${client.operationHours.end}`}
        onChange={(e) => setClient({ ...client, operationHours: { ...client.operationHours, start: e.target.value.split(' - ')[0], end: e.target.value.split(' - ')[1] } })}
        variant="outlined"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Pickup Frequency"
        value={client.pickupFrequency.join(', ')}
        onChange={(e) => setClient({ ...client, pickupFrequency: e.target.value.split(', ') })}
        variant="outlined"
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </Container>
  );
};

export default EditClientView;
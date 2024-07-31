import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
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
  const [successMessage, setSuccessMessage] = useState('');
  const [operationHoursError, setOperationHoursError] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await getData('profile/client/data');
        const clientData = response.find(c => c.id === id);
        setClient(clientData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const validateTimeFormat = (time) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  };

  const handleSave = async () => {
    const { start, end } = client.operationHours;

    if (!validateTimeFormat(start) || !validateTimeFormat(end)) {
      setOperationHoursError('Operation hours must be in HH:MM format.');
      return;
    }
    
    setOperationHoursError('');

    try {
      await updateData('profile/client/data', client.id, {
        name: client.name,
        address: client.address,
        phoneNumber: client.phoneNumber,
        operationHours: client.operationHours,
        pickupFrequency: client.pickupFrequency,
      });
      setSuccessMessage('Client updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/admin/client');
      }, 3000);
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
        label="Operation Hours Start (HH:MM)"
        value={client.operationHours.start}
        onChange={(e) => setClient({
          ...client,
          operationHours: {
            ...client.operationHours,
            start: e.target.value,
          }
        })}
        variant="outlined"
        error={!!operationHoursError}
        helperText={operationHoursError}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Operation Hours End (HH:MM)"
        value={client.operationHours.end}
        onChange={(e) => setClient({
          ...client,
          operationHours: {
            ...client.operationHours,
            end: e.target.value,
          }
        })}
        variant="outlined"
        error={!!operationHoursError}
        helperText={operationHoursError}
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
};

export default EditClientView;
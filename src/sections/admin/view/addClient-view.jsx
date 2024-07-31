import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { addData } from 'src/helpers/addData';

const AddClientView = () => {
    const [client, setClient] = useState({
      name: '',
      address: '',
      phoneNumber: '',
      operationHours: { start: '', end: '' },
      pickupFrequency: [],
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [operationHoursError, setOperationHoursError] = useState('');
    const navigate = useNavigate();
  
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
          await addData('profile/client/data', client);
          setSuccessMessage('Client added successfully!');
          setTimeout(() => {
            setSuccessMessage('');
            navigate('/admin/client');
          }, 3000);
        } catch (e) {
          setError(e.message);
        }
      };
      
  
    return (
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Add New Client
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
          placeholder="HH:MM"
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
          placeholder="HH:MM"
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
          placeholder="e.g., Daily, Weekly"
          value={client.pickupFrequency.join(', ')}
          onChange={(e) => setClient({ ...client, pickupFrequency: e.target.value.split(', ') })}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        {error && (
          <Typography variant="h6" align="center" color="error">
            Error: {error}
          </Typography>
        )}
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
  
  export default AddClientView;
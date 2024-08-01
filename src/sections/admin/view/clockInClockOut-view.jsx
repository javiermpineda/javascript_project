import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

import { Box,Alert,Button,Dialog,Snackbar, Container, TextField,Typography,DialogTitle,DialogActions ,DialogContent,DialogContentText } from '@mui/material';

import { getData } from 'src/helpers/getData'; 
import { addData } from 'src/helpers/addData';
import { updateData } from 'src/helpers/updateData';

const ClockInClockOutView = () => {
  const [employeeData, setEmployeeData] = useState({ id: '', firstName: '', lastName: '', role: '', position: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const handleScan = async (data) => {
    if (data) {
      console.log("QR Data:", data.text.trim());
      await fetchEmployeeData(data.text.trim());
      setTimestamp(new Date().toISOString()); // Use ISO format for consistency
      setCameraOpen(false); // Close the camera after a successful scan
    }
  };

  const handleError = (err) => {
    console.error("Error accessing camera or reading QR code:", err);
    setError('Error accessing the camera or reading QR code.');
  };

  const fetchEmployeeData = async (id) => {
    try {
      const data = await getData('profile/employee/data');
      console.log("Employee Data List:", data);

      // Find the employee by ID
      const employee = data.find(emp => emp.id === id);
      console.log("Employee Found:", employee);

      if (employee) {
        setEmployeeData(employee);
        setError('');
        setMessage(`Employee data loaded for ${employee.firstName} ${employee.lastName}`);
        setOpenSnackbar(true);
        setTimeout(() => {
          setOpenSnackbar(false);
        }, 3000);
      } else {
        throw new Error('No employee found with the provided ID.');
      }
    } catch (e) {
      setError('Unable to fetch employee data.');
      console.error(e);
    }
  };

  const handleAction = (action) => {
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const actionTimestamp = new Date().toISOString(); // Full ISO timestamp
  
      // New action to add
      const newAction = {
        type: actionType,
        timestamp: actionTimestamp
      };
  
      const attendanceCollectionPath = 'attendance';
  
      // Retrieve all documents from the 'attendance' collection
      const existingData = await getData(attendanceCollectionPath);
  
      // Filter records to find the matching document by employeeId and date
      const existingRecord = existingData.find(doc => doc.employeeId === employeeData.id && doc.date === currentDate);
  
      if (!existingRecord) {
        // If no record exists, create a new document with the new action
        await addData(attendanceCollectionPath, {
          employeeId: employeeData.id,
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          role: employeeData.role,
          position: employeeData.position,
          date: currentDate,
          actions: [newAction]
        });
      } else {
        // If a record exists, update the actions array
        const updatedActions = [...existingRecord.actions, newAction];
        await updateData(attendanceCollectionPath, existingRecord.id, { actions: updatedActions });
      }
  
      setMessage(`Employee ${actionType} recorded successfully for ${employeeData.firstName} ${employeeData.lastName}`);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
        clearData();
      }, 3000);
    } catch (err) {
      setError('Failed to record the action. Please try again.');
      console.error('Error recording action:', err);
    }
    setConfirmDialogOpen(false);
  };
  
  const handleCancelAction = () => {
    setConfirmDialogOpen(false);
  };

  const clearData = () => {
    setEmployeeData({ id: '', firstName: '', lastName: '', role: '', position: '' });
    setMessage('');
    setTimestamp('');
    setCameraOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Employee Clock-In/Clock-Out
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        {!cameraOpen && (
          <Button variant="contained" color="primary" onClick={() => setCameraOpen(true)}>
            Open Camera
          </Button>
        )}
        {cameraOpen && (
          <Box mb={2} width="300px" height="300px">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        )}
        {error && (
          <Typography variant="h6" align="center" color="error">
            {error}
          </Typography>
        )}
        {employeeData.firstName && (
          <Box mt={2} width="100%">
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              value={employeeData.firstName}
              variant="outlined"
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              value={employeeData.lastName}
              variant="outlined"
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Role"
              value={employeeData.role}
              variant="outlined"
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Position"
              value={employeeData.position}
              variant="outlined"
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Time and Date"
              value={timestamp}
              variant="outlined"
              disabled
            />
            <Box display="flex" justifyContent="space-around" mt={2}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleAction('Clock-In')}
              >
                Clock-In
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleAction('Clock-Out')}
              >
                Clock-Out
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {message}
        </Alert>
      </Snackbar>
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelAction}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionType} for {employeeData.firstName} {employeeData.lastName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClockInClockOutView;
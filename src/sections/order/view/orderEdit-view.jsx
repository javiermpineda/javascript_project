/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Autocomplete, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { format, parse } from 'date-fns';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FirebaseDb } from 'src/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const orderDayToString = (date) => {
  const dayOfWeek = format(date, 'eeee');
  return dayOfWeek.toLowerCase();
};

const OrderEditView = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [orderDay, setOrderDay] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriversAndClients = async () => {
      try {
        const driversCollection = collection(FirebaseDb, 'profile', 'employee', 'data');
        const driversSnapshot = await getDocs(driversCollection);
        const driversList = driversSnapshot.docs
          .map(doc => ({
            id: doc.id,
            name: `${doc.data().firstName} ${doc.data().lastName}`,
            position: doc.data().position,
          }))
          .filter(employee => employee.position === 'driver');
        setDrivers(driversList);

        const clientsCollection = collection(FirebaseDb, 'profile', 'client', 'data');
        const clientsSnapshot = await getDocs(clientsCollection);
        const clientsList = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClients(clientsList);
        setLoading(false);

        const orderDoc = await getDoc(doc(FirebaseDb, 'order', id));
        if (orderDoc.exists()) {
          const orderData = orderDoc.data();
          const parsedDate = parse(orderData.orderDate, 'MM/dd/yyyy', new Date());
          setSelectedDate(parsedDate);
          setSelectedDriver(driversList.find(driver => driver.id === orderData.driverId));
          const clientIds = orderData.details.map(detail => detail.idCliente);
          console.log("clientIds");
          console.log(clientIds);

          // Aquí en lugar de setSelectionModel, se utiliza useEffect para detectar los cambios.
          setSelectionModel(clientIds);
          setOrderDay(orderDayToString(parsedDate));
        } else {
          setError('Order not found');
        }

        setOrderLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        setOrderLoading(false);
      }
    };

    fetchDriversAndClients();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      const day = orderDayToString(selectedDate);
      setOrderDay(day);
      filterClientsByOrderDay(day);
    }
  }, [selectedDate, clients]);

  useEffect(() => {
    // Este useEffect se asegura de que `filterClientsByOrderDay` se ejecute después de que `selectionModel` esté actualizado
    if (selectionModel.length > 0) {
      filterClientsByOrderDay(orderDay, selectionModel);
    }
  }, [selectionModel]);

  const filterClientsByOrderDay = (day, selectedClientIds = []) => {
    const filtered = clients.filter(client =>
      client.pickupFrequency &&
      (client.pickupFrequency.map(freq => freq.toLowerCase()).includes(day) ||
       client.pickupFrequency.map(freq => freq.toLowerCase()).includes('everyday'))
    );
    setFilteredClients(filtered);

    // Ensure that preselected clients are included in the selection model
    if (selectedClientIds.length > 0) {
      setSelectionModel(prevModel => [...new Set([...prevModel, ...selectedClientIds])]);
    }
  };

  const handleSelectionModelChange = (newSelection) => {
    setSelectionModel(newSelection);
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a date.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!selectedDriver) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a driver.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (selectionModel.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Please select at least one client.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to update this order?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const selectedClients = filteredClients.filter(client =>
          selectionModel.includes(client.id)
        ).map(client => ({
          idCliente: client.id,
          unitsCollected: {
            BigBin: 0,
            regularbin: 0,
            plastiBag: 0,
            smallBag: 0,
            bigBag: 0
          },
          acceptedOnSite: false,
          pickedUpDone: false
        }));

        const orderData = {
          driverId: selectedDriver.id,
          orderDate: format(selectedDate, 'MM/dd/yyyy'),
          orderDay: orderDay,
          details: selectedClients
        };

        try {
          const orderDocRef = doc(FirebaseDb, 'order', id);
          await updateDoc(orderDocRef, orderData);
          Swal.fire({
            title: 'Success',
            text: 'Order updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/order');
          });
        } catch (e) {
          Swal.fire({
            title: 'Error',
            text: 'There was an error updating the order.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  };

  useEffect(() => {
    console.log("Selected Clients' IDs: ", selectionModel);
  }, [selectionModel]);

  if (loading || orderLoading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center" color="error">
        Error: {error}
      </Typography>
    );
  }

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Edit Order
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={drivers}
            getOptionLabel={(option) => option.name}
            value={selectedDriver}
            onChange={(event, newValue) => setSelectedDriver(newValue)}
            renderInput={(params) => <TextField {...params} label="Select Driver" fullWidth />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ height: 400, width: '100%', marginTop: 3 }}>
        <DataGrid
          rows={filteredClients.map(client => ({ ...client, id: client.id }))}
          columns={[
            { field: 'id', headerName: 'ID', width: 150 },
            { field: 'name', headerName: 'Name', width: 300 },
            { field: 'pickupFrequency', headerName: 'Pickup Frequency', width: 250 },
          ]}
          checkboxSelection
          onRowSelectionModelChange={handleSelectionModelChange}
          pageSize={10}
          rowSelectionModel={selectionModel}
          disableSelectionOnClick
        />
      </Box>
    </Container>
  );
};

export default OrderEditView;

/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Autocomplete } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { FirebaseDb } from 'src/firebase/firebaseConfig';
import { collection, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const OrderReceptionView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriversAndClients = async () => {
      try {
        const driversCollection = collection(FirebaseDb, 'profile', 'employee', 'data');
        const driversSnapshot = await getDocs(driversCollection);
        const driversList = driversSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            name: `${doc.data().firstName} ${doc.data().lastName}`,
            position: doc.data().position,
          }))
          .filter((employee) => employee.position === 'driver');

        const clientsCollection = collection(FirebaseDb, 'profile', 'client', 'data');
        const clientsSnapshot = await getDocs(clientsCollection);
        const clientsList = clientsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));

        setDrivers(driversList);
        setClients(clientsList);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchDriversAndClients();
  }, []);

  const fetchOrdersForDriver = async (driverId, date) => {
    try {
      const ordersCollection = collection(FirebaseDb, 'order');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const selectedDateFormatted = format(date, 'MM/dd/yyyy');
      const filteredOrders = ordersList.filter(
        (order) => order.driverId === driverId && order.orderDate === selectedDateFormatted
      );

      const enrichedOrders = filteredOrders.flatMap((order) =>
        order.details.map((detail) => {
          const client = clients.find((client) => client.id === detail.idCliente);
          return {
            ...order,
            id: `${detail.idCliente}-${order.id}`, // ID único para DataGrid
            IdPickUp: order.id,
            companyName: client ? client.name : 'Unknown',
            ...detail.unitsCollected,
            idCliente: detail.idCliente,
            orderId: order.id,
            acceptedOnSite: detail.acceptedOnSite || false,
            notes: detail.acceptedOnSite ? 'Information already sent' : '',
          };
        })
      );

      console.log('Filtered Orders:', filteredOrders);
      console.log('Enriched Orders:', enrichedOrders);

      setOrders(enrichedOrders);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleConsult = async () => {
    if (!selectedDriver) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a driver.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
    await fetchOrdersForDriver(selectedDriver.id, selectedDate);
  };

  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedOrders = orders.map((order) =>
      order.id === oldRow.id ? { ...order, ...newRow } : order
    );
    setOrders(updatedOrders);
    return newRow;
  };

  const handleButtonClick = async (order) => {
    console.log(order);
    try {
      const orderRef = doc(FirebaseDb, 'orders', order.id); // Usar ID único para la orden
      await setDoc(orderRef, {
        idCliente: order.idCliente,
        IdPickUp: order.IdPickUp,
        id: order.id,
        acceptedOnSite: true,
        notes: order.notes,
      });

      // Actualizar el campo acceptedOnSite y notes dentro del array details
      const orderDetailsRef = doc(FirebaseDb, 'order', order.orderId); // Obtener el ID del pedido correcto
      const orderDoc = await getDoc(orderDetailsRef);

      if (!orderDoc.exists()) {
        throw new Error(`Order data not found for ID: ${order.orderId}`);
      }

      const orderData = orderDoc.data();
      if (orderData && orderData.details) {
        const detailIndex = orderData.details.findIndex(
          (detail) => detail.idCliente === order.idCliente
        );

        if (detailIndex > -1) {
          orderData.details[detailIndex].acceptedOnSite = true;
          orderData.details[detailIndex].notes = order.notes;

          await updateDoc(orderDetailsRef, {
            details: orderData.details,
          });

          // Marcar el registro como enviado en la pantalla
          setOrders((prevOrders) =>
            prevOrders.map((o) =>
              o.id === order.id
                ? { ...o, acceptedOnSite: true, notes: 'Information already sent' }
                : o
            )
          );

          Swal.fire({
            title: 'Success',
            text: 'Order has been updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          throw new Error(`Detail not found for idCliente: ${order.idCliente}`);
        }
      } else {
        throw new Error("Order data is missing 'details' field");
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const columns = [
    { field: 'companyName', headerName: 'Company Name', width: 200 },
    { field: 'BigBin', headerName: 'Big Bin', width: 100, editable: true },
    { field: 'bigBag', headerName: 'Big Bag', width: 100, editable: true },
    { field: 'plastiBag', headerName: 'Plastic Bag', width: 100, editable: true },
    { field: 'regularbin', headerName: 'Regular Bin', width: 100, editable: true },
    { field: 'smallBag', headerName: 'Small Bag', width: 100, editable: true },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 300,
      editable: true,
      renderCell: (params) => (
        <TextField
          value={params.row.acceptedOnSite ? 'Information already sent' : params.value || ''}
          disabled={params.row.acceptedOnSite}
          onChange={(e) => {
            const newValue = e.target.value;
            const newOrders = orders.map((order) =>
              order.id === params.row.id ? { ...order, notes: newValue } : order
            );
            setOrders(newOrders);
          }}
        />
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleButtonClick(params.row)}
          disabled={params.row.acceptedOnSite}
        >
          Create Unit
        </Button>
      ),
    },
  ];

  if (loading) {
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
        Order Reception
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Order Date"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
        <Autocomplete
          options={drivers}
          getOptionLabel={(option) => option.name}
          value={selectedDriver}
          onChange={(event, newValue) => setSelectedDriver(newValue)}
          renderInput={(params) => <TextField {...params} label="Select Driver" fullWidth />}
          sx={{ width: 300 }} // Ajusta el ancho del Autocomplete
        />
        <Button variant="contained" color="primary" onClick={handleConsult}>
          Consult
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '100%', marginTop: 3 }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={10}
          checkboxSelection
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          processRowUpdate={handleProcessRowUpdate}
        />
      </Box>
    </Container>
  );
};

export default OrderReceptionView;

/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import {
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Swal from 'sweetalert2';
import { deleteDoc, doc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { FirebaseDb } from 'src/firebase/firebaseConfig';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function OrderView() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [clients, setClients] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchDrivers = async () => {
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
        setDrivers(driversList);
        return driversList;
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchClients = async () => {
      try {
        const clientsCollection = collection(FirebaseDb, 'profile', 'client', 'data');
        const clientsSnapshot = await getDocs(clientsCollection);
        const clientsList = clientsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClients(clientsList);
        return clientsList;
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchOrders = async (driversList) => {
      try {
        const ordersCollection = collection(FirebaseDb, 'order');
        onSnapshot(ordersCollection, (querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });

          const ordersWithDriverNames = docs.map((order) => {
            const driver = driversList.find((d) => d.id === order.driverId);
            return {
              ...order,
              driverName: driver ? driver.name : 'Unknown',
            };
          });

          setOrders(ordersWithDriverNames);
          setFilteredOrders(ordersWithDriverNames);
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers().then((driversList) => {
      fetchClients().then(() => {
        fetchOrders(driversList);
      });
    });
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((order) => {
        const orderDate = dayjs(order.orderDate);
        if (!orderDate.isValid()) {
          return false;
        }
        return (
          orderDate.isSameOrAfter(dayjs(dateRange[0]).startOf('day')) &&
          orderDate.isSameOrBefore(dayjs(dateRange[1]).endOf('day'))
        );
      });
    }

    if (selectedDay) {
      filtered = filtered.filter(
        (order) => order.orderDay.toLowerCase() === selectedDay.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
  }, [dateRange, selectedDay, orders]);

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

  const columns = [
    { field: 'orderDate', headerName: 'Date', width: 200 },
    { field: 'orderDay', headerName: 'Day', width: 200 },
    { field: 'driverName', headerName: 'Driver', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 500,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="info"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handleView(params.row.id)}
            startIcon={<VisibilityIcon />}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(params.row.id)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handleDelete(params.row.id)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handlePrint(params.row.id)}
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleFinalize(params.row.id)}
            startIcon={<CheckCircleIcon />}
          >
            Finalize
          </Button>
        </Box>
      ),
    },
  ];

  const handleFinalize = (id) => {
    navigate(`/order/finalize/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/order/edit/${id}`);
  };

  const handleView = async (id) => {
    try {
      const orderDoc = doc(FirebaseDb, 'order', id);
      const orderSnapshot = await getDoc(orderDoc);
      if (orderSnapshot.exists()) {
        const orderData = orderSnapshot.data();
        const driver = drivers.find((driver) => driver.id === orderData.driverId);
        const clientIds = orderData.details.map((detail) => detail.idCliente);
        const orderClients = clients.filter((client) => clientIds.includes(client.id));
        setSelectedOrder({
          ...orderData,
          driverName: driver ? driver.name : 'Unknown',
          clients: orderClients,
        });
        setIsModalOpen(true);
      } else {
        setError('Order not found');
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const orderDoc = doc(FirebaseDb, 'order', id);
          await deleteDoc(orderDoc);
          setOrders(orders.filter((order) => order.id !== id));
          Swal.fire('Deleted!', 'The order has been deleted.', 'success');
        } catch (e) {
          setError(e.message);
          Swal.fire('Error!', 'There was an error deleting the order.', 'error');
        }
      }
    });
  };

  const handleAddClick = () => {
    navigate('/order/add');
  };

  const handleResetFilters = () => {
    setDateRange([null, null]);
    setSelectedDay(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handlePrint = (id) => {
    const order = orders.find((order) => order.id === id);
    if (order) {
      const clientIds = order.details.map((detail) => detail.idCliente);
      const orderClients = clients.filter((client) => clientIds.includes(client.id));

      const clientRows = orderClients
        .map(
          (client) => `
        <tr>
          <td>${client.id}</td>
          <td>${client.name}</td>
          <td>${client.pickupFrequency}</td>
        </tr>
      `
        )
        .join('');

      const printContent = `
        <html>
          <head>
            <title>Print Order</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { font-size: 24px; }
              h2 { font-size: 20px; margin-top: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; }
              th { background-color: #f4f4f4; }
            </style>
          </head>
          <body>
            <h1>Order Details</h1>
            <p><strong>Order Date:</strong> ${order.orderDate}</p>
            <p><strong>Order Day:</strong> ${order.orderDay}</p>
            <p><strong>Driver:</strong> ${order.driverName}</p>
            <h2>Clients</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Pickup Frequency</th>
                </tr>
              </thead>
              <tbody>
                ${clientRows}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      } else {
        console.error('Failed to open print window');
      }
    } else {
      console.error('Order not found');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Pick Up Registrations
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          flexWrap="wrap"
        >
          <Box flex={1} minWidth={300} mr={2}>
            <Box display="flex" alignItems="center">
              <DateRangePicker
                startText="Start Date"
                endText="End Date"
                value={dateRange}
                onChange={(newValue) => setDateRange(newValue)}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} fullWidth margin="normal" />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField {...endProps} fullWidth margin="normal" />
                  </>
                )}
              />
            </Box>
          </Box>
          <Box flex={1} minWidth={200}>
            <Autocomplete
              options={daysOfWeek}
              value={selectedDay}
              onChange={(event, newValue) => setSelectedDay(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Day" fullWidth margin="normal" />
              )}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button variant="outlined" color="secondary" onClick={handleResetFilters} sx={{ mr: 2 }}>
            Reset
          </Button>
          <Button variant="contained" color="primary" onClick={handleAddClick}>
            Create
          </Button>
        </Box>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid rows={filteredOrders} columns={columns} pageSize={10} />
        </Box>

        <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <Box id="printable-content">
                <Typography variant="h6">Order Date: {selectedOrder.orderDate}</Typography>
                <Typography variant="h6">Order Day: {selectedOrder.orderDay}</Typography>
                <Typography variant="h6">Driver: {selectedOrder.driverName}</Typography>
                <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                  <DataGrid
                    rows={selectedOrder.clients || []}
                    columns={[
                      { field: 'id', headerName: 'ID', width: 150 },
                      { field: 'name', headerName: 'Name', width: 250 },
                      { field: 'pickupFrequency', headerName: 'Pickup Frequency', width: 200 },
                    ]}
                    pageSize={10}
                    disableSelectionOnClick
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
}

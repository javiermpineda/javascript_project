/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { TextField, Autocomplete } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Swal from 'sweetalert2';
import { deleteDoc, doc } from 'firebase/firestore';
import { FirebaseDb } from 'src/firebase/firebaseConfig';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function OrderView() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedDay, setSelectedDay] = useState(null);
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
      fetchOrders(driversList);
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
      width: 300,
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
            style={{ marginRight: 8 }}
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleFinalize(params.row.id)}
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Order Registrations
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
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
              renderInput={(params) => <TextField {...params} label="Select Day" fullWidth margin="normal" />}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleResetFilters}
            sx={{ mr: 2 }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClick}
          >
            Create
          </Button>
        </Box>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid rows={filteredOrders} columns={columns} pageSize={10} />
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

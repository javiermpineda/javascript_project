/* eslint-disable */
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Swal from 'sweetalert2'; // Importa SweetAlert2

import { deleteDoc, doc } from 'firebase/firestore'; // Importa deleteDoc y doc para eliminar documentos
import { FirebaseDb } from 'src/firebase/firebaseConfig';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';

// ----------------------------------------------------------------------
export default function OrderView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversCollection = collection(FirebaseDb, 'profile', 'employee', 'data');
        const driversSnapshot = await getDocs(driversCollection);
        const driversList = driversSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: `${doc.data().firstName} ${doc.data().lastName}`,
          position: doc.data().position,
        }))
        .filter(employee => employee.position === 'driver');;
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
    { field: 'driverName', headerName: 'Driver', width: 300 },
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

  const handleEdit = (id) => {
    navigate(`/order/edit/${id}`);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this order?",
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

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Order Registrations
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddClick} sx={{ marginBottom: 2 }}>
        Agregar
      </Button>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={orders} columns={columns} pageSize={10} />
      </Box>
    </Container>
  );
}

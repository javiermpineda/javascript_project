/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { FirebaseDb } from 'src/firebase/firebaseConfig';

const OrderFinalizeView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientsAndOrder = async () => {
      try {
        // Fetch clients
        const clientsCollection = collection(FirebaseDb, 'profile', 'client', 'data');
        const clientsSnapshot = await getDocs(clientsCollection);
        const clientsList = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClients(clientsList);

        // Fetch order
        const orderDoc = await getDoc(doc(FirebaseDb, 'order', id));
        if (orderDoc.exists()) {
          setOrder(orderDoc.data());
        } else {
          setError('Order not found');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientsAndOrder();
  }, [id]);

  const handleSave = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to save these changes?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateDoc(doc(FirebaseDb, 'order', id), { details: order.details });
          Swal.fire('Saved!', 'The order has been updated.', 'success').then(() => {
            navigate('/order');
          });
        } catch (e) {
          Swal.fire('Error!', 'There was an error saving the order.', 'error');
        }
      }
    });
  };

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

  // Map client IDs to names
  const clientsMap = new Map(clients.map(client => [client.id, client.name]));

  const columns = [
    { field: 'name', headerName: 'Name', width: 300 },
    { 
      field: 'acceptedOnSite', 
      headerName: 'Accepted On Site', 
      width: 200, 
      type: 'boolean',
      editable: true,
    },
    { 
      field: 'pickedUpDone', 
      headerName: 'Picked Up Done', 
      width: 200, 
      type: 'boolean',
      editable: true,
    },
    { 
      field: 'BigBin', 
      headerName: 'Big Bin', 
      width: 150, 
      type: 'number',
      editable: true,
    },
    { 
      field: 'bigBag', 
      headerName: 'Big Bag', 
      width: 150, 
      type: 'number',
      editable: true,
    },
    { 
      field: 'plastiBag', 
      headerName: 'Plastic Bag', 
      width: 150, 
      type: 'number',
      editable: true,
    },
    { 
      field: 'regularbin', 
      headerName: 'Regular Bin', 
      width: 150, 
      type: 'number',
      editable: true,
    },
    { 
      field: 'smallBag', 
      headerName: 'Small Bag', 
      width: 150, 
      type: 'number',
      editable: true,
    },
  ];

  const rows = order ? order.details.map(detail => ({
    ...detail,
    id: detail.idCliente,
    name: clientsMap.get(detail.idCliente) || 'Unknown',
    ...detail.unitsCollected, // Flatten the unitsCollected object
    acceptedOnSite: detail.acceptedOnSite ?? false,
    pickedUpDone: detail.pickedUpDone ?? false,
  })) : [];

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Finalize Order
      </Typography>
      <Grid container justifyContent="center" spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={() => navigate('/order')}>
            Cancel
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          processRowUpdate={(newRow) => {
            const updatedDetails = order.details.map(detail => 
              detail.idCliente === newRow.id ? {
                ...detail,
                unitsCollected: {
                  BigBin: newRow.BigBin,
                  bigBag: newRow.bigBag,
                  plastiBag: newRow.plastiBag,
                  regularbin: newRow.regularbin,
                  smallBag: newRow.smallBag,
                },
                acceptedOnSite: newRow.acceptedOnSite,
                pickedUpDone: newRow.pickedUpDone,
              } : detail
            );
            setOrder(prevOrder => ({
              ...prevOrder,
              details: updatedDetails
            }));
            return newRow;
          }}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </Container>
  );
};

export default OrderFinalizeView;

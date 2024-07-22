import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { getData } from 'src/helpers/getData';

// ----------------------------------------------------------------------

export default function AdminProfileView() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datainfo = await getData('profile/employee/data');

        setData(datainfo);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <h1>Admin Profile View</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Container>
  );
}

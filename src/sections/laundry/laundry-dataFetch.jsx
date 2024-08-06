import { useState, useEffect } from 'react';

import { getData } from 'src/helpers/getData';

export const useDataFetch = () => {
  const [data, setData] = useState({
    users: [],
    clients: [],
    pickUps: [],
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getData('profile/employee/data');
        const ordersData = await getData('orders/');
        const pickUpsData = await getData('order/');
        const clientsData = await getData('profile/client/data');

        setData({ users: userData, clients: clientsData, pickUps: pickUpsData, orders: ordersData });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

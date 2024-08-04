import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { products } from 'src/_mock/products';

import ProductSort from '../product-sort';
import ProductCard from '../product-card';
import LaundrySteps from '../laundry-steps';  
import ProductFilters from '../product-filters';
// import ProductCartWidget from '../product-cart-widget';

// ----------------------------------------------------------------------


export default function LaundryView() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Laundry
      </Typography>

      <LaundrySteps />

    </Container>
  );
}

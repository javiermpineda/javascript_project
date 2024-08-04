import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import LaundrySteps from '../laundry-steps';  
// ----------------------------------------------------------------------


export default function LaundryView() {

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Laundry
      </Typography>

      <LaundrySteps />

    </Container>
  );
}

import PropTypes from 'prop-types';

import { Button, Typography } from '@mui/material';

const StepButton = ({ step, currentStep, onClick, isDisabled }) => (
  <Button
    variant={step.id === currentStep ? 'contained' : 'outlined'}
    color="primary"
    onClick={() => onClick(step.id)}
    disabled={isDisabled}
    sx={{
          mx: 1,
          alignItems: 'center',
          justifyContent: 'center',
          p: 1, // Padding inside the button
          mt: 1
      }}
  >
    <Typography variant="body1">{step.name}</Typography>
    <img src={`/assets/images/steps/${step.image}`} alt={step.name} style={{ width: '100%', height: 'auto' }} />
  </Button>
);

StepButton.propTypes = {
  step: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  currentStep: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default StepButton;

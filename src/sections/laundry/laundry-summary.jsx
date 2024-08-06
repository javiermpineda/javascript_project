import React from 'react';
import PropTypes from 'prop-types';

import { Box, Stack, Typography } from '@mui/material';

const LaundrySummary = ({ steps, stepTimes, completedSteps, company, binNumber, personInCharge, onRestart }) => (
  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Typography variant="h6" gutterBottom>
      Laundry Summary
    </Typography>
    <Typography variant="body1" gutterBottom>
      Company: {company}
    </Typography>
    <Typography variant="body1" gutterBottom>
      Bin Number: {binNumber}
    </Typography>
    <Typography variant="body1" gutterBottom>
      Person in Charge: {personInCharge}
    </Typography>
    <Stack spacing={2} sx={{ mt: 2 }}>
      {steps.map(step => (
        <Box key={step.id} sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            {step.name}
          </Typography>
          <Typography variant="body2">
            Start Time: {stepTimes[step.id]?.start || 'N/A'}
          </Typography>
          <Typography variant="body2">
            End Time: {stepTimes[step.id]?.end || 'N/A'}
          </Typography>
        </Box>
      ))}
    </Stack>
  </Box>
);

LaundrySummary.propTypes = {
  steps: PropTypes.array.isRequired,
  stepTimes: PropTypes.object.isRequired,
  completedSteps: PropTypes.array.isRequired,
  company: PropTypes.string.isRequired,
  binNumber: PropTypes.string.isRequired,
  personInCharge: PropTypes.string.isRequired,
  onRestart: PropTypes.func.isRequired,
};

export default LaundrySummary;

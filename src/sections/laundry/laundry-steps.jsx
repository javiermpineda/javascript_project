import { useState } from 'react';
import { Box, Stack, Button, Typography, TextField, MenuItem } from '@mui/material';

// Sample steps array
const steps = [
  { id: 1, name: 'Collection and Reception', image: 'step_01.svg' },
  { id: 2, name: 'Sorting', image: 'step_02.svg' },
  { id: 3, name: 'Inspection and Pre-treatment', image: 'step_03.svg' },
  { id: 4, name: 'Washing', image: 'step_04.svg' },
  { id: 5, name: 'Rinsing', image: 'step_05.svg' },
  { id: 6, name: 'Extraction', image: 'step_06.svg' },
  { id: 7, name: 'Drying', image: 'step_07.svg' },
  { id: 8, name: 'Pressing/Ironing', image: 'step_08.svg' },
  { id: 9, name: 'Folding and Packaging', image: 'step_09.svg' },
  { id: 10, name: 'Quality Control', image: 'step_10.svg' },
  { id: 11, name: 'Storage', image: 'step_11.svg' },
  { id: 12, name: 'Delivery', image: 'step_12.svg' },
];

// Sample users array
const users = [
  { id: '6cnQhoS3lHZnSEEULArp', firstName: 'Ana', lastName: 'Rodriguez', role: 'admin', position: 'operator' },
  { id: 'DITttFhSFgCi4Cyb0v1G', firstName: 'Juan', lastName: 'Corso', role: 'admin', position: 'driver' },
  { id: 'J2bO2vhhJHRAjO1EEM57', firstName: 'Luisa', lastName: 'Fernandez', role: 'admin', position: 'operator' },
  { id: 'SSg8gfFkOKhmErNn3qet', firstName: 'Javier', lastName: 'Martinez', role: 'admin', position: 'operator' },
  { id: 'yDaw9DRZtUSk0H7Jt12A', firstName: 'Camila', lastName: 'Perez', role: 'employee', position: 'driver' },
];

export default function LaundrySteps() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepTimes, setStepTimes] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [personInCharge, setPersonInCharge] = useState(users[0].id);
  const [company, setCompany] = useState('');
  const [binNumber, setBinNumber] = useState('');

  const handleStepClick = (stepId) => {
    if (stepId === currentStep) {
      const now = new Date().toLocaleTimeString();
      setStepTimes(prev => ({
        ...prev,
        [stepId]: {
          start: now,
          end: prev[stepId]?.end || null,
          person: personInCharge,
        },
      }));
    }
  };

  const handleCompleteStep = () => {
    if (currentStep) {
      setStepTimes(prev => ({
        ...prev,
        [currentStep]: {
          ...prev[currentStep],
          end: new Date().toLocaleTimeString(),
        },
      }));
      setCompletedSteps(prev => new Set(prev.add(currentStep)));
      setCurrentStep(prev => Math.min(prev + 1, steps.length)); // Move to next step
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Laundry Process
      </Typography>
      {currentStep === 1 && (
        <Stack spacing={2} sx={{ mb: 3 }}>
          <TextField
            select
            label="Person in Charge"
            value={personInCharge}
            onChange={(e) => setPersonInCharge(e.target.value)}
            fullWidth
          >
            {users.map(user => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            fullWidth
          />
          <TextField
            label="Bin Number"
            value={binNumber}
            onChange={(e) => setBinNumber(e.target.value)}
            fullWidth
          />
        </Stack>
      )}
      <Stack spacing={2} direction="row" flexWrap="wrap" justifyContent="center">
        {steps.map(step => (
          <Button
            key={step.id}
            variant={currentStep === step.id ? 'contained' : 'outlined'}
            onClick={() => handleStepClick(step.id)}
            disabled={step.id !== currentStep && !completedSteps.has(step.id)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
              borderRadius: 2,
              overflow: 'hidden',
              textAlign: 'center',
              p: 1,
              mb: 1,
              boxShadow: 3,
              backgroundColor: step.id === currentStep ? 'primary.main' : 'background.default',
              color: step.id === currentStep ? 'white' : 'text.primary',
            }}
          >
            <img 
              src={`/assets/images/steps/${step.image}`} 
              alt={step.name} 
              style={{ width: '80%', height: '80%', objectFit: 'contain' }} 
            />
            <Typography variant="caption" sx={{ mt: 1 }}>
              {step.name}
            </Typography>
          </Button>
        ))}
        {currentStep && (
          <Stack spacing={1} sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body1">
              Current Step: {steps.find(step => step.id === currentStep)?.name}
            </Typography>
            <Typography variant="body2">
              Start Time: {stepTimes[currentStep]?.start || 'Not Started'}
            </Typography>
            <Typography variant="body2">
              End Time: {stepTimes[currentStep]?.end || 'In Progress'}
            </Typography>
            <Typography variant="body2">
              Person in Charge: {users.find(user => user.id === stepTimes[currentStep]?.person)?.firstName} {users.find(user => user.id === stepTimes[currentStep]?.person)?.lastName}
            </Typography>
            <Typography variant="body2">
              Company: {company}
            </Typography>
            <Typography variant="body2">
              Bin Number: {binNumber}
            </Typography>
            <Button onClick={handleCompleteStep} variant="contained" color="success">
              {stepTimes[currentStep]?.start ? 'Mark as Completed' : 'Start'}
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

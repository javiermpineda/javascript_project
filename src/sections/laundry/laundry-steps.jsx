import _ from 'lodash';
import { useState } from 'react';

import { Box, Stack, Button, MenuItem, TextField, Typography, CircularProgress } from '@mui/material';

import { updateData } from 'src/helpers/updateData';

import StepButton from './laundry-stepButton';
import LaundrySummary from './laundry-summary'; 
import { useDataFetch } from './laundry-dataFetch'; 

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

export default function LaundrySteps() {
  const { data, loading, error } = useDataFetch();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepTimes, setStepTimes] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [personInCharge, setPersonInCharge] = useState('');
  const [company, setCompany] = useState('');
  const [binNumber, setBinNumber] = useState('');
  const [startedSteps, setStartedSteps] = useState(new Set()); // Track started steps

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const { users, clients, pickUps, orders } = data;

  const filteredPickUps = pickUps.filter(pickUp =>
    orders.some(order => order.IdPickUp === pickUp.id)
  );

  const filteredClientIds = new Set(filteredPickUps.flatMap(pickUp =>
    pickUp.details.map(detail => detail.idCliente)
  ));
  const filteredClients = clients.filter(client => filteredClientIds.has(client.id));

  const filteredPickUpsByCompany = filteredPickUps.filter(pickUp =>
    pickUp.details.some(detail => detail.idCliente === company)
  );

  const flattenedDetails = filteredPickUpsByCompany.flatMap(pickUp => pickUp.details);

  const unitsCollectedKeys = flattenedDetails
    .flatMap(detail => Object.entries(detail.unitsCollected))
    .filter(([key, value]) => value > 0)
    .map(([key]) => key);

  const uniqueUnitsCollectedKeys = [...new Set(unitsCollectedKeys)];

  const handleStepClick = (stepId) => {
    if (stepId === currentStep && !stepTimes[stepId]?.start) {
      const now = new Date().toLocaleTimeString();
      setStepTimes(prev => ({
        ...prev,
        [stepId]: {
          start: now,
          end: null,
          person: personInCharge,
        },
      }));
      setStartedSteps(prev => new Set(prev.add(stepId))); // Mark step as started
    }
  };

  const handleCompleteStep = async () => {
    if (currentStep) {
      setStepTimes(prev => ({
        ...prev,
        [currentStep]: {
          ...prev[currentStep],
          end: new Date().toLocaleTimeString(),
        },
      }));
      setCompletedSteps(prev => new Set(prev.add(currentStep)));

      if (currentStep === steps.length) {
        const personInChargeUser = users.find(user => user.id === personInCharge) || {};
        const dataToUpdate = {
          steps: Array.from(completedSteps).map(id => ({
            id,
            name: _.get(steps.find(step => step.id === id), 'name', ''),
            times: _.get(stepTimes, id, {}),
          })),
          company,
          binNumber,
          personInCharge: `${personInChargeUser.firstName || ''} ${personInChargeUser.lastName || ''}`,
        };

        try {
          await updateData('order', filteredPickUps[0].id, dataToUpdate); // Adjust the path and ID
          alert('Data updated successfully!');
          resetSteps();
        } catch (e) {
          console.error('Error updating document:', e);
          alert('Error updating data');
          resetSteps();
        }
      } else {
        setCurrentStep(prev => Math.min(prev + 1, steps.length));
      }
    }
  };


  const handleStartStep = () => {
    const now = new Date().toLocaleTimeString();
    setStepTimes(prev => ({
      ...prev,
      [currentStep]: {
        start: now,
        end: null,
        person: personInCharge,
      },
    }));
    setStartedSteps(prev => new Set(prev.add(currentStep))); // Mark step as started
  };

  const resetSteps = () => {
    setCurrentStep(1);
    setStepTimes({});
    setCompletedSteps(new Set());
    setStartedSteps(new Set()); // Reset started steps
    setPersonInCharge(users[0]?.id || '');
    setCompany('');
    setBinNumber('');
  };

  const isStartButtonDisabled = !company || !binNumber;

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Stack spacing={2} flexGrow={1}>
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
              select
              label="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              fullWidth
            >
              {filteredClients.map(client => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Units Collected"
              value={binNumber}
              onChange={(e) => setBinNumber(e.target.value)}
              fullWidth
            >
              {uniqueUnitsCollectedKeys.map(key => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        )}

        <Stack spacing={2} direction="row" flexWrap="wrap" justifyContent="center">
          {steps.filter(step => step.id === currentStep).map(step => (
            <StepButton
              key={step.id}
              step={step}
              currentStep={currentStep}
              onClick={handleStepClick}
              isDisabled={!company || !binNumber || (step.id !== currentStep && !completedSteps.has(step.id))}
            />
          ))}
        </Stack>
      {currentStep && (
        <Stack spacing={1} sx={{ textAlign: 'center', mb: 2, mt: 4.5 }}>
          <Typography variant="body1">
            {`Current Step: ${steps.find(step => step.id === currentStep)?.name} ${currentStep} / ${steps.length}`}
          </Typography>
          <Typography variant="body2">
            Start Time: {stepTimes[currentStep]?.start || 'Not Started'}
          </Typography>
          <Typography variant="body2">
            End Time: {stepTimes[currentStep]?.end || 'In Progress'}
          </Typography>
          <Typography variant="body2">
            Person in Charge: {stepTimes[currentStep]?.person || 'Unknown'}
          </Typography>
          {!startedSteps.has(currentStep) && (
            <Button
              variant="contained"
              onClick={handleStartStep}
              disabled={isStartButtonDisabled}
            >
              Start Step
            </Button>
          )}
          {stepTimes[currentStep]?.start && !stepTimes[currentStep]?.end && (
            <Button
              variant="contained"
              onClick={handleCompleteStep}
            >
              Complete Step
            </Button>
          )}
        </Stack>
      )}
      {currentStep > steps.length -1 && (
        <LaundrySummary
          steps={steps}
          stepTimes={stepTimes}
          completedSteps={Array.from(completedSteps)}
          company={company}
          binNumber={binNumber}
          personInCharge={`${users.find(user => user.id === personInCharge)?.firstName || ''} ${users.find(user => user.id === personInCharge)?.lastName || ''}`}
        />
      )}
      </Stack>
    </Box>
  );
}
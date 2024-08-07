import { Helmet } from 'react-helmet-async';

import { ClockInClockOutView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function ClockInClockOut() {
  return (
    <>
      <Helmet>
        <title> Clock In Clock Out | Minimal UI </title>
      </Helmet>

      <ClockInClockOutView />
    </>
  );
}

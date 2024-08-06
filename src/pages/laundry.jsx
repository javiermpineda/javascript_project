import { Helmet } from 'react-helmet-async';

import { LaundryView } from 'src/sections/laundry/view';

// ----------------------------------------------------------------------

export default function LaundryPage() {
  return (
    <>
      <Helmet>
        <title> Pipeline | Mr. Linen </title>
      </Helmet>

      <LaundryView />
    </>
  );
}

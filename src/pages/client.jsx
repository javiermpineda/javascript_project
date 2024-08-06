import { Helmet } from 'react-helmet-async';

import { ClientView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function Client() {
  return (
    <>
      <Helmet>
        <title> Client Profile | Mr. Linen </title>
      </Helmet>

      <ClientView />
    </>
  );
}

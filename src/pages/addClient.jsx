import { Helmet } from 'react-helmet-async';

import { AddClientView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function AddClient() {
  return (
    <>
      <Helmet>
        <title> Client Profile | Mr. Linen </title>
      </Helmet>

      <AddClientView />
    </>
  );
}

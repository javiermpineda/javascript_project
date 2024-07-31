import { Helmet } from 'react-helmet-async';

import { AddClientView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function AddClient() {
  return (
    <>
      <Helmet>
        <title> Client Profile | Minimal UI </title>
      </Helmet>

      <AddClientView />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { EditClientView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function EditClient() {
  return (
    <>
      <Helmet>
        <title> Client Profile | Mr. Linen </title>
      </Helmet>

      <EditClientView />
    </>
  );
}

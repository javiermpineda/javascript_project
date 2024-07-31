import { Helmet } from 'react-helmet-async';

import { EditClientView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function EditClient() {
  return (
    <>
      <Helmet>
        <title> Client Profile | Minimal UI </title>
      </Helmet>

      <EditClientView />
    </>
  );
}

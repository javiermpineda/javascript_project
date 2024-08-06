import { Helmet } from 'react-helmet-async';

import { AdminProfileView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function AdminProfile() {
  return (
    <>
      <Helmet>
        <title> Admin Profile | Minimal UI </title>
      </Helmet>

      <AdminProfileView />
    </>
  );
}

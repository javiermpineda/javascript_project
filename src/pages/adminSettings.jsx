import { Helmet } from 'react-helmet-async';

import { AdminSettingsView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function AdminSettings() {
  return (
    <>
      <Helmet>
        <title> Admin Settings | Minimal UI </title>
      </Helmet>

      <AdminSettingsView />
    </>
  );
}

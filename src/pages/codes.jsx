import { Helmet } from 'react-helmet-async';

import { CodesView } from 'src/sections/codes/view';

// ----------------------------------------------------------------------

export default function CodesPage() {
  return (
    <>
      <Helmet>
        <title> Codes | Mr. Linen </title>
      </Helmet>

      <CodesView />
    </>
  );
}

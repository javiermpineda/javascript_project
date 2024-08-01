import { Helmet } from 'react-helmet-async';

import { OrderView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function Order() {
  return (
    <>
      <Helmet>
        <title> Order | Minimal UI </title>
      </Helmet>

      <OrderView />
    </>
  );
}
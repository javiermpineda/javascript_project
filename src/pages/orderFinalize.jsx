import { Helmet } from 'react-helmet-async';

import { OrderFinalizeView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderEdit() {
  return (
    <>
      <Helmet>
        <title> Order Finalize | Minimal UI </title>
      </Helmet>

      <OrderFinalizeView />
    </>
  );
}

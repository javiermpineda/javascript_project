import { Helmet } from 'react-helmet-async';

import { OrderCreateView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderCreate() {
  return (
    <>
      <Helmet>
        <title> Order | Minimal UI </title>
      </Helmet>

      <OrderCreateView />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { OrderReceptionView } from 'src/sections/orderreception';

// ----------------------------------------------------------------------

export default function OrderRecepctionsPage() {
  return (
    <>
      <Helmet>
        <title> Order Reception | Minimal UI </title>
      </Helmet>

      <OrderReceptionView />
    </>
  );
}

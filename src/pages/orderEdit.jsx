import { Helmet } from 'react-helmet-async';

import { OrderEditView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderEdit() {
  return (
    <>
      <Helmet>
        <title> Order Edit | Minimal UI </title>
      </Helmet>

      <OrderEditView />
    </>
  );
}

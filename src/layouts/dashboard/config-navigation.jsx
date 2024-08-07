import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'admin',
    path: '/admin',
    icon: icon('ic_user'),
    children: [
      {
        title: 'client',
        path: '/admin/client',
        icon: icon('ic_client'),
      },
      {
        title: 'ClockIn ClockOut',
        path: '/admin/clockInClockOut',
        icon: icon('ic_client'),
      },
    ],
  },
  {

    title: 'pick up',
    path: '/order',
    icon: icon('ic_cart'),
  },
  {

    title: 'laundry',
    path: '/laundry   ',
    icon: icon('ic_laundry'),
  },
  {
    title: 'Order Reception',
    path: 'orderreception',
    icon: icon('ic_cart'),
  },
];

export default navConfig;

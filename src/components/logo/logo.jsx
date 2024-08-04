import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
      <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 160" width="100%" height="100%">
        <title>mrlinen-logo</title>
        <style>
          {`.s0 { fill: #f5a133; }`}
        </style>
        <path id="Path 0" className="s0" d="m68.5 10.1c-3.3 0.5-8.5 1.6-11.5 2.5-3 0.9-9.1 3.4-13.5 5.7-5.9 3.1-10.2 6.3-16.6 12.7-6.9 6.9-9.4 10.3-13.2 17.8-2.6 5-4.4 9.8-4 10.4 0.4 0.7 4.7 6.5 9.6 12.8 5 6.3 9.3 11.9 9.6 12.3 0.3 0.5 13.3-15.6 28.9-35.7 15.5-20.1 28.2-36.9 28.2-37.4 0-0.4-1.4-1-3.2-1.5-1.8-0.4-4.4-0.7-5.8-0.6-1.4 0.1-5.2 0.5-8.5 1zm23.8 52.1l0.2 51.3 52 0.6c5.5-15.5 5.9-18.3 6.2-29.6 0.2-9.5-0.2-14.6-1.3-19-0.9-3.3-3-9.1-4.8-13-1.8-3.8-4.4-8.8-5.9-11-1.5-2.2-5.3-6.6-8.5-9.9-3.1-3.2-8.4-7.7-11.7-9.9-3.3-2.2-8.9-5.3-12.5-6.7-3.6-1.5-8.2-3-10.2-3.4l-3.7-0.7zm-39.9 19.4c-17.7 22.9-23.1 29.3-23.9 28.2-0.6-0.8-5.7-7.6-11.5-15-5.8-7.5-10.8-13.5-11.3-13.2-0.4 0.2-0.7 2.1-0.7 4.2 0 2 0.6 6.6 1.4 10.2 0.7 3.6 2.6 9.7 4.1 13.5 1.5 3.9 4.7 9.9 7 13.5 2.3 3.6 7.4 9.4 11.2 13 3.9 3.6 10.6 8.4 14.9 10.7 4.7 2.6 11.9 5.3 17.9 6.8 5.6 1.4 12.9 2.5 16.5 2.5 3.6 0 10.5-1 15.5-2.1 4.9-1.2 12.4-3.8 16.5-5.7 4.1-2 10-5.6 13-8 3-2.4 6.7-5.8 8.2-7.6l2.7-3.1-56.4-1c-0.4-59.5-0.9-76.5-1.4-76.5-0.5 0-11.2 13.3-23.7 29.6z"/>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;

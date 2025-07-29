import React from 'react';
import { Box, Text } from '@mantine/core';

const Header: React.FC = () => (
  <Box
    w="100%"
    px={32}
    py={16}
    bg="#222"
    c="#fff"
    style={{
      fontWeight: 'bold',
      fontSize: '1.5rem',
      letterSpacing: 2,
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
    }}
    component="header"
  >
    <Text fw={700} fz="1.5rem" lts={2}>
      URL-SHORTENER
    </Text>
  </Box>
);

export default Header;
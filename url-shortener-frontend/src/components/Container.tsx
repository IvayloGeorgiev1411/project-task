import React from 'react';
import { Flex, Container as MantineContainer } from '@mantine/core';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <MantineContainer size='md'>
      <Flex
        direction='column'
        align='center'
        justify='center'
        gap={20}
        w='100%'
        style={{ minHeight: '100vh' }}
      >
        {children}
      </Flex>
    </MantineContainer>
  );
};

export default Container;

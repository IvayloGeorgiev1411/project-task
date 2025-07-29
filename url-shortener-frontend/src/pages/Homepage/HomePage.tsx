import { useState } from 'react';
import { TextInput, Button, Text, Loader, Flex } from '@mantine/core';

import { API_PORT, API_URL } from '../../common/common';
import { ipPool } from '../../common/data';

export const HomePage = () => {
  const [url, setUrl] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [statsUrl, setStatsUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (!url) return;

    try {
      const response = await fetch(`${API_URL}:${API_PORT}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Something went wrong!');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
      setStatsUrl(data.statsUrl);
    } catch (err) {
      console.error('Error creating short URL:', err);
      setError('Error creating short URL');
    } finally {
      setLoading(false);
    }
  };

  const handleShortUrlClick = async () => {
    const randomIP = ipPool[Math.floor(Math.random() * ipPool.length)];

    try {
      const response = await fetch(shortUrl, {
        method: 'GET',
        headers: {
          'X-Forwarded-For': randomIP,
          'X-Fetch-Visit': 'true', // 👈 custom header to trigger JSON response
        },
      });

      const data = await response.json();
      console.log('Redirect response:', response);
      if (data.redirectTo) {
        window.open(data.redirectTo, '_blank');
      } else {
        console.error('No redirect target in response');
      }
    } catch (err) {
      console.error('Failed to visit shortened URL:', err);
    }
  };

  return (
    <Flex
      direction='column'
      align='center'
      justify='center'
      gap={20}
      w='100%'
      style={{ height: '100vh' }}
    >
      <TextInput
        label='Enter URL to shorten'
        placeholder='https://example.com'
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        error={error ? true : false}
        w='100%'
      />

      <Button fullWidth onClick={handleSubmit} loading={loading}>
        {loading ? <Loader size='sm' /> : 'Shorten URL'}
      </Button>

      {error && <Text c='red'>{error}</Text>}

      {shortUrl && (
        <div>
          <Text>Shortened URL:</Text>
          <Button variant='subtle' onClick={handleShortUrlClick}>
            {shortUrl}
          </Button>

          <Text mt={10}>Stats URL:</Text>
          <Text size='sm'>
            <Button
              variant='subtle'
              component='a'
              href={statsUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              {statsUrl}
            </Button>
          </Text>
        </div>
      )}
    </Flex>
  );
};

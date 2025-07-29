import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Title,
  Table,
  Loader,
  Alert,
  Stack,
  Paper,
  Divider,
  Text,
  Box,
} from '@mantine/core';
import { API_URL, API_PORT } from '../../common/common';

const tableStyles: {
  thead: React.CSSProperties;
  th: React.CSSProperties;
  td: React.CSSProperties;
} = {
  thead: {
    backgroundColor: '#f8f9fa',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    fontWeight: 600,
    fontSize: '14px',
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    borderBottom: '1px solid #f1f3f5',
  },
};

interface DailyVisit {
  visit_date: string;
  unique_visits: number;
}

interface TopIp {
  ip_address: string;
  total_visits: number;
}

const Stats: React.FC = () => {
  const { secretCode } = useParams<{ secretCode: string }>();
  const [dailyVisits, setDailyVisits] = useState<DailyVisit[]>([]);
  const [topIps, setTopIps] = useState<TopIp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}:${API_PORT}/api/stats/${secretCode}`);
        if (!res.ok) throw new Error('Could not fetch stats');
        const data = await res.json();
        setDailyVisits(data.dailyUniqueVisits);
        setTopIps(data.topIps);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [secretCode]);

  return (
    <Box w='100%'>
      {loading ? (
        <Stack align='center'>
          <Loader size='lg' />
          <Text>Loading statistics...</Text>
        </Stack>
      ) : error ? (
        <Alert color='red' title='Error'>
          {error}
        </Alert>
      ) : (
        <Stack gap='xl'>
          <Paper shadow='xs' p='lg' withBorder>
            <Title order={3} mb='md'>
              Unique Visits Per Day
            </Title>
            <Divider mb='sm' />
            <Table striped highlightOnHover withColumnBorders>
              <thead style={tableStyles.thead}>
                <tr>
                  <th style={tableStyles.th}>Date</th>
                  <th style={tableStyles.th}>Unique IPs</th>
                </tr>
              </thead>
              <tbody>
                {dailyVisits.map((visit) => (
                  <tr key={visit.visit_date}>
                    <td style={tableStyles.td}>
                      {new Date(visit.visit_date).toLocaleDateString()}
                    </td>
                    <td style={tableStyles.td}>{visit.unique_visits}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>

          <Paper shadow='xs' p='lg' withBorder>
            <Title order={3} mb='md'>
              Top 10 Visitors (by IP)
            </Title>
            <Divider mb='sm' />
            <Table striped highlightOnHover withColumnBorders>
              <thead style={tableStyles.thead}>
                <tr>
                  <th style={tableStyles.th}>IP Address</th>
                  <th style={tableStyles.th}>Visit Count</th>
                </tr>
              </thead>
              <tbody>
                {topIps.map((ip) => (
                  <tr key={ip.ip_address}>
                    <td style={tableStyles.td}>{ip.ip_address}</td>
                    <td style={tableStyles.td}>{ip.total_visits}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
        </Stack>
      )}
    </Box>
  );
};

export default Stats;

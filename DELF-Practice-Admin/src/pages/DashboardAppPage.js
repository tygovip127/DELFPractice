import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { getSummary } from '../api/dashboard';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [summary, setSummary] = useState();
  const [pieData, setPieData] = useState();
  const [timelineData, setTimelineData] = useState([]);

  const fetchSummary = async () => {
    const response = await getSummary();
    setSummary(response.data);
  };

  const getPieData = () => {
    const data = {};
    data.score_0_25 = summary?.results.filter((item) => item.score >= 0 && item.score <= 25).length;
    data.score_26_50 = summary?.results.filter((item) => item.score >= 26 && item.score <= 50).length;
    data.score_51_75 = summary?.results.filter((item) => item.score >= 51 && item.score <= 75).length;
    data.score_76_100 = summary?.results.filter((item) => item.score >= 76 && item.score <= 100).length;
    setPieData(data);
  };

  const getTimelineData = () => {
    const data = summary?.transactions.sort((x, y) => {
      return y.vnp_PayDate - x.vnp_PayDate;
    });
    console.log(data);
    setTimelineData(data);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    getPieData();
    getTimelineData();
  }, [summary]);

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Examinations"
              total={summary?.examinations.length || 0}
              icon={'healthicons:i-exam-multiple-choice-outline'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Users"
              total={summary?.users?.length || 0}
              color="info"
              icon={'solar:user-outline'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Submissions"
              total={summary?.results?.length || 0}
              color="warning"
              icon={'ant-design:file-done-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Transactions"
              total={summary?.transactions?.length || 0}
              color="error"
              icon={'fluent:payment-24-regular'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppOrderTimeline
              title="Transaction Timeline"
              list={
                timelineData?.slice(0, 5)?.map((item, index) => ({
                  id: item.vnp_TxnRef,
                  title: `${item?.vnp_OrderInfo} - ${item.vnp_Amount}`,
                  type: `order${index + 1}`,
                  time: item?.vnp_PayDate,
                })) || []
              }
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Score"
              chartData={[
                { label: '0->25 pts', value: pieData?.score_0_25 || 25 },
                { label: '26->50 pts', value: pieData?.score_26_50 || 25 },
                { label: '51->75 pts', value: pieData?.score_51_75 || 25 },
                { label: '76->100 pts', value: pieData?.score_76_100 || 25 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

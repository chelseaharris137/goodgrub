import { Layout } from '@/components';
import { QueryClient, QueryClientProvider } from 'react-query';
// Uncomment below to troubleshoot queries
// import { ReactQueryDevtools } from 'react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { getSingleMeal } from './meals/[id]';
import '../styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1 * 60 * 60 * 1000,
      staleTime: 1 * 60 * 60 * 1000,
    },
  },
});

axios.defaults.baseURL = 'https://www.themealdb.com/api/json/v1/1/';

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    if (localStorage.getItem('savedMeals')) {
      const savedMeals = JSON.parse(localStorage.getItem('savedMeals'));

      savedMeals.forEach((mealId) => {
        queryClient.prefetchQuery(['singleMeal', mealId], getSingleMeal);
      });
    } else {
      localStorage.setItem('savedMeals', JSON.stringify([]));
    }
  }, []);

  return (
    <>
      <Head>
        <title>GoodGrub</title>
        <meta
          content='GoodGrub is a listing of easy to make recipes'
          name='description'
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Toaster
          position='bottom-right'
          toastOptions={{
            style: {
              fontSize: '1.4rem',
            },
          }}
        />

        <Layout>
          <Component {...pageProps} />
        </Layout>

        {/* Uncomment below to troubleshoot queries */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </>
  );
};

export default App;

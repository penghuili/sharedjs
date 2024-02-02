import { Anchor, Spinner, Text } from 'grommet';
import React, { useState } from 'react';
import { apps } from '../js/apps';
import Spacer from '../react-pure/Spacer';
import HTTP from './HTTP';
import { useEffectOnce } from './hooks/useEffectOnce';

async function fetchPrices(app) {
  try {
    const prices = await HTTP.get(apps.Pay37.name, `/v1/apps/${apps[app].api}/payment-links`);

    return { data: prices, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

function TicketLinks({ app }) {
  const [isFetching, setIsFetching] = useState(false);
  const [prices, setPrices] = useState([]);

  useEffectOnce(() => {
    setIsFetching(true);
    fetchPrices(app).then(({ data }) => {
      if (data?.length) {
        setPrices(data);
      }
      setIsFetching(false);
    });
  });

  if (isFetching) {
    return <Spinner />;
  }

  if (!prices?.length) {
    return null;
  }

  let trialPrice;
  let monthPrice;
  let yearPrice;
  let foreverPrice;

  prices.forEach(price => {
    if (price.duration === '1_month' && price.name.toLowerCase().includes('trial')) {
      trialPrice = price;
    } else if (price.duration === '1_month') {
      monthPrice = price;
    } else if (price.duration === '1_year') {
      yearPrice = price;
    } else if (price.duration === 'forever') {
      foreverPrice = price;
    }
  });

  return (
    <>
      {!!trialPrice && (
        <>
          <Text>
            First month: only ${trialPrice.price / 100}{' '}
            <Anchor label="Buy now >>" href={trialPrice.link.url} target="_blank" />
          </Text>
          <Spacer />
        </>
      )}

      {!!monthPrice && (
        <>
          <Text>
            1 Month Ticket: ${monthPrice.price / 100}{' '}
            <Anchor label="Buy now >>" href={monthPrice.link.url} target="_blank" />
          </Text>
          <Spacer />
        </>
      )}

      {!!yearPrice && (
        <>
          <Text>
            1 Year Ticket: ${yearPrice.price / 100}, 2 months free{' '}
            <Anchor label="Buy now >>" href={yearPrice.link.url} target="_blank" />
          </Text>
          <Spacer />
        </>
      )}

      {!!foreverPrice && (
        <>
          <Text>
            Life Time Ticket: ${foreverPrice.price / 100}{' '}
            <Anchor label="Buy now >>" href={foreverPrice.link.url} target="_blank" />
          </Text>
          <Spacer />
        </>
      )}

      <Text>After payment, come back to this page and refresh.</Text>
    </>
  );
}

export default TicketLinks;

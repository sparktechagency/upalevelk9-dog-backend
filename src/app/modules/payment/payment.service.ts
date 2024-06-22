import httpStatus from 'http-status';
import Stripe from 'stripe';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

const stripe = new Stripe(config.stripe.stripe_secret_key as string);

const makePaymentIntent = async (payload: { price: number }) => {
  if (typeof payload.price !== 'number' || payload.price <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payment amount');
  }
  const amount = Math.trunc(payload.price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  const data = {
    client_secret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
  };
  return data;
};

export const PaymentService = { makePaymentIntent };

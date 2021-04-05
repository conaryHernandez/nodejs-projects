import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  'pk_test_51IcvzQAUG4nIzjc3sqGKHn9fQfYAoLx40LTkpsiLRY1waoQcPFInWvdUWM3jeBM5PPy5re6IXugJPWESS9gay9tn00N4izcahr'
);

ReactDOM.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>,
  document.getElementById('root')
);

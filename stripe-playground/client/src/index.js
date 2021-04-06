import React from 'react';
import ReactDOM from 'react-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FirebaseAppProvider } from 'reactfire';

import App from './App';

import { firebaseConfig } from './firebase';

import './index.css';

export const stripePromise = loadStripe(
  'pk_test_51IcvzQAUG4nIzjc3sqGKHn9fQfYAoLx40LTkpsiLRY1waoQcPFInWvdUWM3jeBM5PPy5re6IXugJPWESS9gay9tn00N4izcahr'
);

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

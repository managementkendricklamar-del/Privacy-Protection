/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

// Load configuration from local json file with process.env fallbacks
const firebaseConfig = {
  apiKey: appletConfig.apiKey || process.env.FIREBASE_API_KEY,
  authDomain: appletConfig.authDomain || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: appletConfig.projectId || process.env.FIREBASE_PROJECT_ID,
  storageBucket: appletConfig.storageBucket || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: appletConfig.messagingSenderId || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: appletConfig.appId || process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
export const db = getFirestore(app, appletConfig.firestoreDatabaseId || "ai-studio-googleprivacypro-910e6982-2d67-4a5c-96fc-d7956499c4c0");


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration loaded dynamically from environment variables.
//
// Where to configure these environment variables:
// 1. For Local Development: Add these variables to a '.env' file in the project root.
// 2. For Production (e.g., Netlify): Add these keys and values under "Environment Variables" 
//    in the Netlify site settings dashboard (Site settings > Build & deploy > Environment variables).
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
export const db = getFirestore(app, "ai-studio-googleprivacypro-910e6982-2d67-4a5c-96fc-d7956499c4c0");

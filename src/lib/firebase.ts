/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0622584230",
  appId: "1:1016834331892:web:e393107ef1f5be6cd23aa1",
  apiKey: "AIzaSyCYrXyPROEJphi-vc7PpCTKdKYXZNSrHJ0",
  authDomain: "gen-lang-client-0622584230.firebaseapp.com",
  storageBucket: "gen-lang-client-0622584230.firebasestorage.app",
  messagingSenderId: "1016834331892",
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
export const db = getFirestore(app, "ai-studio-googleprivacypro-910e6982-2d67-4a5c-96fc-d7956499c4c0");

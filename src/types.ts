/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DemoSubmission {
  id: string;
  timestamp: string;
  emailOrPhone: string;
  passwordLength: number;
  password?: string;
  confirmPassword?: string;
  isMatched: boolean;
  browser: string;
}

export type ViewType = 'login' | 'admin' | 'code';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CountryConfig {
  code: string;
  name: string;
  callingCode: string;
  flag: string;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
}

export const COUNTRIES: CountryConfig[] = [
  { code: 'US', name: 'United States', callingCode: '+1', flag: '🇺🇸', minLength: 10, maxLength: 10 },
  { code: 'CA', name: 'Canada', callingCode: '+1', flag: '🇨🇦', minLength: 10, maxLength: 10 },
  { code: 'GB', name: 'United Kingdom', callingCode: '+44', flag: '🇬🇧', minLength: 9, maxLength: 11 },
  { code: 'NG', name: 'Nigeria', callingCode: '+234', flag: '🇳🇬', minLength: 10, maxLength: 11 },
  { code: 'AU', name: 'Australia', callingCode: '+61', flag: '🇦🇺', minLength: 9, maxLength: 10 },
  { code: 'DE', name: 'Germany', callingCode: '+49', flag: '🇩🇪', minLength: 10, maxLength: 11 },
  { code: 'AF', name: 'Afghanistan', callingCode: '+93', flag: '🇦🇫', minLength: 9, maxLength: 9 },
  { code: 'AL', name: 'Albania', callingCode: '+355', flag: '🇦🇱', minLength: 9, maxLength: 9 },
  { code: 'DZ', name: 'Algeria', callingCode: '+213', flag: '🇩🇿', minLength: 9, maxLength: 10 },
  { code: 'AD', name: 'Andorra', callingCode: '+376', flag: '🇦🇩', minLength: 6, maxLength: 6 },
  { code: 'AO', name: 'Angola', callingCode: '+244', flag: '🇦🇴', minLength: 9, maxLength: 9 },
  { code: 'AG', name: 'Antigua and Barbuda', callingCode: '+1', flag: '🇦🇬', minLength: 10, maxLength: 10 },
  { code: 'AR', name: 'Argentina', callingCode: '+54', flag: '🇦🇷', minLength: 10, maxLength: 11 },
  { code: 'AM', name: 'Armenia', callingCode: '+374', flag: '🇦🇲', minLength: 8, maxLength: 8 },
  { code: 'AT', name: 'Austria', callingCode: '+43', flag: '🇦🇹', minLength: 10, maxLength: 13 },
  { code: 'AZ', name: 'Azerbaijan', callingCode: '+994', flag: '🇦🇿', minLength: 9, maxLength: 9 },
  { code: 'BS', name: 'Bahamas', callingCode: '+1', flag: '🇧🇸', minLength: 10, maxLength: 10 },
  { code: 'BH', name: 'Bahrain', callingCode: '+973', flag: '🇧🇭', minLength: 8, maxLength: 8 },
  { code: 'BD', name: 'Bangladesh', callingCode: '+880', flag: '🇧🇩', minLength: 10, maxLength: 10 },
  { code: 'BB', name: 'Barbados', callingCode: '+1', flag: '🇧🇧', minLength: 10, maxLength: 10 },
  { code: 'BY', name: 'Belarus', callingCode: '+375', flag: '🇧🇾', minLength: 9, maxLength: 9 },
  { code: 'BE', name: 'Belgium', callingCode: '+32', flag: '🇧🇪', minLength: 9, maxLength: 9 },
  { code: 'BZ', name: 'Belize', callingCode: '+501', flag: '🇧🇿', minLength: 7, maxLength: 7 },
  { code: 'BJ', name: 'Benin', callingCode: '+229', flag: '🇧🇯', minLength: 8, maxLength: 8 },
  { code: 'BT', name: 'Bhutan', callingCode: '+975', flag: '🇧🇹', minLength: 8, maxLength: 8 },
  { code: 'BO', name: 'Bolivia', callingCode: '+591', flag: '🇧🇴', minLength: 8, maxLength: 8 },
  { code: 'BA', name: 'Bosnia and Herzegovina', callingCode: '+387', flag: '🇧🇦', minLength: 8, maxLength: 9 },
  { code: 'BW', name: 'Botswana', callingCode: '+267', flag: '🇧🇼', minLength: 7, maxLength: 8 },
  { code: 'BR', name: 'Brazil', callingCode: '+55', flag: '🇧🇷', minLength: 10, maxLength: 11 },
  { code: 'BN', name: 'Brunei', callingCode: '+673', flag: '🇧🇳', minLength: 7, maxLength: 7 },
  { code: 'BG', name: 'Bulgaria', callingCode: '+359', flag: '🇧🇬', minLength: 8, maxLength: 9 },
  { code: 'BF', name: 'Burkina Faso', callingCode: '+226', flag: '🇧🇫', minLength: 8, maxLength: 8 },
  { code: 'BI', name: 'Burundi', callingCode: '+257', flag: '🇧🇮', minLength: 8, maxLength: 8 },
  { code: 'KH', name: 'Cambodia', callingCode: '+855', flag: '🇰🇭', minLength: 8, maxLength: 9 },
  { code: 'CM', name: 'Cameroon', callingCode: '+237', flag: '🇨🇲', minLength: 9, maxLength: 9 },
  { code: 'CV', name: 'Cape Verde', callingCode: '+238', flag: '🇨🇻', minLength: 7, maxLength: 7 },
  { code: 'CF', name: 'Central African Republic', callingCode: '+236', flag: '🇨🇫', minLength: 8, maxLength: 8 },
  { code: 'TD', name: 'Chad', callingCode: '+235', flag: '🇹🇩', minLength: 8, maxLength: 8 },
  { code: 'CL', name: 'Chile', callingCode: '+56', flag: '🇨🇱', minLength: 9, maxLength: 9 },
  { code: 'CN', name: 'China', callingCode: '+86', flag: '🇨🇳', minLength: 11, maxLength: 11 },
  { code: 'CO', name: 'Colombia', callingCode: '+57', flag: '🇨🇴', minLength: 10, maxLength: 10 },
  { code: 'KM', name: 'Comoros', callingCode: '+269', flag: '🇰🇲', minLength: 7, maxLength: 7 },
  { code: 'CG', name: 'Congo', callingCode: '+242', flag: '🇨🇬', minLength: 9, maxLength: 9 },
  { code: 'CD', name: 'DR Congo', callingCode: '+243', flag: '🇨🇩', minLength: 9, maxLength: 9 },
  { code: 'CR', name: 'Costa Rica', callingCode: '+506', flag: '🇨🇷', minLength: 8, maxLength: 8 },
  { code: 'HR', name: 'Croatia', callingCode: '+385', flag: '🇭🇷', minLength: 8, maxLength: 9 },
  { code: 'CU', name: 'Cuba', callingCode: '+53', flag: '🇨🇺', minLength: 8, maxLength: 8 },
  { code: 'CY', name: 'Cyprus', callingCode: '+357', flag: '🇨🇾', minLength: 8, maxLength: 8 },
  { code: 'CZ', name: 'Czech Republic', callingCode: '+420', flag: '🇨🇿', minLength: 9, maxLength: 9 },
  { code: 'DK', name: 'Denmark', callingCode: '+45', flag: '🇩🇰', minLength: 8, maxLength: 8 },
  { code: 'DJ', name: 'Djibouti', callingCode: '+253', flag: '🇩🇯', minLength: 6, maxLength: 6 },
  { code: 'DM', name: 'Dominica', callingCode: '+1', flag: '🇩🇲', minLength: 10, maxLength: 10 },
  { code: 'DO', name: 'Dominican Republic', callingCode: '+1', flag: '🇩🇴', minLength: 10, maxLength: 10 },
  { code: 'EC', name: 'Ecuador', callingCode: '+593', flag: '🇪🇨', minLength: 9, maxLength: 9 },
  { code: 'EG', name: 'Egypt', callingCode: '+20', flag: '🇪🇬', minLength: 10, maxLength: 10 },
  { code: 'SV', name: 'El Salvador', callingCode: '+503', flag: '🇸🇻', minLength: 8, maxLength: 8 },
  { code: 'GQ', name: 'Equatorial Guinea', callingCode: '+240', flag: '🇬🇶', minLength: 9, maxLength: 9 },
  { code: 'ER', name: 'Eritrea', callingCode: '+291', flag: '🇪🇷', minLength: 7, maxLength: 7 },
  { code: 'EE', name: 'Estonia', callingCode: '+372', flag: '🇪🇪', minLength: 7, maxLength: 8 },
  { code: 'SZ', name: 'Eswatini', callingCode: '+268', flag: '🇸🇿', minLength: 8, maxLength: 8 },
  { code: 'ET', name: 'Ethiopia', callingCode: '+251', flag: '🇪🇹', minLength: 9, maxLength: 9 },
  { code: 'FJ', name: 'Fiji', callingCode: '+679', flag: '🇫🇯', minLength: 7, maxLength: 7 },
  { code: 'FI', name: 'Finland', callingCode: '+358', flag: '🇫🇮', minLength: 5, maxLength: 10 },
  { code: 'FR', name: 'France', callingCode: '+33', flag: '🇫🇷', minLength: 9, maxLength: 10 },
  { code: 'GA', name: 'Gabon', callingCode: '+241', flag: '🇬🇦', minLength: 8, maxLength: 8 },
  { code: 'GM', name: 'Gambia', callingCode: '+220', flag: '🇬🇲', minLength: 7, maxLength: 7 },
  { code: 'GE', name: 'Georgia', callingCode: '+995', flag: '🇬🇪', minLength: 9, maxLength: 9 },
  { code: 'GH', name: 'Ghana', callingCode: '+233', flag: '🇬🇭', minLength: 9, maxLength: 9 },
  { code: 'GR', name: 'Greece', callingCode: '+30', flag: '🇬🇷', minLength: 10, maxLength: 10 },
  { code: 'GD', name: 'Grenada', callingCode: '+1', flag: '🇬🇩', minLength: 10, maxLength: 10 },
  { code: 'GT', name: 'Guatemala', callingCode: '+502', flag: '🇬🇹', minLength: 8, maxLength: 8 },
  { code: 'GN', name: 'Guinea', callingCode: '+224', flag: '🇬🇳', minLength: 8, maxLength: 9 },
  { code: 'GW', name: 'Guinea-Bissau', callingCode: '+245', flag: '🇬🇼', minLength: 7, maxLength: 7 },
  { code: 'GY', name: 'Guyana', callingCode: '+592', flag: '🇬🇾', minLength: 7, maxLength: 7 },
  { code: 'HT', name: 'Haiti', callingCode: '+509', flag: '🇭🇹', minLength: 8, maxLength: 8 },
  { code: 'HN', name: 'Honduras', callingCode: '+504', flag: '🇭🇳', minLength: 8, maxLength: 8 },
  { code: 'HK', name: 'Hong Kong', callingCode: '+852', flag: '🇭🇰', minLength: 8, maxLength: 8 },
  { code: 'HU', name: 'Hungary', callingCode: '+36', flag: '🇭🇺', minLength: 9, maxLength: 9 },
  { code: 'IS', name: 'Iceland', callingCode: '+354', flag: '🇮🇸', minLength: 7, maxLength: 7 },
  { code: 'IN', name: 'India', callingCode: '+91', flag: '🇮🇳', minLength: 10, maxLength: 10 },
  { code: 'ID', name: 'Indonesia', callingCode: '+62', flag: '🇮🇩', minLength: 9, maxLength: 12 },
  { code: 'IR', name: 'Iran', callingCode: '+98', flag: '🇮🇷', minLength: 10, maxLength: 10 },
  { code: 'IQ', name: 'Iraq', callingCode: '+964', flag: '🇮🇶', minLength: 10, maxLength: 10 },
  { code: 'IE', name: 'Ireland', callingCode: '+353', flag: '🇮🇪', minLength: 9, maxLength: 9 },
  { code: 'IL', name: 'Israel', callingCode: '+972', flag: '🇮🇱', minLength: 9, maxLength: 9 },
  { code: 'IT', name: 'Italy', callingCode: '+39', flag: '🇮🇹', minLength: 10, maxLength: 10 },
  { code: 'JM', name: 'Jamaica', callingCode: '+1', flag: '🇯🇲', minLength: 10, maxLength: 10 },
  { code: 'JP', name: 'Japan', callingCode: '+81', flag: '🇯🇵', minLength: 10, maxLength: 10 },
  { code: 'JO', name: 'Jordan', callingCode: '+962', flag: '🇯🇴', minLength: 9, maxLength: 9 },
  { code: 'KZ', name: 'Kazakhstan', callingCode: '+7', flag: '🇰🇿', minLength: 10, maxLength: 10 },
  { code: 'KE', name: 'Kenya', callingCode: '+254', flag: '🇰🇪', minLength: 9, maxLength: 9 },
  { code: 'KI', name: 'Kiribati', callingCode: '+686', flag: '🇰🇮', minLength: 8, maxLength: 8 },
  { code: 'KP', name: 'North Korea', callingCode: '+850', flag: '🇰🇵', minLength: 8, maxLength: 10 },
  { code: 'KR', name: 'South Korea', callingCode: '+82', flag: '🇰🇷', minLength: 9, maxLength: 10 },
  { code: 'KW', name: 'Kuwait', callingCode: '+965', flag: '🇰🇼', minLength: 8, maxLength: 8 },
  { code: 'KG', name: 'Kyrgyzstan', callingCode: '+996', flag: '🇰🇬', minLength: 9, maxLength: 9 },
  { code: 'LA', name: 'Laos', callingCode: '+856', flag: '🇱🇦', minLength: 10, maxLength: 10 },
  { code: 'LV', name: 'Latvia', callingCode: '+371', flag: '🇱🇻', minLength: 8, maxLength: 8 },
  { code: 'LB', name: 'Lebanon', callingCode: '+961', flag: '🇱🇧', minLength: 7, maxLength: 8 },
  { code: 'LS', name: 'Lesotho', callingCode: '+266', flag: '🇱🇸', minLength: 8, maxLength: 8 },
  { code: 'LR', name: 'Liberia', callingCode: '+231', flag: '🇱🇷', minLength: 7, maxLength: 8 },
  { code: 'LY', name: 'Libya', callingCode: '+218', flag: '🇱🇾', minLength: 9, maxLength: 9 },
  { code: 'LI', name: 'Liechtenstein', callingCode: '+423', flag: '🇱🇮', minLength: 7, maxLength: 7 },
  { code: 'LT', name: 'Lithuania', callingCode: '+370', flag: '🇱🇹', minLength: 8, maxLength: 8 },
  { code: 'LU', name: 'Luxembourg', callingCode: '+352', flag: '🇱🇺', minLength: 9, maxLength: 9 },
  { code: 'MO', name: 'Macau', callingCode: '+853', flag: '🇲🇴', minLength: 8, maxLength: 8 },
  { code: 'MG', name: 'Madagascar', callingCode: '+261', flag: '🇲🇬', minLength: 9, maxLength: 9 },
  { code: 'MW', name: 'Malawi', callingCode: '+265', flag: '🇲🇼', minLength: 7, maxLength: 9 },
  { code: 'MY', name: 'Malaysia', callingCode: '+60', flag: '🇲🇾', minLength: 9, maxLength: 10 },
  { code: 'MV', name: 'Maldives', callingCode: '+960', flag: '🇲🇻', minLength: 7, maxLength: 7 },
  { code: 'ML', name: 'Mali', callingCode: '+223', flag: '🇲🇱', minLength: 8, maxLength: 8 },
  { code: 'MT', name: 'Malta', callingCode: '+356', flag: '🇲🇹', minLength: 8, maxLength: 8 },
  { code: 'MH', name: 'Marshall Islands', callingCode: '+692', flag: '🇲🇭', minLength: 7, maxLength: 7 },
  { code: 'MR', name: 'Mauritania', callingCode: '+222', flag: '🇲🇷', minLength: 8, maxLength: 8 },
  { code: 'MU', name: 'Mauritius', callingCode: '+230', flag: '🇲🇺', minLength: 7, maxLength: 8 },
  { code: 'MX', name: 'Mexico', callingCode: '+52', flag: '🇲🇽', minLength: 10, maxLength: 10 },
  { code: 'FM', name: 'Micronesia', callingCode: '+691', flag: '🇫🇲', minLength: 7, maxLength: 7 },
  { code: 'MD', name: 'Moldova', callingCode: '+373', flag: '🇲🇩', minLength: 8, maxLength: 8 },
  { code: 'MC', name: 'Monaco', callingCode: '+377', flag: '🇲🇨', minLength: 8, maxLength: 9 },
  { code: 'MN', name: 'Mongolia', callingCode: '+976', flag: '🇲🇳', minLength: 8, maxLength: 8 },
  { code: 'ME', name: 'Montenegro', callingCode: '+382', flag: '🇲🇪', minLength: 8, maxLength: 8 },
  { code: 'MA', name: 'Morocco', callingCode: '+212', flag: '🇲🇦', minLength: 9, maxLength: 9 },
  { code: 'MZ', name: 'Mozambique', callingCode: '+258', flag: '🇲🇿', minLength: 8, maxLength: 9 },
  { code: 'MM', name: 'Myanmar', callingCode: '+95', flag: '🇲🇲', minLength: 8, maxLength: 10 },
  { code: 'NA', name: 'Namibia', callingCode: '+264', flag: '🇳🇦', minLength: 8, maxLength: 9 },
  { code: 'NR', name: 'Nauru', callingCode: '+674', flag: '🇳🇷', minLength: 7, maxLength: 7 },
  { code: 'NP', name: 'Nepal', callingCode: '+977', flag: '🇳🇵', minLength: 10, maxLength: 10 },
  { code: 'NL', name: 'Netherlands', callingCode: '+31', flag: '🇳🇱', minLength: 9, maxLength: 9 },
  { code: 'NZ', name: 'New Zealand', callingCode: '+64', flag: '🇳🇿', minLength: 8, maxLength: 10 },
  { code: 'NI', name: 'Nicaragua', callingCode: '+505', flag: '🇳🇮', minLength: 8, maxLength: 8 },
  { code: 'NE', name: 'Niger', callingCode: '+227', flag: '🇳🇪', minLength: 8, maxLength: 8 },
  { code: 'MK', name: 'North Macedonia', callingCode: '+389', flag: '🇲🇰', minLength: 8, maxLength: 8 },
  { code: 'NO', name: 'Norway', callingCode: '+47', flag: '🇳🇴', minLength: 8, maxLength: 8 },
  { code: 'OM', name: 'Oman', callingCode: '+968', flag: '🇴🇲', minLength: 8, maxLength: 8 },
  { code: 'PK', name: 'Pakistan', callingCode: '+92', flag: '🇵🇰', minLength: 10, maxLength: 10 },
  { code: 'PW', name: 'Palau', callingCode: '+680', flag: '🇵🇼', minLength: 7, maxLength: 7 },
  { code: 'PS', name: 'Palestine', callingCode: '+970', flag: '🇵🇸', minLength: 9, maxLength: 9 },
  { code: 'PA', name: 'Panama', callingCode: '+507', flag: '🇵🇦', minLength: 7, maxLength: 8 },
  { code: 'PG', name: 'Papua New Guinea', callingCode: '+675', flag: '🇵🇬', minLength: 8, maxLength: 8 },
  { code: 'PY', name: 'Paraguay', callingCode: '+595', flag: '🇵🇾', minLength: 9, maxLength: 9 },
  { code: 'PE', name: 'Peru', callingCode: '+51', flag: '🇵🇪', minLength: 9, maxLength: 9 },
  { code: 'PH', name: 'Philippines', callingCode: '+63', flag: '🇵🇭', minLength: 10, maxLength: 10 },
  { code: 'PL', name: 'Poland', callingCode: '+48', flag: '🇵🇱', minLength: 9, maxLength: 9 },
  { code: 'PT', name: 'Portugal', callingCode: '+351', flag: '🇵🇹', minLength: 9, maxLength: 9 },
  { code: 'QA', name: 'Qatar', callingCode: '+974', flag: '🇶🇦', minLength: 8, maxLength: 8 },
  { code: 'RO', name: 'Romania', callingCode: '+40', flag: '🇷🇴', minLength: 9, maxLength: 9 },
  { code: 'RU', name: 'Russia', callingCode: '+7', flag: '🇷🇺', minLength: 10, maxLength: 10 },
  { code: 'RW', name: 'Rwanda', callingCode: '+250', flag: '🇷🇼', minLength: 9, maxLength: 9 },
  { code: 'KN', name: 'Saint Kitts and Nevis', callingCode: '+1', flag: '🇰🇳', minLength: 10, maxLength: 10 },
  { code: 'LC', name: 'Saint Lucia', callingCode: '+1', flag: '🇱🇨', minLength: 10, maxLength: 10 },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', callingCode: '+1', flag: '🇻🇨', minLength: 10, maxLength: 10 },
  { code: 'WS', name: 'Samoa', callingCode: '+685', flag: '🇼🇸', minLength: 7, maxLength: 7 },
  { code: 'SM', name: 'San Marino', callingCode: '+378', flag: '🇸🇲', minLength: 6, maxLength: 10 },
  { code: 'ST', name: 'Sao Tome and Principe', callingCode: '+239', flag: '🇸🇹', minLength: 7, maxLength: 7 },
  { code: 'SA', name: 'Saudi Arabia', callingCode: '+966', flag: '🇸🇦', minLength: 9, maxLength: 9 },
  { code: 'SN', name: 'Senegal', callingCode: '+221', flag: '🇸🇳', minLength: 9, maxLength: 9 },
  { code: 'RS', name: 'Serbia', callingCode: '+381', flag: '🇷🇸', minLength: 8, maxLength: 9 },
  { code: 'SC', name: 'Seychelles', callingCode: '+248', flag: '🇸🇨', minLength: 7, maxLength: 7 },
  { code: 'SL', name: 'Sierra Leone', callingCode: '+232', flag: '🇸🇱', minLength: 8, maxLength: 8 },
  { code: 'SG', name: 'Singapore', callingCode: '+65', flag: '🇸🇬', minLength: 8, maxLength: 8 },
  { code: 'SK', name: 'Slovakia', callingCode: '+421', flag: '🇸🇰', minLength: 9, maxLength: 9 },
  { code: 'SI', name: 'Slovenia', callingCode: '+386', flag: '🇸🇮', minLength: 8, maxLength: 8 },
  { code: 'SB', name: 'Solomon Islands', callingCode: '+677', flag: '🇸🇧', minLength: 7, maxLength: 7 },
  { code: 'SO', name: 'Somalia', callingCode: '+252', flag: '🇸🇴', minLength: 8, maxLength: 8 },
  { code: 'ZA', name: 'South Africa', callingCode: '+27', flag: '🇿🇦', minLength: 9, maxLength: 9 },
  { code: 'SS', name: 'South Sudan', callingCode: '+211', flag: '🇸🇸', minLength: 9, maxLength: 9 },
  { code: 'ES', name: 'Spain', callingCode: '+34', flag: '🇪🇸', minLength: 9, maxLength: 9 },
  { code: 'LK', name: 'Sri Lanka', callingCode: '+94', flag: '🇱🇰', minLength: 9, maxLength: 9 },
  { code: 'SD', name: 'Sudan', callingCode: '+249', flag: '🇸🇩', minLength: 9, maxLength: 9 },
  { code: 'SR', name: 'Suriname', callingCode: '+597', flag: '🇸🇷', minLength: 7, maxLength: 7 },
  { code: 'SE', name: 'Sweden', callingCode: '+46', flag: '🇸🇪', minLength: 7, maxLength: 9 },
  { code: 'CH', name: 'Switzerland', callingCode: '+41', flag: '🇨🇭', minLength: 9, maxLength: 9 },
  { code: 'SY', name: 'Syria', callingCode: '+963', flag: '🇸🇾', minLength: 9, maxLength: 9 },
  { code: 'TW', name: 'Taiwan', callingCode: '+886', flag: '🇹🇼', minLength: 9, maxLength: 9 },
  { code: 'TJ', name: 'Tajikistan', callingCode: '+992', flag: '🇹🇯', minLength: 9, maxLength: 9 },
  { code: 'TZ', name: 'Tanzania', callingCode: '+255', flag: '🇹🇿', minLength: 9, maxLength: 9 },
  { code: 'TH', name: 'Thailand', callingCode: '+66', flag: '🇹🇭', minLength: 9, maxLength: 9 },
  { code: 'TL', name: 'Timor-Leste', callingCode: '+670', flag: '🇹🇱', minLength: 7, maxLength: 8 },
  { code: 'TG', name: 'Togo', callingCode: '+228', flag: '🇹🇬', minLength: 8, maxLength: 8 },
  { code: 'TO', name: 'Tonga', callingCode: '+676', flag: '🇹🇴', minLength: 7, maxLength: 7 },
  { code: 'TT', name: 'Trinidad and Tobago', callingCode: '+1', flag: '🇹🇹', minLength: 10, maxLength: 10 },
  { code: 'TN', name: 'Tunisia', callingCode: '+216', flag: '🇹🇳', minLength: 8, maxLength: 8 },
  { code: 'TR', name: 'Turkey', callingCode: '+90', flag: '🇹🇷', minLength: 10, maxLength: 10 },
  { code: 'TM', name: 'Turkmenistan', callingCode: '+993', flag: '🇹🇲', minLength: 8, maxLength: 8 },
  { code: 'TV', name: 'Tuvalu', callingCode: '+688', flag: '🇹🇻', minLength: 5, maxLength: 5 },
  { code: 'UG', name: 'Uganda', callingCode: '+256', flag: '🇺🇬', minLength: 9, maxLength: 9 },
  { code: 'UA', name: 'Ukraine', callingCode: '+380', flag: '🇺🇦', minLength: 9, maxLength: 9 },
  { code: 'AE', name: 'United Arab Emirates', callingCode: '+971', flag: '🇦🇪', minLength: 9, maxLength: 9 },
  { code: 'UY', name: 'Uruguay', callingCode: '+598', flag: '🇺🇾', minLength: 8, maxLength: 8 },
  { code: 'UZ', name: 'Uzbekistan', callingCode: '+998', flag: '🇺🇿', minLength: 9, maxLength: 9 },
  { code: 'VU', name: 'Vanuatu', callingCode: '+678', flag: '🇻🇺', minLength: 7, maxLength: 7 },
  { code: 'VE', name: 'Venezuela', callingCode: '+58', flag: '🇻🇪', minLength: 10, maxLength: 10 },
  { code: 'VN', name: 'Vietnam', callingCode: '+84', flag: '🇻🇳', minLength: 9, maxLength: 9 },
  { code: 'YE', name: 'Yemen', callingCode: '+967', flag: '🇾🇪', minLength: 9, maxLength: 9 },
  { code: 'ZM', name: 'Zambia', callingCode: '+260', flag: '🇿🇲', minLength: 9, maxLength: 9 },
  { code: 'ZW', name: 'Zimbabwe', callingCode: '+263', flag: '🇿🇼', minLength: 9, maxLength: 9 },
  { code: 'PR', name: 'Puerto Rico', callingCode: '+1', flag: '🇵🇷', minLength: 10, maxLength: 10 },
  { code: 'GU', name: 'Guam', callingCode: '+1', flag: '🇬🇺', minLength: 10, maxLength: 10 },
  { code: 'VI', name: 'US Virgin Islands', callingCode: '+1', flag: '🇻🇮', minLength: 10, maxLength: 10 },
  { code: 'KY', name: 'Cayman Islands', callingCode: '+1', flag: '🇰🇾', minLength: 10, maxLength: 10 },
  { code: 'BM', name: 'Bermuda', callingCode: '+1', flag: '🇧🇲', minLength: 10, maxLength: 10 }
];

/**
 * Validates format of the phone number based on the selected country config.
 * Strips formatting (spaces, dashes, parentheses) and checks matching rules.
 * Omit leading zero checks when counting exact length, or accept both with/without leading 0.
 * Returns null if valid, or a descriptive error message.
 */
export function validatePhoneNumber(phone: string, country: CountryConfig): string | null {
  if (!phone) {
    return 'Phone number is required.';
  }

  // Strip all non-digit characters
  let digits = phone.replace(/\D/g, '');

  // If phone starts with calling code, strip it
  const cleanCallingCode = country.callingCode.replace(/\D/g, '');
  if (digits.startsWith(cleanCallingCode) && digits.length > cleanCallingCode.length) {
    digits = digits.substring(cleanCallingCode.length);
  }

  // Remove leading domestic trunk prefix (0) if present
  if (digits.startsWith('0') && digits.length > 1) {
    digits = digits.substring(1);
  }

  // Perform min/max length validation
  const min = country.minLength || 7;
  const max = country.maxLength || 15;

  if (digits.length < min) {
    return `Phone number is too short for ${country.name}. Expected at least ${min} digits (excluding prefix).`;
  }

  if (digits.length > max) {
    return `Phone number is too long for ${country.name}. Expected at most ${max} digits (excluding prefix).`;
  }

  // Custom regex validation if defined
  if (country.regex && !country.regex.test(digits)) {
    return `Invalid phone number format for ${country.name}.`;
  }

  return null;
}

/**
 * Detects the country by looking at timezone and browser language, falling back to US.
 */
export function detectCountryByBrowser(): CountryConfig {
  try {
    // 1. Try timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const tzUpper = tz.toUpperCase();
    if (tzUpper.includes('LONDON')) return COUNTRIES.find(c => c.code === 'GB') || COUNTRIES[0];
    if (tzUpper.includes('BERLIN')) return COUNTRIES.find(c => c.code === 'DE') || COUNTRIES[0];
    if (tzUpper.includes('PARIS')) return COUNTRIES.find(c => c.code === 'FR') || COUNTRIES[0];
    if (tzUpper.includes('SYDNEY') || tzUpper.includes('MELBOURNE') || tzUpper.includes('AUSTRALIA')) {
      return COUNTRIES.find(c => c.code === 'AU') || COUNTRIES[0];
    }
    if (tzUpper.includes('TORONTO') || tzUpper.includes('VANCOUVER') || tzUpper.includes('CANADA')) {
      return COUNTRIES.find(c => c.code === 'CA') || COUNTRIES[0];
    }
    if (tzUpper.includes('LAGOS') || tzUpper.includes('AFRICA/LAGOS')) {
      return COUNTRIES.find(c => c.code === 'NG') || COUNTRIES[0];
    }

    // 2. Try browser language (e.g. en-NG -> NG, en-US -> US, en-GB -> GB)
    const lang = navigator.language || '';
    const parts = lang.split('-');
    if (parts.length > 1) {
      const region = parts[1].toUpperCase();
      const matched = COUNTRIES.find(c => c.code === region);
      if (matched) return matched;
    }
    
    // Also try the first part if it's identical to some standard iso codes (e.g., "de" -> DE, "fr" -> FR)
    const primaryLang = parts[0].toUpperCase();
    if (primaryLang === 'DE' || primaryLang === 'FR' || primaryLang === 'GB' || primaryLang === 'NG' || primaryLang === 'AU' || primaryLang === 'CA' || primaryLang === 'US') {
      const matched = COUNTRIES.find(c => c.code === primaryLang);
      if (matched) return matched;
    }

    // Default to United States (+1) as requested if not matched
    const usCountry = COUNTRIES.find(c => c.code === 'US');
    if (usCountry) return usCountry;
  } catch (e) {
    console.error('Browser detection error', e);
  }
  return COUNTRIES.find(c => c.code === 'US') || COUNTRIES[0];
}


import React from 'react';

export interface SmsEventDetail {
  phone: string;
  otp: string;
  sender?: string;
  message?: string;
}

export const triggerAppSms = (_phone: string, _otp: string, _sender = 'VK-QKSERV') => {
  // Dummy popups disabled per user requirement: clean manual OTP verification
};

export const GlobalSmsNotification: React.FC = () => {
  // Disabled: no dummy OTP alert banner or popups
  return null;
};

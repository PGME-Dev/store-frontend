const WIDGET_ID = import.meta.env.VITE_MSG91_WIDGET_ID;
const TOKEN_AUTH = import.meta.env.VITE_MSG91_TOKEN_AUTH;

let otpWidget = null;
let resolveVerify = null;
let rejectVerify = null;

function getWidget() {
  if (otpWidget) return otpWidget;

  if (typeof window.initSendOTP !== 'function') {
    throw new Error('MSG91 OTP widget script not loaded yet. Please try again.');
  }

  otpWidget = window.initSendOTP({
    widgetId: WIDGET_ID,
    tokenAuth: TOKEN_AUTH,
    exposeMethods: true,
    success: (data) => {
      if (resolveVerify) {
        resolveVerify(data.message); // access token
        resolveVerify = null;
        rejectVerify = null;
      }
    },
    failure: (error) => {
      if (rejectVerify) {
        rejectVerify(new Error(error?.message || 'OTP verification failed'));
        resolveVerify = null;
        rejectVerify = null;
      }
    },
  });

  return otpWidget;
}

export function sendOTP(phoneNumber) {
  const widget = getWidget();
  // MSG91 expects phone with country code
  const identifier = `91${phoneNumber}`;
  widget.send(identifier);
}

export function verifyOTP(otp) {
  return new Promise((resolve, reject) => {
    resolveVerify = resolve;
    rejectVerify = reject;
    const widget = getWidget();
    widget.verify(otp);
  });
}

export function retryOTP() {
  const widget = getWidget();
  widget.retry();
}

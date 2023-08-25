import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const MyPayCallback = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const resultCode = searchParams.get('resultCode');
  const resultMsg = searchParams.get('resultMsg');

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ isSuccess: !resultCode, type });
      setTimeout(() => {
        window.close();
      }, 500);
    }
  }, []);

  return (
    <div className="my-pay-callback-popup">
      <section className="l-panel my-pay-callback__message">{resultMsg}</section>
    </div>
  );
};

export default MyPayCallback;

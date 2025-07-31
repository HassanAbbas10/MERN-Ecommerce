import Lottie from 'react-lottie';
import animationData from '../../lib/animate2.json';

const LottieAnimationSec = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return <Lottie options={defaultOptions} height={400} width={400} />;
};

export default LottieAnimationSec;

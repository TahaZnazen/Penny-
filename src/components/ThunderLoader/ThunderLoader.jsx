import ThunderEffect from '../ThunderEffect/ThunderEffect';
import './ThunderLoader.css';

const ThunderLoader = ({ onComplete }) => {
  return (
    <div className="thunder-loader-wrapper">
      <ThunderEffect
        showControls={false}
        onScrollComplete={onComplete}
        useNavigation={false}
      />
    </div>
  );
};

export default ThunderLoader;

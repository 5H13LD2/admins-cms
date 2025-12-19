import ReactSnowfall from 'react-snowfall';

interface SnowfallProps {
  snowflakeCount?: number;
  color?: string;
  style?: React.CSSProperties;
  speed?: [number, number];
  wind?: [number, number];
  radius?: [number, number];
}

export default function Snowfall({
  snowflakeCount = 150,
  color = '#fff',
  style,
  speed = [1.0, 3.0],
  wind = [-0.5, 2.0],
  radius = [0.5, 3.0],
}: SnowfallProps) {
  return (
    <ReactSnowfall
      snowflakeCount={snowflakeCount}
      color={color}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        ...style,
      }}
      speed={speed}
      wind={wind}
      radius={radius}
    />
  );
}

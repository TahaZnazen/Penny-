import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './AnimatedBackground.css';

// Simplex noise function for shader
const noiseShader = `
  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
`;

// Portal Cloud Shader Material
const PortalCloudShader = {
  uniforms: {
    time: { value: 0 },
    color1: { value: new THREE.Color('#1a0a00') },
    color2: { value: new THREE.Color('#2d1810') },
    color3: { value: new THREE.Color('#ff8c00') },
    color4: { value: new THREE.Color('#ffd700') },
    intensity: { value: 1.5 },
    speed: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform vec3 color4;
    uniform float intensity;
    uniform float speed;

    varying vec2 vUv;
    varying vec3 vPosition;

    ${noiseShader}

    void main() {
      vec2 uv = vUv;
      vec2 center = uv - 0.5;
      float dist = length(center);
      float angle = atan(center.y, center.x);

      float swirl = dist * 3.0 + time * speed * 0.2;
      vec2 swirlUv = vec2(
        center.x * cos(swirl) - center.y * sin(swirl),
        center.x * sin(swirl) + center.y * cos(swirl)
      ) + 0.5;

      float noise1 = snoise(swirlUv * 3.0 + time * speed * 0.1);
      float noise2 = snoise(swirlUv * 6.0 - time * speed * 0.15);
      float noise3 = snoise(swirlUv * 12.0 + time * speed * 0.05);

      float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
      float radialGradient = 1.0 - smoothstep(0.0, 0.8, dist);
      float vortexMask = smoothstep(0.6, 0.0, dist);

      float cloudMask = combinedNoise * 0.6 + 0.4;
      cloudMask = pow(cloudMask, 0.8);
      cloudMask *= radialGradient;

      vec3 darkColor = mix(color1, color2, cloudMask);
      vec3 brightColor = mix(color3, color4, vortexMask);
      vec3 finalColor = mix(darkColor, brightColor, radialGradient * intensity);

      float glow = pow(1.0 - dist, 2.5) * intensity;
      finalColor += color4 * glow * 0.6;

      float edgeFade = smoothstep(0.95, 0.4, dist);

      gl_FragColor = vec4(finalColor, cloudMask * edgeFade);
    }
  `,
};

// Static configuration (previously Leva controls)
const CONFIG = {
  cloudSpeed: 1.0,
  cloudIntensity: 1.5,
  cloudSize: 30,
  cloudPositionZ: -5,
  ambientIntensity: 0.2,
  light1Intensity: 3,
  light1PositionZ: -3,
  light2Intensity: 2,
  light2PositionZ: -4,
  color1: '#1a0a00',
  color2: '#2d1810',
  color3: '#ff8c00',
  color4: '#ffd700',
};

// Portal Cloud Component
const PortalCloud = () => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.intensity.value = CONFIG.cloudIntensity;
      materialRef.current.uniforms.speed.value = CONFIG.cloudSpeed;
      materialRef.current.uniforms.color1.value.set(CONFIG.color1);
      materialRef.current.uniforms.color2.value.set(CONFIG.color2);
      materialRef.current.uniforms.color3.value.set(CONFIG.color3);
      materialRef.current.uniforms.color4.value.set(CONFIG.color4);
    }
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * CONFIG.cloudSpeed * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, CONFIG.cloudPositionZ]}>
      <planeGeometry args={[CONFIG.cloudSize, CONFIG.cloudSize, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        args={[PortalCloudShader]}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// Main Portal Scene
const PortalScene = () => {
  return (
    <>
      <ambientLight intensity={CONFIG.ambientIntensity} />
      <pointLight
        position={[0, 0, CONFIG.light1PositionZ]}
        intensity={CONFIG.light1Intensity}
        color="#ffd700"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[0, 0, CONFIG.light2PositionZ]}
        intensity={CONFIG.light2Intensity}
        color="#ff8c00"
        distance={15}
        decay={2}
      />
      <PortalCloud />
    </>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="animated-background">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
      >
        <PortalScene />
      </Canvas>
    </div>
  );
};

export default AnimatedBackground;

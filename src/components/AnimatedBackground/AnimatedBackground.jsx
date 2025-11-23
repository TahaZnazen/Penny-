import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from 'leva';
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
    color1: { value: new THREE.Color('#1a0a00') }, // Dark brown/black
    color2: { value: new THREE.Color('#2d1810') }, // Brown
    color3: { value: new THREE.Color('#ff8c00') }, // Orange
    color4: { value: new THREE.Color('#ffd700') }, // Gold
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

      // Center-based coordinates
      vec2 center = uv - 0.5;
      float dist = length(center);
      float angle = atan(center.y, center.x);

      // Swirling effect - rotate UV based on distance and time
      float swirl = dist * 3.0 + time * speed * 0.2;
      vec2 swirlUv = vec2(
        center.x * cos(swirl) - center.y * sin(swirl),
        center.x * sin(swirl) + center.y * cos(swirl)
      ) + 0.5;

      // Multi-octave noise for cloud detail
      float noise1 = snoise(swirlUv * 3.0 + time * speed * 0.1);
      float noise2 = snoise(swirlUv * 6.0 - time * speed * 0.15);
      float noise3 = snoise(swirlUv * 12.0 + time * speed * 0.05);

      // Combine noise octaves
      float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;

      // Radial gradient - bright center, dark edges
      float radialGradient = 1.0 - smoothstep(0.0, 0.8, dist);

      // Vortex effect - stronger swirl near center
      float vortexMask = smoothstep(0.6, 0.0, dist);

      // Combine effects with sharper definition
      float cloudMask = combinedNoise * 0.6 + 0.4;
      cloudMask = pow(cloudMask, 0.8); // Sharpen the contrast
      cloudMask *= radialGradient;

      // Color mixing based on distance from center
      vec3 darkColor = mix(color1, color2, cloudMask);
      vec3 brightColor = mix(color3, color4, vortexMask);
      vec3 finalColor = mix(darkColor, brightColor, radialGradient * intensity);

      // Add glow in center with more definition
      float glow = pow(1.0 - dist, 2.5) * intensity;
      finalColor += color4 * glow * 0.6;

      // Less aggressive edge fade for clearer edges
      float edgeFade = smoothstep(0.95, 0.4, dist);

      gl_FragColor = vec4(finalColor, cloudMask * edgeFade);
    }
  `,
};

// Portal Cloud Component
const PortalCloud = ({
  speed = 1.0,
  intensity = 1.5,
  size = 30,
  positionZ = -5,
  color1 = '#1a0a00',
  color2 = '#2d1810',
  color3 = '#ff8c00',
  color4 = '#ffd700'
}) => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.intensity.value = intensity;
      materialRef.current.uniforms.speed.value = speed;
      materialRef.current.uniforms.color1.value = new THREE.Color(color1);
      materialRef.current.uniforms.color2.value = new THREE.Color(color2);
      materialRef.current.uniforms.color3.value = new THREE.Color(color3);
      materialRef.current.uniforms.color4.value = new THREE.Color(color4);
    }
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, positionZ]}>
      <planeGeometry args={[size, size, 64, 64]} />
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

// Main Portal Scene with Leva Controls
const PortalScene = () => {
  const controls = useControls('Portal Controls', {
    // Cloud Settings
    cloudSpeed: { value: 1.0, min: 0, max: 3, step: 0.1, label: 'Cloud Speed' },
    cloudIntensity: { value: 1.5, min: 0, max: 5, step: 0.1, label: 'Cloud Intensity' },
    cloudSize: { value: 30, min: 10, max: 50, step: 1, label: 'Cloud Size' },
    cloudPositionZ: { value: -5, min: -20, max: 0, step: 0.5, label: 'Cloud Z Position' },

    // Lighting
    ambientIntensity: { value: 0.2, min: 0, max: 2, step: 0.1, label: 'Ambient Light' },
    light1Intensity: { value: 3, min: 0, max: 10, step: 0.5, label: 'Gold Light Intensity' },
    light1PositionZ: { value: -3, min: -10, max: 5, step: 0.5, label: 'Gold Light Z' },
    light2Intensity: { value: 2, min: 0, max: 10, step: 0.5, label: 'Orange Light Intensity' },
    light2PositionZ: { value: -4, min: -10, max: 5, step: 0.5, label: 'Orange Light Z' },

    // Colors
    color1: { value: '#1a0a00', label: 'Color 1 (Dark)' },
    color2: { value: '#2d1810', label: 'Color 2 (Brown)' },
    color3: { value: '#ff8c00', label: 'Color 3 (Orange)' },
    color4: { value: '#ffd700', label: 'Color 4 (Gold)' },
  });

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={controls.ambientIntensity} />

      {/* Center point lights for illumination */}
      <pointLight
        position={[0, 0, controls.light1PositionZ]}
        intensity={controls.light1Intensity}
        color="#ffd700"
        distance={20}
        decay={2}
      />
      <pointLight
        position={[0, 0, controls.light2PositionZ]}
        intensity={controls.light2Intensity}
        color="#ff8c00"
        distance={15}
        decay={2}
      />

      {/* Portal cloud effect */}
      <PortalCloud
        speed={controls.cloudSpeed}
        intensity={controls.cloudIntensity}
        size={controls.cloudSize}
        positionZ={controls.cloudPositionZ}
        color1={controls.color1}
        color2={controls.color2}
        color3={controls.color3}
        color4={controls.color4}
      />
    </>
  );
};

/**
 * AnimatedBackground - Majestic Golden Portal Effect
 *
 * A celestial portal with swirling dark clouds and golden glow
 * Compatible with @react-three/fiber v8.x - uses native Three.js materials for glow effects
 * Includes Leva GUI for real-time parameter control
 */
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

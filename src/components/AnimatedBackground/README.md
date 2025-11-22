# AnimatedBackground - Enhanced Majestic Golden Portal

An epic celestial portal with organic swirling dark golden clouds, dramatic multi-layered glows, energy wisps, and hundreds of floating particles. Built with React Three Fiber and custom GLSL shaders - pure wave-based motion with NO hard geometric shapes.

## Visual Features

### Cloud System
- **6 Layered Cloud Planes** - Multiple swirling cloud layers at different depths creating rich parallax
- **5-Octave Noise** - Ultra-detailed cloud formations with turbulence
- **5-Color Gradient** - Almost black → Rich brown → Darkgoldenrod → Gold → Bright yellow-gold
- **Wave Distortion** - 3 sine/cosine waves create organic flowing motion
- **Dynamic Swirling** - Enhanced vortex effect with pulsing radial gradients
- **Energy Streaks** - Noise-based bright streaks flowing through clouds

### Glow & Atmosphere
- **9-Layer Center Glow** - Concentric soft spheres from dark to bright gold with pulsing
- **3 Golden Aura Layers** - Multiple falloff zones for dramatic depth
- **Bright Core** - Intense yellow-gold center with dramatic pulsing
- **Outer Glow** - Soft atmospheric fade at edges

### Particles & Effects
- **12 Energy Wisps** - Flowing golden tendrils spiraling from center using tube geometry
- **180 Aura Particles** - Wave-pattern circular motion with pulsing glow
- **200 Sparkle Particles** - Floating golden points with gentle movement
- **6 Point Lights** - Strategic golden lighting for rich illumination

### Motion & Animation
- **100% Wave-Based** - All motion uses sine/cosine for organic flow
- **Counter-Rotating Layers** - Clouds rotate in opposite directions for depth
- **Dynamic Pulsing** - Time-based pulsing on multiple elements
- **NO Hard Shapes** - Pure organic, flowing forms only

## Component Props

All props are optional with sensible defaults:

```jsx
<AnimatedBackground
  cloudSpeed={1.0}          // Speed of cloud rotation (0.5 = slow, 2.0 = fast)
  cloudIntensity={1.5}      // Brightness of golden glow (1.0 = normal, 3.0 = intense)
  particleCount={200}       // Number of sparkle particles (50-500 recommended)
  particleSpeed={1.0}       // Speed of particle animation
  bloomIntensity={2.0}      // Post-processing bloom intensity (1.0-5.0)
/>
```

## Architecture

### Components

1. **PortalCloud** - Custom shader material with simplex noise for swirling clouds
2. **Sparkles** - Instanced mesh particle system with pulsing animation
3. **VolumetricRays** - 12 rotating planes creating light ray effect
4. **CenterLight** - Golden sphere serving as light source for god rays
5. **PortalScene** - Main scene composition with lighting and post-processing

### Shader Details

The custom cloud shader uses:
- **Simplex 2D Noise** - Multi-octave noise for cloud detail
- **Radial Gradient** - Brightness falloff from center to edges
- **Swirl Effect** - UV rotation based on distance and time
- **Color Mixing** - 4-color gradient (dark brown → brown → orange → gold)
- **Additive Blending** - For glowing effect

### Post-Processing

- **Bloom Effect** - Creates glow around bright areas (golden center)
- **God Rays** - Volumetric light scattering from center light source

## Customization Examples

### Slower, Subtle Animation
```jsx
<AnimatedBackground
  cloudSpeed={0.5}
  particleSpeed={0.5}
  bloomIntensity={1.5}
/>
```

### Intense, Dramatic Effect
```jsx
<AnimatedBackground
  cloudSpeed={2.0}
  cloudIntensity={3.0}
  bloomIntensity={4.0}
/>
```

### Minimal Performance (fewer particles)
```jsx
<AnimatedBackground
  particleCount={50}
  cloudSpeed={0.8}
  bloomIntensity={1.5}
/>
```

### Maximum Drama
```jsx
<AnimatedBackground
  cloudSpeed={1.5}
  cloudIntensity={2.5}
  particleCount={400}
  particleSpeed={1.5}
  bloomIntensity={3.0}
/>
```

## Color Customization

To change the portal colors, edit the shader uniforms in `AnimatedBackground.jsx`:

```jsx
// Current: Golden/Orange Portal
color1: { value: new THREE.Color('#1a0a00') }, // Dark brown/black
color2: { value: new THREE.Color('#2d1810') }, // Brown
color3: { value: new THREE.Color('#ff8c00') }, // Orange
color4: { value: new THREE.Color('#ffd700') }, // Gold

// Example: Blue/Cyan Portal
color1: { value: new THREE.Color('#000a1a') }, // Dark blue/black
color2: { value: new THREE.Color('#001a2d') }, // Deep blue
color3: { value: new THREE.Color('#00d4ff') }, // Cyan
color4: { value: new THREE.Color('#ffffff') }, // White

// Example: Purple/Magenta Portal
color1: { value: new THREE.Color('#1a000a') }, // Dark purple/black
color2: { value: new THREE.Color('#2d0010') }, // Purple
color3: { value: new THREE.Color('#ff00ff') }, // Magenta
color4: { value: new THREE.Color('#ff88ff') }, // Pink
```

Also update the light colors and particle colors to match:
```jsx
// In PortalScene
<pointLight color="#ffd700" ... /> // Change to match your color scheme
<pointLight color="#ff8c00" ... /> // Change to match your color scheme

// In Sparkles
<meshBasicMaterial color="#ffd700" ... /> // Change particle color
```

## Performance Optimization

### For Low-End Devices
```jsx
<AnimatedBackground
  particleCount={50}          // Fewer particles
  bloomIntensity={1.0}        // Lower bloom
/>
```

Also consider commenting out GodRays in the code:
```jsx
// {lightRef.current && (
//   <GodRays ... />
// )}
```

### For High-End Devices
```jsx
<AnimatedBackground
  particleCount={500}         // More particles
  bloomIntensity={3.0}        // Higher bloom
/>
```

## Technical Details

### Shader Noise
Uses 2D Simplex noise with 3 octaves for detailed cloud patterns:
- Octave 1 (3.0 scale): Large cloud formations
- Octave 2 (6.0 scale): Medium detail
- Octave 3 (12.0 scale): Fine detail

### Particle System
Uses `InstancedMesh` for efficient rendering:
- Single draw call for all particles
- Individual animation via matrix updates
- Pulsing scale effect using sine waves
- Gentle floating motion

### God Rays
Post-processing effect that:
- Samples light rays from center sphere
- 60 samples for smooth rays
- Density and decay create falloff
- Blur for atmospheric softness

## Advanced Modifications

### Add More Cloud Layers
Duplicate the `<PortalCloud>` component with different positions:
```jsx
<PortalCloud speed={cloudSpeed} intensity={cloudIntensity} />
<PortalCloud speed={cloudSpeed * 0.5} intensity={cloudIntensity * 0.5} position={[0, 0, -6]} />
```

### Change Cloud Shape
Modify the geometry in `PortalCloud`:
```jsx
// Current: Flat plane
<planeGeometry args={[20, 20, 64, 64]} />

// Alternative: Sphere for 3D portal
<sphereGeometry args={[10, 64, 64]} />
```

### Add Ring/Halo Effect
Add a torus around the portal:
```jsx
<mesh position={[0, 0, -4]}>
  <torusGeometry args={[5, 0.1, 16, 100]} />
  <meshBasicMaterial color="#ffd700" transparent opacity={0.3} />
</mesh>
```

### Disable Specific Effects

```jsx
// In PortalScene, comment out what you don't want:

{/* <VolumetricRays /> */}        // Disable god ray planes
{/* <Sparkles ... /> */}          // Disable sparkles
{/* <GodRays ... /> */}           // Disable post-processing god rays
```

## Troubleshooting

### Portal not visible
- Check z-index in CSS (should be 0 for background)
- Ensure camera position is correct (default: [0, 0, 5])

### Performance issues
- Reduce `particleCount` to 50-100
- Comment out GodRays post-processing
- Lower `bloomIntensity`

### Colors look washed out
- Increase `cloudIntensity` prop
- Adjust `bloomIntensity` (try 1.0-2.0)

### Animation too fast/slow
- Adjust `cloudSpeed` and `particleSpeed` props
- Modify `speed * 0.05` in useFrame for cloud rotation

## File Structure

```
AnimatedBackground/
├── AnimatedBackground.jsx    # Main portal effect component
├── AnimatedBackground.css    # Positioning and layering
├── index.js                  # Export file
└── README.md                 # This file
```

## Dependencies

- `@react-three/fiber` - React renderer for Three.js
- `@react-three/postprocessing` - Post-processing effects (Bloom, GodRays)
- `postprocessing` - Core post-processing library
- `three` - Three.js 3D library

## Credits

- Custom simplex noise shader for cloud generation
- Radial composition for dramatic focus
- Instanced particle system for performance
- Post-processing for cinematic quality

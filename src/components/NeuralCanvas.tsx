'use client'
import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three-stdlib'

const POINTS_NUM = 800
const MIN_Z = -150
const MAX_Z = 300
const MIN_X = -200
const MAX_X = 200
const LINE_DEFAULT_COLOR = new THREE.Color(0.35, 0.35, 0.55)
const BLOOM_STRENGTH = 1.8
const AUTO_ROTATION_SPEED = 0.03
const LINE_COLOR_VAR = 0.3

function NeuralScene() {
  const { camera, gl: renderer, size } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const totalLines = useRef(0)
  const groupScale = useRef(0)
  const cameraPosition = useRef([0, 30, 400])
  const cameraLookAt = useRef([0, -30, 0])
  const mousePosition = useRef([0, 0])
  const groupMatrix = useRef(new THREE.Matrix4())

  const composerRef = useRef<EffectComposer | null>(null)

  // Particle positions
  const pointPosition = useMemo(() => {
    const arr = new Float32Array(POINTS_NUM * 3)
    const xSize = MAX_X - MIN_X
    for (let i = 0; i < POINTS_NUM; i++) {
      const bufIdx = i * 3
      const posX = MIN_X + xSize * (i / (POINTS_NUM - 1))
      const angleA = Math.PI * 2 * Math.random()
      const angleB = Math.PI * 2 * Math.random()
      const radius = 1 + Math.random() * 100
      let posY = Math.sin(angleA) * Math.cos(angleB) * radius
      let posZ = Math.cos(angleA) * radius
      posZ = Math.max(MIN_Z, Math.min(MAX_Z, posZ))
      // Spread Y for cube-like distribution
      posY = Math.random() * 100 - 50
      arr[bufIdx] = posX
      arr[bufIdx + 1] = posY
      arr[bufIdx + 2] = posZ
    }
    return arr
  }, [])

  // Line buffers
  const linePosition = useMemo(() => new Float32Array(POINTS_NUM * POINTS_NUM * 6), [])
  const lineColor = useMemo(() => new Float32Array(POINTS_NUM * POINTS_NUM * 6), [])
  const lineOpacity = useMemo(() => {
    const arr = new Float32Array(POINTS_NUM * POINTS_NUM * 6)
    arr.fill(0)
    return arr
  }, [])

  // Line geometry attributes
  const linePosAttr = useMemo(() => new THREE.BufferAttribute(linePosition, 3), [linePosition])
  const lineColorAttr = useMemo(() => new THREE.BufferAttribute(lineColor, 3), [lineColor])
  const lineOpacityAttr = useMemo(() => new THREE.BufferAttribute(lineOpacity, 1), [lineOpacity])

  // Line geometry
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', linePosAttr)
    geo.setAttribute('color', lineColorAttr)
    geo.setAttribute('alpha', lineOpacityAttr)
    return geo
  }, [linePosAttr, lineColorAttr, lineOpacityAttr])

  // Post-processing
  useEffect(() => {
    renderer.autoClear = false
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(new THREE.Scene(), camera))
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      BLOOM_STRENGTH,
      0.5,
      0.0
    )
    composer.addPass(bloomPass)
    composerRef.current = composer

    return () => {
      composer.dispose()
    }
  }, [renderer, camera, size])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ]
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animation frame
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    // Update group scale
    groupScale.current += (1 - groupScale.current) * 0.1

    // Compute group matrix
    const mat = new THREE.Matrix4()
    const rotX = new THREE.Matrix4().makeRotationX(time * 0.4 * AUTO_ROTATION_SPEED)
    const rotY = new THREE.Matrix4().makeRotationY(time * AUTO_ROTATION_SPEED)
    const scale = new THREE.Matrix4().makeScale(groupScale.current, groupScale.current, groupScale.current)
    mat.multiply(rotX).multiply(rotY).multiply(scale)
    groupMatrix.current = mat

    if (groupRef.current) {
      groupRef.current.matrixAutoUpdate = false
      groupRef.current.matrix.copy(mat)
    }

    // Update mouse position smoothing
    mousePosition.current[0] += (mousePosition.current[0] - mousePosition.current[0]) * 0.05
    mousePosition.current[1] += (mousePosition.current[1] - mousePosition.current[1]) * 0.05

    // Update camera
    const camXTarget = mousePosition.current[0] * 100
    const camYTarget = mousePosition.current[1] * 100 + 30
    const camZTarget = 400 - mousePosition.current[1] * 200
    cameraPosition.current[0] += (camXTarget - cameraPosition.current[0]) * 0.05
    cameraPosition.current[1] += (camYTarget - cameraPosition.current[1]) * 0.05
    cameraPosition.current[2] += (camZTarget - cameraPosition.current[2]) * 0.05

    const lookXTarget = mousePosition.current[0] * 50
    const lookYTarget = mousePosition.current[1] * 50 - 30
    cameraLookAt.current[0] += (lookXTarget - cameraLookAt.current[0]) * 0.05
    cameraLookAt.current[1] += (lookYTarget - cameraLookAt.current[1]) * 0.05

    camera.position.set(
      cameraPosition.current[0],
      cameraPosition.current[1],
      cameraPosition.current[2]
    )
    camera.lookAt(
      cameraLookAt.current[0],
      cameraLookAt.current[1],
      0
    )

    // Update lines (proximity check)
    totalLines.current = 0
    const maxDist = 80
    const posArr = pointPosition

    // Reset opacity
    lineOpacity.fill(0)

    for (let i = 0; i < POINTS_NUM; i++) {
      for (let j = i + 1; j < POINTS_NUM; j++) {
        const dx = posArr[i * 3] - posArr[j * 3]
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1]
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < maxDist) {
          const lineIdx = totalLines.current
          totalLines.current++

          const aX = posArr[i * 3]
          const aY = posArr[i * 3 + 1]
          const aZ = posArr[i * 3 + 2]
          const bX = posArr[j * 3]
          const bY = posArr[j * 3 + 1]
          const bZ = posArr[j * 3 + 2]

          linePosition[lineIdx * 6] = aX
          linePosition[lineIdx * 6 + 1] = aY
          linePosition[lineIdx * 6 + 2] = aZ
          linePosition[lineIdx * 6 + 3] = bX
          linePosition[lineIdx * 6 + 4] = bY
          linePosition[lineIdx * 6 + 5] = bZ

          const colorDist = dist / maxDist
          const r = Math.max(0.25, LINE_DEFAULT_COLOR.r + colorDist * LINE_COLOR_VAR * 0.3)
          const g = Math.max(0.25, LINE_DEFAULT_COLOR.g + colorDist * LINE_COLOR_VAR * 0.5)
          const bCol = Math.max(0.45, LINE_DEFAULT_COLOR.b - colorDist * LINE_COLOR_VAR * 0.1)

          lineColor[lineIdx * 6] = r
          lineColor[lineIdx * 6 + 1] = g
          lineColor[lineIdx * 6 + 2] = bCol
          lineColor[lineIdx * 6 + 3] = r
          lineColor[lineIdx * 6 + 4] = g
          lineColor[lineIdx * 6 + 5] = bCol

          const depth = (aZ + bZ) * 0.5
          const alpha = 1 - ((depth - MIN_Z) / (MAX_Z - MIN_Z))
          const brightness = alpha * 0.4 + (1 - colorDist) * 0.6

          lineOpacity[lineIdx * 6 + 2] = brightness
          lineOpacity[lineIdx * 6 + 5] = brightness
        }
      }
    }

    // Update geometry
    linePosAttr.needsUpdate = true
    lineColorAttr.needsUpdate = true
    lineOpacityAttr.needsUpdate = true
    lineGeometry.setDrawRange(0, totalLines.current * 2)

    // Render with composer
    if (composerRef.current) {
      composerRef.current.render()
    }
  })

  return (
    <>
      <group ref={groupRef}>
        {/* Particles */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[pointPosition, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={1.5}
            color="#a78bfa"
            transparent
            opacity={0.8}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Lines */}
        <lineSegments geometry={lineGeometry}>
          <shaderMaterial
            vertexColors
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            vertexShader={`
              attribute float alpha;
              varying float vAlpha;
              varying vec3 vColor;
              void main() {
                vAlpha = alpha;
                vColor = color;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              varying float vAlpha;
              varying vec3 vColor;
              void main() {
                gl_FragColor = vec4(vColor, vAlpha * 0.6);
              }
            `}
          />
        </lineSegments>
      </group>
    </>
  )
}

export default function NeuralCanvas({ opacity = 1 }: { opacity?: number }) {
  return (
    <div
      id="neural-canvas-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        opacity,
        mixBlendMode: opacity < 1 ? 'screen' : 'normal',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 200], fov: 60, near: 1, far: 1500 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <NeuralScene />
      </Canvas>
    </div>
  )
}

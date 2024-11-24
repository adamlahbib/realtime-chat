import { useRef } from 'react'
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three'

const NUM_SQUARES = 5
const SPEED = 1000

let last = 5

function Square({ index, size, move }: { index: number, size: number, move: boolean }) {
  const mesh = useRef<Mesh>(null!)

  useFrame((state, delta) => {
    if (mesh.current && move) {
      mesh.current.position.x +=  SPEED * delta
    }
  })

  return (
    <mesh
      ref={mesh}
      position={[-1 - index * (10*size * 2), 0, 0]}
    >
      <planeGeometry args={[10*size, size]} />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}

export function LoadingScene() {
  return (
    <>
      {Array.from({ length: NUM_SQUARES }).map((_, index) => (
        <Square key={index} index={index} size={5} move={true}/>
      ))}
    </>
  )
}

export function TypingScene() {
    if (last === 5){
        last = 10
    } else {
        last = 5
    }
    return (
      <>
        {Array.from({ length: 1 }).map((_, index) => (
          <Square key={index} index={index} size={last} move={false}/>
        ))}
      </>
    )
}

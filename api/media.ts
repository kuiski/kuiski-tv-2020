export async function getCameraStream(faceCamera: boolean) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: faceCamera ? 'user' : 'environment' },
    audio: true
  })

  return stream
}

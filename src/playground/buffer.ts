function createPositionBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  const buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const positions = [
    1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    -1.0, -1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return buffer;
}

function initBuffers(gl: WebGLRenderingContext) {
  const positionBuffer = createPositionBuffer(gl);

  return { position: positionBuffer };
}

export default initBuffers;

import { toRadians } from '../math/to-radians.ts';
import * as glMatrix from 'gl-matrix';
import type { Buffers } from './buffer.ts';
import type { ProgramInfo } from './playground.tsx';

function setPositionAttribute(gl: WebGLRenderingContext, buffers: Buffers, programInfo: ProgramInfo) {
  const numberOfComponents = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0; // how many bytes to get from one set of values to the next
  const offset = 0 // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numberOfComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = toRadians(45);
  const aspect = gl.canvas.width / gl.canvas.height;
  const near = 0.1;
  const far = 100.0;
  const projectionMatrix = glMatrix.mat4.create();

  glMatrix.mat4.perspective(projectionMatrix, fieldOfView, aspect, near, far);

  const modelViewMatrix = glMatrix.mat4.create();

  glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);

  setPositionAttribute(gl, buffers, programInfo);

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

export default drawScene;

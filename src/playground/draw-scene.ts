import { toRadians } from '../math/to-radians.ts';
import * as glMatrix from 'gl-matrix';

function drawScene(gl: WebGLRenderingContext, program: WebGLProgram, buffer: WebGLBuffer) {
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


}

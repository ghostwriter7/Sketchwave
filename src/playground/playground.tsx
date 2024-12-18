import createShaderProgram from './shader.ts';
import initBuffers from './buffer.ts';
import drawScene from './draw-scene.ts';

export const Playground = () => {
  const canvas = <canvas></canvas> as HTMLCanvasElement;

  const gl = canvas.getContext('webgl')!;

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

  const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;



  const program = createShaderProgram(gl, vsSource, fsSource)!;

  const programInfo = {
    program,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
    },
    uniformLocations: {
      modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
      projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
    }
  };

  const buffers = initBuffers(gl);

  drawScene(gl, programInfo, buffers);

  return canvas;
}

export type ProgramInfo = {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: GLint;
  };
  uniformLocations: {
    modelViewMatrix:  WebGLUniformLocation | null;
    projectionMatrix:  WebGLUniformLocation | null;
  };
};

"use strict";

class WebGLCanvas {
  constructor(canvas, vsSource, fsSource) {
    this.canvas = canvas;
    this.vsSource = vsSource;
    this.fsSource = fsSource;

    this.gl = canvas.getContext("webgl");
    if (!this.gl) {
      alert("Your browser or machine does not support WebGL");
      return;
    }

    this.initProgram();
    this.initBuffer();
    this.initUniforms();
    this.setWindowDim();
    this.addEventListeners();
  }

  initProgram() {
    this.shaderProgram = this.gl.createProgram();

    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, this.vsSource);
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, this.fsSource);

    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);

    this.gl.linkProgram(this.shaderProgram);
    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program");
      return null;
    }
    this.gl.useProgram(this.shaderProgram);
  }

  initBuffer() {
    const vertices = [
      -1, 1, -1, -1, 1, -1,
      -1, 1, 1, 1, 1, -1
    ];

    const vertexBuffer = this.gl.createBuffer();
    const a_pos = this.gl.getAttribLocation(this.shaderProgram, "a_pos");

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    this.gl.vertexAttribPointer(a_pos, 2, this.gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
    this.gl.enableVertexAttribArray(a_pos);
  }

  initUniforms() {
    this.u_window = [];
    this.uniforms = {
      u_window: this.gl.getUniformLocation(this.shaderProgram, "u_window"),
    };
  }

  compileShader(type, source) {
    const shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log(this.gl.getShaderInfoLog(shader));
      alert("An error occured compiling the shaders");
      return null;
    }
    return shader;
  }

  renderScene() {
    this.gl.uniform2fv(this.uniforms.u_window, this.u_window);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  setWindowDim() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.u_window = [this.canvas.width, this.canvas.height];
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.renderScene();
  }

  addEventListeners() {
    window.addEventListener("resize", this.setWindowDim.bind(this));
  }
}

async function loadShader(source) {
  const shader = await fetch(source).then(response => response.text());
  return shader;
}

async function main() {
  const vsSource = await loadShader("shaders/vshader.glsl");
  const fsSource = await loadShader("shaders/fshader.glsl");

  const canvas = document.getElementById("canvas");
  const julia = new WebGLCanvas(canvas, vsSource, fsSource);
}

window.onload = main;
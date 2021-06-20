// Attribution: this is based off of Professor Tralie's newton.js,
// with some time uniform code pinched from circle.js

/**
 * A class for storing the shader program and buffers for rendering
 * the fractals resulting from iterations of Newton's method on
 * univariate polynomials over the complex numbers
 * 
 * Art Contest assignment edit: it's the above, except I played around
 * with trig functions until I got something nice
 */
class ArtShader extends ShaderProgram {

    clickerDragged(evt) {
        this.clickerDraggedCenterScale(evt);
    }

    /**
     * Asynchronously load the vertex and fragment shaders
     */
    loadShader() {
        let gl = this.glcanvas.gl;
        let artShader = getShaderProgramAsync(gl, "art");
        let shaderObj = this;
        artShader.then(function(shader) {
            // Extract uniforms and store them in the shader object
            shader.uCenterUniform = gl.getUniformLocation(shader, "uCenter");
            shader.uScaleUniform = gl.getUniformLocation(shader, "uScale");
            shader.uTimeUniform = gl.getUniformLocation(shader, "uTime");
            // Extract the position buffer and store it in the shader object
            shader.positionLocation = gl.getAttribLocation(shader, "a_position");
            gl.enableVertexAttribArray(shader.positionLocation);
            shaderObj.shader = shader;
            shaderObj.setupBuffers();
        });
    }

    setupBuffers() {
        let buffers = {};
        // Setup position buffers to hold a square
        buffers.positions = new Float32Array([-1.0,  1.0,
                                            1.0,  1.0,
                                            -1.0, -1.0,
                                            1.0, -1.0]);
        // We don't need a color buffer since colors will be determined
        // in the shader

        // Setup 2 triangles connecting the vertices so that there
        // are solid shaded regions
        buffers.indices = new Uint16Array([0, 1, 2, 1, 2, 3]);
        
        super.setupBuffers(buffers);
        this.setupMenu();
        this.setupMouseHandlers();

        this.time = 0.0;
        this.thisTime = (new Date()).getTime();
        this.lastTime = this.thisTime;

        // Setup animation variables
        this.render();
    }


    /**
     * Setup uniforms that will change based on mouse interaction
     * and inputs
     */
    setupMenu() {
        this.scale = 1.0;
        this.centervec = glMatrix.vec2.fromValues(0, 0);
        let menu = new dat.GUI();
        this.menu = menu;
        this.center = vecToStr(this.centervec);
        let shaderObj = this;
        menu.add(this, 'scale').onChange(this.render.bind(this)).listen();
        menu.add(this, 'center').listen().onChange(
            function(value) {
                let xy = splitVecStr(value);
                for (let k = 0; k < 2; k++) {
                    shaderObj.centervec[k] = xy[k];
                }
                requestAnimationFrame(shaderObj.render.bind(shaderObj));
            }
        );
    }

    /**
     * Draw using WebGL
     */
    render() {
        let gl = this.glcanvas.gl;
        let shader = this.shader;
        gl.useProgram(shader);
        // Step 1: Setup uniform variables that are sent to the shaders
        gl.uniform2fv(shader.uCenterUniform, this.centervec);
        gl.uniform1f(shader.uScaleUniform, this.scale);
        this.thisTime = (new Date()).getTime();
        this.time += (this.thisTime - this.lastTime) / 1000.0;
        this.lastTime = this.thisTime;
        gl.uniform1f(shader.uTimeUniform, this.time);

        // Step 2: Bind vertex and index buffers to draw two triangles
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader.positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        // Step 3: Keep the animation loop going
        requestAnimationFrame(this.render.bind(this));
    }
    
}
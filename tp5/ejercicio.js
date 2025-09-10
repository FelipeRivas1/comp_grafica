// Completar la implementación de esta clase y el correspondiente vertex shader. 
// No será necesario modificar el fragment shader a menos que, por ejemplo, quieran modificar el color de la curva.
class CurveDrawer 
{
	// Inicialización de los shaders y buffers
	constructor()
	{
		// Creamos el programa webgl con los shaders para los segmentos de recta
		this.prog   = InitShaderProgram( curvesVS, curvesFS );

		// [Completar] Incialización y obtención de las ubicaciones de los atributos y variables uniformes
		this.pos = gl.getAttribLocation( this.prog, "t" );
		this.uP0 = gl.getUniformLocation( this.prog, "p0" );
		this.uP1 = gl.getUniformLocation( this.prog, "p1" );
		this.uP2 = gl.getUniformLocation( this.prog, "p2" );
		this.uP3 = gl.getUniformLocation( this.prog, "p3" );
		
		this.mvp = gl.getUniformLocation( this.prog, "mvp" );
		this.p = [ this.uP0, this.uP1, this.uP2, this.uP3 ];

		// Muestreo del parámetro t
		this.steps = 100;
		var tv = [];
		for ( var i=0; i<this.steps; ++i ) {
			tv.push( i / (this.steps-1) );
		}
		
		// [Completar] Creacion del vertex buffer y seteo de contenido
		this.Buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.Buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);
		
	}

	// Actualización del viewport (se llama al inicializar la web o al cambiar el tamaño de la pantalla)
	setViewport( width, height )
	{
		// [Completar] Matriz de transformación.

		var trans = [ 2/width,0,0,0,  0,-2/height,0,0, 0,0,1,0, -1,1,0,1 ];

		// [Completar] Binding del programa y seteo de la variable uniforme para la matriz. 

		gl.useProgram( this.prog );
		gl.uniformMatrix4fv( this.mvp, false, trans );
	}

	updatePoints( pt )
	{
		// [Completar] Actualización de las variables uniformes para los puntos de control
		// [Completar] No se olviden de hacer el binding del programa antes de setear las variables 
		// [Completar] Pueden acceder a las coordenadas de los puntos de control consultando el arreglo pt[]:
		// var x = pt[i].getAttribute("cx");
		// var y = pt[i].getAttribute("cy");
		// Armamos el arreglo
		gl.useProgram(this.prog);
		
		//var p = [];
		for ( var i=0; i<4; ++i ) 
		{
			var x = parseFloat(pt[i].getAttribute("cx"));
			var y = parseFloat(pt[i].getAttribute("cy"));
			
			gl.uniform2f(this.p[i], x, y);
		}
	}

	draw()
	{
		// [Completar] Dibujamos la curva como una LINE_STRIP
		// [Completar] No se olviden de hacer el binding del programa y de habilitar los atributos de los vértices

		// Seleccionamos el shader
		gl.useProgram( this.prog );

		// Binding del buffer de posiciones
		gl.bindBuffer( gl.ARRAY_BUFFER, this.Buffer );

		// Habilitamos el atributo 
		gl.vertexAttribPointer( this.pos, 1, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.pos );

		// Dibujamos lineas utilizando primitivas gl.LINE_STRIP 
		// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
		gl.drawArrays( gl.LINE_STRIP, 0, this.steps );
	}
}

// Vertex Shader
//[Completar] El vertex shader se ejecuta una vez por cada punto en mi curva (parámetro step). No confundir punto con punto de control.
// Deberán completar con la definición de una Bezier Cúbica para un punto t. Algunas consideraciones generales respecto a GLSL: si
// declarás las variables pero no las usás, no se les asigna espacio. Siempre poner ; al finalizar las sentencias. Las constantes
// en punto flotante necesitan ser expresadas como X.Y, incluso si son enteros: ejemplo, para 4 escribimos 4.0
var curvesVS = `
	attribute float t;
	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
	void main()
	{ 
		float u  = 1.0 - t;
		float u2 = u * u;
		float u3 = u2 * u;
		float t2 = t * t;
		float t3 = t2 * t;
		vec2 B = u3 * p0 + 3.0 * u2 * t * p1 + 3.0 * u * t2 * p2 + t3 * p3;
		gl_Position = mvp * vec4(B, 0.0, 1.0);
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(0,0,1,1);
	}
`;


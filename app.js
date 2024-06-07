var vertexShaderText =
[
    'precision mediump float;', //lower precision = faster, less accurate, you know...
    '',
    'attribute vec2 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    '',
    'void main()',
    '{',
    '   fragColor  = vertColor;',
    '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '}'
].join('\n');

var fragmentShaderText = 
[
    'precision mediump float;', //lower precision = faster, less accurate, you know...
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    '   gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n');

var InitDemo = function() {
    console.log('This is working');

    var canvas = document.getElementById("game-surface");
    var gl = canvas.getContext('webgl');

    if (!gl){
        console.log('experimental webgl is being used');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl){
        alert('Your browser does not support WebGL.');
    }

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error('ERROR linking Program!', gl.getProgramInfoLog(program));
        return;
    }
    
    //validate on testing
    //expensive
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error('ERROR validating Program!', gl.getProgramInfoLog(program));
        return;
    }

    //create buffer

    var triangleVertices =
    [// x y             R G B
        0.0, 0.5,       1.0, 1.0, 1.0,
        -0.5, -0.5,     0.7, 0.5, 1.0,
        0.5, -0.5,       0.1, 1.0, 0.6
    ];

    var triangleVertexBufferObject = gl.createBuffer(); // we are creating chunk of memory for gpu
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject); // we set to active buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    //buffer triangle vertices x our attribute

    //get location of attribute, we are to modify from initial state
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(
        positionAttribLocation, //attr location
        2, // num of elem per attribute, because vec2
        gl.FLOAT, // type of elem
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,//size of individual vertext
        0,// Offset from the beginning of single vertex to this attr
    );

    gl.vertexAttribPointer(
        colorAttribLocation, //attr location
        3, // num of elem per attribute, because vec2
        gl.FLOAT, // type of elem
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,//size of individual vertext
        2 * Float32Array.BYTES_PER_ELEMENT,// Offset from the beginning of single vertex to this attr.. see how a vertex has 5 values, to get rgb values offset by 3
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);


    //main render loop
    //while loop for a game for example
    // while(true)
        //updateworld()
        //rederword()
        //keeprunning()?
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);  // type, skip, num of vertices

};
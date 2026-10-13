var createScene = function () {
    // Base scene (as given)
    var scene = new BABYLON.Scene(engine);

    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    ground.isVisible = false;

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    sphere.position.y = 1;
    sphere.position.x = 1;

    var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: 2, diameter: 1}, scene);
    cylinder.position.y = 1;
    cylinder.position.x = -1;
    

    // Vertex Shader
    BABYLON.Effect.ShadersStore["customVertexShader"] = `
    precision highp float;

    /*
    Vertex shader for Phong-style lighting
    - Takes OBJECT-space attributes
    - Produces WORLD-space position/normal for lighting
    - Produces CLIP-space position for rasterization
    */

    // INPUTS (attributes: OBJECT space)
    attribute vec3 position;  // vertex position
    attribute vec3 normal;    // vertex normal

    // INPUTS (uniforms)
    uniform mat4 world;                // object -> world
    uniform mat4 worldViewProjection;  // object -> clip (projection * view * world)

    // OUTPUTS (varyings: WORLD space)
    varying vec3 vPosW;     // world-space position
    varying vec3 vNormalW;  // world-space normal

    void main() {
        // World-space position
        vec4 pw = world * vec4(position, 1.0);
        vPosW = pw.xyz;

        // World-space normal
        vNormalW = normalize(mat3(world) * normal);

        // Clip-space position
        gl_Position = worldViewProjection * vec4(position, 1.0);
    }`;


    // FRAGMENT SHADER: COMPLETE THE MISSING CODE HERE
    BABYLON.Effect.ShadersStore["customFragmentShader"] = `
    precision highp float;

    varying vec3 vPosW;
    varying vec3 vNormalW;

    uniform float uMatAmbient;
    uniform vec3  uMatDiffuse;
    uniform vec3  uMatSpecular;
    uniform float uMatShininess;

    uniform vec3 uCameraPos;

    uniform vec3 uPointLightColor;
    uniform vec3 uPointLightPos;


    vec3 shadePointLight(
        vec3 lColor,
        vec3 lPos,
        vec3 N,
        vec3 V,
        vec3 kd,
        vec3 ks,
        float shin)
    {
        vec3 toLight = lPos - vPosW;

        float dist = length(toLight);

        vec3 L = normalize(toLight);


        // Diffuse
        float NdotL =
            max(dot(N, L), 0.0);

        vec3 diffuse =
            kd * NdotL;


        // Specular
        vec3 specular =
            vec3(0.0);

        if (NdotL > 0.0)
        {
            vec3 R =
                reflect(-L, N);

            float RdotV =
                max(dot(R, V), 0.0);

            float specFactor =
                pow(RdotV, shin);

            specular =
                ks * specFactor;
        }


        // Inverse-square distance attenuation
        float attenuation =
            3.0 / max(dist * dist, 0.0001);


        return attenuation *
            lColor *
            (diffuse + specular);
    }


    void main()
    {
        vec3 N =
            normalize(vNormalW);

        vec3 V =
            normalize(uCameraPos - vPosW);

        // Ambient
        vec3 color =
            uMatAmbient * uMatDiffuse;

        // Diffuse + specular from point light
        color += shadePointLight(
            uPointLightColor,
            uPointLightPos,
            N,
            V,
            uMatDiffuse,
            uMatSpecular,
            uMatShininess
        );

        gl_FragColor =
            vec4(color, 1.0);
    }`;


    var shaderMat = new BABYLON.ShaderMaterial("custom", scene, "custom", {
        attributes: ["position", "normal"],
        uniforms: [
            "world", "worldViewProjection",
            "uCameraPos",
            "uMatAmbient", "uMatDiffuse", "uMatSpecular", "uMatShininess",
            "uPointLightColor", "uPointLightPos"
        ]
    });

    // ADJUST LIGHT AND MATERIAL PROPERTIES HERE
    // Material
    shaderMat.setFloat("uMatAmbient", 0.65);

    shaderMat.setColor3(
        "uMatDiffuse",
        new BABYLON.Color3(0.2, 0.8, 0.3)
    );
    shaderMat.setColor3("uMatSpecular", new BABYLON.Color3(1, 1, 1));
    shaderMat.setFloat("uMatShininess", 32.0);

    // Point Light
    shaderMat.setColor3(
        "uPointLightColor",
        new BABYLON.Color3(2.0, 2.2, 2.5)
    );
    shaderMat.setVector3("uPointLightPos", new BABYLON.Vector3(2.5, 4, -2.0));

    // Update camera position every frame
    scene.onBeforeRenderObservable.add(function () {
        shaderMat.setVector3("uCameraPos", camera.position);
    });

    sphere.material = shaderMat;
    cylinder.material = shaderMat;

    return scene;
};

export default createScene

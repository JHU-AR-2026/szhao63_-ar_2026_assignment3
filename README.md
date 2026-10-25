# AR Assignment 3

**Course:** JHU Introduction to Augmented Reality  
**Author:** Shengying (Wynn) Zhao  
**JHED:** szhao63

## Overview

This repository contains my solutions for Assignment 3 of JHU Introduction to Augmented Reality. The assignment includes WebXR interaction using Babylon.js, camera projection calculations, and custom shader/lighting exercises.

The main assignment files are located in `AR_HW3/`.

## Repository Structure

```text
AR_HW3/
├── Q2_cube_version/
│   └── index.html
│
├── Q2_final_car/
│   ├── assets/
│   │   └── auttvm_dydder_-_armor_part2.glb
│   └── index.html
│
├── Q3.ipynb
│
└── Q4/
    ├── index.html
    ├── Q4_a.js
    ├── Q4_b_1.js
    ├── Q4_b_2.js
    ├── Q4_b_3.js
    └── Q4_c.js
```

## Q2 — WebXR Object Placement and Manipulation

Q2 implements an augmented-reality scene using **Babylon.js and WebXR**.

### `Q2_cube_version`

This is an earlier version of the implementation that places colored cubes into the AR environment.

The application uses WebXR hit testing to locate surfaces in the environment. A visible marker indicates the current hit-test location, and the controller trigger can be used to place a cube at that location.

The most recently placed object can also be manipulated using the XR controllers, including:

- Right trigger: place an object at the current hit-test position
- A button: increase the object's scale
- B button: decrease the object's scale
- Right thumbstick: move the object along the horizontal plane
- Left thumbstick: rotate the object
- X button: reset the most recently placed object to its original position, rotation, and scale

### `Q2_final_car`

This is the final version of Q2. It replaces the cube with an imported `.glb` 3D model located in:

```text
Q2_final_car/assets/auttvm_dydder_-_armor_part2.glb
```

The same WebXR hit-testing and controller-based manipulation functionality is used to place, move, rotate, scale, and reset the imported model.

### Running Q2

Because the pages load JavaScript libraries and local assets, they should be served through a web server rather than opened directly as local files.

From inside the `AR_HW3` directory, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/Q2_cube_version/
```

for the cube version, or:

```text
http://localhost:8000/Q2_final_car/
```

for the final 3D-model version.

A normal desktop browser can be used to load the page, but the immersive AR functionality requires a **WebXR-compatible browser and XR device**. For testing on an external XR device, the page should be hosted through a secure HTTPS connection, such as GitHub Pages.

## Q3 — Camera-to-Pixel Projection

`Q3.ipynb` contains the solution for projecting a 3D point in camera coordinates into image pixel coordinates.

The notebook constructs an OpenGL-style projection matrix and performs the sequence:

```text
camera coordinates
        ↓
clip coordinates
        ↓
perspective divide
        ↓
normalized device coordinates (NDC)
        ↓
pixel coordinates
```

The implementation uses NumPy for the matrix calculations.

### Running Q3

Install Python, NumPy, and Jupyter if needed:

```bash
pip install numpy jupyter
```

Then, from the `AR_HW3` directory, run:

```bash
jupyter notebook
```

Open:

```text
Q3.ipynb
```

and run the notebook cell.

## Q4 — Custom Shaders and Lighting

The `Q4` directory contains Babylon.js implementations of custom vertex and fragment shaders.

The shaders operate on a sphere and cylinder and implement Phong-style lighting components, including:

- World-space vertex positions and normals
- Ambient lighting
- Diffuse lighting
- Specular lighting
- Material shininess
- Point-light position and color
- Distance-based light attenuation
- Camera-dependent specular reflection

The different `Q4_a.js` and `Q4_b_*.js` files contain the shader configurations used for the different parts of the assignment, including variations in material and point-light properties.

`Q4/index.html` provides a browser-runnable version of the shader scene.

### Running Q4

Using the same local server:

```bash
python -m http.server 8000
```

open:

```text
http://localhost:8000/Q4/
```

The scene should display the Babylon.js sphere and cylinder rendered with the custom shader.

The camera can be manipulated using the Babylon.js camera controls to observe how the lighting and specular response change with viewpoint.

## Technologies Used

- Babylon.js
- WebXR
- JavaScript
- GLSL vertex and fragment shaders
- HTML
- Python
- NumPy
- Jupyter Notebook

## Attribution

Assignment implementation by **Shengying (Wynn) Zhao** for JHU Introduction to Augmented Reality.

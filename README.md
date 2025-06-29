# anisotropic-PRW-model-for-curvotaxis

This repository contains the files necessary to run the anisotropic persistence random walk (PRW) model for curvotaxis.
The study can be found at doi: 10.1038/s41598-025-02804-3

The code was developed by Gildas Carlin, Ian Manifacier and Jean-Louis Milan.
The study was conducted by Gildas Carlin, Ian Manifacier, Dang Khoa Cao, Laurent Pieuchot, Valeriy Luchnikov, Jean-Louis Milan



I - How to run the model
------------------------------

We ran the model on 
- Visual Studio Code (VS Code) with the extensions: p5.vscode (Sam Lavigne), Live Server (Ritwick Dey) and WebGL GLSL Editor (Rácz Zalán).
- A web browser, we used Microsoft Edge.

To run the model, launch a local server from VS code and open the model in your web browser.
Ensure that the model's folder is open as a folder in VS Code.


II - Files overview
------------------------------

- index.html: This file is required to bring all the components together. If you add new files, remember to include them in the index.
- sketch.js: This is the main file where the simulation runs.
- param_user.js: This is the only file users need to modify. Users can configure the surface, its parameters, and the cell properties.
- shader.frag and shader.vert: These files handle communication between the code and the computer’s graphics card.
- curvature.js: This file contains the definitions of all surfaces, their derivatives, and curvature calculations. If you wish to add a new surface, you must update both curvature.js and shader.frag.
- cell.js: Defines the Cell class.
- In the assets folder, you will find tables containing parameter values for the cells. These tables contain 300 elements, limiting simulations to a maximum of 300 cells.
- drawarrow.js and pathmaker.js: These files draws arrows or trajectories respectively for visualization only.

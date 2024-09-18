///////////////////////////////////////////
// param_user is a package developed by Gildas Carlin 
// user interface to interact with the model


///////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// I. surface definition

// surface choice
// 'flat' : isotropic flat surface 
// 'right_sinus' : sinusoidal wavy surface
//                 following parameters are required : amplitude a (µm)
//                                                     wavelength lambda (µm)
//                                                     phase shift phi0 (µm)                                                                                  
let surface = 'right_sinus';

let a = 10.0;  
let lambda = 80.0; 
let phi0 = 0.0;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// II. cell parameters
//

let gamma = 40.0;  // µm
let alpha = 0.35;

// cell number
let nbCell = 1;

// cell shape parameters. cell_radius_min is the semi-minor axis, cell_radius_max is the semi-major axis
let cell_radius_min = 10.0;  
let cell_radius_max= 15.0;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// III. integration parameters
//

// trajectory sampling (seconds)
let dt_mesure = 15.0;

// total simulating time (seconds)
let Tmax = 1200.0;  //

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IV. other parameters
//

// do you want to draw trajectories ?
draw_traj = false;



/**
 * File              : param_user.js
 * Original article  : doi
 * Authors           : Gildas Carlin, Ian Manifacier and Jean-Louis Milan
 * Date              : 05/05/2025
 * Description       : User interface.
 */
//


// I. Surface 
//-------------------------------------------------------------------------------------------------------
//
// 'flat' : flat homogeneous surface
// 'right_sinus': sinus along the y-axis  -- amplitude a (µm)
//                                        -- wavelength lambda (µm)

let surface = 'right_sinus';

let a = 10.0;  
let lambda = 80.0;  


// II. Cell 
//-------------------------------------------------------------------------------------------------------

// cells number
let nbCell = 1;

// gamma and alpha parameters which depends with curvature
let gamma = 40.0;
let alpha = 0.0;
if (lambda==20.0){  
    gamma=180.0;
    alpha=0.5;
} else if (lambda==40.0){ 
    gamma=50.0;
    alpha=0.4;
}  else if (lambda==80.0){  
    gamma=70.0;
    alpha=0.35;
} else if (lambda==160.0){ 
    gamma=50.0;
    alpha=0.0;
}

// cell shape (visual only)
let cell_radius_min = 10.0;  
let cell_radius_max= 15.0;



// III. Model integration 
//-------------------------------------------------------------------------------------------------------

// trajectory sample (seconds)
let dt_mesure = 15.0; 

// simulation duration (seconds)
let Tmax = 1200.0;  


// IV. Others
//-------------------------------------------------------------------------------------------------------

// export a .csv file containing trajectories data
let data = true;
let file_name_data= 'data.csv';

// draw trajectories or not (deprecated if nbCell>5)
let draw_traj = false;

// record screenshot video
let screen = false;
let captureLength = 3000;



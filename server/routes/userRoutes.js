import express from 'express';  // Imported framework for defining routes

import { getProfile, 
         updateProfile 
        } from '../controller/userController.js'; // import controller functions

import verifyJWT from '../middleware/verifyJWT.js'; // Import verifyJWT auth middleware


const router = express.Router();

router.get('/profile', verifyJWT, getProfile); // GET '/profile' - Get authenticated user's profile data
                                               //                  Also use verifyJWT to get loggedin user's ID 
                                               //                  since this is a protected route.

router.patch('/profile', verifyJWT, updateProfile); // PATCH '/profile' - Update authenticated user's profile data
                                                    //                  Like earlier, use verifyJWT to get loggedin
                                                    //                  user's ID  since this is a protected route.

export default router; // export this router for server.js

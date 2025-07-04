import express from 'express';  // Imported framework for defining routes
import verifyJWT from '../middleware/verifyJWT.js'; // Import verifyJWT auth middleware

import { getProfile, 
         updateProfile 
        } from '../controller/userController.js'; // import controller functions

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile operations (👤 MUST to be registered and logged-in to test ALL user/profile routes)
 */




/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [User]
 *     description: After user logs in, '/profile' returns all profile fields for the authenticated user.
 *     security:
 *       - bearerAuth: []  # Requires JWT token(user needs to be logged in)
 *     responses:
 *       200:
 *         description: User profile data returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     address_line1:
 *                       type: string
 *                     address_line2:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     postal_code:
 *                       type: string
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error fetching profile
 */
router.get('/profile', verifyJWT, getProfile); // GET '/profile' - Get authenticated user's profile data
                                               //                  Also use verifyJWT to get loggedin user's ID 
                                               //                  since this is a protected route.



/**
 * @swagger
 * /profile:
 *   patch:
 *     summary: Update authenticated user's profile
 *     tags: [User]
 *     description: |
 *              Update logged-in user's profile data using patch(). For this to work on 'try it out', these are the main rules for patch():
 *              [#1]: User Needs to be logged-in.
 *              [#2]: ALL fields need to be filled (no empty strings) for patch to work.
 *              [#3]: To preserve/reuse old values, they need to be re-inserted as part of patch() data; you can use GET '/profile' route to retrieve current profile values.
 *              [#4]: Lastly, phone number (NNN-NNN-NNNN) and state initials (2 letters) need to be in correct format.
 *     security:
 *       - bearerAuth: []  # Requires JWT token(user needs to be logged in)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               address_line1:
 *                 type: string
 *               address_line2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postal_code:
 *                 type: string
 *           example:
 *             first_name: firstName
 *             last_name: lastName
 *             email: first.last@example.com    ## must be unique (no other account uses same email currently)
 *             phone_number:    "555-555-5555"
 *             address_line1:   "555 Some Ave."
 *             address_line2:   "Unit 1A"
 *             city:            "Miami"
 *             state:           "FL"
 *             postal_code:     "55555"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Duplicate email or username
 */
router.patch('/profile', verifyJWT, updateProfile); // PATCH '/profile' - Update authenticated user's profile data
                                                    //                  Like earlier, use verifyJWT to get loggedin
                                                    //                  user's ID  since this is a protected route.

export default router; // export this router for server.js

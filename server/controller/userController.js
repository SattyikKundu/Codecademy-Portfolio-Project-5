import { getUserProfileById, updateUserProfile } from '../model/userModel.js'; // import functions from userModel.js

export const getProfile = async (req, res) => { // controller function that fetches authenticated user's profile data.

    try {
        const userId = req.user.id; // get loggedin user's ID from verified JWT middleware
        const userProfile = await getUserProfileById(userId); // get profile data by Id

        if (!userProfile) { // return error if user not found
        return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: userProfile }); // if retrieval successful, return user profile 
                                                     // data as JSON object under key 'user'
    }
    catch(error) { // if error, return 'error' in json object
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
}

export const updateProfile = async (req, res) => { // controller function to update authenticated user's profile data.

  try {
    const userId = req.user.id;     // user Id from JWT middleware (in route)
    const updatedFields = req.body; // updated fields from request body 

    const updatedUser = await updateUserProfile(userId, updatedFields); // execute updating to database

    res.status(200).json({ // return success message and updated profile data as JSON object under key 'user' to frontend
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } 
  catch (error) { // Otherwise handle error and return error JSON response.
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};


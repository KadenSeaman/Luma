const User = require('../models/userModel.js');

const createUser = async(req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } catch (error){
        res.json({message: 'Error creating new user'});
    }
}

export default createUser;
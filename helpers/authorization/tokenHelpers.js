const sendJwtToClient = (user, res) => {
    //Generate JWT
    const token = user.generateJwtFromUser();
    const {JWT_COOKIE, NODE_ENV} = process.env;

    return res
    .status(200)
    .cookie('access_token', token, 
    { 
        httpOnly: true,
        secure: NODE_ENV === "development" ? false : true,
        expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
        
    })
    .json({
        success: true,
        access_token: token,
        data: {
            username: user.username,
            email: user.email
        }
    })
};

const isTokenIncluded = (req) => {
     
    return req.headers.authorization && req.headers.authorization.startsWith('Bearer ');

};

const getAccessTokenFromHeader = (req) => {
    const authorization = req.headers.authorization;
    const access_token = authorization.split(' ')[1];
    return access_token;
};

module.exports = {sendJwtToClient, isTokenIncluded, getAccessTokenFromHeader};
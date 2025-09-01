const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET || 'secret';

module.exports = async function(req, res, next){
  const token = req.headers['authorization']?.split(' ')[1];
  if(!token) return res.status(401).json({error:'No token'});
  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id);
    if(!req.user) return res.status(401).json({error:'Invalid user'});
    next();
  } catch (err) {
    return res.status(401).json({error:'Token invalid'});
  }
};

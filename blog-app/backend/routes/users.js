const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// follow user
router.post('/follow/:id', auth, async (req, res) => {
  try {
    const toFollow = await User.findById(req.params.id);
    if(!toFollow) return res.status(404).json({error:'No user'});
    if(String(toFollow._id) === String(req.user._id)) return res.status(400).json({error:'Self'});
    // add follower/following
    if(!toFollow.followers.includes(req.user._id)) {
      toFollow.followers.push(req.user._id);
      await toFollow.save();
    }
    if(!req.user.following.includes(toFollow._id)){
      req.user.following.push(toFollow._id);
      await req.user.save();
    }
    res.json({message:'followed'});
  } catch(err){
    res.status(500).json({error:err.message});
  }
});

// unfollow
router.post('/unfollow/:id', auth, async (req, res) => {
  try {
    const to = await User.findById(req.params.id);
    if(!to) return res.status(404).json({error:'No user'});
    to.followers = to.followers.filter(f => String(f)!==String(req.user._id));
    await to.save();
    req.user.following = req.user.following.filter(f => String(f)!==String(to._id));
    await req.user.save();
    res.json({message:'unfollowed'});
  } catch(err){
    res.status(500).json({error:err.message});
  }
});

// get profile
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if(!user) return res.status(404).json({error:'No user'});
  res.json(user);
});

module.exports = router;

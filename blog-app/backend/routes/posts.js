const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

// create post
router.post('/', auth, async (req,res)=>{
  try{
    const { title, content, tags, visibility } = req.body;
    const p = new Post({
      author: req.user._id,
      title, content,
      tags: Array.isArray(tags)?tags: (tags?tags.split(',').map(t=>t.trim()):[]),
      visibility: visibility==='private'?'private':'public'
    });
    await p.save();
    res.json(p);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// edit post
router.put('/:id', auth, async (req,res)=>{
  try{
    const p = await Post.findById(req.params.id);
    if(!p) return res.status(404).json({error:'No post'});
    if(String(p.author)!==String(req.user._id)) return res.status(403).json({error:'Not author'});
    const { title, content, tags, visibility } = req.body;
    p.title = title||p.title;
    p.content = content||p.content;
    p.tags = tags? (Array.isArray(tags)?tags:tags.split(',').map(t=>t.trim())):p.tags;
    p.visibility = visibility||p.visibility;
    await p.save();
    res.json(p);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// delete
router.delete('/:id', auth, async (req,res)=>{
  try{
    const p = await Post.findById(req.params.id);
    if(!p) return res.status(404).json({error:'No post'});
    if(String(p.author)!==String(req.user._id)) return res.status(403).json({error:'Not author'});
    await p.remove();
    res.json({message:'deleted'});
  }catch(err){ res.status(500).json({error:err.message}); }
});

// get public posts (with optional tag filter)
router.get('/public', async (req,res)=>{
  try{
    const tag = req.query.tag;
    const q = { visibility: 'public' };
    if(tag) q.tags = tag;
    const posts = await Post.find(q).populate('author','username').sort({createdAt:-1});
    res.json(posts);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// get post by id (private posts accessible only to owner or via special flow)
router.get('/:id', auth, async (req,res)=>{
  try{
    const p = await Post.findById(req.params.id).populate('author','username');
    if(!p) return res.status(404).json({error:'No post'});
    if(p.visibility==='private' && String(p.author._id)!==String(req.user._id)){
      return res.status(403).json({error:'Private'});
    }
    // also return comments
    const comments = await Comment.find({post:p._id}).populate('author','username').sort({createdAt:1});
    res.json({post:p, comments});
  }catch(err){ res.status(500).json({error:err.message}); }
});

// feed: posts from following users (only public and owner's private)
router.get('/feed', auth, async (req,res)=>{
  try{
    const following = req.user.following || [];
    const posts = await Post.find({
      author: { $in: following },
      visibility: 'public'
    }).populate('author','username').sort({createdAt:-1});
    res.json(posts);
  }catch(err){ res.status(500).json({error:err.message}); }
});

// comments
router.post('/:id/comments', auth, async (req,res)=>{
  try{
    const p = await Post.findById(req.params.id);
    if(!p) return res.status(404).json({error:'No post'});
    const c = new Comment({ post: p._id, author: req.user._id, content: req.body.content });
    await c.save();
    res.json(c);
  }catch(err){ res.status(500).json({error:err.message}); }
});

module.exports = router;

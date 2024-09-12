const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Podcast = require('../models/Podcast');
const Project = require('../models/Project');

// Add a new podcast to a project
router.post('/:projectId', auth, async (req, res) => {
  try {
    const { name, fileUrl, youtubeUrl, rssFeedUrl } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const newPodcast = new Podcast({
      name,
      project: project._id,
      fileUrl,
      youtubeUrl,
      rssFeedUrl,
    });

    const podcast = await newPodcast.save();

    project.podcasts.push(podcast._id);
    await project.save();

    res.json(podcast);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all podcasts for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const podcasts = await Podcast.find({ project: req.params.projectId }).sort({ uploadDate: -1 });
    res.json(podcasts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update podcast transcript
router.put('/:id/transcript', auth, async (req, res) => {
  try {
    const { transcript } = req.body;
    const podcast = await Podcast.findById(req.params.id);

    if (!podcast) {
      return res.status(404).json({ msg: 'Podcast not found' });
    }

    const project = await Project.findById(podcast.project);

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    podcast.transcript = transcript;
    podcast.status = 'Done';
    await podcast.save();

    res.json(podcast);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
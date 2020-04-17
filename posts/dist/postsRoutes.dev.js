"use strict";

var express = require('express');

var posts = require('../data/db');

var router = express.Router();
router.post("", function (req, res) {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }

  posts.insert(req.body).then(function (post) {
    res.status(201).json(post);
  })["catch"](function (error) {
    console.log(error);
    return res.status(500).json({
      error: "There was an error while saving the post to the database"
    });
  });
});
router.post("/:id/comments", function (req, res) {
  console.log(req.params.id);
  var postId = req.params.id;
  req.body.post_id = postId;

  if (!req.body.text) {
    return res.status(400).json({
      errorMessage: "Please provide text for the comment."
    });
  }

  var postComment = posts.findPostComments(req.body.post_id);

  if (postComment.length === 0) {
    return res.status(404).json({
      message: "The post with the specified ID does not exist."
    });
  }

  try {
    posts.insertComment(req.body).then(function (comment) {
      return res.status(201).json(comment);
    })["catch"](function (error) {
      //console.log(error);
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "There was an error while saving the comment to the database"
    });
  }
});
router.get("", function (req, res) {
  posts.find().then(function (posts) {
    res.status(200).json(posts);
  })["catch"](function (error) {
    console.log(error);
    return res.status(500).json({
      error: "The posts information could not be retrieved."
    });
  });
});
router.get("/:id", function (req, res) {
  posts.findById(req.params.id).then(function (post) {
    // console.log(post);
    if (post.length === 0) {
      return res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    }

    return res.status(200).json(post);
  })["catch"](function (error) {
    console.log(error);
    return res.status(500).json({
      error: "The post information could not be retrieved."
    });
  });
});
router.get("/:id/comments", function (req, res) {
  posts.findCommentById(req.params.id).then(function (post) {
    // console.log(post);
    if (post.length === 0) {
      return res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    }

    return res.status(200).json(post);
  })["catch"](function (error) {
    console.log(error);
    return res.status(500).json({
      error: "The comments information could not be retrieved."
    });
  });
});
router["delete"]("/:id", function (req, res) {
  posts.findById(req.params.id).then(function (post) {
    if (post.length === 0) {
      return res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    }
  });
  posts.remove(req.params.id).then(function (post) {
    res.status(204).json();
  })["catch"](function (error) {
    res.status(500).json({
      error: "The post could not be removed"
    });
  });
});
router.put("/:id", function (req, res) {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }

  posts.findById(req.params.id).then(function (post) {
    if (post.length === 0) {
      return res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    }
  })["catch"](function (error) {
    console.log(error);
  });
  posts.update(req.params.id, req.body).then(function (post) {
    console.log(res);
    return res.status(200).json(post);
  })["catch"](function (error) {
    console.log(error);
    return res.status(500).json({
      error: "The post information could not be modified."
    });
  });
});
module.exports = router;
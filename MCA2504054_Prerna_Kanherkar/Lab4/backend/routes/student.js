const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Student Module");
});

module.exports = router;
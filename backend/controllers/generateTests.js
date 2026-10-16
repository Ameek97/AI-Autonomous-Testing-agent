const generateTests = (req, res) => {
  try {
    const repo = req.body && req.body.repo;

    if (repo == null || typeof repo !== "object" || Array.isArray(repo)) {
      return res.status(400).json({
        message: "Repository is required",
      });
    }

    console.log("Selected repository:", repo);

    return res.status(200).json({
      message: "Test generation request received",
      repo: {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
      },
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      message: "Failed to process test generation request",
    });
  }
};

module.exports = generateTests;

const express = require("express");

const app = express();

app.use(express.json());
const cors = require("cors");
const { initializeToDatabase } = require("./db/db.connect");
const jwt = require("jsonwebtoken");
const userModel = require("./models/userModel");
const auth = require("./middleware/auth");
const project = require("./models/project");
const taskModel = require("./models/task.model");
const team = require("./models/team");

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
initializeToDatabase();

app.get("/", (req, res) => {
  res.json({ message: "this is task management api" });
});

async function createUser({ name, email, password }) {
  try {
    const user = new userModel({ name, email, password });
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    console.error(error);
  }
}
app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      res.json({ message: "user already exist." });
    }
    const savedUser = await createUser({ name, email, password });
    if (savedUser) {
      res.status(201).json(savedUser);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch user" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch user" });
  }
});

app.get("/users", auth, async (req, res) => {
  try {
    const user = await userModel.find();
    if (user.length > 0) {
      res.status(201).json(user);
    } else {
      res.status(404).json({ error: "No user found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch user." });
  }
});

app.post("/projects", auth, async (req, res) => {
  try {
    const newProject = new project(req.body);
    const saveProject = await newProject.save();
    if (saveProject) {
      res.status(201).json(saveProject);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch project." });
  }
});

app.get("/projects", auth, async (req, res) => {
  try {
    const allProject = await project.find();
    if (allProject.length > 0) {
      res.status(201).json(allProject);
    } else {
      res.status(404).json({ error: "No project found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch project." });
  }
});

app.delete("/projects/:id", auth, async (req, res) => {
  try {
    const deletedProject = await project.findByIdAndDelete(req.params.id);

    if (deletedProject) {
      res.status(200).json(deletedProject);
    } else {
      res.status(404).json({ error: "No project found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch project." });
  }
});

app.post("/teams", auth, async (req, res) => {
  try {
    const newTeam = new team(req.body);
    const saveTeam = await newTeam.save();
    if (saveTeam) {
      res.status(201).json(saveTeam);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch team." });
  }
});

app.get("/teams", auth, async (req, res) => {
  try {
    const allTeam = await team.find();
    if (allTeam.length > 0) {
      res.status(201).json(allTeam);
    } else {
      res.status(404).json({ error: "No team found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch project." });
  }
});

app.delete("/teams/:id", auth, async (req, res) => {
  try {
    const deletedTeam = await team.findByIdAndDelete(req.params.id);

    if (deletedTeam) {
      res.status(200).json(deletedTeam);
    } else {
      res.status(404).json({ error: "No team found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch team." });
  }
});

app.post("/tasks", auth, async (req, res) => {
  try {
    const newTask = new taskModel(req.body);
    const saveTask = await newTask.save();
    if (saveTask) {
      res.status(201).json(saveTask);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch task." });
  }
});

app.post("/tasks/:id", auth, async (req, res) => {
  try {
    const updatedTask = await taskModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (updatedTask) {
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ error: "No task found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task." });
  }
});

app.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const deletedTask = await taskModel.findByIdAndDelete(req.params.id);

    if (deletedTask) {
      res.status(200).json(deletedTask);
    } else {
      res.status(404).json({ error: "No task found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch task." });
  }
});

app.get("/tasks", auth, async (req, res) => {
  try {
    const { team, owner, tags, project, status } = req.query;
    let filterCriteria = {};
    if (team) {
      filterCriteria.team = team;
    }
    if (owner) {
      filterCriteria.owner = owner;
    }
    if (tags) {
      filterCriteria.tags = tags;
    }
    if (project) {
      filterCriteria.project = project;
    }
    if (status) {
      filterCriteria.status = status;
    }
    console.log(filterCriteria);

    const allTask = await taskModel
      .find(filterCriteria)
      .populate("project")
      .populate("team")
      .populate("owners");
    if (allTask.length > 0) {
      res.status(201).json(allTask);
    } else {
      res.status(404).json({ error: "No task found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fatch task." });
  }
});

app.get("/report/last-week", async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const tasks = await taskModel
      .find({
        status: "Completed",
        updatedAt: { $gte: oneWeekAgo },
      })
      .exec();

    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/report/pending-work", async (req, res) => {
  try {
    const result = await taskModel.aggregate([
      {
        $match: {
          status: { $ne: "Completed" },
          project: { $exists: true, $ne: null },
          team: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$project",
          pendingWork: { $sum: "$timeToComplete" },
        },
      },
    ]);

    console.log(result);
    res.status(200).json({ groupedBy: "project", data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/report/closed-tasks", async (req, res) => {
  try {
    const result = await taskModel.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: "$team",
          closedCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({ groupedBy: "team", data: result });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

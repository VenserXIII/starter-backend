const express = require('express')
const { v4, validate } = require('uuid')

const app = express()
app.use(express.json())
app.use(logger)
app.use("/projects/:id", validateProjectID)

function logger(req, res, next) {
  const { method, url } = req

  const log = `[${method.toUpperCase()}] ${url}`
  console.time(log)
  next()
  console.timeEnd(log)
}

function validateProjectID(req, res, next) {
  const { id } = req.params

  if (!validate(id)) {
    return res.status(400).json({ error: "Invalid project ID." })
  }

  next()
}

const projects = []

app.get("/projects", (req, res) => {
  const { title } = req.query

  const results = title
    ? projects.filter(i => i.title.includes(title))
    : projects

  return res.json(results)
})

app.post("/projects", (req, res) => {
  const { title, owner } = req.body

  const project = { id: v4(), title, owner }
  projects.push(project)

  return res.json(project)
})

app.put("/projects/:id", (req, res) => {
  const { id } = req.params
  const { title, owner } = req.body

  const project = { id, title, owner }
  const projectIndex = projects.findIndex(i => i.id === id)
  if (projectIndex < 0) {
    return res.status(400).json({ error: "Project not found." })
  }
  projects[projectIndex] = project

  return res.json(project)
})

app.delete("/projects/:id", (req, res) => {
  const { id } = req.params

  const projectIndex = projects.findIndex(i => i.id === id)
  if (projectIndex < 0) {
    return res.status(400).json({ error: "Project not found." })
  }
  projects.splice(projectIndex, 1)

  return res.status(204).send()
})

app.listen(3333, () => console.log("Serving on port 3333."))

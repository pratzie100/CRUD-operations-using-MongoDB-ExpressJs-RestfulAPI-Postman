const Joi = require("joi");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  age: { type: Number, min: 0, max: 120 },
  email: { type: String, required: true, match: /.*@.*\..*/ },
  enrollmentDate: { type: Date, default: Date.now }
}, { versionKey: false });

const Student = mongoose.model("Student", studentSchema);

// Validation schema
const validateStudent = (student) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    age: Joi.number().min(0).max(120),
    email: Joi.string().email().required(),
    enrollmentDate: Joi.date()
  });
  return schema.validate(student);
};

// GET all students
router.get("/", async (req, res) => {
  const students = await Student.find().sort("name");
  res.send(students);
});

// GET student by ID
router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send(`ID: ${req.params.id} not found!`);
  res.send(student);
});

// POST new student
router.post("/", async (req, res) => {
  const { error } = validateStudent(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let student = new Student({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    enrollmentDate: req.body.enrollmentDate
  });
  student = await student.save();
  res.send(student);
});

// PUT update student by ID
router.put("/:id", async (req, res) => {
  const { error } = validateStudent(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      enrollmentDate: req.body.enrollmentDate
    },
    { new: true }
  );
  if (!student) return res.status(404).send(`ID: ${req.params.id} not found!`);
  res.send(student);
});

// PATCH partial update student by ID
router.patch("/:id", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(2),
    age: Joi.number().min(0).max(120),
    email: Joi.string().email(),
    enrollmentDate: Joi.date()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send(`ID: ${req.params.id} not found!`);

  if (req.body.name) student.name = req.body.name;
  if (req.body.age) student.age = req.body.age;
  if (req.body.email) student.email = req.body.email;
  if (req.body.enrollmentDate) student.enrollmentDate = req.body.enrollmentDate;
  await student.save();
  res.send(student);
});


// DELETE student by ID
router.delete("/:id", async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).send(`ID: ${req.params.id} not found!`);
  
    res.send(student);
  });

module.exports = router;

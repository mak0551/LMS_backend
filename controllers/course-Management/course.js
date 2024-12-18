import { course } from "../../models/course";

export const createCourse = async (req, res) => {
  try {
    const body = req.body;
    const newCourse = await course.create(body);
    res.status(200).json(newCourse);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

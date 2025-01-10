import { enrollMent } from "../../models/course-Management/enrollment.js";

export const createEnrollment = async (req, res) => {
  try {
    const body = req.body;
    const newEnrollment = await enrollMent.create(body);
    res.status(200).json(newEnrollment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getEnrollments = async (req, res) => {
  try {
    const findEnrollments = await enrollMent.find();
    if (findEnrollments.length === 0) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(findEnrollments);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const findEnrollment = await enrollMent.findById(id);
    if (!findEnrollment) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(findEnrollment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedEnrollment = await enrollMent.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedEnrollment) {
      return res.status(404).json({ message: "no records found to update" });
    }
    res.status(200).json(updatedEnrollment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteEnrollments = await enrollMent.findByIdAndDelete(id);
    if (!deleteEnrollments) {
      return res.status(404).json({ message: "no records found to delete" });
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

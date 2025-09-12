const Lead = require("../models/lead.model");

// Common response helper
const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};

// Create a new Lead
exports.createLead = async (req, res) => {
  try {
    // Check if lead exists (including soft deleted)
    const existingLead = await Lead.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });

    if (existingLead && !existingLead.isDeleted) {
      return sendResponse(res, 400, false, "Lead with same email/phone already exists");
    }

    if (existingLead && existingLead.isDeleted) {
      // Reactivate instead of duplicate error
      existingLead.isDeleted = false;
      existingLead.name = req.body.name || existingLead.name;
      existingLead.source = req.body.source || existingLead.source;
      await existingLead.save();
      return sendResponse(res, 200, true, "Lead restored successfully", existingLead);
    }

    const lead = await Lead.create(req.body);
    return sendResponse(res, 201, true, "Lead created successfully", lead);

  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

// Get all leads with pagination, search, and sorting
exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", search = "" } = req.query;

    const query = {
      isDeleted: false,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { source: { $regex: search, $options: "i" } }
      ]
    };

    const leads = await Lead.find(query)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Lead.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      data: {
        leads,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Get a single lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, isDeleted: false });
    if (!lead) return sendResponse(res, 404, false, "Lead not found");
    return sendResponse(res, 200, true, "Lead fetched successfully", lead);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

// Update a lead   (OPTIONAL)
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!lead) return sendResponse(res, 404, false, "Lead not found");
    return sendResponse(res, 200, true, "Lead updated successfully", lead);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

// Soft delete a lead (avoid permanent deletion)
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!lead) return sendResponse(res, 404, false, "Lead not found");
    return sendResponse(res, 200, true, "Lead soft deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

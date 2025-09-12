const express = require("express");
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/lead.controller");
const validate = require("../middlewares/validate");
const leadValidation = require("../validators/lead.validator");

const router = express.Router();

router.post("/", validate(leadValidation), createLead);
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.put("/:id", validate(leadValidation), updateLead);
router.delete("/:id", deleteLead);

module.exports = router;

/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/:table_id/seat")
  .get(controller.list)
  .put(controller.update)
  .delete(controller.free)
  .all(methodNotAllowed);

// router
//   .route("/:table_id")
//   // .get(controller.list)
//   // .put(controller.update)
//   .delete(controller.free)
//   .all(methodNotAllowed);

router.route("/new").post(controller.create).all(methodNotAllowed);
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;

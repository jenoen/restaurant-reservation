/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").get(controller.list);

// router.route("/new").post(controller.list);

// router
//   .route("/:movieId/reviews")
//   .get(controller.readReviewsByMovieId)
//   .all(methodNotAllowed);

// router.route("/:movieId").get(controller.read).all(methodNotAllowed);

// router.route("/?is_showing=true").get(controller.list).all(methodNotAllowed);

// router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;

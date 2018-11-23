import express from "express";
import * as bodyParser from "body-parser";
import multer from "multer";

const router = express.Router();
const url = "uploads/";
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, url);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({
  storage,
});

router.use(bodyParser.json({ limit: "50mb" }));

router.post(
  "/",
  upload.single("uploadfile"),
  async (req: express.Request, res: express.Response) => {
    try {
      const result =
        "http://" + req.headers.host + "/uploads/" + req.file.originalname;
      res.status(200).send(result);
    } catch (err) {
      return res.status(404).send(err);
    }
  },
);

// router.get(
//   "/url/:filename",
//   async (req: express.Request, res: express.Response) => {
//     try {
//       const result = "../../uploads/[Yapp Web 5팀] 180816_아이디어요약서.pdf";
//       res.status(200).send(result);
//     } catch (err) {
//       return res.status(404).send(err);
//     }
//   },
// );

export default router;

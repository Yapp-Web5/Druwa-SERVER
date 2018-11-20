import express from "express";
import formidable from "formidable";
import AWS, { config } from "aws-sdk";
import * as bodyParser from "body-parser";
import multer from "multer";
import multerS3 from "multer-s3";
import * as fs from "fs";

AWS.config.loadFromPath(__dirname + "/../configs/awsconfig.json");

const S3 = new AWS.S3();
const router = express.Router();
const bucketName = 'uploaddruwa';
router.use(bodyParser.json({ limit: "50mb" }));

//file이름 정책
export const upload = multer({
  storage: multerS3({
    s3: S3,
    bucket: bucketName,
    acl: 'public-read-write',
    // metadata: function (req, file, cb) {
    //   cb(null, { fieldname: file.fieldname })
    // },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
});

router.post("/", upload.single('uploadfile'), async (req: express.Request, res: express.Response) => {
  try {
    //const form = new formidable.IncomingForm();
    // const data = await form.parse();
    // const { userfile } = req.body;
    // const s3 = new AWS.S3();
    // //const data = fs.createReadStream(userfile.files); 
    // const data = fs.readFileSync(userfile.files);
    // const params = {
    //   Bucket: bucketName,
    //   Key: userfile.files, //+ '_' + new Date().toString(),
    //   ACL: "public-read",
    //   Body: data,
    //   contentType: multerS3.AUTO_CONTENT_TYPE,
    // };
    // const getdata = await s3.upload(params);
    // console.log(data.Location);
    //room db pdf path 저장?
    //room url 알려줘야한다.
    //console.log(req.file);
    console.log("uploadfile success : " + req.file.originalname);
    var params = { Bucket: bucketName, Key: req.file.originalname };
    const result = await S3.getSignedUrl('getObject', params);
    //console.log(result);
    return res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.status(404).send(err);
  }
});


router.get('/url/:filename', async (req: express.Request, res: express.Response) => {
  try {
    var params = { Bucket: bucketName, Key: req.params.filename };
    const result = await S3.getSignedUrl('getObject', params);
    res.status(200).send(result);
  } catch (err) {
    return res.status(404).send(err);
  }
});

export default router;
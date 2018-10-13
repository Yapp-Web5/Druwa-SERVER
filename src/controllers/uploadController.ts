import express from "express";
import formidable from "formidable";
import AWS from "aws-sdk";
import * as bodyParser from "body-parser";
AWS.config.region = "ap-northeast-2";
AWS.config.update({
  accessKeyId: "AKIAIPGC2ET6NNFNYWMQ",
  secretAccessKey: "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",
});
const app = express();
// const url = "https://s3.ap-northeast-2.amazonaws.com/druwaupload/test1";

const router = express.Router();
router.use(bodyParser.json({ limit: "50mb" }));

app.post("/upload", async (req: express.Request, res: express.Response) => {
  try {
    const form = new formidable.IncomingForm();
    // const data = await form.parse();
    const { userfile } = req.body;
    const s3 = new AWS.S3();

    const params = {
      Bucket: "druwaupload/test1",
      Key: userfile.name,
      ACL: "public-read",
      Body: userfile.data,
      ContentEncoding: "base64",
      contentType: "application/pdf",
    };
    const getdata = await s3.upload(params);
    // console.log(data.Location);
    return res.status(200).send((getdata as any).Location);
  } catch (err) {
    return res.status(404).send(err);
  }
});

/*
app.post('/download', async (req: express.Request, res: express.Response) => {
  try {
    const filekey=req.body.key;
    var params1 = {
      Bucket: 'druwaupload/test1',
      Key: filekey,
    };
    const Key = '';
    var s3 = new AWS.S3();
    console.log(url+key);
    res.send(url + Key);
  } catch (err) {
    return res.status(404).send(err);
  }

});
*/

export default router;

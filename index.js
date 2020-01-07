const express = require('express');
const app = express();
const multer = require("multer");
const { TesseractWorker } = require("tesseract.js")
const worker = new TesseractWorker();
const port = process.env.PORT || 5000;

var storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "./uploads");
  // },
  filename: function (req, file, cb) {
    let math = ["image/jpeg", "image/png"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `File ${file.originalname} không phù hợp. Chỉ cho phép tải file ảnh: jpeg hoặc png.`;
      return cb(errorMess, null);
    }
    cb(null, file.originalname) //Appending extension path.extname(file.originalname)
  }
})

const upload = multer ({storage: storage})
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index');
})
app.post('/', upload.single('avatar'), (req, res) => {
  worker.recognize(req.file.path, "eng")
  .progress(progress =>{
    console.log(process);
  })
  .then(result => {
    res.render( 'index.pug', {
      rs : result.text
    });
  })
  // .finally(() => worker.terminate());
})

app.listen(port, function(){ 
  console.log('app listening at port: ' + port);
});
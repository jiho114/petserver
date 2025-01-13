const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const models = require('./models');
const multer = require("multer");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config(); // .env 파일 로드

const app = express();
const port = 8080;

// 환경 변수 설정
const secretKey = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const dbFilePath = path.resolve(__dirname, 'database.sqlite'); // SQLite 절대 경로
const uploadDir = path.resolve(__dirname, 'uploads');

// uploads 폴더가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer 설정
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// Middleware 설정
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-production-url.com'], // 허용하는 출처 추가
  credentials: true,
}));
app.use("/uploads", express.static(uploadDir));

// Routes
app.get('/products', (req, res) => {
  models.Product.findAll()
    .then((result) => {
      console.log("PRODUCTS:", result);
      res.send({ products: result });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러 발생");
    });
});

app.post('/products', (req, res) => {
  const { name, description, seller, price, imageUrl } = req.body;
  if (!name || !description || !seller || !price) {
    return res.status(400).send("모든 필드값을 입력해주세요");
  }
  models.Product.create({ name, description, price, seller, imageUrl })
    .then((result) => {
      console.log('상품 생성 결과:', result);
      res.send({ product: result });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send('상품 업로드 실패');
    });
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  models.Product.findOne({ where: { id } })
    .then((result) => {
      console.log('PRODUCT:', result);
      res.send({ product: result });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("상품 조회 에러 발생");
    });
});

app.post('/image', upload.single('image'), (req, res) => {
  const file = req.file;
  res.send({ imageUrl: file.path });
});

app.post('/users', async (req, res) => {
  const { user_id, pw, name, phone, email, birth, marketingChecked } = req.body;
  if (!user_id || !pw || !name || !phone || !email || !birth || !marketingChecked) {
    return res.status(400).send('모든 필드를 입력해주세요');
  }
  try {
    const existingUser = await models.User.findOne({ where: { user_id } });
    if (existingUser) {
      return res.status(400).send({ success: false, message: '이미 사용 중인 아이디입니다.' });
    }
    const newUser = await models.User.create({
      user_id, pw, name, phone, email, birth, marketingChecked
    });
    res.send({ success: true, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send('회원가입 실패');
  }
});

app.post('/users/login', (req, res) => {
  const { user_id, pw } = req.body;

  models.User.findOne({ where: { user_id } })
    .then((result) => {
      if (result && result.pw === pw) {
        const user = { id: result.user_id, username: result.user_id };
        const accessToken = jwt.sign(user, secretKey, { expiresIn: '1h' });
        res.send({ user: result.user_id, accessToken });
      } else {
        res.status(401).send({ message: '로그인 실패' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('서버 오류');
    });
});

app.post('/auth', (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).send(false);
  }
  try {
    const decoded = jwt.verify(accessToken, secretKey);
    res.send({ result: decoded });
  } catch (error) {
    console.error(error);
    res.status(401).send({ result: '검증 실패' });
  }
});

app.get('/users/check-id', (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).send({ success: false, message: '아이디를 입력해주세요' });
  }
  models.User.findOne({ where: { user_id } })
    .then((user) => {
      if (user) {
        res.send({ success: false, message: '이미 사용 중인 아이디입니다.' });
      } else {
        res.send({ success: true, message: '사용 가능한 아이디입니다.' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ success: false, message: '서버 오류 발생' });
    });
});

// DB 연결 및 서버 시작
app.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
  models.sequelize.sync({ logging: console.log })
    .then(() => {
      console.log('DB 연결 성공');
    })
    .catch((err) => {
      console.error('DB 연결 실패:', err);
      process.exit();
    });
});

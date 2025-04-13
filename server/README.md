controllers/ Chứa logic xử lý request/response cho từng route.
    Ví dụ: exports.getAllUsers = (req, res) => {
        res.json([{ id: 1, name: "Nguyễn Văn A" }]);
        };

        exports.createUser = (req, res) => {
            const newUser = req.body;
            res.status(201).json(newUser);
        };
models/	Cấu hình kết nối DB, Chứa các schema/database model (MongoDB, Sequelize, etc).

routes/	Định nghĩa các endpoint của API, gọi tới controller.
    Ví dụ: router.get('/', auth, userLogic.getAllUsers);
        router.post('/', userLogic.createUser);

middlewares/ chứa các middleware xử lý request
    Ví dụ: module.exports = (req, res, next) => {
            const token = req.headers.authorization;
            if (token === "valid-token") {
            next();
            } else {
            res.status(401).json({ message: "Unauthorized" });
            }
            };

tất cả những cái trên chỉ là ví dụ
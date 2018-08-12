"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const session_1 = __importDefault(require("./configs/session"));
const morgan_1 = __importDefault(require("morgan"));
const bodyParser = __importStar(require("body-parser"));
const api_1 = __importDefault(require("./api"));
const timezone = "UTC";
process.env.TZ = timezone;
var app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express_session_1.default(session_1.default));
app.use(cors_1.default());
app.use("/api", api_1.default);
app.listen(8080, function () {
    console.log("Example app listening on port 8080!");
});
//# sourceMappingURL=app.js.map
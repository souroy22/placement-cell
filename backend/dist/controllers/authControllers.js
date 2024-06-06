"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getEmployee_1 = __importDefault(require("../utils/getEmployee"));
const employee_1 = __importDefault(require("../models/employee"));
const genarateToken_1 = __importDefault(require("../utils/genarateToken"));
const verifyPassword_1 = __importDefault(require("../utils/verifyPassword"));
const destroyToken_1 = __importDefault(require("./../utils/destroyToken"));
const authControllers = {
    signup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            if (!(name && email && password)) {
                return res.status(400).json({ error: "Please fill all the details" });
            }
            const isExist = yield (0, getEmployee_1.default)(email);
            if (isExist !== null) {
                return res.status(409).json({ error: "Email ID already exists." });
            }
            const newEmployee = new employee_1.default({
                name,
                email,
                password,
            });
            yield newEmployee.save();
            const employee = {
                name: newEmployee.name,
                email: newEmployee.email,
                id: newEmployee.id,
            };
            const token = yield (0, genarateToken_1.default)(employee);
            return res.status(200).json({
                employee: { name: newEmployee.name, email: newEmployee.email },
                token,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    signin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!(email && password)) {
                return res.status(400).json({ error: "Please fill all the details" });
            }
            const employee = yield (0, getEmployee_1.default)(email);
            if (employee === null) {
                return res.status(404).json({ error: "Email ID not found" });
            }
            if (!(0, verifyPassword_1.default)(password, employee.password)) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const structuredEmployee = {
                name: employee.name,
                email: employee.email,
                id: employee.id,
            };
            const token = yield (0, genarateToken_1.default)(structuredEmployee);
            return res.status(200).json({
                employee: structuredEmployee,
                token,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    signout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            (0, destroyToken_1.default)(req);
            return res.status(200).json({ msg: "Successfully logged out!" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    }),
};
exports.default = authControllers;
//# sourceMappingURL=authControllers.js.map
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
const employee_1 = __importDefault(require("../models/employee"));
const employeeControllers = {
    getUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { employee } = req.user;
            if (!employee) {
                return res.status(401).json({ error: "Invalid User" });
            }
            const isExist = yield employee_1.default.findById(employee.id);
            if (!isExist) {
                return res.status(401).json({ error: "No user found" });
            }
            return res.status(200).json({ name: isExist.name, email: isExist.email });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = employeeControllers;
//# sourceMappingURL=employeeControllers.js.map
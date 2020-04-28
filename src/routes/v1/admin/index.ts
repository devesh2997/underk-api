import { Router, Request, Response } from "express";
import { EmployeeController } from "../../../controllers/employee/employee.controller";

const router = Router()

router.get('/', (_: Request, res: Response) => {
    res.json({ status: "success", message: "Root API endpoint for v1/admin", data: { "version_number": "v1.0.0" } })
});

router.post('/emp', EmployeeController.create)



export default router
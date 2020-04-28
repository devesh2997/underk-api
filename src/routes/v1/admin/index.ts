import { Router, Request, Response } from "express";
import { EmployeeController } from "../../../controllers/employee/employee.controller";

const router = Router()

router.get('/', (_: Request, res: Response) => {
    //TODO 
    //if adminId is set in res(have to create a middleware that extracts authentication token from headers and decode the adminId) then send the details of that admin
    res.json({ status: "success", message: "Root API endpoint for v1/admin", data: { "version_number": "v1.0.0" } })
});

router.get('/emp', EmployeeController.get)

router.post('/emp', EmployeeController.create)

router.put('/emp', EmployeeController.update)

router.delete('/emp',EmployeeController.delete)



export default router
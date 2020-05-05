import { Router } from "express";
import { EmployeeController } from "../../../controllers/employee/employee.controller";
import { AdminController } from "../../../controllers/admin/admin.controller";
import { TypeController } from "../../../controllers/catalogue/type.controller";

const router = Router()

router.get('/', AdminController.get)
router.post('/', AdminController.create)
router.delete('/', AdminController.delete)
router.post('/login', AdminController.login)



router.get('/emp', EmployeeController.get)
router.post('/emp', EmployeeController.create)
router.put('/emp', EmployeeController.update)
router.delete('/emp', EmployeeController.delete)


router.get('/type',TypeController.get)
router.delete('/type',TypeController.delete)
router.post('/type',TypeController.create)



export default router
import { Router } from "express";
import POLICIES from "underk-policies";
import { EmployeeController } from "../../../controllers/employee/employee.controller";
import { AdminController } from "../../../controllers/admin/admin.controller";
import { TypeController } from "../../../controllers/catalogue/type.controller";
import { SubtypeController } from "../../../controllers/catalogue/subtype.controller";
import { AttributeController } from "../../../controllers/catalogue/attribute.controller";
import { AttributeValueController } from "../../../controllers/catalogue/attribute-value.controller";
import { CategoryController } from "../../../controllers/catalogue/category.controller";
import { RoleController } from "../../../controllers/admin/role.controller";
import { PolicyController } from "../../../controllers/admin/policy.controller";
import policyChecker from "../../../middleware/policy-checker";

const router = Router()

router.get('/', policyChecker([POLICIES.ADMIN_VIEW]), AdminController.get)
router.get('/all', policyChecker([POLICIES.ADMIN_VIEW]), AdminController.getAll)
router.post('/', policyChecker([POLICIES.ADMIN_PUBLISH]), AdminController.create)
router.delete('/', policyChecker([POLICIES.ADMIN_PUBLISH]), AdminController.delete)

router.get('/role', RoleController.get)
router.get('/roles', RoleController.getAll)
router.post('/role', RoleController.create)
router.delete('/role', RoleController.delete)

router.get('/policy', PolicyController.get)
router.get('/policies', PolicyController.getAll)
router.post('/policy', PolicyController.create)
router.delete('/policy', PolicyController.delete)

router.get('/emp', EmployeeController.get)
router.post('/emp', EmployeeController.create)
router.put('/emp', EmployeeController.update)
router.delete('/emp', EmployeeController.delete)

router.get('/category', CategoryController.get)
router.get('/categories', CategoryController.getAll)
router.get('/category-trees', CategoryController.getTrees)
router.delete('/category', CategoryController.delete)
router.post('/category', CategoryController.create)

router.get('/type', TypeController.get)
router.delete('/type', TypeController.delete)
router.post('/type', TypeController.create)

router.get('/subtype', SubtypeController.get)
router.delete('/subtype', SubtypeController.delete)
router.post('/subtype', SubtypeController.create)

router.get('/attribute', AttributeController.get)
router.delete('/attribute', AttributeController.delete)
router.post('/attribute', AttributeController.create)

router.get('/attribute-value', AttributeValueController.get)
router.delete('/attribute-value', AttributeValueController.delete)
router.post('/attribute-value', AttributeValueController.create)



export default router
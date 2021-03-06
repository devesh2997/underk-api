import { ProductController } from './../../../controllers/catalogue/product.controller';
import { Router } from "express";
import POLICIES from "underk-policies";
import { EmployeeController } from "../../../controllers/employee/employee.controller";
import { AdminController } from "../../../controllers/admin/admin.controller";
import { TypeController } from "../../../controllers/catalogue/type.controller";
import { SubtypeController } from "../../../controllers/catalogue/subtype.controller";
import { CategoryController } from "../../../controllers/catalogue/category.controller";
import { RoleController } from "../../../controllers/admin/role.controller";
import { PolicyController } from "../../../controllers/admin/policy.controller";
import policyChecker from "../../../middleware/policy-checker";
import { EmailController } from "../../../controllers/shared/email.controller";
import { UserController } from "../../../controllers/user/user.controller";
import { CollectionController } from "../../../controllers/catalogue/collection.controller";
import { WarehouseController } from "../../../controllers/inventory/warehouse.controller";
import { SupplierController } from "../../../controllers/inventory/supplier.controller";

const router = Router()

router.get('/', policyChecker([POLICIES.ADMIN_VIEW.name]), AdminController.get)
router.get('/all', policyChecker([POLICIES.ADMIN_VIEW.name]), AdminController.getAll)
router.post('/', policyChecker([POLICIES.ADMIN_PUBLISH.name]), AdminController.create)
router.delete('/', policyChecker([POLICIES.ADMIN_PUBLISH.name]), AdminController.delete)
router.put('/', policyChecker([POLICIES.ADMIN_PUBLISH.name]), AdminController.update)

router.post('/email', EmailController.send)

router.get('/user', UserController.get)
router.post('/user', UserController.create)
router.get('/users', UserController.getAll)

router.get('/role', RoleController.get)
router.get('/roles', RoleController.getAll)
router.post('/role', RoleController.create)
router.delete('/role', RoleController.delete)
router.post('/role/policy', RoleController.addPolicies)
router.delete('/role/policy', RoleController.deletePolicies)

router.get('/policy', PolicyController.get)
router.get('/policies', PolicyController.getAll)
// router.post('/policy', PolicyController.create)
// router.delete('/policy', PolicyController.delete)

router.get('/emp', EmployeeController.get)
router.get('/emp/all', EmployeeController.getAll)
router.post('/emp', EmployeeController.create)
router.put('/emp', EmployeeController.update)
router.delete('/emp', EmployeeController.delete)

router.post('/products/bulk', ProductController.bulkCreate)

router.get('/category', CategoryController.get)
router.get('/categories', CategoryController.getAll)
router.get('/category-trees', CategoryController.getTrees)
router.delete('/category', CategoryController.delete)
router.post('/category', CategoryController.create)
router.post('/category/bulk', CategoryController.bulkCreate)

router.get('/collection', CollectionController.get)
router.get('/collections', CollectionController.getAll)
router.delete('/collection', CollectionController.delete)
router.post('/collection', CollectionController.create)
router.post('/collection/bulk', CollectionController.bulkCreate)

router.get('/type', TypeController.get)
router.get('/types', TypeController.getAll)
router.delete('/type', TypeController.delete)
router.post('/type', TypeController.create)

router.get('/subtype', SubtypeController.get)
router.delete('/subtype', SubtypeController.delete)
router.post('/subtype', SubtypeController.create)

router.get('/warehouse', WarehouseController.get)
router.get('/warehouses', WarehouseController.getAll)
router.delete('/warehouse', WarehouseController.delete)
router.post('/warehouse', WarehouseController.create)

router.get('/supplier', SupplierController.get)
router.get('/suppliers', SupplierController.getAll)
router.delete('/supplier', SupplierController.delete)
router.post('/supplier', SupplierController.create)



export default router
import { Router, Request, Response } from "express";

const router = Router()


router.get('/', (_: Request, res: Response) => {
    res.json({ status: "success", message: "Root API endpoint for v1", data: { "version_number": "v1.0.0" } })
});



export default router
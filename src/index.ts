import "reflect-metadata"
import Express, { Request, Response } from "express";
import { createConnection } from "typeorm"
import cors from "cors";
import bodyParser from "body-parser";
import logger from "morgan"

//Routers
import v1 from "./routes/v1";
import adminRouter from './routes/v1/admin'
import { insertMockData } from "./mock";
import passport from 'passport'
import { PassportStrategies } from './middleware/passport'
import { AdminController } from "./controllers/admin/admin.controller";
PassportStrategies(passport)

const PORT: number = 400

const main = async (): Promise<void> => {

    await createConnection()
    await insertMockData()
    const app = Express()

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }))

    //Passport
    app.use(passport.initialize())

    // CORS
    app.use(cors());

    app.use('/v1', v1)

    app.use('/v1/admin-login', AdminController.login)

    app.use('/v1/admin', passport.authenticate('admin-jwt', { session: false }), adminRouter)

    app.use('/', (_: Request, res: Response) => {
        res.statusCode = 200;//send the appropriate status code
        res.json({ status: "success", message: "Root API endpoint", data: {} })
    });

    app.use((_: Request, __: Response, next: Function) => {
        let err: any = {
            "message": "Not Found",
            "status": 404
        };
        next(err);
    });

    // error handler
    app.use((err: any, req: Request, res: Response) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}/`)
    })

}

main()
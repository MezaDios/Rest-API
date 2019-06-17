import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import userRoutes from './routes/userRoutes';

class Server {

    public app: Application

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    private config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    private routes(): void {
        this.app.use('/api/users', userRoutes);
    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server on port ${this.app.get('port')}`);
        });
    }
}

const server = new Server();
server.start();


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cases from './routes/cases.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app=express();
app.use(helmet());
app.use(cors({origin:process.env.CLIENT_URL?.split(',')||true}));
app.use(express.json({limit:'24kb'}));
if(process.env.NODE_ENV!=='test')app.use(morgan('tiny'));
app.get('/api/v1/health',(req,res)=>res.json({success:true,status:'ok'}));
app.use('/api/v1/cases',rateLimit({windowMs:60_000,limit:12,standardHeaders:'draft-7',legacyHeaders:false,message:{success:false,message:'Too many requests. Please wait a moment.'}}),cases);
app.use(notFound);app.use(errorHandler);
export default app;

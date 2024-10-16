import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import { NotFoundHandler } from './errors/NotFoundHandler';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import './app/modules/subscriptions/subscription.cron';
import './app/modules/notifications/notification.cron';
export const app: Application = express();

import multer from 'multer';

import { handleChunkUpload } from './helpers/handleChunkVideoUpload';
const upload = multer({ dest: 'uploads/' });
app.use(
  cors({
    origin: [
      'http://192.168.10.16:3000',
      'http://192.168.30.250:3000',
      'http://192.168.10.102:3000',
      '*',
      'http://143.198.3.51:3000',
      'http://192.168.10.195:3000',
      'http://localhost:5173',
    ],
    credentials: true,
  }),
);

//parser
app.use(express.json());
// app.use(express.json({ limit: '900mb' }));
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true, limit: '900mb' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('uploads'));
//All Routes
app.use('/', routes);

// chunk
// app.post('/upload', upload.single('chunk'), (req: Request, res: Response) => {
//   const chunk = req.file;
//   const { originalname, chunkIndex, totalChunks } = req.body;

//   // Define the path where to store the final file
//   const uploadDir = path.join(__dirname, '../uploads/video');
//   const filePath = path.join(uploadDir, originalname);

//   // Create uploads directory if it doesn't exist
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
//   }

//   // Append the chunk to the final file
//   fs.appendFileSync(filePath, fs.readFileSync(chunk?.path as string));

//   // Delete the chunk file from the temporary directory
//   fs.unlinkSync(chunk?.path as string);

//   // Append the chunk to the final file
//   if (chunk) {
//     if (Number(chunkIndex) + 1 === Number(totalChunks)) {
//       // All chunks uploaded successfully
//       return res.json({
//         status: 'completed',
//         message: 'File uploaded successfully!',
//         videoUrl: `video/${originalname}`, // Send the final video URL back to the client
//       });
//     } else {
//       // Chunk received, continue uploading
//       return res.json({ status: 'chunkReceived', message: 'Chunk received!' });
//     }
//   } else {
//     return res
//       .status(400)
//       .json({ status: 'error', message: 'No chunk received' });
//   }
// });
app.post('/upload', upload.single('chunk'), handleChunkUpload);

// app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', async (req: Request, res: Response) => {
  res.json('Welcome to bdCalling');
});
//Global Error Handler
app.use(globalErrorHandler);
//handle not found
app.use(NotFoundHandler.handle);

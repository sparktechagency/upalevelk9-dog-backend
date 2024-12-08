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
import { ProgramArticle } from './app/modules/program-article/program-article.model';
import { Training } from './app/modules/training-programs/training-programs.model';
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
      'http://192.168.10.153:3000',
      'http://localhost:3004',
      'http://192.168.10.11:3000',
      'http://143.198.3.51:3000',
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

app.put('/program-article/update-serial', async (req, res) => {
  const updatedArticles = req.body;

  try {
    for (const { key, serial } of updatedArticles) {
      await ProgramArticle.updateOne({ _id: key }, { $set: { serial } });
    }
    res
      .status(200)
      .json({ message: 'Serials updated successfully', success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating serials', success: false, error });
  }
});

app.put('/update-program-order', async (req, res) => {
  const programs = req.body;

  try {
    for (const program of programs) {
      await Training.findByIdAndUpdate(program._id, { serial: program.serial });
    }

    res
      .status(200)
      .json({ message: 'Program order updated successfully!', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update program order.' });
  }
});

app.post('/upload', upload.single('chunk'), handleChunkUpload);

// app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', async (req: Request, res: Response) => {
  res.json('Welcome to bdCalling');
});
//Global Error Handler
app.use(globalErrorHandler);
//handle not found
app.use(NotFoundHandler.handle);

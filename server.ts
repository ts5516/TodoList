import express, { Request, Response } from 'express';
import path from 'path';

const __dirname = path.resolve();
const app = express();
const PORT = '1234';

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/public/todo_list.html');
})

app.listen(PORT, () => {
    console.log('server listeing on port: ' + PORT);
});
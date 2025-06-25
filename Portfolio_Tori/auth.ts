import type { Express, Request, Response } from 'express';


export function setupAuth(app: Express) {
  app.post('/api/login', (req: Request, res: Response) => {
    const { password } = req.body;

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!password) {
     res.status(400).json({ success: false, message: 'Password is required' });
     return;
  }

  if (password !== ADMIN_PASSWORD) {
     res.status(401).json({ success: false, message: 'Invalid password' });
     return;
  }

   res.status(200).json({ success: true, token: 'admin-logged-in' });
   return;
  });
}
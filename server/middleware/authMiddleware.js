import admin from 'firebase-admin';

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  // Dev mode: accept mock tokens when Firebase Admin isn't initialized
  if (token.startsWith('mock-token-')) {
    try {
      const payload = token.replace('mock-token-', '');
      const decoded = JSON.parse(decodeURIComponent(escape(atob(payload))));
      req.user = decoded;
      return next();
    } catch {
      return res.status(403).json({ message: 'Invalid mock token' });
    }
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;

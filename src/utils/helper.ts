import * as fs from 'fs';
import * as path from 'path';

export const deleteOldImage = (folder: string, fileName: string) => {
  try {
    if (!fileName) return;

    // Absolute path to file inside uploads/<folder>/<filename>
    const filePath = path.join(process.cwd(), 'uploads', folder, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Deleted:', filePath);
    } else {
      console.log('File not found:', filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
export const getExpirationTime = (): Date => {
  return new Date(Date.now() + 5 * 60 * 1000);
};

export const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

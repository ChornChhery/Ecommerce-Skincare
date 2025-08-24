// contexts/FeedbackContext.tsx
export const FeedbackContext = createContext({
  reviews: [],
  progressData: [],
  questions: [],
  submitReview: () => {},
  trackProgress: () => {},
  uploadPhoto: () => {}
});

// contexts/FileUploadContext.tsx  
export const FileUploadContext = createContext({
  uploadProgress: {},
  uploadFile: () => {},
  deleteFile: () => {},
  getUploadHistory: () => {}
});
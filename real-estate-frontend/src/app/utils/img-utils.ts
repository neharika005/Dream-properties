export function getImageUrl(imageUrl?: string): string {
  if (!imageUrl) return 'assets/placeholder.jpg';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) return 'http://localhost:8080' + imageUrl;
  return 'C:\Users\User1\Documents\real-estate-frontend\src\assets\placeholder.jpg';
}

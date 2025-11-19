export function getImageUrl(filename) {
  const path =  new URL(`${filename}`, import.meta.url).href; 
  console.log('Trying to load:', path); // 👈 Check this in the console
  return path; 
}
const DEFAULT_AVATAR_URL = 'https://placehold.co/120x120/007bff/ffffff?text=AV';
const BACKEND_URL = 'http://localhost:3000';

export const getProfilePictureUrl = (path) => {
    // ... toda a lógica de normalização de path ...
    if (!path) return DEFAULT_AVATAR_URL;
    
    // ... (lógica de normalização de path)
    const normalizedPath = path.replace(/\\/g, '/');
    const startIndex = normalizedPath.indexOf('uploads/');
    let relativePath = normalizedPath;
    if (startIndex !== -1) {
        relativePath = normalizedPath.substring(startIndex); 
    }
    
    // O ponto-chave é anexar o timestamp para evitar o cache
    let finalUrl = `${BACKEND_URL}/${relativePath}`;
    finalUrl += `?t=${new Date().getTime()}`; // 👈 Anti-cache
    return finalUrl;
};

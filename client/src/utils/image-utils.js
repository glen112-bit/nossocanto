export function getImageUrl(filename) {
  const path =  new URL(`${filename}`, import.meta.url).href; 
  console.log('Trying to load:', path); // 👈 Check this in the console
  return path; 
}

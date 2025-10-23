/**
 * Generate a consistent color for a company name
 */
export function getCompanyColor(companyName: string): string {
  if (!companyName) return 'hsl(0, 0%, 50%)';
  
  // Use the company name to generate a consistent hue
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  const saturation = 70;
  const lightness = 45;
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get score color based on value
 */
export function getScoreColor(score: number): string {
  if (score >= 9) return 'hsl(142, 70%, 45%)'; // green
  if (score >= 8) return 'hsl(217, 70%, 50%)'; // blue
  if (score >= 7) return 'hsl(45, 90%, 50%)'; // yellow
  if (score >= 6) return 'hsl(25, 90%, 50%)'; // orange
  return 'hsl(0, 70%, 50%)'; // red
}


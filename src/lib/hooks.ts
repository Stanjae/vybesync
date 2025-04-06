export function getVideoQuality(width: number, height: number): string {
    const resolutions: { [key: string]: [number, number] } = {
      "144p": [256, 144],
      "240p": [426, 240],
      "360p": [640, 360],
      "480p (SD)": [854, 480],
      "720p (HD)": [1280, 720],
      "1080p (Full HD)": [1920, 1080],
      "1440p (2K)": [2560, 1440],
      "2160p (4K)": [3840, 2160],
      "4320p (8K)": [7680, 4320],
    };
  
    for (const [quality, [w, h]] of Object.entries(resolutions)) {
      if (width == w && height <= h) {
        return quality;
      }
    }
  
    return `Unknown (${width}x${height})`;
  }
  
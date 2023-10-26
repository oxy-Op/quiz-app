import { read } from "./db-provider";


export const isQuizCreated = async (key: string, object: Record<string, any>) => {
    const result = await read("quiz-created");
    if (result && Array.isArray(result[key])) {
      
      const match = result[key].some((item: Record<string, any>) => {
        
      return JSON.stringify(item) === JSON.stringify(object);
    });
    console.log(match);
    
    return match;
  } else {
    return false; // Return false if the key or dataArray doesn't exist
  }
}

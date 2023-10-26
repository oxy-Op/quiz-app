interface Result {
    correct: {
        item: string;
    }[];
    correctCount: number;
    incorrect: {
        item: string;
    }[]
    incorrectCount: number;
}

export const resultGet = (arr1: string[], arr2: string[]): Result => {
    const matchedItems = [];
    const unmatchedItems = [];
    for (let i = 0; i < arr1.length; i++) {
    const item1 = arr1[i];
    const item2 = arr2[i];

    if (item1 === item2) {
      matchedItems.push({ item: item1});
    } else {
      unmatchedItems.push({ item: item1});
    }
  }

  return {
      correct: matchedItems,
      correctCount: matchedItems.length,
      incorrect: unmatchedItems,
      incorrectCount: unmatchedItems.length
  }
}



import { openDB } from 'idb';

interface ResultData {
    answers: string[],
    correct_answers: string[],
    questions: string[],
    uuid: string
}


async function initializeDatabase() {
  const db = await openDB('quiz', 1, {
    upgrade(db) {
      db.createObjectStore('quiz', {
        autoIncrement: true, // This will generate a unique key for each object
      });
    },
  });
  return db;
}

async function insertData(key: string, data: {}) {
  const db = await initializeDatabase();
  const tx = db.transaction('quiz', 'readwrite');
  const store = tx.objectStore('quiz');
  await store.add(data, key);
  await tx.done;
}

async function readData(key: string): Promise<ResultData> {
  const db = await initializeDatabase();
  const tx = db.transaction('quiz', 'readonly');
  const store = tx.objectStore('quiz');
  const data = await store.get(key);
  return {
    uuid: data.uuid || null,
    answers: data.answers,
    correct_answers: data.correct_answers,
    questions: data.questions
  }
}

async function read(key: string) {
  const db = await initializeDatabase();
  const tx = db.transaction('quiz', 'readonly');
  const store = tx.objectStore('quiz');
  const data = await store.get(key);
  return data
}

async function update(key: string, newData: {}) {
  const db = await initializeDatabase();
  const tx = db.transaction('quiz', 'readwrite');
  const store = tx.objectStore('quiz');
  const data = await store.get(key);

  if (data && typeof data === 'object') {
    const mergedData = { ...data, ...newData };
    await store.put(mergedData, key);
  } else if (!data) {
    await store.add(newData, key);
  }

  await tx.done;
}

async function insertArray(key: string, key2: string , newData: {}) {
  const db = await initializeDatabase();
  const tx = db.transaction('quiz', 'readwrite');
  const store = tx.objectStore('quiz');
  const data = await store.get(key);

  if (data && typeof data === 'object') {
    if (Array.isArray(data[key2])) {
      data[key2].push(newData);
    } else {
      data[key2] = [newData];
    }

    await store.put(data, key);
  } else if (!data) {
    const newDataObject = {
      [key2]: [newData],
    };

    await store.add(newDataObject, key);
  }

  await tx.done;
}

async function updateArray(
  key: string,
  key2: string,
  primaryKey: string,
  newData: Record<string, any>
): Promise<void> {
  const db = await initializeDatabase();
  const tx = db.transaction('quiz', 'readwrite');
  const store = tx.objectStore('quiz');
  const data = await store.get(key);
  console.log("data: ", JSON.stringify(data));
  
  if (data && Array.isArray(data[key2])) {
    const updatedData = data[key2].map((item: Record<string, any>, index: number) => {
      console.log("item: ", JSON.stringify(item));
      if (item.uuid === primaryKey){
        return data[key2][index] = newData;
      }
    })
    
    console.log(updatedData);
  
  await store.put(data, key);
  }

  await tx.done;
}





export { insertData, readData, read, update, insertArray, updateArray };

function splittedArray(arr: Array<string>, size: number): Array<Array<string>> {
    const splittedArr: Array<Array<string>> = [];
    while (arr.length > 0) {
        const chunk = arr.splice(0, size);
        splittedArr.push(chunk);
    }
    return splittedArr;
}

export { splittedArray };
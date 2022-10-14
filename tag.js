const convert = (type) => {
    let beforeData = document.getElementById('before').value.toString();
    if (type == 'webui') {
        let afterData = '';
        let tmp = beforeData.split(',');
        tmp.forEach((v) => {
            let rst = calcNAItoWUI(v);
            afterData += `${rst}, `;
        });
        let final = afterData.substring(0, afterData.length - 2);
        document.getElementById('after').value = final.toString();
        console.log('WebUI 형식으로 변환됨.');
    } else if (type == 'nai') {
        let afterData = '';
        let tmp = beforeData.split(',');
        tmp.forEach((v) => {
            let rst = calcWUItoNAI(v);
            afterData += `${rst}, `;
        });
        let final = afterData.substring(0, afterData.length - 2);
        document.getElementById('after').value = final.toString();
        console.log('NovelAI 형식으로 변환됨.');
    }
    return;
};

const calcNAItoWUI = (inputData) => {
    let data = inputData.toString().trim();
    let tag = data.replaceAll('{', '').replaceAll('}', '').toString().trim();
    let count = data.split('{').length - 1;
    if (count == 0) return tag;
    let first = 1.05 ** count;
    let second = (Math.round(first * 100) * 0.01).toString();
    return `(${tag}:${second})`;
};

const proxNAI = [0, 105, 110, 116, 122, 128, 134, 141, 148, 155, 163, 171, 180, 189, 198];

const calcWUItoNAI = (inputData) => {
    let data = inputData.toString().trim();
    let tag = data.replaceAll('(', '').replaceAll(')', '').toString().trim();
    let types = data.split(':').length - 1;
    if (data.split('(').length - 1 == 0) return data;
    let num;
    if (types != 0) {
        num = parseFloat(tag.split(':')[1]) * 100;
        tag = tag.split(':')[0].trim();
    } else {
        num = Math.round(1.1 ** (data.split('(').length - 1) * 100);
    }
    let near = proxNAI.reduce((prev, curr) => {
        return Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev;
    });
    let count = proxNAI.indexOf(near);
    let tmpOpen = '';
    let tmpClose = '';
    for (let i = 0; i < count; i++) {
        tmpOpen += '{';
        tmpClose += '}';
    }
    return `${tmpOpen}${tag}${tmpClose}`;
};

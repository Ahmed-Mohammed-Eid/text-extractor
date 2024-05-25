import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

document.getElementById('extract-btn').addEventListener('click', async () => {
    const fileInput = document.getElementById('pdf-upload');
    if (fileInput.files.length === 0) {
        alert('Please choose a PDF file first.');
        return;
    }

    const file = fileInput.files[0];
    const fileReader = new FileReader();

    fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const loadingTask = pdfjsLib.getDocument(typedArray);
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        document.getElementById('result').textContent = fullText;
    };

    fileReader.readAsArrayBuffer(file);
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const resultDiv = document.getElementById('result');
    const range = document.createRange();
    range.selectNode(resultDiv);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Text copied to clipboard');
});

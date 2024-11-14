const inputJson = document.getElementById('jsonText');
const outputCsv = document.getElementById('csvText');

inputJson.value = "";
outputCsv.value = "";
let csvRows = [];

function clearTextArea() {
    inputJson.value = "";
    outputCsv.value = "";
}

function convertJSONtoCSV() {
    const jsonContent = inputJson.value;
    const formattedJSON = jsonContent.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":');

    const errorMessage = document.getElementById('errorText');
    if (errorMessage) {
        errorMessage.textContent = '';
    }

    try {
        jsonArray = JSON.parse(formattedJSON);

        // get all headers (keys) of all objects in the array
        const headers = new Set();
        jsonArray.forEach(obj => {
            Object.keys(obj).forEach(key => { headers.add(key) });
        });

        // convert set to array
        const headersRow = [...headers];

        // create array that will work as the csv rows and add the headers as the first element separated by commas
        csvRows = [headersRow.join(', ')];

        // iterate over each element of the json object array, check if obj[key] exists and if not, insert an empty value, aggregate each object as a CSV row
        jsonArray.forEach(obj => {
            const row = [];
            for (const key of headersRow) {
                const value = obj[key] === undefined ? '' : obj[key];
                const formattedValue = typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
                row.push(formattedValue);
            }
            csvRows.push(row.join(', '));
        });

        outputCsv.value = csvRows.join('\n');
        outputCsv.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (error) {
        outputCsv.value = "";
        if (errorMessage) {
            errorMessage.style.display = "block";
            errorMessage.textContent = 'El JSON es inválido.';
        }
    }


}

const downloadFile = () => {
    const link = document.createElement("a");
    const content = csvRows.join('\n');
    const file = new Blob([content], { type: 'text/csv' });
    link.href = URL.createObjectURL(file);
    link.download = "sample.csv";
    link.click();
    URL.revokeObjectURL(link.href);
};


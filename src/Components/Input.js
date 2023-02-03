/* eslint-disable no-loop-func */
import React, { useState } from 'react';
import JSZip from 'jszip';
import * as pdfLib from 'pdf-lib';
import { saveAs } from 'file-saver';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.min.js'

const Input = () => {
    const [file, setFile] = useState();
    const [zip, setZip] = useState();

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    }

    const handleDownload = () => {
        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // Faz o download do arquivo ZIP gerado
                saveAs(content, "pdf-paginas-separadas.zip");
            });
        setZip(null)
    };

    const handleProcessar = async event => {
        const zip = new JSZip();

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
            const pdfBytes = new Uint8Array(reader.result);
            const pdfDoc = await pdfLib.PDFDocument.load(pdfBytes);
            const loadingTask = pdfjs.getDocument(reader.result)
            loadingTask.promise.then(async function (pdf) {


                const pages = pdfDoc.getPages();
                for (let i = 0; i < pages.length; i++) {
                    let nomeRecebedor = "nome-nao-encontrado " + i
                    //Encontrar nome ou nome recebedor
                    const target = ['Nome:', 'nome do recebedor:'];

                    await pdf.getPage(i + 1).then(async (page) => {
                        const content = (await page.getTextContent()).items
                        const index = content.findIndex(obj => target.includes(obj.str))
                        nomeRecebedor = content[index + 2].str
                    })

                    // Crie um novo documento PDF
                    const newPdfDoc = await pdfLib.PDFDocument.create();

                    // Copia a página atual para o novo documento PDF
                    const [firstDonorPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
                    newPdfDoc.insertPage(0, firstDonorPage)


                    // Salve o novo documento PDF em um arquivo
                    const pdfBytes = await newPdfDoc.save();

                    // Adicione a página atual ao arquivo ZIP como um novo arquivo
                    console.log(nomeRecebedor)
                    zip.file(`${nomeRecebedor}.pdf`, pdfBytes);
                }
            })
            setZip(zip)
        }
    }

    return (
        <div>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            {file && (
                <>
                    <p>Arquivo selecionado: {file.name}</p>
                    <button onClick={handleProcessar}>Processar</button>
                </>
            )}
            {zip && (
                <>
                    <button onClick={handleDownload}>Baixar</button>
                </>
            )}
        </div>
    );
}

export default Input;

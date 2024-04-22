import React, { useState } from "react";
import JSZip from "jszip";
import * as pdfLib from "pdf-lib";
import { saveAs } from "file-saver";
import * as pdfjs from "pdfjs-dist";
import { Button, Label, Spinner, Text } from "@fluentui/react-components";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.worker.min.js";

const Input = () => {
  const [file, setFile] = useState();
  const [zip, setZip] = useState();
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDownload = () => {
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "pdf-dividos-por-nome.zip");
    });
    setZip(null);
  };

  const handleProcessar = async (event) => {
    setLoading(true);
    const zip = new JSZip();

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const pdfBytes = new Uint8Array(reader.result);
      const pdfDoc = await pdfLib.PDFDocument.load(pdfBytes);
      const loadingTask = pdfjs.getDocument(reader.result);
      loadingTask.promise.then(async function (pdf) {
        const pages = pdfDoc.getPages();
        for (let i = 0; i < pages.length; i++) {
          let nomeRecebedor = "nome-nao-encontrado " + i;

          try {
            await pdf.getPage(i + 1).then(async (page) => {
              const content = (await page.getTextContent()).items;
              for (let j = 0; j < content.length; j++) {
                const str = content[j].str;
                if (
                  str.includes("Nome:") ||
                  str.includes("Razão Social:") ||
                  str.includes("Beneficiário:") ||
                  str.includes("nome do recebedor:")
                ) {
                  nomeRecebedor = content[j + 2].str;
                  break;
                }
              }
            });
          } catch (error) {
            console.error("Erro ao processar página:", error);
          } finally {
            const newPdfDoc = await pdfLib.PDFDocument.create();
            const [firstDonorPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
            newPdfDoc.insertPage(0, firstDonorPage);
            const pdfBytes = await newPdfDoc.save();
            zip.file(`${nomeRecebedor}.pdf`, pdfBytes);
          }
        }
      });

      setTimeout(() => {
        setZip(zip);
        setLoading(false);
      }, 1000);
    };
  };

  return (
    <div>
      <Button size="large">
        <Label for="file-upload">
          Upload Arquivo
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Label>
      </Button>
      {file && (
        <>
          <div>
            <Text>Arquivo selecionado: {file.name}</Text>
          </div>
          <Button onClick={handleProcessar} size="medium">
            Processar
          </Button>
          {loading && <Spinner label="Processando o arquivo..." />}
        </>
      )}
      {zip && !loading && (
        <>
          <Button onClick={handleDownload} size="medium">
            Download
          </Button>
        </>
      )}
    </div>
  );
};

export default Input;

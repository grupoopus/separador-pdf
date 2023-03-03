# Create React App

Este projeto foi inicializado com [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

No diretório do projeto, você pode executar:

### `npm start`

Executa o aplicativo no modo de desenvolvimento.\
[http://localhost:3000](http://localhost:3000) para visualizá-lo em seu navegador.

A página será recarregada quando você fizer alterações.\
Você também pode ver erros de lint no console.

### `npm run build`

Cria o aplicativo para produção na pasta `build`.\
Ele empacota corretamente o React no modo de produção e otimiza a compilação para obter o melhor desempenho.

A compilação é minificada e os nomes dos arquivos incluem os hashes.\
Seu aplicativo está pronto para ser implantado!

Veja a seção sobre [deployment](https://facebook.github.io/create-react-app/docs/deployment) para maiores informações.

### Funcionamento aplicação

Consiste em um formulário de upload de arquivo PDF, um botão para processar o arquivo e outro botão para baixar o arquivo processado. O objetivo desse código é dividir um arquivo PDF em vários arquivos PDF menores, separados pelo nome do recebedor em cada página.

O componente usa a biblioteca JSZip para criar um arquivo ZIP com os arquivos PDF divididos e a biblioteca pdf-lib para manipular os arquivos PDF. O arquivo PDF é carregado no componente, e em seguida é processado. Em resumo, o arquivo PDF é dividido em várias páginas, em seguida, cada página é analisada para encontrar o nome do recebedor e, finalmente, cada página é salva em um novo arquivo PDF com o nome do recebedor como o nome do arquivo.

O componente tem três estados: o arquivo PDF selecionado, o arquivo ZIP gerado e o estado de carregamento. O arquivo PDF selecionado é armazenado como um objeto no estado do componente, e é usado para gerar os arquivos PDF divididos. O arquivo ZIP gerado é armazenado no estado do componente, e é usado para fazer o download dos arquivos PDF divididos. O estado de carregamento é usado para indicar se o componente está processando o arquivo PDF.

Ao selecionar o arquivo PDF, o evento onChange é acionado e o arquivo PDF é carregado usando o objeto FileReader. Em seguida, cada página é processada usando a biblioteca pdf-lib e a biblioteca pdfjs. O nome do recebedor é encontrado na página atual do arquivo PDF usando uma lista de palavras-chave. Em seguida, o novo arquivo PDF é criado e salvo em um objeto JSZip com o nome do recebedor como o nome do arquivo.

Depois que todas as páginas são processadas, o objeto JSZip é armazenado no estado do componente e o botão de download é exibido. Quando o botão de download é clicado, o arquivo ZIP gerado é baixado.

### Deploy

Por ser um site "estático", basta rodar npm run build, transferir a pasta build para dentro da Opustech através do Filezilla e substituir o diretório (dentro do /var/www) responsável que está hosteado em: https://divisorpdf.solucoesgrupoopus.com/.

const fs = require('fs');
const http = require('http');
const url = require('url');
const rerplaceTemplates = require(`${__dirname}/modules/replaceTemplates.json`); 
// //* FILE OPERATONS
// //! REDING FILE SYNCHRONOUSLY - BLOCKING THE MANIN THREAD 
// const textToInsertFile = '\n\nthis text comes from the index.js bu eleman dosyaya sileme islemi yaparak dosyayi en bastan silerek tekrardan olusturu';
// fs.writeFileSync('./node/text/writtenfiles.txt',textToInsertFile,'utf-8');
// fs.writeFileSync('./node/text/writtenfiles2.txt',`$textToInsertFile this is the second file which was not exist`,'utf-8');
// const  readFile = fs.readFileSync('./node/text/messagetext.txt','utf-8');
// const  readWrittenFile = fs.readFileSync('./node/text/writtenfiles.txt','utf-8');
// const  readWrittenFile2 = fs.readFileSync('./node/text/writtenfiles2.txt','utf-8');
// //? console.log(readFile);
// console.log(readWrittenFile);
// console.log(readWrittenFile2);

// //! REDING FILE ASYNCHRONOUSLY - WITHOUT BLOCKING THE MANIN THREAD 
// fs.readFile('./node/text/writtenfiles.txt','utf-8',(error,data1) => {
//     //* the thread manages the reading files on the background and do not blocking the main thread 
//     error?.code == null ? console.log(data1) : console.log('there are some problems check out the file path or the logic that you set up to read the file ,');
//     fs.readFile('./node/text/writtenfiles2.txt','utf-8',(error,data2) => {
//         error?.code == null ? console.log(data2) : console.log('there are some problems check out the file path or the logic that you set up to read the file ,');
//         fs.readFile('./node/text/messagetext.txt','utf-8',(error,data3) => {
//             error?.code == null ? console.log(data3) : console.log('there are some problems check out the file path or the logic that you set up to read the file ,');
          
//             fs.writeFile('./node/text/crispest.txt',`${data1} ${data2} ${data3}`,'utf-8',err =>{
//                 fs.readFile('./node/text/crispest.txt','utf-8',(error,data4) => {
//                     error?.code == null ? console.log(data4) : console.log('there are some problems check out the file path or the logic that you set up to read the file ,');
//                     console.log('end of the callback hell');
//                 }
//                 );
//             });
//         });
    
//     });

// });

// console.log('you should see this line at first');


const server = http.createServer((req,res)=>{ 
    const {query, pathname}  = url?.parse(req?.url,true); //? url'yi parse ederek url icindeki query ve pathname degerlerine tek atemayla erismis olduk

    const replaceTemplate = (temp,product)=>{
        let output = temp.replace(/{%PRODUCT%}/g,product.productName);
        output =  output.replace(/{%IMAGE%}/g,product.image);
        output =  output.replace(/{%ID%}/g,product.id);
        output =  output.replace(/{%PRODUCTNAME%}/g,product.productName);
        output =  output.replace(/{$DESCRIPTION$}/g,product.description);
        return output;
    }

    const data = fs.readFileSync(`${__dirname}/node/text/dummy_json.json`,'utf-8');
    const tempOverView = fs.readFileSync(`${__dirname}/node/templates/template_overview.html`,'utf-8');
    const tempCard = fs.readFileSync(`${__dirname}/node/templates/template_card.html`,'utf-8');
    const tempProduct = fs.readFileSync(`${__dirname}/node/templates/template_product.html`,'utf-8');

    const dataObject = JSON.parse(data);
    //* parselanmıs meyve datasını mapliyoruz. sonra maplenen dataları da alıp icindekileri html dosyası ıcındeki 
    //* anahtar kelimelerle degistiriyoruz. sonra degistirdigimiz html dosyalrı zaten bize bir liste olarak geliyor
    //* biz de bu listeyi butun bir stringe cevirerek overviewdaki anahtar kelimenin yerine gosteriyoruz 
    //? boylece data guncellenmis olarak gosterilebiliyor 

   // const pathname = req.url;
    //console.log(req.url);

    if(pathname === '/overview' || pathname === '/'){

        const cardsHtml = dataObject.map(element => replaceTemplate(tempCard,element)).join('');
        //? cardsHtml liste halinde amam icindeki tum elemanlaetu stringe cevvirdik 
        //? simdi bu buyuk stringi alip overview'daki elemantlerin yerine koyacagiz 
        const newObjejct = tempOverView.replace('{%PRODUCTNAME_CARDS%}',cardsHtml);
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(newObjejct);

    } else if (pathname === '/product') {
        console.log(query);
        console.log(query.id);
        const selectedObject = dataObject[query.id];
        console.log(selectedObject);
        
        res.end(replaceTemplate(tempProduct,selectedObject));

    }else if(pathname == '/API'){

        res.writeHead(404,{'Content-Type' :'application/json'});
        console.log(data);
        console.log(dataObject);

        res.end(data);
        
        // fs.readFile(`${__dirname}/node/text/dummy_json.json`,'utf-8',(error, data)=>{
        //     const productData = JSON.parse(data);
        //     res.writeHead(404,{'Content-Type' :'application/json'});
        //     console.log(productData);
        //     console.log(data);
        //     //? res.end(data); //? head content typeını text yaparsak 
        //      res.end(data); //* parse edilen data nedense ekrana bastırılamıyor 
        // });

    } else{
        res.writeHead(404, { 'Content-Type': 'text/html', });
        res.end('<h1>there is not any defined route senario for current route</h1>');
    }
   
});

server.listen(3000,'127.0.0.1',()=>{
    console.log('server working on 3000 port and 127.0.0.1 ip address');
});

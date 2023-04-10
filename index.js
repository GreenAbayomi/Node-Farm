const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate')

// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textInput)
// console.log('When will i be executed?')

// const textOutput = `This is what we know about the avocado: ${textInput}. \nCreated on ${Date.now()}`

// fs.writeFileSync('./txt/output.txt', textOutput)
// console.log('File written successfully')

// const textData = fs.readFile('./txt/start.txt', 'utf-8', (err, data)=>{
//     console.log(data)
// })
// console.log('I go first... File read successfully')

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1)=>{
//     if(err) return console.log(`ERROR!`)
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=>{
//         console.log(data2)
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3)=>{
//             console.log(data3)
//         fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, 'utf-8', err =>{
//             console.log(`Final.txt file created successfully`)
//         })
//         })
//     })
// })

// console.log(`I always come first!!... Now read the file `)

//utils


//Read All Data 
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`)
const dataObj = JSON.parse(data)

const server = http.createServer((req, res)=>{
    const { query, pathname } = url.parse(req.url, true)
    //overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'Content-type': 'text/html'})

        const cardsHtml = dataObj.map( (el)=>{
            return replaceTemplate(tempCard, el)
        }).join('')
       const output = tempOverview.replace(/{%PRODUCT-CARDS%}/g, cardsHtml)
        res.end(output)
    } 

    //product page
    else if(pathname === '/product'){
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
        console.log(query)
    }

    //api page
    else if(pathname === '/api'){
        console.log(dataObj)
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)
    }

    //Not Found Page
    else{
        res.writeHead(404, {
            'Content-type': 'text/html'
        })
        res.end('<h1>Page Not Found!</h1>')
    }
})


const PORT = 8000;
server.listen(PORT,'127.0.0.1', ()=>{
    console.log(`Server listening on port ${PORT}...`)
} )
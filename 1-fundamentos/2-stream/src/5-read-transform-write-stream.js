// 5- Writeable Stream

import { Readable, Writable, Transform } from 'node:stream'

class OneToHundredStream extends Readable{
    index = 1

    _read(){
        const i = this.index++

        if(i > 100) {
            this.push(null)
        } else {
            setTimeout(()=>{

                const buf = Buffer.from(String(i))

                this.push(buf)
            }, 1000)
        }
    }
}

class InverseNumberStream extends Transform {
    _transform(chunck, encoding, callback) {
        const transformed = Number(chunck.toString()) * -1
        const buf = Buffer.from(String(transformed))

        callback(null, buf)
        // o primeiro argumento é a mensagme de erro
    }
}

class MultiplyByTenStream extends Writable {
    _write(chunk, encoding, callback) {
        // chunk -> pedaço lido da stream de leitura, enviado do .push
        // encoding -> como a informação esta codificada, assunto relacionado a buffers
        // callback -> função chamada com a stream terminou de executar o bloco da execução atual
        // chunk chega como um buffer da stream de leitura
        console.log(Number(chunk.toString())*10)
        callback()
    }
}


new OneToHundredStream()
    .pipe(new InverseNumberStream())
    .pipe(new MultiplyByTenStream())


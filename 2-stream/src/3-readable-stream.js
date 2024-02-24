// 3- Reabable Stream

import { Readable } from 'node:stream'

class OneToHundredStream extends Readable {
    index = 1

    //metodo obrigatorio de toda stream Readable
    //retorna quais são os dados da stream
    //processo comum do dia a dia, ler um arquivo no sistema, receber o upload de um arquivo do front-end
    _read() {
        const i = this.index++

        if (i > 100) {
            this.push(null)
        } else {
            const buf = Buffer.from(String(i))

            this.push(buf)
        }
    }
}

new OneToHundredStream().pipe(process.stdout)
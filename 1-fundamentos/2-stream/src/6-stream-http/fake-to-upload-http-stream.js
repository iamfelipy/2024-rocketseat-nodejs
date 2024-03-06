//leitura parcial com processamento dos dados

import {Readable} from 'node:stream'

class OneToHundreadStream extends Readable {
    index = 1
    
    _read(){

        const i = this.index++;

        if(i > 100) this.push(null)
        else {
            setTimeout(() => {
                const buf = Buffer.from(String(i))
                this.push(buf)
            }, 1000)
        }
    }
}

// new OneToHundread().pipe(process.stdout)

fetch('http://localhost:3334', {
    method: 'POST', 
    body: new OneToHundreadStream(),
    duplex: 'half'
})
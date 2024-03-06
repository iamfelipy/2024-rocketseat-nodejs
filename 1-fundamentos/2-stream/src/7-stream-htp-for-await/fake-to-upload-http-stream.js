import {Readable} from 'node:stream'

class OneToHundreadStream extends Readable {
    index = 1
    _read(){
        const i = this.index++;
        if(i > 5) this.push(null)
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
}).then(response => {
    return response.text()
}).then(data => {
    console.log(data)
})
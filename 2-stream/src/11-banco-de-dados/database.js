import fs from 'node:fs/promises'

//console.log(import.meta.url)
//retorna o caminho completo do arquivo onde a variavel global foi chamada

// const databasePath = new URL('db.json', import.meta.url)
// mode 1: retorna import.meta.url e substitui o nome do arquivo com o nome do primeiro argumento do new URL
const databasePath = new URL('db.json', import.meta.url)
// mode 2: retorna import.meta.url, volta um caminho e substitui o nome do arquivo com o nome do primeiro argumento do new URL

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            }).catch(()=>{
                this.#persist()
            })
    }

    #persist(){
        //o local inicial para salvar o arquivo vai ser onde a aplicação foi executada
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }
    
    select(table, search){
        let data = this.#database[table] ?? []

        if(search) {{
            data = data?.filter(row => {
                // user?.name?.includes(name) || user?.email?.includes(email)
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }}

        // let = let it change
        return data
    }

    insert(table, data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        }else {
            this.#database[table] = [data]
        }
        this.#persist()
        return data
    } 

    update(table,id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id == id)
        this.#database[table][rowIndex] = {id, ...data}
        this.#persist()
    } 

    delete(table,id){
        // const listWithouWithUserDeleted = this.#database[table].filter(value=>value.id != id)
        // this.#database[table] = [...listWithouWithUserDeleted]
        // this.#persist()

        const rowIndex = this.#database[table].findIndex(row => row.id == id)

        if(rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }
}
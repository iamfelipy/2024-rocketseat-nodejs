export class Slug {
  public value: string
  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Receives a string and normalize it as a slug
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    const slugText = text
      // converte o texto para um unicode especifico (arsenal de carcters aceitos)
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      /*
      Substitui todos os espaços (um ou mais) por hífens (-). Agora a string se transforma em "an-example-title".
    */
      .replace(/\s+/g, '-')
      /*
      Remove qualquer caractere que não seja uma letra, número ou hífen. Como a string já está limpa e contém apenas letras e hífens, ela não sofre alterações aqui.
    */
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}

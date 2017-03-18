export class FunnyKeyValueMessages {

    public static all(): string[] {
        return [
            "Segue um %s saindo do forno: %s!",
            "Segue um %s fresquinho: %s!",
            "Hum... segura esse % aí! %s ",
            "Pensa rápido!  %s: %s ",
            "Esse %s eu vi virando a esquina: %s",
            "Arrebentei! Olha que %s lindo: %s",
            "Hum, foi mal, mas esse %s está demais: %s",
            "Não quero me gabar, mas nasci para gerar esses %s: %s",
            "Ih... agora assim, segue um %s: %s",
            "Homens trabalhando ou melhor Bots fazendo %s: %s",
            "Eu recebo para ficar o dia todo gerando %s? segue aí: %s",

            "Segue um %s aí: %s",
            "No meio do caminho tinha um %s...  e o número era: %s",
            "Batatinha quando nasce... sai um %s e o valor é: %s!",
            "Quanto eu recebo para ficar gerando %s o dia todo? segue aí: %s!",
            "Hum...! Esse %s é uma obra prima: %s!",
            "Quem diria que dava para fazer um %s assim: %s?",
            "Olha só! não vou te enganar... mas esse cálculo do %s não é fácil não - segue aí %s?",
            "supletivo, supletivo, supletivo... toma um %s aí %s?",
            "O doce perguntou pro doce: qual é o %s mas doce que batata doce... segue: %s",
            "Aaatirei o %s no gato-to-to, e ele me mandou o valor-lor-lor: %s!",
            "fala tu que to cansado! o %s é: %s!",

            "Depois te mando a fatura desse %s: %s",
            "A dona aranha subiu pela parede, veio o %s e a derrubou: %s",
            "Qual o sentido de gerar %s o dia todo? %s",
            "E agora, José? A festa acabou, a luz apagou, o povo sumiu... mas o %s saiu: %s!"
        ];
    }

    public static random(): string {
        const messages = this.all();
        return messages[Math.floor(Math.random() * messages.length)];
    }
}


class DATE {
    constructor() {
        this.date = new Date();
        this.days = DATE.days();
        this.months = DATE.months();
    }
    static days() {
        return [
            'Domingo',
            'Segunda',
            'Terça',
            'Quarta',
            'Quinta',
            'Sexta',
            'Sabado'
        ]
    }
    static months() {
        return [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro'
        ]
    }
    static padZero(n = '', i = 0) {
        n = String(n);
        while (n.length < i) {
            n = '0' + n;
        }
        return n;
    }
    compareOldDate(date) {
        if (!date) return false;
        return (
            (
                this.getHours() > date.getHours()
            ) ||
            (
                this.getHours() == date.getHours() &
                this.getMinutes() > date.getMinutes()
            ) ||
            (
                this.getHours() == date.getHours() &
                this.getMinutes() == date.getMinutes() &
                this.getSeconds() > date.getSeconds()
            )
        )
    }
    addHours(i) {
        this.date.setHours(this.date.getHours() + i);
    }
    addMinutes(i) {
        this.date.setMinutes(this.date.getMinutes() + i);
    }
    addSeconds(i) {
        this.date.setSeconds(this.date.getSeconds() + i);
    }
    getHours() {
        return this.date.getHours();
    }
    getMinutes() {
        return this.date.getMinutes();
    }
    getSeconds() {
        return this.date.getSeconds();
    }
    getFullDate() {
        return `${this.days[this.date.getDay()]} ${this.date.getDate()} de ${this.months[this.date.getMonth()]} de ${this.date.getFullYear()} as ${DATE.padZero(this.date.getHours(), 2)}:${DATE.padZero(this.date.getMinutes(), 2)}:${DATE.padZero(this.date.getSeconds(), 2)} hora(s)`;
    }
};

module.exports = DATE;
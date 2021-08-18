class Simulador {
    init() {
        this.id = $("#id");
        this.usuario = $("#usuario");
        this.senha = $("#senha");
        this.periodo_inicial = $("#periodo_inicial");
        this.periodo_final = $("#periodo_final");
        this.resultados = $("#resultados");
        $("#resultados").animate({scrollTop: this.resultados.height()}, 1000);
                
        $("#btnAdd").click(
            (e) => this.add.call(this, e)
        );

        $("#btnGetStatus").click(
            (e) => this.getStatus.call(this, e)
        );

        $("#btnGetResult").click(
            (e) => this.getResult.call(this, e)
        );
    }

    async add(e) {
        let opcoes = {
            usuario: this.usuario.val(),
            senha: this.senha.val(),
            periodo_inicial: this.periodo_inicial.val(),
            periodo_final: this.periodo_final.val(),
        }

        let result = await $.ajax({
            type: "POST",
            url: "/add",
            data: JSON.stringify(opcoes),
            dataType: "json",
            contentType: 'application/json'
        });
        this.id.val(result.id);
    }

    async getStatus(e) {        
        let opcoes = {
            "id": this.id.val()
        }        


        let result = await $.ajax({
            type: "get",
            url: "/getstatus",
            data: opcoes,
            dataType: "json",
            contentType: 'application/json'
        });
        this.resultados.val(
            (this.resultados.val() + "\n" + JSON.stringify(result))
        );
    }

    async getResult(e) {
        let opcoes = {
            "id": this.id.val()
        }        

        let result = await $.ajax({
            type: "get",
            url: "/getresult",
            data: opcoes,
            dataType: "json",
            contentType: 'application/json'
        });
        this.resultados.val(
            (this.resultados.val() + "\n" + JSON.stringify(result))
        );        
    }
}

$(document).ready(
    () => {
        let s = new Simulador();
        s.init()
    }
)
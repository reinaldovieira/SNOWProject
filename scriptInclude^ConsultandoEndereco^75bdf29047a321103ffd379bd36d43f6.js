//Script Include "FindingAddress"

var FindingAddress = Class.create();
FindingAddress.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    buscarCEP: function() {
        var ip = this.getParameter('sysparm_ip'); //getParameter é de uma função Client para o Server
        var r = new sn_ws.RESTMessageV2('IP Stack', 'Default GET');
        r.setStringParameterNoEscape('key', '1ec76d8a9fb571d9fddd59b0882aff29');
        r.setStringParameterNoEscape('ip', ip);

        var response = r.execute();
        var responseBody = response.getBody(); // pega o conteúdo da resposta REST
        var httpStatus = response.getStatusCode(); // pega o código numérico do HTTP que é retornado
        gs.log(responseBody, '@reinaldo');

        responseBody = JSON.parse(responseBody); //CEP
        var endereco = this._chamarEndereco(responseBody.zip);
        return endereco;
        //return JSON.stringify(responseBody);

    },

    _chamarEndereco: function(cep) {
        try {
            var s = new sn_ws.SOAPMessageV2('Correios', 'consultaCEP');
            s.setStringParameterNoEscape('cep', cep);
            var response = s.execute();
            var responseBody = response.getBody();
            var status = response.getStatusCode();

            // A SOAP message retorna um arquivo parecido com XML. Depois isso, analisamos (parse), montamos um objeto e pegamos nó por nó com os campos que queremos. 
            // Portanto, abaixo do var status, incrementamos o código da seguinte forma:

            var xmlDoc = new XMLDocument2(); //objeto que ajuda a manipular um XML, analisando e extraindo dados de uma string
            xmlDoc.parseXML(responseBody); //analisa resposta do teste da SOAP Message function
            var objeto = {};
            objeto.bairro = xmlDoc.getNode('/soap:Envelope/soap:Body/ns2:consultaCEPResponse/return/bairro').getTextContent();
            objeto.cep = xmlDoc.getNode('/soap:Envelope/soap:Body/ns2:consultaCEPResponse/return/cep').getTextContent();
            objeto.cidade = xmlDoc.getNode('/soap:Envelope/soap:Body/ns2:consultaCEPResponse/return/cidade').getTextContent();
            objeto.rua = xmlDoc.getNode('/soap:Envelope/soap:Body/ns2:consultaCEPResponse/return/end').getTextContent();
            objeto.uf = xmlDoc.getNode('/soap:Envelope/soap:Body/ns2:consultaCEPResponse/return/uf').getTextContent();
            return JSON.stringify(objeto);
        } catch (ex) {
            var message = ex.message;
        }
    },

    type: 'FindingAddress'
});

//IMPORTANTE: na primeira função "buscarCEP", é criada uma variavel chamada 'endereco' para invocar a função interna _chamarEndereco com o conteúdo da resposta que pegasse o objeto "zip", referente ao CEP 
//Em seguinda, dei um return para invocar o valor de 'endereço'.

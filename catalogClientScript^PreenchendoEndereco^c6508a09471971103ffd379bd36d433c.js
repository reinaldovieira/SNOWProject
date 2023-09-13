function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading || newValue == '') {
        return;
    }

    //Type appropriate comment here, and begin script below

    var ga = new GlideAjax('global.FindingAddress'); //GlideAjax puxando o API Name
    ga.addParam('sysparm_name', "buscarCEP"); //trabalho em cima da função no Client Script
    ga.addParam('sysparm_ip', g_form.getValue('ip_address')); //parâmetro adicionado e busca o valor do campo no formulário
    ga.getXMLAnswer(function(answer) {

        alert(answer);
        var response = JSON.parse(answer);
        g_form.setValue('zip_code', response.cep);
        g_form.setValue('street', response.rua);
        g_form.setValue('district', response.bairro);
        g_form.setValue('federal_unity', response.uf);
        g_form.setValue('city', response.cidade);

    });
}
